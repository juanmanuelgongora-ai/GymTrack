import express from 'express';
import cors from 'cors';
import QRCode from 'qrcode';

const app = express();
const PORT = 3007;

app.use(express.json());
app.use(cors());

// --- ENDPOINT: Generar QR ---
app.post('/api/acceso/generar-qr', async (req, res) => {
    try {
        const { usuario_id, membresia_activa, nombre } = req.body;

        if (!usuario_id) {
            return res.status(400).json({ error: "Falta el ID de usuario." });
        }

        // Datos a codificar en el QR
        const qrData = JSON.stringify({
            usuario_id,
            nombre: nombre || "Usuario",
            membresia_activa: membresia_activa !== undefined ? membresia_activa : true,
            timestamp: Date.now()
        });

        // Generar QR en formato Data URI (Base64)
        const qrImageBase64 = await QRCode.toDataURL(qrData);

        return res.json({
            status: "exito",
            mensaje: "QR generado correctamente",
            qr_base64: qrImageBase64
        });

    } catch (error) {
        console.error("Error al generar QR:", error);
        return res.status(500).json({ error: "Ocurrió un error al generar el código QR" });
    }
});

// --- ENDPOINT: Validar QR ---
app.post('/api/acceso/validar-qr', (req, res) => {
    try {
        const { qr_data } = req.body;

        if (!qr_data) {
            return res.status(400).json({ error: "Faltan los datos del QR." });
        }

        // En un caso real, qr_data ya vendría desencriptado del frontend
        let dataParsed;
        try {
            dataParsed = typeof qr_data === 'string' ? JSON.parse(qr_data) : qr_data;
        } catch (e) {
            return res.status(400).json({ status: "rechazado", error: "Formato de QR inválido." });
        }

        const { usuario_id, membresia_activa, nombre } = dataParsed;

        if (!membresia_activa) {
            return res.json({
                status: "rechazado",
                mensaje: `Acceso denegado para ${nombre || 'el usuario'}. Membresía inactiva o vencida.`
            });
        }

        return res.json({
            status: "permitido",
            mensaje: `Acceso concedido. ¡Bienvenido, ${nombre || 'Usuario'}!`,
            usuario_id
        });

    } catch (error) {
        console.error("Error al validar QR:", error);
        return res.status(500).json({ error: "Ocurrió un error al procesar la validación" });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: "ok", service: "Control de Acceso (QR)" });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Acceso QR corriendo en http://localhost:${PORT}`);
});
