import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3005;

app.use(cors());
app.use(express.json());

// Configuración de Nodemailer (Simulada para desarrollo)
// En producción, aquí irían los datos de tu servidor SMTP real
const createTransporter = async () => {
    // Si no hay variables de entorno, creamos una cuenta de prueba en Ethereal
    if (!process.env.SMTP_HOST) {
        console.log("No SMTP detected. Creating test account...");
        const testAccount = await nodemailer.createTestAccount();
        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

app.post('/api/notificar-registro', async (req, res) => {
    const { email, nombre, rol } = req.body;

    if (!email || !nombre) {
        return res.status(400).json({ error: 'Faltan datos requeridos: email y nombre.' });
    }

    try {
        const transporter = await createTransporter();

        const mailOptions = {
            from: '"GymTrack Team" <no-reply@gymtrack.com>',
            to: email,
            subject: `¡Bienvenido a GymTrack, ${nombre}!`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h1 style="color: #ff8c42; text-align: center;">¡Bienvenido a la Familia GymTrack!</h1>
                    <p>Hola <strong>${nombre}</strong>,</p>
                    <p>Estamos emocionados de tenerte con nosotros como <strong>${rol || 'miembro'}</strong>.</p>
                    <p>En GymTrack, nos enfocamos en ayudarte a alcanzar tus metas fitness con la mejor tecnología.</p>
                    <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                    <p style="font-size: 0.9em; color: #666;">
                        Este es un correo automático. No es necesario que respondas. Si no te has registrado en nuestra app, por favor ignora este mensaje.
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        console.log(`[Notification] Mensaje enviado a ${email}: %s`, info.messageId);

        // Si usamos Ethereal, mostramos la URL de vista previa en la consola
        if (info.host === 'smtp.ethereal.email') {
            console.log(`[Preview URL]: ${nodemailer.getTestMessageUrl(info)}`);
        }

        res.json({
            status: 'exito',
            messageId: info.messageId,
            previewUrl: nodemailer.getTestMessageUrl(info) || null
        });

    } catch (error) {
        console.error('[Notification Error]:', error);
        res.status(500).json({ error: 'Error al enviar el correo electrónico.' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Notification' });
});

app.listen(PORT, () => {
    console.log(`🚀 Microservicio de Notificaciones corriendo en http://localhost:${PORT}`);
});
