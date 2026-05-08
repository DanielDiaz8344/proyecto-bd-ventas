// ============================================================================
// Controlador: Clientes
// ============================================================================

const db = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const result = await db.query(
            'SELECT * FROM cliente WHERE estado = TRUE ORDER BY nombre'
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al listar clientes' });
    }
};

exports.obtener = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM cliente WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener cliente' });
    }
};

exports.crear = async (req, res) => {
    const { cedula, nombre, apellido, telefono, email, direccion } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO cliente (cedula, nombre, apellido, telefono, email, direccion)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [cedula, nombre, apellido, telefono, email, direccion]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un cliente con esa cédula' });
        }
        res.status(500).json({ error: 'Error al crear cliente' });
    }
};

exports.actualizar = async (req, res) => {
    const { cedula, nombre, apellido, telefono, email, direccion } = req.body;
    try {
        const result = await db.query(
            `UPDATE cliente
             SET cedula = $1, nombre = $2, apellido = $3, telefono = $4, email = $5, direccion = $6
             WHERE id = $7
             RETURNING *`,
            [cedula, nombre, apellido, telefono, email, direccion, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar cliente' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const result = await db.query(
            'UPDATE cliente SET estado = FALSE WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        res.json({ mensaje: 'Cliente desactivado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar cliente' });
    }
};
