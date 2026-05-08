-- ============================================================================
-- Proyecto:  Sistema Administrativo de Ventas, Inventario y Almacén
-- Materia:   Programación I - Módulo 2 (UNETI)
-- Estudiante: Daniel Díaz
-- Profesor:  Rodolfo Caccamo
-- Motor:     PostgreSQL 14+
-- ============================================================================
--
-- Este script crea toda la estructura de la base de datos:
--   - 12 tablas con sus claves primarias, foráneas y restricciones
--   - Índices recomendados para optimizar consultas frecuentes
--   - Comentarios descriptivos por tabla y columna
--
-- Para ejecutar:
--   psql -U postgres -d ventas_inventario -f schema.sql
--
-- Para re-ejecutar limpiando la base de datos:
--   El script incluye DROP TABLE IF EXISTS al inicio.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 0. Limpieza previa (orden inverso por dependencias)
-- ----------------------------------------------------------------------------

DROP TABLE IF EXISTS movimiento_inventario CASCADE;
DROP TABLE IF EXISTS detalle_compra        CASCADE;
DROP TABLE IF EXISTS compra                CASCADE;
DROP TABLE IF EXISTS detalle_venta         CASCADE;
DROP TABLE IF EXISTS venta                 CASCADE;
DROP TABLE IF EXISTS inventario            CASCADE;
DROP TABLE IF EXISTS producto              CASCADE;
DROP TABLE IF EXISTS almacen               CASCADE;
DROP TABLE IF EXISTS categoria             CASCADE;
DROP TABLE IF EXISTS proveedor             CASCADE;
DROP TABLE IF EXISTS cliente               CASCADE;
DROP TABLE IF EXISTS usuario               CASCADE;


-- ============================================================================
-- 1. ENTIDADES SIN DEPENDENCIAS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- USUARIO: empleados que operan el sistema
-- ----------------------------------------------------------------------------
CREATE TABLE usuario (
    id              SERIAL          PRIMARY KEY,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    nombre_completo VARCHAR(150)    NOT NULL,
    rol             VARCHAR(30)     NOT NULL CHECK (rol IN ('admin', 'vendedor', 'almacenista')),
    email           VARCHAR(100)    UNIQUE,
    fecha_creacion  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    estado          BOOLEAN         NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE  usuario IS 'Empleados con permisos para operar el sistema';
COMMENT ON COLUMN usuario.rol IS 'Tipo de permiso: admin, vendedor, almacenista';


-- ----------------------------------------------------------------------------
-- CLIENTE: personas o empresas que compran
-- ----------------------------------------------------------------------------
CREATE TABLE cliente (
    id              SERIAL          PRIMARY KEY,
    cedula          VARCHAR(20)     NOT NULL UNIQUE,
    nombre          VARCHAR(100)    NOT NULL,
    apellido        VARCHAR(100),
    telefono        VARCHAR(20),
    email           VARCHAR(100),
    direccion       TEXT,
    fecha_registro  DATE            NOT NULL DEFAULT CURRENT_DATE,
    estado          BOOLEAN         NOT NULL DEFAULT TRUE
);

COMMENT ON TABLE cliente IS 'Clientes que adquieren productos del negocio';


-- ----------------------------------------------------------------------------
-- PROVEEDOR: empresas que suministran productos
-- ----------------------------------------------------------------------------
CREATE TABLE proveedor (
    id              SERIAL          PRIMARY KEY,
    rif             VARCHAR(20)     NOT NULL UNIQUE,
    nombre          VARCHAR(150)    NOT NULL,
    telefono        VARCHAR(20),
    email           VARCHAR(100),
    direccion       TEXT,
    contacto        VARCHAR(100),
    fecha_registro  DATE            NOT NULL DEFAULT CURRENT_DATE
);

COMMENT ON TABLE proveedor IS 'Proveedores que suministran mercancía a la empresa';


-- ----------------------------------------------------------------------------
-- CATEGORIA: clasificación de productos
-- ----------------------------------------------------------------------------
CREATE TABLE categoria (
    id          SERIAL          PRIMARY KEY,
    nombre      VARCHAR(80)     NOT NULL UNIQUE,
    descripcion TEXT
);

COMMENT ON TABLE categoria IS 'Agrupa productos por tipo o familia';


-- ----------------------------------------------------------------------------
-- ALMACEN: ubicaciones físicas donde se guarda el stock
-- ----------------------------------------------------------------------------
CREATE TABLE almacen (
    id          SERIAL          PRIMARY KEY,
    nombre      VARCHAR(80)     NOT NULL,
    direccion   TEXT,
    encargado   VARCHAR(100),
    capacidad   INTEGER         CHECK (capacidad >= 0)
);

COMMENT ON TABLE almacen IS 'Sucursales o bodegas físicas';


-- ============================================================================
-- 2. ENTIDADES CON DEPENDENCIAS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- PRODUCTO: artículo comercializado
-- ----------------------------------------------------------------------------
CREATE TABLE producto (
    id              SERIAL          PRIMARY KEY,
    codigo          VARCHAR(30)     NOT NULL UNIQUE,
    nombre          VARCHAR(150)    NOT NULL,
    descripcion     TEXT,
    precio_venta    DECIMAL(10,2)   NOT NULL CHECK (precio_venta >= 0),
    precio_compra   DECIMAL(10,2)   CHECK (precio_compra >= 0),
    id_categoria    INTEGER         NOT NULL,
    stock_minimo    INTEGER         NOT NULL DEFAULT 0 CHECK (stock_minimo >= 0),
    stock_maximo    INTEGER         CHECK (stock_maximo >= stock_minimo),
    unidad_medida   VARCHAR(20),
    estado          BOOLEAN         NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria) REFERENCES categoria(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

COMMENT ON TABLE  producto IS 'Catálogo de productos del negocio';
COMMENT ON COLUMN producto.codigo IS 'SKU o código interno único';


-- ----------------------------------------------------------------------------
-- INVENTARIO: stock de cada producto en cada almacén (relación N:M)
-- ----------------------------------------------------------------------------
CREATE TABLE inventario (
    id                  SERIAL          PRIMARY KEY,
    id_producto         INTEGER         NOT NULL,
    id_almacen          INTEGER         NOT NULL,
    cantidad            INTEGER         NOT NULL DEFAULT 0 CHECK (cantidad >= 0),
    ubicacion           VARCHAR(50),
    fecha_actualizacion TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_inventario_producto
        FOREIGN KEY (id_producto) REFERENCES producto(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_inventario_almacen
        FOREIGN KEY (id_almacen) REFERENCES almacen(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT uq_inventario_producto_almacen
        UNIQUE (id_producto, id_almacen)
);

COMMENT ON TABLE  inventario IS 'Stock disponible por producto y almacén';
COMMENT ON COLUMN inventario.ubicacion IS 'Pasillo, estante o coordenada interna del almacén';


-- ----------------------------------------------------------------------------
-- VENTA: cabecera de la transacción comercial
-- ----------------------------------------------------------------------------
CREATE TABLE venta (
    id              SERIAL          PRIMARY KEY,
    numero_factura  VARCHAR(20)     NOT NULL UNIQUE,
    id_cliente      INTEGER         NOT NULL,
    id_usuario      INTEGER         NOT NULL,
    fecha           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal        DECIMAL(12,2)   NOT NULL CHECK (subtotal >= 0),
    descuento       DECIMAL(12,2)   NOT NULL DEFAULT 0 CHECK (descuento >= 0),
    impuesto        DECIMAL(12,2)   NOT NULL DEFAULT 0 CHECK (impuesto >= 0),
    total           DECIMAL(12,2)   NOT NULL CHECK (total >= 0),
    estado          VARCHAR(20)     NOT NULL DEFAULT 'pagada'
                        CHECK (estado IN ('pagada', 'pendiente', 'anulada')),
    metodo_pago     VARCHAR(30)     CHECK (metodo_pago IN ('efectivo', 'tarjeta', 'transferencia', 'mixto')),

    CONSTRAINT fk_venta_cliente
        FOREIGN KEY (id_cliente) REFERENCES cliente(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_venta_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

COMMENT ON TABLE venta IS 'Cabecera de cada operación de venta (factura)';


-- ----------------------------------------------------------------------------
-- DETALLE_VENTA: líneas de cada venta
-- ----------------------------------------------------------------------------
CREATE TABLE detalle_venta (
    id                  SERIAL          PRIMARY KEY,
    id_venta            INTEGER         NOT NULL,
    id_producto         INTEGER         NOT NULL,
    cantidad            INTEGER         NOT NULL CHECK (cantidad > 0),
    precio_unitario     DECIMAL(10,2)   NOT NULL CHECK (precio_unitario >= 0),
    descuento_linea     DECIMAL(10,2)   NOT NULL DEFAULT 0 CHECK (descuento_linea >= 0),
    subtotal            DECIMAL(12,2)   NOT NULL CHECK (subtotal >= 0),

    CONSTRAINT fk_detventa_venta
        FOREIGN KEY (id_venta) REFERENCES venta(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_detventa_producto
        FOREIGN KEY (id_producto) REFERENCES producto(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

COMMENT ON TABLE detalle_venta IS 'Productos específicos vendidos en cada venta';


-- ----------------------------------------------------------------------------
-- COMPRA: cabecera de orden de compra a proveedor
-- ----------------------------------------------------------------------------
CREATE TABLE compra (
    id              SERIAL          PRIMARY KEY,
    numero_orden    VARCHAR(20)     NOT NULL UNIQUE,
    id_proveedor    INTEGER         NOT NULL,
    id_usuario      INTEGER         NOT NULL,
    fecha           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    subtotal        DECIMAL(12,2)   NOT NULL CHECK (subtotal >= 0),
    impuesto        DECIMAL(12,2)   NOT NULL DEFAULT 0 CHECK (impuesto >= 0),
    total           DECIMAL(12,2)   NOT NULL CHECK (total >= 0),
    estado          VARCHAR(20)     NOT NULL DEFAULT 'recibida'
                        CHECK (estado IN ('recibida', 'pendiente', 'anulada')),

    CONSTRAINT fk_compra_proveedor
        FOREIGN KEY (id_proveedor) REFERENCES proveedor(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_compra_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

COMMENT ON TABLE compra IS 'Cabecera de cada orden de compra al proveedor';


-- ----------------------------------------------------------------------------
-- DETALLE_COMPRA: líneas de cada compra
-- ----------------------------------------------------------------------------
CREATE TABLE detalle_compra (
    id              SERIAL          PRIMARY KEY,
    id_compra       INTEGER         NOT NULL,
    id_producto     INTEGER         NOT NULL,
    cantidad        INTEGER         NOT NULL CHECK (cantidad > 0),
    costo_unitario  DECIMAL(10,2)   NOT NULL CHECK (costo_unitario >= 0),
    subtotal        DECIMAL(12,2)   NOT NULL CHECK (subtotal >= 0),

    CONSTRAINT fk_detcompra_compra
        FOREIGN KEY (id_compra) REFERENCES compra(id)
        ON DELETE CASCADE ON UPDATE CASCADE,

    CONSTRAINT fk_detcompra_producto
        FOREIGN KEY (id_producto) REFERENCES producto(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

COMMENT ON TABLE detalle_compra IS 'Productos específicos incluidos en cada compra';


-- ----------------------------------------------------------------------------
-- MOVIMIENTO_INVENTARIO: kardex completo
-- ----------------------------------------------------------------------------
CREATE TABLE movimiento_inventario (
    id              SERIAL          PRIMARY KEY,
    id_producto     INTEGER         NOT NULL,
    id_almacen      INTEGER         NOT NULL,
    tipo            VARCHAR(20)     NOT NULL
                        CHECK (tipo IN ('entrada', 'salida', 'ajuste')),
    cantidad        INTEGER         NOT NULL,
    costo_unitario  DECIMAL(10,2)   CHECK (costo_unitario >= 0),
    fecha           TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    referencia      VARCHAR(50),
    id_usuario      INTEGER         NOT NULL,

    CONSTRAINT fk_movinv_producto
        FOREIGN KEY (id_producto) REFERENCES producto(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_movinv_almacen
        FOREIGN KEY (id_almacen) REFERENCES almacen(id)
        ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT fk_movinv_usuario
        FOREIGN KEY (id_usuario) REFERENCES usuario(id)
        ON DELETE RESTRICT ON UPDATE CASCADE
);

COMMENT ON TABLE  movimiento_inventario IS 'Kardex: registro histórico de movimientos de stock';
COMMENT ON COLUMN movimiento_inventario.referencia IS 'Documento origen, ej: VENTA-0123 o COMPRA-0045';


-- ============================================================================
-- 3. ÍNDICES RECOMENDADOS PARA QUERIES FRECUENTES
-- ============================================================================

-- Búsquedas por código de producto
CREATE INDEX idx_producto_codigo       ON producto (codigo);
CREATE INDEX idx_producto_categoria    ON producto (id_categoria);
CREATE INDEX idx_producto_estado       ON producto (estado) WHERE estado = TRUE;

-- Búsquedas en ventas por cliente y fecha
CREATE INDEX idx_venta_cliente         ON venta (id_cliente);
CREATE INDEX idx_venta_usuario         ON venta (id_usuario);
CREATE INDEX idx_venta_fecha           ON venta (fecha);
CREATE INDEX idx_venta_estado          ON venta (estado);

-- Búsquedas en compras
CREATE INDEX idx_compra_proveedor      ON compra (id_proveedor);
CREATE INDEX idx_compra_fecha          ON compra (fecha);

-- Joins frecuentes en detalles
CREATE INDEX idx_detventa_venta        ON detalle_venta (id_venta);
CREATE INDEX idx_detventa_producto     ON detalle_venta (id_producto);
CREATE INDEX idx_detcompra_compra      ON detalle_compra (id_compra);
CREATE INDEX idx_detcompra_producto    ON detalle_compra (id_producto);

-- Consultas de stock e historial
CREATE INDEX idx_inventario_producto   ON inventario (id_producto);
CREATE INDEX idx_inventario_almacen    ON inventario (id_almacen);
CREATE INDEX idx_movinv_producto       ON movimiento_inventario (id_producto);
CREATE INDEX idx_movinv_fecha          ON movimiento_inventario (fecha);

-- Búsquedas por documento de identidad
CREATE INDEX idx_cliente_cedula        ON cliente (cedula);
CREATE INDEX idx_proveedor_rif         ON proveedor (rif);


-- ============================================================================
-- FIN DEL SCRIPT
-- ============================================================================
