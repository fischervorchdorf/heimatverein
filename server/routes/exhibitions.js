const express = require('express');
const multer = require('multer');
const path = require('path');
const pool = require('../config/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Image upload config
const storage = multer.diskStorage({
    destination: path.join(__dirname, '..', '..', 'public', 'uploads'),
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const name = Date.now() + '-' + Math.random().toString(36).substring(2, 8) + ext;
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

function computeStatus(dateStart, dateEnd) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = dateStart ? new Date(dateStart) : null;
    const end = dateEnd ? new Date(dateEnd) : null;

    if (start && start > today) return 'naechste';
    if (end && end < today) return 'abgelaufen';
    if (start && start <= today) return 'aktuell';
    return 'abgelaufen';
}

// GET /api/exhibitions - public
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM exhibitions WHERE is_active = TRUE ORDER BY sort_order ASC, date_start DESC'
        );
        const exhibitions = rows.map(row => ({
            ...row,
            detail_items: typeof row.detail_items === 'string' ? JSON.parse(row.detail_items) : row.detail_items,
            gallery_links: typeof row.gallery_links === 'string' ? JSON.parse(row.gallery_links) : row.gallery_links,
            status: computeStatus(row.date_start, row.date_end)
        }));
        res.json(exhibitions);
    } catch (err) {
        console.error('Error fetching exhibitions:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// GET /api/exhibitions/:id - public
router.get('/:id', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM exhibitions WHERE id = ? AND is_active = TRUE',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Nicht gefunden' });
        }
        const row = rows[0];
        res.json({
            ...row,
            detail_items: typeof row.detail_items === 'string' ? JSON.parse(row.detail_items) : row.detail_items,
            gallery_links: typeof row.gallery_links === 'string' ? JSON.parse(row.gallery_links) : row.gallery_links,
            status: computeStatus(row.date_start, row.date_end)
        });
    } catch (err) {
        console.error('Error fetching exhibition:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// POST /api/exhibitions - admin only
router.post('/', requireAdmin, async (req, res) => {
    try {
        const {
            title, description, date_start, date_end, date_display,
            image_url, image_alt, location, curator,
            detail_items, gallery_links, modal_content, sort_order
        } = req.body;

        const [result] = await pool.execute(
            `INSERT INTO exhibitions (title, description, date_start, date_end, date_display,
             image_url, image_alt, location, curator, detail_items, gallery_links,
             modal_content, sort_order)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title, description,
                date_start || null, date_end || null, date_display,
                image_url || null, image_alt || null,
                location || 'Museum der Region Vorchdorf',
                curator || null,
                detail_items ? JSON.stringify(detail_items) : null,
                gallery_links ? JSON.stringify(gallery_links) : null,
                modal_content || null,
                sort_order || 0
            ]
        );

        res.status(201).json({ id: result.insertId, success: true });
    } catch (err) {
        console.error('Error creating exhibition:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// PUT /api/exhibitions/:id - admin only
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const {
            title, description, date_start, date_end, date_display,
            image_url, image_alt, location, curator,
            detail_items, gallery_links, modal_content, sort_order
        } = req.body;

        await pool.execute(
            `UPDATE exhibitions SET title=?, description=?, date_start=?, date_end=?,
             date_display=?, image_url=?, image_alt=?, location=?, curator=?,
             detail_items=?, gallery_links=?, modal_content=?, sort_order=?
             WHERE id=?`,
            [
                title, description,
                date_start || null, date_end || null, date_display,
                image_url || null, image_alt || null,
                location || 'Museum der Region Vorchdorf',
                curator || null,
                detail_items ? JSON.stringify(detail_items) : null,
                gallery_links ? JSON.stringify(gallery_links) : null,
                modal_content || null,
                sort_order || 0,
                req.params.id
            ]
        );

        res.json({ success: true });
    } catch (err) {
        console.error('Error updating exhibition:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// DELETE /api/exhibitions/:id - admin only (soft delete)
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        await pool.execute(
            'UPDATE exhibitions SET is_active = FALSE WHERE id = ?',
            [req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting exhibition:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// POST /api/exhibitions/:id/image - admin only
router.post('/:id/image', requireAdmin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Kein Bild hochgeladen' });
        }
        const imageUrl = 'uploads/' + req.file.filename;
        await pool.execute(
            'UPDATE exhibitions SET image_url = ? WHERE id = ?',
            [imageUrl, req.params.id]
        );
        res.json({ success: true, image_url: imageUrl });
    } catch (err) {
        console.error('Error uploading image:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

module.exports = router;
