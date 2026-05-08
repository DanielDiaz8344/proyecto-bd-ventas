// ============================================================================
// Controlador: Inventario y Reportes
// ============================================================================

const db = require('../config/database');

exports.listarStock = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                i.id,
                p.codigo,
                p.nombre AS producto,
                a.nombre AS almacen,
                i.cantidad,
                p.stock_minimo,
                p.stock_maximo,
                i.ubicacion,
                i.fecha_actualizacion
            FROM inventario i
            JOIN producto p ON p.id = i.id_producto
            JOIN almacen  a ON a.id = i.id_almacen
            ORDER BY p.codigo, a.nombre
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al consultar inventario' });
    }
};

exports.alertasStock = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                p.codigo,
                p.nombre AS producto,
                a.nombre AS almacen,
                i.cantidad AS stock_actual,
                p.stock_minimo
            FROM inventario i
            JOIN producto p ON p.id = i.id_producto
            JOIN almacen  a ON a.id = i.id_almacen
            WHERE i.cantidad <= p.stock_minimo
              AND p.estado = TRUE
            ORDER BY p.codigo
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al consultar alertas' });
    }
};

exports.kardexProducto = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT
                m.fecha,
                m.tipo,
                m.cantidad,
                m.costo_unitario,
                m.referencia,
                a.nombre AS almacen,
                u.nombre_completo AS usuario
            FROM movimiento_inventario m
            JOIN almacen a ON a.id = m.id_almacen
            JOIN usuario u ON u.id = m.id_usuario
            WHERE m.id_producto = $1
            ORDER BY m.fecha DESC
        `, [req.params.idProducto]);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al consultar kardex' });
    }
};

exports.ajusteManual = async (req, res) => {
    const { id_producto, id_almacen, cantidad, tipo, id_usuario, motivo } = req.body;
    const client = await db.connect();
    try {
        await client.query('BEGIN');

        const delta = tipo === 'entrada' ? cantidad : -cantidad;

        await client.query(`
            INSERT INTO inventario (id_producto, id_almacen, cantidad)
            VALUES ($1, $2, $3)
            ON CONFLICT (id_producto, id_almacen)
            DO UPDATE SET cantidad = inventario.cantidad + $3,
                          fecha_actualizacion = CURRENT_TIMESTAMP
        `, [id_producto, id_almacen, delta]);

        await client.query(`
            INSERT INTO movimiento_inventario
              (id_producto, id_almacen, tipo, cantidad, referencia, id_usuario)
            VALUES ($1, $2, $3, $4, $5, $6)
        `, [id_producto, id_almacen, tipo, cantidad, motivo || 'Ajuste manual', id_usuario]);

        await client.query('COMMIT');
        res.status(201).json({ mensaje: 'Ajuste registrado correctamente' });
    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        res.status(500).json({ error: 'Error al registrar ajuste' });
    } finally {
        client.release();
    }
};
