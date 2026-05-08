// ============================================================================
// Controlador: Categorías
// ============================================================================

const db = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM categoria ORDER BY nombre');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al listar categorías' });
    }
};

exports.obtener = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM categoria WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener categoría' });
    }
};

exports.crear = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO categoria (nombre, descripcion) VALUES ($1, $2) RETURNING *',
            [nombre, descripcion]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe una categoría con ese nombre' });
        }
        res.status(500).json({ error: 'Error al crear categoría' });
    }
};

exports.actualizar = async (req, res) => {
    const { nombre, descripcion } = req.body;
    try {
        const result = await db.query(
            'UPDATE categoria SET nombre = $1, descripcion = $2 WHERE id = $3 RETURNING *',
            [nombre, descripcion, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar categoría' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const result = await db.query(
            'DELETE FROM categoria WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.json({ mensaje: 'Categoría eliminada correctamente' });
    } catch (err) {
        console.error(err);
        if (err.code === '23503') {
            return res.status(409).json({ error: 'No se puede eliminar: hay productos asociados a esta categoría' });
        }
        res.status(500).json({ error: 'Error al eliminar categoría' });
    }
};
