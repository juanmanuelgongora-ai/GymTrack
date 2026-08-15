import assert from 'node:assert';
import http from 'node:http';

console.log("=== INICIANDO PRUEBAS DEL MICROSERVICIO CALCULADORA ===");

// Función auxiliar para realizar peticiones POST
function post(path, body) {
    return new Promise((resolve, reject) => {
        const payload = JSON.stringify(body);
        const req = http.request({
            hostname: '127.0.0.1',
            port: 3000,
            path: path,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(payload)
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                resolve({
                    statusCode: res.statusCode,
                    headers: res.headers,
                    body: JSON.parse(data)
                });
            });
        });

        req.on('error', reject);
        req.write(payload);
        req.end();
    });
}

async function runTests() {
    try {
        // Test 1: Health check del microservicio
        console.log("Ejecutando Test 1: Health check...");
        const healthRes = await new Promise((resolve, reject) => {
            http.get('http://127.0.0.1:3000/health', (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(data) }));
            }).on('error', reject);
        });
        assert.strictEqual(healthRes.statusCode, 200, "El código de estado del Health Check debe ser 200");
        assert.strictEqual(healthRes.body.status, "ok", "El status debe ser 'ok'");
        console.log("✅ Test 1 aprobado!");

        // Test 2: Cálculo correcto de IMC y categoría Saludable
        console.log("Ejecutando Test 2: Cálculo saludable...");
        const res2 = await post('/api/calcular-metricas', { peso_kg: 70, altura_m: 1.75 });
        assert.strictEqual(res2.statusCode, 200, "Debe retornar 200");
        assert.strictEqual(res2.body.status, "exito");
        assert.strictEqual(res2.body.resultados.imc_calculado, 22.86);
        assert.strictEqual(res2.body.resultados.categoria_actual, "Saludable");
        console.log("✅ Test 2 aprobado!");

        // Test 3: Validación de parámetros requeridos (error 400)
        console.log("Ejecutando Test 3: Validación de datos faltantes...");
        const res3 = await post('/api/calcular-metricas', { peso_kg: 70 });
        assert.strictEqual(res3.statusCode, 400, "Debe retornar 400 por falta de altura_m");
        assert.ok(res3.body.error.includes("Faltan datos"), "Debe indicar error de datos faltantes");
        console.log("✅ Test 3 aprobado!");

        // Test 4: Categoría Sobrepeso
        console.log("Ejecutando Test 4: Cálculo sobrepeso...");
        const res4 = await post('/api/calcular-metricas', { peso_kg: 85, altura_m: 1.75 });
        assert.strictEqual(res4.statusCode, 200);
        assert.strictEqual(res4.body.resultados.categoria_actual, "Sobrepeso");
        console.log("✅ Test 4 aprobado!");

        console.log("\n🎉 ¡TODAS LAS PRUEBAS SE COMPLETARON CON ÉXITO! 🎉\n");
    } catch (e) {
        console.error("❌ ERROR EN LAS PRUEBAS:", e.message);
        process.exit(1);
    }
}

// Ejecutar pruebas
runTests();
