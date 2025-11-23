import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
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
        return res.status(500).json({ error: 'Template not found' });
    }

    // Simple variable replacement (for more complex, use Handlebars)
    Object.entries(templateData || {}).forEach(([key, value]) => {
        html = html.replace(new RegExp(`{{${key}}}`, 'g'), value);
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
        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
