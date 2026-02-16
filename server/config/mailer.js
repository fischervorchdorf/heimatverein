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
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
}

async function notifyAdmin(formType, name, email, data) {
    if (!transporter) return;

    const label = TYPE_LABELS[formType] || formType;
    const dataText = Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join('\n');

    await transporter.sendMail({
        from: `"Heimatverein Website" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
        to: process.env.ADMIN_EMAIL || 'fischervorchdorf@gmx.at',
        subject: `Neue ${label}${name ? ': ' + name : ''}`,
        text: `Neue Einreichung vom Typ "${label}":\n\n${dataText}\n\nIm Admin-Dashboard ansehen: ${process.env.BASE_URL || ''}/admin`
    });
}

module.exports = { notifyAdmin };
