// ============================================================================
// Controlador: Almacenes
// ============================================================================

const db = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM almacen ORDER BY nombre');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al listar almacenes' });
    }
};

exports.obtener = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM almacen WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Almacén no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener almacén' });
    }
};

exports.crear = async (req, res) => {
    const { nombre, direccion, encargado, capacidad } = req.body;
    try {
        const result = await db.query(
            `INSERT INTO almacen (nombre, direccion, encargado, capacidad)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [nombre, direccion, encargado, capacidad]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al crear almacén' });
    }
};

exports.actualizar = async (req, res) => {
    const { nombre, direccion, encargado, capacidad } = req.body;
    try {
        const result = await db.query(
            `UPDATE almacen
             SET nombre = $1, direccion = $2, encargado = $3, capacidad = $4
             WHERE id = $5
             RETURNING *`,
            [nombre, direccion, encargado, capacidad, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Almacén no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar almacén' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM almacen WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Almacén no encontrado' });
        }
        res.json({ mensaje: 'Almacén eliminado correctamente' });
    } catch (err) {
        console.error(err);
        if (err.code === '23503') {
            return res.status(409).json({ error: 'No se puede eliminar: hay inventario o movimientos asociados' });
        }
        res.status(500).json({ error: 'Error al eliminar almacén' });
    }
};
