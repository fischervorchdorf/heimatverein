require('dotenv').config();
const pool = require('./server/config/database');
(async () => {
    try {
        const [rows] = await pool.execute("SELECT id, form_type, email FROM form_submissions ORDER BY id DESC LIMIT 5");
        console.log("DB rows:", rows);
        const [types] = await pool.execute("SHOW COLUMNS FROM form_submissions LIKE 'form_type'");
        console.log("Enum type:", types[0].Type);
        process.exit(0);
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
})();
