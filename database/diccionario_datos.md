# Diccionario de Datos

> Documento formal que describe cada tabla, campo, tipo y restricción de la base de datos del Sistema Administrativo de Ventas, Inventario y Almacén.

**Motor:** PostgreSQL 14+
**Total de tablas:** 12
**Total de relaciones:** 14 claves foráneas

---

## Convenciones

- **PK** — Primary Key (clave primaria)
- **FK** — Foreign Key (clave foránea)
- **UK** — Unique Key (valor único)
- **NN** — NOT NULL (campo obligatorio)
- **CK** — CHECK (validación de valor)
- **DF** — DEFAULT (valor por defecto)

---

## 1. Tabla `usuario`

Empleados con permisos para operar el sistema.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| username | VARCHAR(50) | UK, NN | Nombre de usuario para login |
| password_hash | VARCHAR(255) | NN | Contraseña encriptada (bcrypt) |
| nombre_completo | VARCHAR(150) | NN | Nombre real del empleado |
| rol | VARCHAR(30) | NN, CK ('admin','vendedor','almacenista') | Tipo de permiso |
| email | VARCHAR(100) | UK | Correo del usuario |
| fecha_creacion | TIMESTAMP | NN, DF CURRENT_TIMESTAMP | Fecha de alta |
| estado | BOOLEAN | NN, DF TRUE | Activo / Inactivo |

---

## 2. Tabla `cliente`

Personas o empresas que adquieren productos.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| cedula | VARCHAR(20) | UK, NN | Cédula o documento de identidad |
| nombre | VARCHAR(100) | NN | Nombre |
| apellido | VARCHAR(100) | | Apellido |
| telefono | VARCHAR(20) | | Teléfono de contacto |
| email | VARCHAR(100) | | Correo electrónico |
| direccion | TEXT | | Dirección física |
| fecha_registro | DATE | NN, DF CURRENT_DATE | Fecha de alta |
| estado | BOOLEAN | NN, DF TRUE | Activo / Inactivo |

---

## 3. Tabla `proveedor`

Empresas que suministran productos al negocio.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| rif | VARCHAR(20) | UK, NN | RIF / NIT del proveedor |
| nombre | VARCHAR(150) | NN | Razón social |
| telefono | VARCHAR(20) | | Teléfono |
| email | VARCHAR(100) | | Correo |
| direccion | TEXT | | Dirección |
| contacto | VARCHAR(100) | | Persona de contacto |
| fecha_registro | DATE | NN, DF CURRENT_DATE | Fecha de alta |

---

## 4. Tabla `categoria`

Clasificación general de los productos.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| nombre | VARCHAR(80) | UK, NN | Nombre de la categoría |
| descripcion | TEXT | | Descripción detallada |

---

## 5. Tabla `almacen`

Ubicaciones físicas donde se guarda el stock.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| nombre | VARCHAR(80) | NN | Nombre del almacén |
| direccion | TEXT | | Dirección física |
| encargado | VARCHAR(100) | | Nombre del responsable |
| capacidad | INTEGER | CK (>=0) | Capacidad total |

---

## 6. Tabla `producto`

Catálogo de productos del negocio.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| codigo | VARCHAR(30) | UK, NN | SKU / código interno |
| nombre | VARCHAR(150) | NN | Nombre del producto |
| descripcion | TEXT | | Detalle del producto |
| precio_venta | DECIMAL(10,2) | NN, CK (>=0) | Precio al público |
| precio_compra | DECIMAL(10,2) | CK (>=0) | Costo de adquisición |
| id_categoria | INTEGER | FK → categoria.id, NN | Categoría a la que pertenece |
| stock_minimo | INTEGER | NN, DF 0, CK (>=0) | Umbral de alerta |
| stock_maximo | INTEGER | CK (>=stock_minimo) | Capacidad máxima |
| unidad_medida | VARCHAR(20) | | unidad, kg, litro, caja |
| estado | BOOLEAN | NN, DF TRUE | Activo / Inactivo |

---

## 7. Tabla `inventario`

Stock disponible de cada producto en cada almacén.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| id_producto | INTEGER | FK → producto.id, NN | Producto |
| id_almacen | INTEGER | FK → almacen.id, NN | Almacén |
| cantidad | INTEGER | NN, DF 0, CK (>=0) | Stock actual |
| ubicacion | VARCHAR(50) | | Pasillo / estante |
| fecha_actualizacion | TIMESTAMP | NN, DF CURRENT_TIMESTAMP | Última actualización |

**Restricción adicional:** UNIQUE (id_producto, id_almacen) — un producto solo puede tener un registro de stock por almacén.

---

## 8. Tabla `venta`

Cabecera de cada operación de venta.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| numero_factura | VARCHAR(20) | UK, NN | Número correlativo |
| id_cliente | INTEGER | FK → cliente.id, NN | Cliente comprador |
| id_usuario | INTEGER | FK → usuario.id, NN | Vendedor que registra |
| fecha | TIMESTAMP | NN, DF CURRENT_TIMESTAMP | Fecha y hora |
| subtotal | DECIMAL(12,2) | NN, CK (>=0) | Suma de líneas |
| descuento | DECIMAL(12,2) | NN, DF 0, CK (>=0) | Descuento aplicado |
| impuesto | DECIMAL(12,2) | NN, DF 0, CK (>=0) | IVA u otro |
| total | DECIMAL(12,2) | NN, CK (>=0) | Monto final |
| estado | VARCHAR(20) | NN, DF 'pagada', CK ('pagada','pendiente','anulada') | Estado de la venta |
| metodo_pago | VARCHAR(30) | CK ('efectivo','tarjeta','transferencia','mixto') | Forma de pago |

---

## 9. Tabla `detalle_venta`

Líneas de cada venta (un producto por línea).

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| id_venta | INTEGER | FK → venta.id (CASCADE), NN | Venta a la que pertenece |
| id_producto | INTEGER | FK → producto.id, NN | Producto vendido |
| cantidad | INTEGER | NN, CK (>0) | Unidades vendidas |
| precio_unitario | DECIMAL(10,2) | NN, CK (>=0) | Precio al momento de la venta |
| descuento_linea | DECIMAL(10,2) | NN, DF 0, CK (>=0) | Descuento de la línea |
| subtotal | DECIMAL(12,2) | NN, CK (>=0) | cantidad × precio − descuento |

---

## 10. Tabla `compra`

Cabecera de orden de compra a proveedor.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| numero_orden | VARCHAR(20) | UK, NN | Número de la orden |
| id_proveedor | INTEGER | FK → proveedor.id, NN | Proveedor |
| id_usuario | INTEGER | FK → usuario.id, NN | Quien la registra |
| fecha | TIMESTAMP | NN, DF CURRENT_TIMESTAMP | Fecha y hora |
| subtotal | DECIMAL(12,2) | NN, CK (>=0) | Suma de líneas |
| impuesto | DECIMAL(12,2) | NN, DF 0, CK (>=0) | Impuestos |
| total | DECIMAL(12,2) | NN, CK (>=0) | Monto total |
| estado | VARCHAR(20) | NN, DF 'recibida', CK ('recibida','pendiente','anulada') | Estado |

---

## 11. Tabla `detalle_compra`

Líneas de cada compra.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| id_compra | INTEGER | FK → compra.id (CASCADE), NN | Compra a la que pertenece |
| id_producto | INTEGER | FK → producto.id, NN | Producto comprado |
| cantidad | INTEGER | NN, CK (>0) | Unidades compradas |
| costo_unitario | DECIMAL(10,2) | NN, CK (>=0) | Costo unitario al momento |
| subtotal | DECIMAL(12,2) | NN, CK (>=0) | cantidad × costo |

---

## 12. Tabla `movimiento_inventario`

Kardex: registro histórico de cada movimiento de stock.

| Campo | Tipo | Restricciones | Descripción |
|---|---|---|---|
| id | SERIAL | PK | Identificador único |
| id_producto | INTEGER | FK → producto.id, NN | Producto afectado |
| id_almacen | INTEGER | FK → almacen.id, NN | Almacén afectado |
| tipo | VARCHAR(20) | NN, CK ('entrada','salida','ajuste') | Tipo de movimiento |
| cantidad | INTEGER | NN | Unidades movidas |
| costo_unitario | DECIMAL(10,2) | CK (>=0) | Costo en el momento (PEPS/UEPS/Promedio) |
| fecha | TIMESTAMP | NN, DF CURRENT_TIMESTAMP | Fecha del movimiento |
| referencia | VARCHAR(50) | | Documento origen, ej: VENTA-0123 |
| id_usuario | INTEGER | FK → usuario.id, NN | Quien lo ejecuta |

---

## Resumen de Claves Foráneas

| Tabla origen | Campo | Tabla destino | ON DELETE |
|---|---|---|---|
| producto | id_categoria | categoria | RESTRICT |
| inventario | id_producto | producto | RESTRICT |
| inventario | id_almacen | almacen | RESTRICT |
| venta | id_cliente | cliente | RESTRICT |
| venta | id_usuario | usuario | RESTRICT |
| detalle_venta | id_venta | venta | CASCADE |
| detalle_venta | id_producto | producto | RESTRICT |
| compra | id_proveedor | proveedor | RESTRICT |
| compra | id_usuario | usuario | RESTRICT |
| detalle_compra | id_compra | compra | CASCADE |
| detalle_compra | id_producto | producto | RESTRICT |
| movimiento_inventario | id_producto | producto | RESTRICT |
| movimiento_inventario | id_almacen | almacen | RESTRICT |
| movimiento_inventario | id_usuario | usuario | RESTRICT |

> **Nota:** las cabeceras (`venta`, `compra`) protegen sus líneas con `CASCADE` para mantener integridad. Las demás usan `RESTRICT` para evitar borrados accidentales que rompan el historial.
