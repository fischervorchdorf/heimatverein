require('dotenv').config();
const pool = require('../config/database');
const { exhibitions, events } = require('./seed-data');

async function seed() {
    try {
        // Seed exhibitions
        console.log('Seeding exhibitions...');
        for (const ex of exhibitions) {
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
            console.log('  +', ex.title);
        }

        // Seed events
        console.log('\nSeeding events...');
        for (const evt of events) {
            await pool.execute(
                'INSERT INTO events (title, date, time, description, location) VALUES (?, ?, ?, ?, ?)',
                [evt.title, evt.date, evt.time, evt.description, evt.location]
            );
            console.log('  +', evt.title);
        }

        console.log('\nSeeding completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

seed();
