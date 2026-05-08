-- ============================================================================
-- DATOS DE PRUEBA (SEED) - Sistema de Ventas e Inventario
-- ============================================================================
--
-- Este script carga datos iniciales para probar el sistema.
-- Debe ejecutarse DESPUÉS de schema.sql:
--
--   psql -U postgres -d ventas_inventario -f schema.sql
--   psql -U postgres -d ventas_inventario -f seed.sql
--
-- ============================================================================


-- ----------------------------------------------------------------------------
-- USUARIOS DEL SISTEMA
-- ----------------------------------------------------------------------------
-- NOTA: en producción, password_hash se genera con bcrypt desde el backend.
-- Aquí se usa un hash de ejemplo para clave "1234".

INSERT INTO usuario (username, password_hash, nombre_completo, rol, email) VALUES
    ('admin',     '$2b$10$ejemploHashAdmin1234567890abcdef', 'Daniel Díaz',         'admin',        'admin@empresa.com'),
    ('vendedor1', '$2b$10$ejemploHashVende1234567890abcdef', 'María González',      'vendedor',     'maria@empresa.com'),
    ('almacen1',  '$2b$10$ejemploHashAlmac1234567890abcdef', 'Carlos Rodríguez',    'almacenista',  'carlos@empresa.com');


-- ----------------------------------------------------------------------------
-- CATEGORÍAS
-- ----------------------------------------------------------------------------
INSERT INTO categoria (nombre, descripcion) VALUES
    ('Bebidas',        'Refrescos, jugos, agua y bebidas en general'),
    ('Limpieza',       'Productos de aseo personal y del hogar'),
    ('Alimentos',      'Productos alimenticios no perecederos'),
    ('Electrónica',    'Equipos electrónicos y accesorios'),
    ('Papelería',      'Materiales de oficina y escolares');


-- ----------------------------------------------------------------------------
-- PROVEEDORES
-- ----------------------------------------------------------------------------
INSERT INTO proveedor (rif, nombre, telefono, email, direccion, contacto) VALUES
    ('J-12345678-9', 'Distribuidora Polar C.A.',     '0212-555-1001', 'ventas@polar.com.ve',    'Av. Principal, Caracas',   'Luis Pérez'),
    ('J-23456789-0', 'Alimentos La Granja S.A.',     '0212-555-1002', 'pedidos@lagranja.com',   'Zona Industrial, Valencia','Ana Mendoza'),
    ('J-34567890-1', 'Importadora Tecnológica C.A.', '0212-555-1003', 'contacto@imptec.com.ve', 'Centro Comercial, Caracas','Pedro Salazar');


-- ----------------------------------------------------------------------------
-- ALMACENES
-- ----------------------------------------------------------------------------
INSERT INTO almacen (nombre, direccion, encargado, capacidad) VALUES
    ('Almacén Principal',  'Galpón 1, Av. Industrial, Caracas',  'Carlos Rodríguez', 5000),
    ('Almacén Sucursal',   'Local 5, C.C. Sambil, Caracas',      'Ana Méndez',       1500);


-- ----------------------------------------------------------------------------
-- PRODUCTOS
-- ----------------------------------------------------------------------------
INSERT INTO producto (codigo, nombre, descripcion, precio_venta, precio_compra, id_categoria, stock_minimo, stock_maximo, unidad_medida) VALUES
    ('BEB-001', 'Refresco Cola 2L',          'Botella PET de 2 litros',           3.50,  2.00, 1,  20, 200, 'unidad'),
    ('BEB-002', 'Agua Mineral 600ml',        'Botella PET de 600 ml',             1.20,  0.60, 1,  50, 500, 'unidad'),
    ('LIM-001', 'Detergente en polvo 1kg',   'Bolsa de 1 kg',                     5.80,  3.50, 2,  15, 100, 'unidad'),
    ('LIM-002', 'Jabón de baño 90g',         'Pastilla individual',               1.50,  0.80, 2,  30, 300, 'unidad'),
    ('ALI-001', 'Arroz blanco 1kg',          'Bolsa de 1 kg',                     2.80,  1.80, 3,  25, 250, 'unidad'),
    ('ALI-002', 'Aceite vegetal 1L',         'Botella de 1 litro',                4.20,  2.80, 3,  20, 150, 'unidad'),
    ('ALI-003', 'Pasta corta 500g',          'Paquete de 500 gramos',             1.90,  1.10, 3,  30, 200, 'unidad'),
    ('ELE-001', 'Pendrive 32GB USB 3.0',     'Memoria USB de 32 gigabytes',      12.50,  7.00, 4,  10,  80, 'unidad'),
    ('ELE-002', 'Audífonos con cable',       'Audífonos in-ear estándar',         8.00,  4.50, 4,  10,  60, 'unidad'),
    ('PAP-001', 'Cuaderno universitario',    'Cuaderno 100 hojas, cuadriculado',  3.20,  1.80, 5,  20, 150, 'unidad');


-- ----------------------------------------------------------------------------
-- INVENTARIO INICIAL (stock distribuido entre los 2 almacenes)
-- ----------------------------------------------------------------------------
INSERT INTO inventario (id_producto, id_almacen, cantidad, ubicacion) VALUES
    -- Almacén Principal
    (1,  1, 120, 'A-01-03'),
    (2,  1, 350, 'A-01-04'),
    (3,  1,  60, 'B-02-01'),
    (4,  1, 200, 'B-02-02'),
    (5,  1, 180, 'C-03-01'),
    (6,  1,  90, 'C-03-02'),
    (7,  1, 140, 'C-03-03'),
    (8,  1,  45, 'D-04-01'),
    (9,  1,  30, 'D-04-02'),
    (10, 1,  85, 'E-05-01'),
    -- Almacén Sucursal (cantidades menores)
    (1,  2,  40, 'P-01'),
    (2,  2, 120, 'P-02'),
    (3,  2,  25, 'P-03'),
    (5,  2,  60, 'P-04'),
    (8,  2,  15, 'P-05');


-- ----------------------------------------------------------------------------
-- CLIENTES
-- ----------------------------------------------------------------------------
INSERT INTO cliente (cedula, nombre, apellido, telefono, email, direccion) VALUES
    ('V-12345678', 'Juan',    'Martínez', '0414-555-2001', 'juan.martinez@gmail.com',    'Urb. La Castellana, Caracas'),
    ('V-23456789', 'Sofía',   'Hernández','0424-555-2002', 'sofia.h@hotmail.com',        'Av. Bolívar, Valencia'),
    ('V-34567890', 'Andrés',  'Rojas',    '0412-555-2003', 'andresrojas@yahoo.com',      'Calle 5, Maracaibo'),
    ('V-45678901', 'Isabella','Castro',   '0416-555-2004', 'isa.castro@outlook.com',     'Centro, Mérida'),
    ('J-56789012', 'Bodegón Express C.A.', NULL, '0212-555-2005', 'compras@bodegon.com', 'Av. Principal, Caracas');


-- ----------------------------------------------------------------------------
-- COMPRAS DE EJEMPLO
-- ----------------------------------------------------------------------------
INSERT INTO compra (numero_orden, id_proveedor, id_usuario, fecha, subtotal, impuesto, total, estado) VALUES
    ('OC-2026-0001', 1, 1, '2026-02-15 09:30:00',  500.00,  80.00,  580.00, 'recibida'),
    ('OC-2026-0002', 2, 1, '2026-02-20 11:00:00',  430.00,  68.80,  498.80, 'recibida');

INSERT INTO detalle_compra (id_compra, id_producto, cantidad, costo_unitario, subtotal) VALUES
    -- Compra 1: bebidas
    (1, 1, 100, 2.00, 200.00),
    (1, 2, 500, 0.60, 300.00),
    -- Compra 2: alimentos
    (2, 5, 100, 1.80, 180.00),
    (2, 6,  50, 2.80, 140.00),
    (2, 7, 100, 1.10, 110.00);


-- ----------------------------------------------------------------------------
-- VENTAS DE EJEMPLO
-- ----------------------------------------------------------------------------
INSERT INTO venta (numero_factura, id_cliente, id_usuario, fecha, subtotal, descuento, impuesto, total, estado, metodo_pago) VALUES
    ('FAC-2026-0001', 1, 2, '2026-03-01 10:15:00',  21.40, 0.00, 3.42,  24.82, 'pagada', 'efectivo'),
    ('FAC-2026-0002', 2, 2, '2026-03-02 14:30:00',  29.80, 1.00, 4.61,  33.41, 'pagada', 'tarjeta'),
    ('FAC-2026-0003', 5, 2, '2026-03-03 16:45:00',  86.00, 5.00, 12.96, 93.96, 'pagada', 'transferencia');

INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario, descuento_linea, subtotal) VALUES
    -- Venta 1: 2 refrescos + 3 aguas + 1 jabón
    (1, 1, 2, 3.50, 0.00,  7.00),
    (1, 2, 3, 1.20, 0.00,  3.60),
    (1, 4, 1, 1.50, 0.00,  1.50),
    (1, 7, 5, 1.90, 0.00,  9.50),
    -- Venta 2: arroz, aceite, detergente
    (2, 5, 3, 2.80, 0.00,  8.40),
    (2, 6, 2, 4.20, 0.00,  8.40),
    (2, 3, 2, 5.80, 1.00, 10.60),
    (2, 7, 1, 1.90, 0.00,  1.90),
    (2, 1, 1, 3.50, 0.00,  3.50),
    -- Venta 3: pendrive + audífonos + cuaderno (compra grande del bodegón)
    (3, 8, 5, 12.50, 0.00, 62.50),
    (3, 9, 2,  8.00, 0.00, 16.00),
    (3,10, 5,  3.20, 5.00, 11.00);


-- ----------------------------------------------------------------------------
-- MOVIMIENTOS DE INVENTARIO (kardex correspondiente a las compras y ventas)
-- ----------------------------------------------------------------------------
INSERT INTO movimiento_inventario (id_producto, id_almacen, tipo, cantidad, costo_unitario, fecha, referencia, id_usuario) VALUES
    -- Entradas por las compras
    (1, 1, 'entrada', 100, 2.00, '2026-02-15 09:30:00', 'COMPRA-0001', 1),
    (2, 1, 'entrada', 500, 0.60, '2026-02-15 09:30:00', 'COMPRA-0001', 1),
    (5, 1, 'entrada', 100, 1.80, '2026-02-20 11:00:00', 'COMPRA-0002', 1),
    (6, 1, 'entrada',  50, 2.80, '2026-02-20 11:00:00', 'COMPRA-0002', 1),
    (7, 1, 'entrada', 100, 1.10, '2026-02-20 11:00:00', 'COMPRA-0002', 1),
    -- Salidas por las ventas
    (1, 1, 'salida',   2, 2.00, '2026-03-01 10:15:00', 'VENTA-0001', 2),
    (2, 1, 'salida',   3, 0.60, '2026-03-01 10:15:00', 'VENTA-0001', 2),
    (4, 1, 'salida',   1, 0.80, '2026-03-01 10:15:00', 'VENTA-0001', 2),
    (7, 1, 'salida',   5, 1.10, '2026-03-01 10:15:00', 'VENTA-0001', 2),
    (5, 1, 'salida',   3, 1.80, '2026-03-02 14:30:00', 'VENTA-0002', 2),
    (6, 1, 'salida',   2, 2.80, '2026-03-02 14:30:00', 'VENTA-0002', 2),
    (3, 1, 'salida',   2, 3.50, '2026-03-02 14:30:00', 'VENTA-0002', 2),
    (7, 1, 'salida',   1, 1.10, '2026-03-02 14:30:00', 'VENTA-0002', 2),
    (1, 1, 'salida',   1, 2.00, '2026-03-02 14:30:00', 'VENTA-0002', 2),
    (8, 1, 'salida',   5, 7.00, '2026-03-03 16:45:00', 'VENTA-0003', 2),
    (9, 1, 'salida',   2, 4.50, '2026-03-03 16:45:00', 'VENTA-0003', 2),
    (10,1, 'salida',   5, 1.80, '2026-03-03 16:45:00', 'VENTA-0003', 2);


-- ============================================================================
-- FIN DEL SEED
-- ============================================================================
--
-- Para verificar la carga, consultas útiles:
--
--   SELECT COUNT(*) FROM producto;       -- 10
--   SELECT COUNT(*) FROM cliente;        -- 5
--   SELECT COUNT(*) FROM venta;          -- 3
--   SELECT COUNT(*) FROM detalle_venta;  -- 12
--
--   -- Ver stock actual:
--   SELECT p.codigo, p.nombre, a.nombre AS almacen, i.cantidad
--   FROM inventario i
--   JOIN producto p ON p.id = i.id_producto
--   JOIN almacen  a ON a.id = i.id_almacen
--   ORDER BY p.codigo;
--
--   -- Ver historial de ventas con detalle:
--   SELECT v.numero_factura, c.nombre, v.total, v.fecha
--   FROM venta v
--   JOIN cliente c ON c.id = v.id_cliente
--   ORDER BY v.fecha DESC;
-- ============================================================================
