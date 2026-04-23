import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3000;

// Middleware para permitir recibir JSON y peticiones de otros puertos (como de tu Laravel)
app.use(express.json());
app.use(cors());

// --- ENDPOINT PRINCIPAL ---
// Aquí recibe las métricas y devuelve los cálculos
app.post('/api/calcular-metricas', (req, res) => {
    try {
        const { peso_kg, altura_m } = req.body;

        // Validar que manden los datos
        if (!peso_kg || !altura_m) {
            return res.status(400).json({ error: "Faltan datos: peso_kg o altura_m requeridos." });
        }

        // 1. Cálculo del IMC (Índice de Masa Corporal)
        const imc = peso_kg / (altura_m * altura_m);

        // 2. Determinar la categoría del IMC
        let categoria = "";
        let recomendacion = "";

        if (imc < 18.5) {
            categoria = "Bajo de peso";
            recomendacion = "Necesitas un superávit calórico para ganar masa muscular.";
        } else if (imc >= 18.5 && imc <= 24.9) {
            categoria = "Saludable";
            recomendacion = "Estás en tu peso ideal, enfócate en mantenimiento o recomposición corporal.";
        } else if (imc >= 25 && imc <= 29.9) {
            categoria = "Sobrepeso";
            recomendacion = "Te sugerimos un ligero déficit calórico acompañado de cardio.";
        } else {
            categoria = "Obesidad";
            recomendacion = "Es importante enfocarse en la pérdida de peso por salud con déficit calórico.";
        }

        // 3. Calcular Peso Ideal Aproximado (Fórmula de Devine modificada por BMI)
        const pesoIdealMin = 18.5 * (altura_m * altura_m);
        const pesoIdealMax = 24.9 * (altura_m * altura_m);

        // Devolver la respuesta al servicio que lo llamó (Laravel o React)
        return res.json({
            status: "exito",
            origen: "Microservicio Matemático GymTrack",
            resultados: {
                imc_calculado: parseFloat(imc.toFixed(2)),
                categoria_actual: categoria,
                sugerencia: recomendacion,
                peso_ideal_min: parseFloat(pesoIdealMin.toFixed(2)),
                peso_ideal_max: parseFloat(pesoIdealMax.toFixed(2))
            }
        });

    } catch (error) {
        return res.status(500).json({ error: "Ocurrió un error en el servidor matemático" });
    }
});

// Ruta de prueba rápida (health check)
app.get('/health', (req, res) => {
    res.json({ status: "ok", service: "Calculadora" });
});

app.listen(PORT, () => {
    console.log(`✅ Microservicio Matemático corriendo en http://localhost:${PORT}`);
});
