const express = require('express');
const pool = require('../config/database');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/events - public, all active events
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM events WHERE is_active = TRUE ORDER BY date DESC'
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching events:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// GET /api/events/upcoming - public, only future events
router.get('/upcoming', async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT * FROM events WHERE is_active = TRUE AND date >= CURDATE() ORDER BY date ASC'
        );
        res.json(rows);
    } catch (err) {
        console.error('Error fetching upcoming events:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// POST /api/events - admin only
router.post('/', requireAdmin, async (req, res) => {
    try {
        const { title, date, time, description, location } = req.body;
        if (!title || !date || !time || !description) {
            return res.status(400).json({ error: 'Pflichtfelder fehlen' });
        }

        const [result] = await pool.execute(
            'INSERT INTO events (title, date, time, description, location) VALUES (?, ?, ?, ?, ?)',
            [title, date, time, description, location || null]
        );

        res.status(201).json({ id: result.insertId, success: true });
    } catch (err) {
        console.error('Error creating event:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// PUT /api/events/:id - admin only
router.put('/:id', requireAdmin, async (req, res) => {
    try {
        const { title, date, time, description, location } = req.body;
        await pool.execute(
            'UPDATE events SET title=?, date=?, time=?, description=?, location=? WHERE id=?',
            [title, date, time, description, location || null, req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Error updating event:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

// DELETE /api/events/:id - admin only (soft delete)
router.delete('/:id', requireAdmin, async (req, res) => {
    try {
        await pool.execute(
            'UPDATE events SET is_active = FALSE WHERE id = ?',
            [req.params.id]
        );
        res.json({ success: true });
    } catch (err) {
        console.error('Error deleting event:', err);
        res.status(500).json({ error: 'Serverfehler' });
    }
});

module.exports = router;
