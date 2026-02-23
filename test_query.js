require('dotenv').config();
const pool = require('./server/config/database');
(async () => {
    try {
        const [rows] = await pool.execute("SELECT id, is_archived FROM form_submissions WHERE form_type = 'newsletter'");
        console.log("Newsletter rows:", rows);
        const [archived] = await pool.execute("SELECT * FROM form_submissions WHERE is_archived = 0 AND form_type = 'newsletter'");
        console.log("Archived 0 count:", archived.length);
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
})();
