// ============================================================================
// Controlador: Ventas
// Registra una venta completa en una transacción atómica:
//   1. Inserta cabecera en venta
//   2. Inserta líneas en detalle_venta
//   3. Descuenta stock en inventario
//   4. Genera movimientos de salida en movimiento_inventario
// ============================================================================

const db = require('../config/database');

exports.listar = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT v.*,
                   c.nombre AS cliente_nombre,
                   c.cedula AS cliente_cedula,
                   u.nombre_completo AS vendedor
            FROM venta v
            JOIN cliente c ON c.id = v.id_cliente
            JOIN usuario u ON u.id = v.id_usuario
            ORDER BY v.fecha DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al listar ventas' });
    }
};

exports.obtener = async (req, res) => {
    try {
        const cabecera = await db.query(`
            SELECT v.*, c.nombre AS cliente_nombre, c.cedula AS cliente_cedula,
                   u.nombre_completo AS vendedor
            FROM venta v
            JOIN cliente c ON c.id = v.id_cliente
            JOIN usuario u ON u.id = v.id_usuario
            WHERE v.id = $1
        `, [req.params.id]);

        if (cabecera.rows.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }

        const detalles = await db.query(`
            SELECT dv.*, p.codigo, p.nombre AS producto_nombre
            FROM detalle_venta dv
            JOIN producto p ON p.id = dv.id_producto
            WHERE dv.id_venta = $1
            ORDER BY dv.id
        `, [req.params.id]);

        res.json({
            ...cabecera.rows[0],
            detalles: detalles.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener venta' });
    }
};

exports.crear = async (req, res) => {
    const {
        numero_factura, id_cliente, id_usuario, id_almacen,
        descuento = 0, impuesto = 0, metodo_pago, items
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ error: 'La venta debe tener al menos un producto' });
    }

    const client = await db.connect();

    try {
        await client.query('BEGIN');

        let subtotal = 0;
        for (const item of items) {
            const sub = (item.cantidad * item.precio_unitario) - (item.descuento_linea || 0);
            subtotal += sub;
            item._subtotal = sub;
        }
        const total = subtotal - descuento + impuesto;

        const venta = await client.query(`
            INSERT INTO venta
              (numero_factura, id_cliente, id_usuario, subtotal, descuento, impuesto, total, metodo_pago)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *
        `, [numero_factura, id_cliente, id_usuario, subtotal, descuento, impuesto, total, metodo_pago]);

        const idVenta = venta.rows[0].id;

        for (const item of items) {
            const stock = await client.query(
                'SELECT cantidad FROM inventario WHERE id_producto = $1 AND id_almacen = $2',
                [item.id_producto, id_almacen]
            );

            if (stock.rows.length === 0 || stock.rows[0].cantidad < item.cantidad) {
                throw new Error(`Stock insuficiente para producto ${item.id_producto}`);
            }

            await client.query(`
                INSERT INTO detalle_venta
                  (id_venta, id_producto, cantidad, precio_unitario, descuento_linea, subtotal)
                VALUES ($1, $2, $3, $4, $5, $6)
            `, [idVenta, item.id_producto, item.cantidad, item.precio_unitario,
                item.descuento_linea || 0, item._subtotal]);

            await client.query(`
                UPDATE inventario
                SET cantidad = cantidad - $1, fecha_actualizacion = CURRENT_TIMESTAMP
                WHERE id_producto = $2 AND id_almacen = $3
            `, [item.cantidad, item.id_producto, id_almacen]);

            await client.query(`
                INSERT INTO movimiento_inventario
                  (id_producto, id_almacen, tipo, cantidad, costo_unitario, referencia, id_usuario)
                VALUES ($1, $2, 'salida', $3, $4, $5, $6)
            `, [item.id_producto, id_almacen, item.cantidad,
                item.precio_unitario, `VENTA-${numero_factura}`, id_usuario]);
        }

        await client.query('COMMIT');
        res.status(201).json({ mensaje: 'Venta registrada correctamente', venta: venta.rows[0] });

    } catch (err) {
        await client.query('ROLLBACK');
        console.error(err);
        if (err.code === '23505') {
            return res.status(409).json({ error: 'Ya existe una factura con ese número' });
        }
        res.status(500).json({ error: err.message || 'Error al registrar venta' });
    } finally {
        client.release();
    }
};

exports.anular = async (req, res) => {
    try {
        const result = await db.query(
            "UPDATE venta SET estado = 'anulada' WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Venta no encontrada' });
        }
        res.json({ mensaje: 'Venta anulada' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al anular venta' });
    }
};
