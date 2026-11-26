import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3008;

app.use(express.json());
app.use(cors());

// --- BASE DE DATOS SIMULADA DE RUTINAS ---
const rutinas = {
    "Bajo de peso": {
        enfoque: "Hipertrofia y Superávit Calórico",
        dias: 3,
        ejercicios: [
            { dia: 1, tipo: "Pecho y Tríceps", detalles: "Press banca (4x8), Fondos (3x10), Extensión tríceps (3x12)" },
            { dia: 2, tipo: "Espalda y Bíceps", detalles: "Dominadas (4xMax), Remo con barra (4x8), Curl bíceps (3x12)" },
            { dia: 3, tipo: "Pierna Completa", detalles: "Sentadilla (4x8), Prensa (3x10), Peso muerto rumano (3x10)" }
        ]
    },
    "Saludable": {
        enfoque: "Mantenimiento y Recomposición",
        dias: 4,
        ejercicios: [
            { dia: 1, tipo: "Tren Superior", detalles: "Press inclinado (4x10), Dominadas (3x10), Press militar (3x10)" },
            { dia: 2, tipo: "Tren Inferior", detalles: "Sentadilla (4x10), Hip Thrust (4x10), Elevación de talones (4x15)" },
            { dia: 3, tipo: "Descanso Activo", detalles: "30 min de cardio ligero o Yoga" },
            { dia: 4, tipo: "Cuerpo Completo", detalles: "Peso muerto (4x8), Flexiones (3xMax), Zancadas (3x12)" }
        ]
    },
    "Sobrepeso": {
        enfoque: "Pérdida de Grasa (Déficit Calórico) y Cardio",
        dias: 5,
        ejercicios: [
            { dia: 1, tipo: "Fuerza Básica", detalles: "Press de banca (3x12), Sentadilla libre (3x12) + 20 min Cardio" },
            { dia: 2, tipo: "Cardio HIIT", detalles: "20 min intervalos (30s intenso, 30s descanso)" },
            { dia: 3, tipo: "Fuerza y Resistencia", detalles: "Remo máquina (3x15), Prensa de pierna (3x15) + 20 min Cardio" },
            { dia: 4, tipo: "Cardio LISS", detalles: "45 min caminata rápida o bicicleta" },
            { dia: 5, tipo: "Circuito Full Body", detalles: "Kettlebell swings (4x15), Flexiones apoyadas (3x12), Plancha (3x45s)" }
        ]
    },
    "Obesidad": {
        enfoque: "Acondicionamiento Físico Suave y Movilidad",
        dias: 4,
        ejercicios: [
            { dia: 1, tipo: "Cardio Bajo Impacto", detalles: "30 min bicicleta estática o natación" },
            { dia: 2, tipo: "Fuerza Suave", detalles: "Sentadilla en caja (3x10), Press sentado con mancuernas (3x12)" },
            { dia: 3, tipo: "Caminata Larga", detalles: "40 min caminata a paso constante" },
            { dia: 4, tipo: "Circuito Máquinas", detalles: "Extensión pierna (3x15), Jalón al pecho (3x15), Remo (3x15)" }
        ]
    }
};

// --- ENDPOINT: Sugerir Rutina ---
app.post('/api/rutinas/sugerir', (req, res) => {
    try {
        const { categoria } = req.body;

        if (!categoria) {
            return res.status(400).json({ error: "Falta la categoría (ej. 'Sobrepeso', 'Saludable')." });
        }

        const plan = rutinas[categoria];

        if (!plan) {
            return res.status(404).json({ error: `No se encontró una rutina específica para la categoría: ${categoria}` });
        }

        return res.json({
            status: "exito",
            categoria_recibida: categoria,
            rutina_sugerida: plan
        });

    } catch (error) {
        console.error("Error al sugerir rutina:", error);
        return res.status(500).json({ error: "Ocurrió un error al procesar la solicitud" });
    }
});

// Health check
app.get('/health', (req, res) => {
    res.json({ status: "ok", service: "Sugerencia de Rutinas" });
});

app.listen(PORT, () => {
    console.log(`Microservicio de Rutinas corriendo en http://localhost:${PORT}`);
});
