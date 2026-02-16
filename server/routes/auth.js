const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { password } = req.body;
        if (!password) {
            return res.status(400).json({ error: 'Passwort erforderlich' });
        }

        const hash = process.env.ADMIN_PASSWORD_HASH;
        if (!hash) {
            return res.status(500).json({ error: 'Admin-Passwort nicht konfiguriert' });
        }

        const match = await bcrypt.compare(password, hash);
        if (match) {
            req.session.isAdmin = true;
            return res.json({ success: true });
        }

        return res.status(401).json({ error: 'Falsches Passwort' });
    } catch (err) {
        console.error('Login error:', err);
        return res.status(500).json({ error: 'Serverfehler' });
    }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ error: 'Logout fehlgeschlagen' });
        }
        res.clearCookie('heimatverein_admin_sid');
        return res.json({ success: true });
    });
});

// GET /api/auth/check
router.get('/check', (req, res) => {
    res.json({ authenticated: !!(req.session && req.session.isAdmin) });
});

module.exports = router;
