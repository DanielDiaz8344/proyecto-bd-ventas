# Investigación: Sistemas Administrativos de Ventas, Inventario y Almacén

> Documento de investigación que sustenta el modelado de la base de datos del proyecto.
> Requisito explícito del docente: la BD debe basarse en el funcionamiento real de estos sistemas.

**Materia:** Programación I - Módulo 2 (UNETI)
**Estudiante:** Daniel Díaz
**Profesor:** Rodolfo Caccamo

---

## 1. Introducción

Toda empresa que comercializa productos requiere un control sistemático de tres áreas estrechamente conectadas: **ventas, inventario y almacén**. Estas áreas se gestionan mediante **sistemas administrativos**, que son aplicaciones informáticas diseñadas para registrar, controlar y optimizar las operaciones del negocio.

El estándar moderno para este tipo de gestión integrada es el **ERP (Enterprise Resource Planning)** o "Sistema de Planificación de Recursos Empresariales". Un ERP es un conjunto de aplicaciones (módulos) que comparten una **base de datos común** que las conecta y les permite intercambiar información entre sí (SAP, 2024). Esta característica —una sola base de datos integrada— es precisamente lo que hace posible automatizar las áreas administrativas que abordará este proyecto.

---

## 2. Estructura Modular de un Sistema Administrativo

Un sistema administrativo moderno se organiza en **módulos** especializados que se comunican entre sí a través de la base de datos. Para el alcance de este proyecto, los dos módulos centrales son:

### 2.1 Módulo de Ventas

Registra todas las operaciones comerciales con los clientes. Sus funciones principales son (Clavei, 2024; TICPortal, 2024):

- Creación y seguimiento de **cotizaciones** (presupuestos)
- Gestión de **pedidos** y órdenes de venta
- **Facturación** automática
- Control de **márgenes comerciales**
- Registro de **clientes**, contactos y oportunidades comerciales
- Emisión de comprobantes (albaranes, notas de entrega)

### 2.2 Módulo de Inventario y Almacén

Controla la disponibilidad física de los productos. Sus funciones son (TICPortal, 2024):

- Registro de **entradas y salidas** de productos
- Gestión de **ubicaciones** dentro del almacén
- Control de **lotes y caducidades**
- Realización de **inventarios físicos** y auditorías
- **Trazabilidad** completa del producto (desde compra hasta venta)
- Optimización de **niveles de stock** (mínimos, máximos, punto de reorden)

Ambos módulos están conectados de forma directa: **cada venta descuenta automáticamente el stock del almacén**.

---

## 3. Proceso de Ventas: Flujo Real

El proceso de ventas en una empresa sigue un flujo estructurado que va desde el primer interés del cliente hasta el pago final. Este ciclo se compone de las siguientes etapas (Odoo, 2024; QuickBooks, 2024):

| Etapa | Descripción | Documento Generado |
|---|---|---|
| 1. Cotización | Propuesta inicial de precios al cliente | Cotización / Presupuesto |
| 2. Orden de Venta | El cliente acepta y se confirma la venta | Orden de pedido |
| 3. Entrega | Despacho de los productos | Nota de entrega / Albarán |
| 4. Facturación | Emisión del documento legal de cobro | Factura |
| 5. Pago | El cliente cancela el monto adeudado | Recibo de pago |

> **Importancia para el modelado de la BD:** este flujo implica que un mismo cliente puede generar múltiples documentos, y que cada documento se compone de uno o varios productos. Esto exige una estructura de tablas con relaciones **uno-a-muchos** (1 venta → N detalles) y **muchos-a-muchos** resueltas con tablas intermedias.

---

## 4. Gestión de Inventario: Kardex y Métodos de Valuación

### 4.1 ¿Qué es el Kardex?

El **kardex** es un registro estructurado que documenta cada movimiento de mercancía en el almacén (entrada, salida, devolución, ajuste). Permite conocer en todo momento el stock disponible y su valor monetario (Auwi, 2024).

Cada registro del kardex contiene como mínimo:
- Fecha del movimiento
- Tipo de movimiento (entrada / salida / ajuste)
- Cantidad
- Costo unitario
- Stock resultante

### 4.2 Métodos de Valuación

Existen tres métodos principales para asignar el costo a las salidas de inventario (Perú Contable, 2024):

| Método | Descripción | Caso de uso |
|---|---|---|
| **PEPS (FIFO)** | Primero en Entrar, Primero en Salir | Productos perecederos (alimentos, medicinas) |
| **UEPS (LIFO)** | Último en Entrar, Primero en Salir | Épocas de alta inflación (reduce utilidad fiscal) |
| **Promedio Ponderado** | Costo unitario promedio de toda la mercancía disponible | Productos homogéneos sin caducidad |

> **Implicación para la BD:** registrar cada movimiento con su costo unitario es indispensable para que el sistema pueda calcular el valor del inventario aplicando cualquiera de estos métodos.

### 4.3 Conceptos clave de almacén

- **Stock mínimo:** cantidad por debajo de la cual se debe reordenar
- **Stock máximo:** cantidad límite que se puede almacenar
- **Punto de reorden:** umbral que dispara una alerta para reabastecer
- **Múltiples almacenes:** una misma empresa puede tener varios almacenes físicos, y un producto puede estar distribuido entre ellos

---

## 5. Entidades Identificadas para el Modelo

A partir de la investigación, se identifican las siguientes **entidades** que conformarán la base de datos:

### Entidades principales

1. **Cliente** — quien compra productos
2. **Proveedor** — quien suministra productos a la empresa
3. **Categoría** — clasificación de productos
4. **Producto** — artículo comercializado
5. **Almacén** — ubicación física donde se guarda el stock
6. **Inventario** — stock de cada producto en cada almacén
7. **Venta** — transacción comercial con un cliente
8. **Detalle de Venta** — productos específicos incluidos en una venta
9. **Compra** — adquisición de productos a un proveedor
10. **Detalle de Compra** — productos específicos de una compra
11. **Movimiento de Inventario** — registro tipo kardex (entradas/salidas)
12. **Usuario** — empleado que opera el sistema

### Relaciones identificadas

| Relación | Tipo | Descripción |
|---|---|---|
| Cliente — Venta | 1 : N | Un cliente puede tener muchas ventas |
| Venta — Detalle de Venta | 1 : N | Una venta tiene varios productos |
| Producto — Detalle de Venta | 1 : N | Un producto aparece en muchos detalles |
| Categoría — Producto | 1 : N | Una categoría agrupa muchos productos |
| Proveedor — Producto | N : M | Un producto puede tener varios proveedores |
| Proveedor — Compra | 1 : N | Un proveedor recibe varias órdenes de compra |
| Almacén — Inventario | 1 : N | Un almacén guarda varios productos |
| Producto — Inventario | 1 : N | Un producto puede estar en varios almacenes |
| Usuario — Venta | 1 : N | Un usuario registra varias ventas |
| Producto — Movimiento | 1 : N | Un producto tiene muchos movimientos en kardex |

---

## 6. Conclusiones para el Diseño de la Base de Datos

A partir de esta investigación se concluye que:

1. La base de datos debe ser **relacional** (PostgreSQL cumple), porque las entidades están altamente interconectadas.
2. Es indispensable separar **Venta** de **Detalle de Venta** (cabecera y líneas) para soportar ventas multi-producto.
3. La tabla de **Inventario** debe relacionar producto y almacén (no es un atributo del producto), porque un producto puede estar distribuido en varios almacenes.
4. Cada **movimiento de stock** debe quedar registrado con fecha, tipo, cantidad y costo unitario para poder aplicar PEPS, UEPS o Promedio Ponderado.
5. Las tablas deben incluir campos de **auditoría** (fecha de creación, usuario que creó el registro) para garantizar trazabilidad.
6. Las **claves foráneas** deben configurarse con `ON DELETE RESTRICT` para evitar borrados accidentales que rompan la integridad referencial.

Estas conclusiones guiarán la siguiente fase del proyecto: el diseño formal del **Modelo Entidad-Relación** y la elaboración del **script SQL** de creación de tablas.

---

## 7. Referencias

- Auwi. (2024). *Kardex de Inventarios: La Guía Definitiva de Métodos (PEPS, UEPS, Promedio)*. Recuperado de https://auwi.mx/kardex/
- Clavei. (2024). *¿Cuáles son los principales módulos de un ERP?*. Recuperado de https://www.clavei.es/blog/cuales-son-los-principales-modulos-de-un-erp/
- Odoo. (2024). *Cotizaciones de ventas — Documentación oficial*. Recuperado de https://www.odoo.com/documentation/18.0/es_419/applications/sales/sales/sales_quotations.html
- Perú Contable. (2024). *Métodos de Valuación de Inventarios: PEPS, UEPS y Promedio Ponderado*. Recuperado de https://www.perucontable.com/contabilidad/metodos-de-valuacion-de-inventarios-peps-ueps-y-promedio-ponderado/
- QuickBooks. (2024). *Factura de venta: definición y características*. Recuperado de https://quickbooks.intuit.com/global/resources/es/facturacion/factura-venta/
- SAP. (2024). *¿Qué es un ERP? Definición y Beneficios para Empresas*. Recuperado de https://www.sap.com/latinamerica/resources/what-is-erp
- TICPortal. (2024). *Módulos de ERP: tipos y los más comunes*. Recuperado de https://www.ticportal.es/temas/enterprise-resource-planning/modulos-erp
- Universidad de Chile, Departamento de Ciencias de la Computación. (2007). *Guía de Ejercicios: Modelo Entidad/Relación*. Recuperado de https://users.dcc.uchile.cl/~mnmonsal/BD/2007-1/auxiliar02.pdf
