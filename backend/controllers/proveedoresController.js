// ============================================================================
// Controlador: Proveedores
// ============================================================================

const db = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM proveedor ORDER BY nombre');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al listar proveedores' });
    }
};

exports.obtener = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM proveedor WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener proveedor' });
    }
};

exports.crear = async (req, res) => {
    const { rif, nombre, telefono, email, direccion, contacto } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO proveedor (rif, nombre, telefono, email, direccion, contacto)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [rif, nombre, telefono, email, direccion, contacto]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un proveedor con ese RIF' });
        }
        res.status(500).json({ error: 'Error al crear proveedor' });
    }
};

exports.actualizar = async (req, res) => {
    const { rif, nombre, telefono, email, direccion, contacto } = req.body;
    try {
        const result = await db.query(
            `UPDATE proveedor
             SET rif = $1, nombre = $2, telefono = $3, email = $4, direccion = $5, contacto = $6
             WHERE id = $7
             RETURNING *`,
            [rif, nombre, telefono, email, direccion, contacto, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar proveedor' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM proveedor WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Proveedor no encontrado' });
        }
        res.json({ mensaje: 'Proveedor eliminado correctamente' });
    } catch (err) {
        console.error(err);
        if (err.code === '23503') {
            return res.status(409).json({ error: 'No se puede eliminar: hay compras asociadas' });
        }
        res.status(500).json({ error: 'Error al eliminar proveedor' });
    }
};
