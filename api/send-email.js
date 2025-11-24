import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    // CORS headers
    const allowedOrigins = [
        'http://localhost:8080',
        'http://localhost:3000',
        'https://figurine-journey.vercel.app'
    ];
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    } else {
        res.setHeader('Access-Control-Allow-Origin', allowedOrigins[0]);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { to, subject, templateData } = req.body;

    // Load the email template
    const templatePath = path.join(process.cwd(), 'email-templates', 'GeneralEmail', 'email.html');
    let html;
    try {
        html = fs.readFileSync(templatePath, 'utf8');
    } catch (err) {
        console.error('Template load error:', err);
        return res.status(500).json({ error: 'Template not found', path: templatePath });
    }

    // Simple variable replacement (for more complex, use Handlebars)
    Object.entries(templateData || {}).forEach(([key, value]) => {
        // Replace both {{key}} and {{ key }} (with or without spaces)
        html = html.replace(new RegExp(`{{\\s*${key}\\s*}}`, 'g'), value);
    });

    // Create transporter
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    try {
        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to,
            subject,
            html,
        });
        console.log('Email sent successfully to:', to);
        res.status(200).json({ success: true });
    } catch (error) {
        console.error('Email sending error:', error);
        res.status(500).json({ error: error.message });
    }
}
