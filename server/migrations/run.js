require('dotenv').config();
const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function runMigrations() {
    try {
        const sql = fs.readFileSync(
            path.join(__dirname, '001_create_tables.sql'),
            'utf8'
        );

        const statements = sql
            .split(';')
            .map(s => s.trim())
            .filter(s => s.length > 0);

        for (const statement of statements) {
            await pool.execute(statement);
            console.log('Executed:', statement.substring(0, 60) + '...');
        }

        console.log('\nMigrations completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Migration failed:', err);
        process.exit(1);
    }
}

runMigrations();
