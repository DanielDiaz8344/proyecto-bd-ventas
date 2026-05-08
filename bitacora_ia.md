# Bitácora de Uso de Inteligencia Artificial

## Información del Proyecto

- **Materia:** Programación I - Módulo 2
- **Universidad:** UNETI - Universidad Nacional Experimental de las Telecomunicaciones e Informática
- **Profesor:** Rodolfo Caccamo
- **Correo del profesor:** Profodolfocaccamo.uneti@gmail.com
- **Estudiante:** Daniel Díaz
- **Evaluación:** Diseño y creación de Base de Datos (30% - 6 puntos)
- **Fecha de entrega:** Domingo 17 de marzo de 2026

---

## Inteligencia Artificial Utilizada

- **Nombre:** Claude (Claude Code CLI)
- **Modelo:** Opus 4.7 (1M context)
- **Proveedor:** Anthropic
- **Sitio oficial:** https://www.claude.com/

---

## Registro de Prompts

A continuación se documentan los prompts utilizados durante el desarrollo del proyecto, indicando el propósito de cada interacción.

---

### Prompt 1
**Propósito:** Establecer contexto inicial del proyecto, definir el alcance del entregable y validar la interpretación de las pautas dadas por el docente.

**Prompt:**
> Te comparto el contexto de un proyecto académico para la materia Programación I - Módulo 2 en UNETI. La asignación consiste en diseñar y crear una base de datos para un sistema administrativo enfocado en las áreas de ventas, inventario y almacén. La base de datos debe sustentarse en investigación previa sobre el funcionamiento de estos sistemas administrativos en el mundo real.
>
> Pautas indicadas por el docente:
> - Motor de base de datos: PostgreSQL o cualquier otro SQL.
> - Tecnologías para la página web: HTML, CSS, Bootstrap y SQL.
> - Entrega: enviar al correo Profodolfocaccamo.uneti@gmail.com el domingo 17 de marzo de 2026.
>
> Adjunto el PDF con la rúbrica oficial de evaluación (ubicado en C:\UNETI\Programación\Programación I (M2)\Sesión 2. Modelado de la base de datos\Rubrica_BD_30%.pdf).
>
> Por favor analiza la rúbrica y el contexto, y confírmame el alcance exacto del entregable, los criterios de evaluación y cualquier observación que consideres relevante antes de iniciar la planificación.

---

### Prompt 2
**Propósito:** Redactar una pregunta clara para enviar al grupo de la materia y consultar al profesor sobre el alcance del entregable y el lenguaje backend.

**Prompt:**
> Dame la pregunta para hacerle en el grupo de Programación I.

---

### Prompt 3
**Propósito:** Ajustar el tono de la pregunta a un registro menos formal, más cercano al lenguaje natural de un estudiante.

**Prompt:**
> Hazla más estudiante, no tan formal, más normal.

---

### Prompt 4
**Propósito:** Adaptar el mensaje al estilo informal característico de la mensajería instantánea (Telegram).

**Prompt:**
> Hazla que no se vea tan correo, hazla como escribe un estudiante universitario por Telegram.

---

### Prompt 5
**Propósito:** Documentar el requerimiento del docente respecto a la transparencia en el uso de herramientas de IA.

**Prompt:**
> El profesor también indicó: "Si llegan a utilizar alguna IA deben indicar cuál usaron, para qué, y los prompts que utilizaron".

---

### Prompt 6
**Propósito:** Definir el lenguaje backend del proyecto. Se decide utilizar Node.js como tecnología de servidor para conectar el frontend con la base de datos.

**Prompt:**
> El profesor nunca indicó la tecnología de backend, pero muchos compañeros usaron Python; nosotros utilizaremos Node.js.

---

### Prompt 7
**Propósito:** Crear la estructura de carpetas del proyecto e inicializar la bitácora de uso de IA dentro del directorio correspondiente.

**Prompt:**
> En esta ruta crea la carpeta del proyecto: C:\UNETI\Programación\Programación I (M2)\Sesión 2. Modelado de la base de datos. Antes de eso, vamos a crear el archivo .md de la bitácora de IA con un prompt inicial estructurado y profesional que registre las instrucciones del proyecto.

---

### Prompt 8
**Propósito:** Generar la estructura completa de carpetas y archivos base del proyecto (frontend, backend, database, docs), incluyendo configuración inicial del servidor Express, plantilla HTML con Bootstrap y archivos de documentación vacíos listos para completar.

**Prompt:**
> Arma la estructura completa de carpetas del proyecto.

---

### Prompt 9
**Propósito:** Realizar la investigación documental sobre el funcionamiento real de los sistemas administrativos de ventas, inventario y almacén, con el fin de sustentar académicamente el modelado de la base de datos. Incluye la consulta de fuentes especializadas (SAP, Odoo, QuickBooks, Clavei, TICPortal, Perú Contable) y la redacción del documento `docs/investigacion.md` con referencias bibliográficas.

**Prompt:**
> Arranca con la investigación.

---

### Prompt 10
**Propósito:** Diseñar el Modelo Entidad-Relación completo del sistema, definiendo las 12 entidades con sus atributos detallados (tipos, restricciones, claves primarias y foráneas), elaborando el diagrama ER en notación Mermaid, justificando las cardinalidades de cada relación y documentando las reglas de negocio que el modelo refleja. Salida: archivo `docs/modelo_entidad_relacion.md`.

**Prompt:**
> Arranca con el modelo ER.

---

### Prompt 11
**Propósito:** Generar el script SQL completo de creación de la base de datos en PostgreSQL (`database/schema.sql`), incluyendo las 12 sentencias `CREATE TABLE` en orden correcto de dependencias, con todas sus restricciones (PK, FK, UNIQUE, CHECK, DEFAULT), los índices recomendados para optimizar consultas frecuentes y comentarios descriptivos. Adicionalmente, generar el script `database/seed.sql` con datos de prueba realistas (usuarios, categorías, productos, clientes venezolanos, proveedores, inventario inicial, ventas y compras de ejemplo, y movimientos de kardex consistentes), y completar el documento formal `database/diccionario_datos.md` con la descripción detallada de cada tabla y el resumen de claves foráneas.

**Prompt:**
> Generemos el schema.sql.

---

### Prompt 12
**Propósito:** Desarrollar el backend completo del sistema en Node.js con Express y PostgreSQL. Incluye: (1) `package.json` con dependencias (express, pg, cors, dotenv), (2) `server.js` con middlewares y manejo de errores, (3) router central que agrupa todas las rutas bajo `/api`, (4) controladores y rutas CRUD para clientes, productos, categorías, proveedores, almacenes y usuarios, (5) endpoint transaccional de ventas que registra cabecera + detalles + descuento de stock + movimientos de kardex en una sola transacción atómica con BEGIN/COMMIT/ROLLBACK, (6) endpoints de inventario con consultas de stock, alertas de stock mínimo, kardex por producto y ajustes manuales, (7) actualización del módulo de conexión a PostgreSQL para soportar tanto consultas simples como transacciones.

**Prompt:**
> Dale con el backend.

---

### Prompt 13
**Propósito:** Desarrollar el frontend completo del sistema con HTML, CSS y Bootstrap 5, conectado al backend mediante peticiones `fetch`. Incluye: (1) helper `api.js` con wrappers de fetch y utilidades (formato moneda, fecha, mensajes flotantes), (2) hoja de estilos `styles.css` con clases personalizadas (tarjetas dashboard, alertas de stock visual), (3) `app.js` con navbar y footer compartidos por todas las páginas, (4) dashboard `index.html` con tarjetas de resumen (productos, clientes, ventas, alertas) y accesos rápidos, (5) páginas CRUD completas con tabla + modal de crear/editar para productos, clientes, proveedores, categorías y almacenes, (6) página de inventario con pestañas de stock actual (con alertas visuales por colores), alertas de stock mínimo y kardex por producto, (7) página de listado de ventas con detalle modal y opción de anular, (8) página de nueva venta con carrito multi-producto, cálculo automático de subtotal/descuento/impuesto/total y envío al endpoint transaccional del backend.

**Prompt:**
> Dale con el frontend.

---

## Stack Tecnológico Definido

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | HTML, CSS, Bootstrap | Indicado por el docente |
| Backend | Node.js + Express | Decisión del equipo (no fue restringido por el docente) |
| Base de datos | PostgreSQL | Permitido por el docente |
| Conector BD | librería `pg` (node-postgres) | Estándar para Node.js + PostgreSQL |
| Hosting | Render.com / Railway | Planes gratuitos, despliegue rápido |

---

## Notas

- Todos los prompts utilizados durante el desarrollo del proyecto deben quedar registrados en este documento.
- La bitácora se actualizará de forma incremental conforme avance el proyecto.
- Este archivo se incluirá como anexo del entregable final.
