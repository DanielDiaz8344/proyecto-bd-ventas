// ============================================================================
// Controlador: Productos
// ============================================================================

const db = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, c.nombre AS categoria_nombre
            FROM producto p
            JOIN categoria c ON c.id = p.id_categoria
            WHERE p.estado = TRUE
            ORDER BY p.codigo
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al listar productos' });
    }
};

exports.obtener = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT p.*, c.nombre AS categoria_nombre
            FROM producto p
            JOIN categoria c ON c.id = p.id_categoria
            WHERE p.id = $1
        `, [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener producto' });
    }
};

exports.crear = async (req, res) => {
    const {
        codigo, nombre, descripcion, precio_venta, precio_compra,
        id_categoria, stock_minimo, stock_maximo, unidad_medida
    } = req.body;
    try {
        const result = await db.query(`
            INSERT INTO producto
              (codigo, nombre, descripcion, precio_venta, precio_compra,
               id_categoria, stock_minimo, stock_maximo, unidad_medida)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `, [
            codigo, nombre, descripcion, precio_venta, precio_compra,
            id_categoria, stock_minimo || 0, stock_maximo, unidad_medida
        ]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe un producto con ese código' });
        }
        res.status(500).json({ error: 'Error al crear producto' });
    }
};

exports.actualizar = async (req, res) => {
    const {
        codigo, nombre, descripcion, precio_venta, precio_compra,
        id_categoria, stock_minimo, stock_maximo, unidad_medida
    } = req.body;
    try {
        const result = await db.query(`
            UPDATE producto
            SET codigo = $1, nombre = $2, descripcion = $3,
                precio_venta = $4, precio_compra = $5, id_categoria = $6,
                stock_minimo = $7, stock_maximo = $8, unidad_medida = $9
            WHERE id = $10
            RETURNING *
        `, [
            codigo, nombre, descripcion, precio_venta, precio_compra,
            id_categoria, stock_minimo, stock_maximo, unidad_medida, req.params.id
        ]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al actualizar producto' });
    }
};

exports.eliminar = async (req, res) => {
    try {
        const result = await db.query(
            'UPDATE producto SET estado = FALSE WHERE id = $1 RETURNING *',
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Producto no encontrado' });
        }
        res.json({ mensaje: 'Producto desactivado correctamente' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al eliminar producto' });
    }
};
