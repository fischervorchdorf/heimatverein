const nodemailer = require('nodemailer');

const TYPE_LABELS = {
    kontakt: 'Kontaktanfrage',
    mitgliedschaft: 'Beitrittserklärung',
    zeitzeugen: 'Zeitzeugen-Geschichte',
    ausflug: 'Ausflug-Anmeldung',
    ideenworkshop: 'Ideenworkshop',
    newsletter: 'Newsletter-Anmeldung'
};

let transporter = null;

if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT) || 587,
        secure: (parseInt(process.env.SMTP_PORT) || 587) === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        },
        tls: { rejectUnauthorized: false }
    });

    // Verify connection on startup
    transporter.verify()
        .then(() => console.log('✅ SMTP-Verbindung erfolgreich'))
        .catch(err => console.error('❌ SMTP-Verbindung fehlgeschlagen:', err.message));
}

async function notifyAdmin(formType, name, email, data) {
    if (!transporter) {
        console.log('📧 E-Mail-Benachrichtigung übersprungen (kein SMTP konfiguriert)');
        return;
    }

    const label = TYPE_LABELS[formType] || formType;
    const dataText = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    const adminEmail = process.env.ADMIN_EMAIL || 'fischervorchdorf@gmx.at';
    const baseUrl = process.env.BASE_URL || 'https://heimatvereinvorchdorf.at';

    try {
        await transporter.sendMail({
            from: `"Heimatverein Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: adminEmail,
            subject: `[Heimatverein] Neue ${label}${name ? ' von ' + name : ''}`,
            text: `Neue Einreichung vom Typ "${label}":\n\n${dataText}\n\n---\nIm Admin-Dashboard ansehen: ${baseUrl}/admin`,
            html: `
                <h2 style="color:#2c5530;">Neue ${label}</h2>
                ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
                ${email ? `<p><strong>E-Mail:</strong> ${email}</p>` : ''}
                <hr style="border:1px solid #eee;">
                <table style="border-collapse:collapse; width:100%;">
                    ${Object.entries(data).map(([key, value]) =>
                        `<tr><td style="padding:5px 10px 5px 0; font-weight:bold; vertical-align:top;">${key}:</td><td style="padding:5px 0;">${value}</td></tr>`
                    ).join('')}
                </table>
                <hr style="border:1px solid #eee;">
                <p><a href="${baseUrl}/admin" style="color:#2c5530;">Im Admin-Dashboard ansehen →</a></p>
            `
        });
        console.log(`📧 E-Mail-Benachrichtigung gesendet für ${label}`);
    } catch (err) {
        console.error('❌ E-Mail senden fehlgeschlagen:', err.message);
    }
}

module.exports = { notifyAdmin };
