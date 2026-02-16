const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// File upload for zeitzeugen
const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'public', 'uploads'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const name = 'zeitzeugen-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8) + ext;
        cb(null, name);
    }
});
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowed.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Nur JPG, PNG und WebP erlaubt'));
        }
    }
});

const VALID_TYPES = ['kontakt', 'mitgliedschaft', 'zeitzeugen', 'ausflug', 'ideenworkshop', 'newsletter'];

// POST /api/submissions - public form submission
router.post('/', async (req, res) => {
    try {
        const { form_type, data } = req.body;

        if (!form_type || !VALID_TYPES.includes(form_type)) {
            return res.status(400).json({ error: 'Ungültiger Formulartyp' });
        }
        if (!data || typeof data !== 'object') {
            return res.status(400).json({ error: 'Keine Daten übermittelt' });
        }

        // Case-insensitive field lookup (forms send "Vorname", "E-Mail", etc.)
        const getField = (...keys) => {
            for (const key of keys) {
                for (const [k, v] of Object.entries(data)) {
                    if (k.toLowerCase() === key.toLowerCase()) return v;
                }
            }
            return null;
        };

        const email = getField('email', 'e-mail', 'Email', 'E-Mail') || null;
        const name = [getField('vorname', 'Vorname'), getField('nachname', 'Nachname', 'familienname', 'Familienname'), getField('name', 'Name')]
            .filter(Boolean)
            .join(' ')
            .trim() || null;

        await pool.execute(
            `INSERT INTO form_submissions (form_type, data, email, name)
             VALUES (?, ?, ?, ?)`,
            [form_type, JSON.stringify(data), email, name]
        );

        // Optional: send email notification
        try {
            const mailer = require('../config/mailer');
            if (mailer) {
                await mailer.notifyAdmin(form_type, name, email, data);
            }
        } catch (e) {
            // Email is optional, don't fail the submission
        }

        res.status(201).json({ success: true, message: 'Vielen Dank für Ihre Einreichung!' });
    } catch (err) {
        console.error('Error saving submission:', err);
        res.status(500).json({ error: 'Serverfehler beim Speichern' });
    }
});

// POST /api/submissions/zeitzeugen - with file upload
router.post('/zeitzeugen', upload.single('bild'), async (req, res) => {
    try {
        const data = {
            titel: req.body.titel || '',
            geschichte: req.body.geschichte || '',
            kontakt: req.body.kontakt || ''
        };
        const filePath = req.file ? 'uploads/' + req.file.filename : null;

        await pool.execute(
            `INSERT INTO form_submissions (form_type, data, name, file_path)
             VALUES ('zeitzeugen', ?, ?, ?)`,
            [JSON.stringify(data), data.kontakt || null, filePath]
        );

        // Email notification
        try {
            const mailer = require('../config/mailer');
            await mailer.notifyAdmin('zeitzeugen', data.kontakt, null, data);
        } catch (e) { /* Email is optional */ }

        res.status(201).json({ success: true, message: 'Vielen Dank für Ihre Zeitzeugen-Geschichte!' });
    } catch (err) {
        console.error('Error saving zeitzeugen:', err);
        res.status(500).json({ error: 'Serverfehler beim Speichern' });
    }
});

// GET /api/submissions/stats - admin
router.get('/stats', requireAdmin, async (req, res) => {
    try {
        const [counts] = await pool.execute(
            `SELECT form_type, COUNT(*) as total,
             SUM(CASE WHEN is_read = 0 THEN 1 ELSE 0 END) as unread
             FROM form_submissions WHERE is_archived = 0
             GROUP BY form_type`
        );
        const [totalUnread] = await pool.execute(
            'SELECT COUNT(*) as count FROM form_submissions WHERE is_read = 0 AND is_archived = 0'
        );
        res.json({
            by_type: counts || [],
            total_unread: (totalUnread && totalUnread[0]) ? totalUnread[0].count : 0
        });
    } catch (err) {
        console.error('Error fetching stats:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// GET /api/submissions/export - admin CSV export
router.get('/export', requireAdmin, async (req, res) => {
    try {
        const { type } = req.query;
        let query = 'SELECT * FROM form_submissions WHERE is_archived = 0';
        const params = [];
        if (type && VALID_TYPES.includes(type)) {
            query += ' AND form_type = ?';
            params.push(type);
        }
        query += ' ORDER BY created_at DESC';

        const [rows] = await pool.execute(query, params);

        // Build CSV
        const headers = ['ID', 'Typ', 'Name', 'E-Mail', 'Gelesen', 'Datum', 'Daten'];
        const csvRows = [headers.join(';')];
        for (const row of rows) {
            const data = typeof row.data === 'string' ? JSON.parse(row.data) : row.data;
            const dataStr = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(' | ');
            csvRows.push([
                row.id,
                row.form_type,
                `"${(row.name || '').replace(/"/g, '""')}"`,
                `"${(row.email || '').replace(/"/g, '""')}"`,
                row.is_read ? 'Ja' : 'Nein',
                new Date(row.created_at).toLocaleString('de-AT'),
                `"${dataStr.replace(/"/g, '""')}"`
            ].join(';'));
        }

        res.setHeader('Content-Type', 'text/csv; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename=eingaenge_${type || 'alle'}_${Date.now()}.csv`);
        res.send('\uFEFF' + csvRows.join('\n'));
    } catch (err) {
        console.error('Error exporting:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// GET /api/submissions - admin list
router.get('/', requireAdmin, async (req, res) => {
    try {
        const { type, search, unread, page = 1, limit = 25 } = req.query;
        let query = 'SELECT * FROM form_submissions WHERE is_archived = 0';
        const params = [];

        if (type && VALID_TYPES.includes(type)) {
            query += ' AND form_type = ?';
            params.push(type);
        }
        if (unread === 'true') {
            query += ' AND is_read = 0';
        }
        if (search) {
            query += ' AND (name LIKE ? OR email LIKE ? OR JSON_EXTRACT(data, "$") LIKE ?)';
            const s = `%${search}%`;
            params.push(s, s, s);
        }

        // Count total
        const countQuery = query.replace('SELECT *', 'SELECT COUNT(*) as total');
        const [countResult] = await pool.execute(countQuery, params);
        const total = countResult[0].total;

        // Paginate
        const limitInt = parseInt(limit);
        const offset = (parseInt(page) - 1) * limitInt;
        query += ` ORDER BY created_at DESC LIMIT ${limitInt} OFFSET ${offset}`;

        const [rows] = await pool.execute(query, params);

        const submissions = rows.map(row => ({
            ...row,
            data: typeof row.data === 'string' ? JSON.parse(row.data) : row.data
        }));

        res.json({
            submissions,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / parseInt(limit))
        });
    } catch (err) {
        console.error('Error fetching submissions:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// PATCH /api/submissions/:id - admin mark read/archived
router.patch('/:id', requireAdmin, async (req, res) => {
    try {
        const { is_read, is_archived } = req.body;
        const updates = [];
        const params = [];

        if (is_read !== undefined) {
            updates.push('is_read = ?');
            params.push(is_read);
        }
        if (is_archived !== undefined) {
            updates.push('is_archived = ?');
            params.push(is_archived);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: 'Keine Änderungen' });
        }

        params.push(req.params.id);
        await pool.execute(
            `UPDATE form_submissions SET ${updates.join(', ')} WHERE id = ?`,
            params
        );

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating submission:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

module.exports = router;
