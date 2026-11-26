import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3009;
const JWT_SECRET = process.env.JWT_SECRET || 'gymtrack_secret_2026';

app.use(express.json());
app.use(cors());

// =====================================================
// CONEXIÓN A BASE DE DATOS
// =====================================================
const dbConfig = {
    host:     process.env.DB_HOST     || 'localhost',
    port:     parseInt(process.env.DB_PORT || '3306'),
    user:     process.env.DB_USER     || 'gymtrack',
    password: process.env.DB_PASSWORD || 'gymtrack_pass',
    database: process.env.DB_DATABASE || 'gymtrack_db',
    waitForConnections: true,
    connectionLimit: 10,
};

let pool;
try {
    pool = mysql.createPool(dbConfig);
    console.log('[Auth Service] Conexión a MySQL configurada.');
} catch (err) {
    console.error('[Auth Service] Error configurando pool MySQL:', err.message);
}

// =====================================================
// MIDDLEWARE: Verificar token JWT
// =====================================================
function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Token requerido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token inválido o expirado.' });
    }
}

// =====================================================
// ENDPOINTS
// =====================================================

/**
 * POST /api/auth/login
 * Autentica al usuario y devuelve un JWT
 */
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
    }

    try {
        const [rows] = await pool.execute(
            'SELECT id, name, email, password, rol, activo FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        const user = rows[0];

        if (!user.activo) {
            return res.status(403).json({ error: 'Usuario inactivo. Contacta al administrador.' });
        }

        // Verificar contraseña con bcrypt
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Generar JWT
        const token = jwt.sign(
            { id: user.id, email: user.email, rol: user.rol, name: user.name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.json({
            status: 'exito',
            message: 'Inicio de sesión exitoso.',
            token,
            user: {
                id:    user.id,
                name:  user.name,
                email: user.email,
                rol:   user.rol,
            }
        });

    } catch (err) {
        console.error('[Login Error]:', err.message);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

/**
 * POST /api/auth/register
 * Registra un nuevo usuario (cliente)
 */
app.post('/api/auth/register', async (req, res) => {
    const { name, email, password, rol = 'cliente' } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos.' });
    }

    if (password.length < 8) {
        return res.status(422).json({ error: 'La contraseña debe tener al menos 8 caracteres.' });
    }

    try {
        // Verificar si el email ya existe
        const [existing] = await pool.execute(
            'SELECT id FROM users WHERE email = ? LIMIT 1',
            [email]
        );

        if (existing.length > 0) {
            return res.status(409).json({ error: 'El correo electrónico ya está registrado.' });
        }

        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 12);

        // Insertar nuevo usuario
        const [result] = await pool.execute(
            'INSERT INTO users (name, email, password, rol, activo, created_at, updated_at) VALUES (?, ?, ?, ?, 1, NOW(), NOW())',
            [name, email, hashedPassword, rol]
        );

        const userId = result.insertId;

        // Generar JWT inmediatamente
        const token = jwt.sign(
            { id: userId, email, rol, name },
            JWT_SECRET,
            { expiresIn: '7d' }
        );

        return res.status(201).json({
            status: 'exito',
            message: 'Usuario registrado correctamente.',
            token,
            user: { id: userId, name, email, rol }
        });

    } catch (err) {
        console.error('[Register Error]:', err.message);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

/**
 * GET /api/auth/me
 * Devuelve los datos del usuario autenticado (valida el token)
 */
app.get('/api/auth/me', verifyToken, async (req, res) => {
    try {
        const [rows] = await pool.execute(
            'SELECT id, name, email, rol, activo, created_at FROM users WHERE id = ? LIMIT 1',
            [req.user.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        return res.json({ status: 'exito', user: rows[0] });

    } catch (err) {
        console.error('[Me Error]:', err.message);
        return res.status(500).json({ error: 'Error interno del servidor.' });
    }
});

/**
 * POST /api/auth/validate
 * Valida si un token JWT es válido (usado por otros microservicios)
 */
app.post('/api/auth/validate', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.status(400).json({ valido: false, error: 'Token requerido.' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return res.json({
            valido: true,
            user: { id: decoded.id, email: decoded.email, rol: decoded.rol, name: decoded.name }
        });
    } catch (err) {
        return res.status(401).json({ valido: false, error: 'Token inválido o expirado.' });
    }
});

/**
 * GET /api/auth/usuarios
 * Lista todos los usuarios (solo admin)
 */
app.get('/api/auth/usuarios', verifyToken, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
    }

    try {
        const [rows] = await pool.execute(
            'SELECT id, name, email, rol, activo, created_at FROM users ORDER BY created_at DESC'
        );
        return res.json({ status: 'exito', total: rows.length, usuarios: rows });
    } catch (err) {
        return res.status(500).json({ error: 'Error al obtener usuarios.' });
    }
});

/**
 * PUT /api/auth/usuarios/:id
 * Actualizar usuario (nombre, email, activo)
 */
app.put('/api/auth/usuarios/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { name, email, activo } = req.body;

    // Solo admin o el mismo usuario puede editar
    if (req.user.rol !== 'admin' && req.user.id !== parseInt(id)) {
        return res.status(403).json({ error: 'Acceso denegado.' });
    }

    try {
        await pool.execute(
            'UPDATE users SET name = COALESCE(?, name), email = COALESCE(?, email), activo = COALESCE(?, activo), updated_at = NOW() WHERE id = ?',
            [name || null, email || null, activo !== undefined ? activo : null, id]
        );
        return res.json({ status: 'exito', message: 'Usuario actualizado correctamente.' });
    } catch (err) {
        return res.status(500).json({ error: 'Error al actualizar usuario.' });
    }
});

/**
 * DELETE /api/auth/usuarios/:id
 * Eliminar usuario (solo admin)
 */
app.delete('/api/auth/usuarios/:id', verifyToken, async (req, res) => {
    if (req.user.rol !== 'admin') {
        return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
    }

    const { id } = req.params;

    try {
        await pool.execute('DELETE FROM users WHERE id = ?', [id]);
        return res.json({ status: 'exito', message: `Usuario ${id} eliminado.` });
    } catch (err) {
        return res.status(500).json({ error: 'Error al eliminar usuario.' });
    }
});

// =====================================================
// HEALTH CHECK
// =====================================================
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: 'Microservicio de Autenticación — GymTrack',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});

// =====================================================
// INICIO DEL SERVIDOR
// =====================================================
app.listen(PORT, () => {
    console.log(`🔐 Microservicio de Auth corriendo en http://localhost:${PORT}`);
    console.log(`   POST /api/auth/login`);
    console.log(`   POST /api/auth/register`);
    console.log(`   GET  /api/auth/me`);
    console.log(`   POST /api/auth/validate`);
    console.log(`   GET  /api/auth/usuarios  (admin)`);
    console.log(`   PUT  /api/auth/usuarios/:id`);
    console.log(`   DELETE /api/auth/usuarios/:id (admin)`);
});
