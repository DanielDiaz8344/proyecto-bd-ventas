// ============================================================================
// Controlador: Usuarios
// (Login simple - sin JWT para mantener el alcance académico)
// ============================================================================

const db = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT id, username, nombre_completo, rol, email, fecha_creacion, estado FROM usuario ORDER BY username'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al listar usuarios' });
    }
};

exports.crear = async (req, res) => {
    const { username, password_hash, nombre_completo, rol, email } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO usuario (username, password_hash, nombre_completo, rol, email)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id, username, nombre_completo, rol, email`,
            [username, password_hash, nombre_completo, rol, email]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Username o email ya registrado' });
        }
        res.status(500).json({ error: 'Error al crear usuario' });
    }
};

exports.login = async (req, res) => {
    const { username, password_hash } = req.body;
    try {
        const result = await db.query(
            `SELECT id, username, nombre_completo, rol
             FROM usuario
             WHERE username = $1 AND password_hash = $2 AND estado = TRUE`,
            [username, password_hash]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }
        res.json({ mensaje: 'Login exitoso', usuario: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en login' });
    }
};
