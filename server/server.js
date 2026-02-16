require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const pool = require('./config/database');

const app = express();

// Auto-migrate and seed on startup
async function initDatabase() {
    try {
        // Check if tables exist
        const [tables] = await pool.execute(
            "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'exhibitions'",
            [process.env.DB_NAME || 'heimatverein']
        );

        if (tables.length === 0) {
            console.log('🔧 Erste Ausführung erkannt – erstelle Datenbank-Tabellen...');

            // Run migration
            const sql = fs.readFileSync(
                path.join(__dirname, 'migrations', '001_create_tables.sql'),
                'utf8'
            );
            const statements = sql.split(';').map(s => s.trim()).filter(s => s.length > 0);
            for (const statement of statements) {
                await pool.execute(statement);
            }
            console.log('✅ Tabellen erfolgreich erstellt.');

            // Run seed
            console.log('🌱 Füge Seed-Daten ein...');
            const seedModule = require('./seeds/seed-data');

            for (const ex of seedModule.exhibitions) {
                await pool.execute(
                    `INSERT INTO exhibitions (title, description, date_start, date_end, date_display,
                     image_url, image_alt, location, curator, detail_items, gallery_links,
                     modal_content, sort_order)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        ex.title, ex.description,
                        ex.date_start, ex.date_end, ex.date_display,
                        ex.image_url, ex.image_alt,
                        ex.location || 'Museum der Region Vorchdorf',
                        ex.curator,
                        ex.detail_items, ex.gallery_links,
                        ex.modal_content,
                        ex.sort_order
                    ]
                );
                console.log('  + Ausstellung:', ex.title);
            }

            for (const evt of seedModule.events) {
                await pool.execute(
                    'INSERT INTO events (title, date, time, description, location) VALUES (?, ?, ?, ?, ?)',
                    [evt.title, evt.date, evt.time, evt.description, evt.location]
                );
                console.log('  + Event:', evt.title);
            }

            console.log('✅ Seed-Daten erfolgreich eingefügt.');
        } else {
            console.log('✅ Datenbank-Tabellen bereits vorhanden.');
        }
    } catch (err) {
        console.error('❌ Datenbank-Initialisierung fehlgeschlagen:', err.message);
        console.error('   Server startet trotzdem – bitte DB-Verbindung prüfen.');
    }
}

// Security headers (relaxed for inline scripts in static HTML)
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session store (needs non-promise pool)
const sessionStoreOptions = {
    clearExpired: true,
    checkExpirationInterval: 900000,
    expiration: 86400000,
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'heimatverein'
};
const sessionStore = new MySQLStore(sessionStoreOptions);

app.use(session({
    key: 'heimatverein_admin_sid',
    secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production'
    }
}));

// Rate limiting for form submissions
const submissionLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 10,
    message: { error: 'Zu viele Anfragen. Bitte versuchen Sie es später erneut.' }
});

// Rate limiting for login
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: 'Zu viele Anmeldeversuche. Bitte warten Sie 15 Minuten.' }
});

// API routes
app.use('/api/auth', loginLimiter, require('./routes/auth'));
app.use('/api/exhibitions', require('./routes/exhibitions'));
app.use('/api/submissions', submissionLimiter, require('./routes/submissions'));
app.use('/api/events', require('./routes/events'));

// Serve admin dashboard
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')));

// Serve existing static files
app.use(express.static(path.join(__dirname, '..', 'public')));

// Fallback for admin SPA routes
app.get('/admin/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

const PORT = process.env.PORT || 3000;

// Initialize DB then start server
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`\n🏠 Heimatverein Server läuft auf Port ${PORT}`);
        console.log(`   Admin: http://localhost:${PORT}/admin`);
    });
});
