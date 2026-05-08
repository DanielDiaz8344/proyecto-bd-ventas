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

### Prompt 14
**Propósito:** Verificar el entorno de desarrollo (Node.js, npm, PostgreSQL), instalar las dependencias del proyecto con `npm install` y arrancar el servidor en localhost para realizar pruebas funcionales antes del despliegue. Como PostgreSQL no estaba instalado localmente, se evaluaron dos opciones: instalación local vs uso de Supabase como base de datos PostgreSQL en la nube. Se decidió utilizar Supabase para evitar dependencia de software local y facilitar el posterior despliegue en Vercel.

**Prompt:**
> Ejecuta el localhost para hacer pruebas al yo darte el visto bueno, lo subimos a Git y después a Vercel.

---

### Prompt 15
**Propósito:** Configurar el servidor MCP (Model Context Protocol) de Supabase en el alcance del proyecto, generando el archivo `.mcp.json` que permite la integración entre Claude Code y la base de datos remota de Supabase para automatizar operaciones de administración (consulta de tablas, aplicación de migraciones, etc.).

**Prompt:**
> claude mcp add --scope project --transport http supabase "https://mcp.supabase.com/mcp?project_ref=dsvbogtygnivdcscppcg&read_only=true"

---

### Prompt 16
**Propósito:** Aplicar de forma automatizada el script `schema.sql` (creación de las 12 tablas) y el script `seed.sql` (datos de prueba) sobre la base de datos PostgreSQL alojada en Supabase, utilizando un Personal Access Token (PAT) y la API de gestión de Supabase (`api.supabase.com`). Verificar que las 12 tablas se crearon correctamente y que los datos de prueba se cargaron (3 usuarios, 5 categorías, 10 productos, 5 clientes, 3 ventas con sus 12 detalles, 17 movimientos de inventario). Obtener el connection string del pooler de Supabase para configurar el backend.

**Prompt:**
> Aplica el schema y seed directamente en Supabase usando el Personal Access Token (PAT redactado por seguridad).

---

### Prompt 17
**Propósito:** Adaptar el backend Node.js para conectarse a la base de datos remota de Supabase. Modificaciones realizadas: (1) `backend/config/database.js` actualizado para soportar `DATABASE_URL` con SSL, manteniendo compatibilidad con variables individuales para entornos locales; (2) `backend/server.js` separado en `app` y `listen` para que funcione tanto en localhost (desarrollo) como en serverless (Vercel); (3) creación de `vercel.json` con configuración de builds y rutas; (4) creación de `database/setup-db.js` como script auxiliar para aplicar schema y seed desde el connection string. Verificación de la conexión Node.js → Supabase pooler y arranque exitoso del servidor en `http://localhost:3000` con todos los endpoints respondiendo correctamente.

**Prompt:**
> Configura el backend para conectarse al pooler de Supabase y prepáralo para Vercel.

---

### Prompt 18
**Propósito:** Inicializar el repositorio Git en el directorio del proyecto, crear el commit inicial con los 47 archivos del sistema (excluyendo `node_modules` y `.env` mediante `.gitignore`), crear el repositorio público en GitHub mediante el CLI `gh` y realizar el push del código fuente. URL pública: https://github.com/DanielDiaz8344/proyecto-bd-ventas

**Prompt:**
> Súbelo a Git para yo subirlo a Vercel.

---

### Prompt 19
**Propósito:** Guiar el proceso de despliegue en Vercel y la configuración de la variable de entorno `DATABASE_URL` en el panel de control de Vercel para que el backend desplegado pueda conectarse a la base de datos de Supabase. Forzar un nuevo despliegue (redeploy) para que la variable de entorno tomase efecto y verificar que la URL pública del proyecto carga correctamente con datos reales en el dashboard.

**Prompt:**
> Ya subí el proyecto a Vercel. Ayúdame a configurar la variable de entorno DATABASE_URL para que el backend conecte a Supabase.

---

### Prompt 20
**Propósito:** Rediseñar completamente la interfaz de usuario para lograr un look profesional tipo dashboard ERP moderno (referencia visual: Vercel Dashboard, Linear). Cambios implementados: (1) sidebar lateral oscuro de 260px con organización por secciones (General, Operaciones, Catálogo, Contactos) y logo con gradiente; (2) tipografía Inter para texto y JetBrains Mono para códigos vía Google Fonts; (3) sistema de design tokens con variables CSS para paleta refinada (slate, azul, verde, naranja, morado); (4) stat cards con iconos coloreados y micro-interacciones (hover lift); (5) cards de acción rápida con borde resaltado al hover; (6) tablas con headers en mayúscula y filas con hover sutil; (7) dashboard rediseñado con sección de últimas ventas y panel de productos con stock bajo; (8) responsive con sidebar colapsable en mobile (<992px).

**Prompt:**
> Look más profesional.

---

### Prompt 21
**Propósito:** Implementar la funcionalidad de registro manual de movimientos de inventario (entradas, salidas y ajustes) que faltaba en la interfaz. (1) Backend: mejora del endpoint `POST /api/inventario/ajuste` con validación de campos obligatorios, validación de tipo permitido (entrada/salida/ajuste), verificación de stock disponible antes de salidas (con mensaje claro de stock disponible), creación automática del registro de inventario si no existe, y mantenimiento de la transacción atómica BEGIN/COMMIT/ROLLBACK. (2) Frontend: botón "Nuevo movimiento" en el page-header de la página de inventario, modal con formulario completo (tipo, producto, almacén, cantidad, usuario, motivo), carga dinámica de selects (productos, almacenes, usuarios), refresco automático de tablas tras registrar el movimiento, y manejo de errores con mensajes flotantes.

**Prompt:**
> ¿Y cómo agrego cosas al inventario?

---

### Prompt 22
**Propósito:** Actualizar la bitácora de uso de IA con los prompts faltantes desde el desarrollo del frontend (Prompt 13) hasta el momento actual, registrando todas las decisiones tomadas con asistencia de la IA durante las fases de despliegue, configuración de Supabase, mejora del diseño y adición de funcionalidades.

**Prompt:**
> Actualiza la bitácora.

---

## Stack Tecnológico Definido

| Capa | Tecnología | Justificación |
|---|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5, Inter (Google Fonts), Bootstrap Icons | Indicado por el docente; Inter y BS Icons añadidos para look profesional |
| Backend | Node.js + Express | Decisión del equipo (no fue restringido por el docente) |
| Base de datos | PostgreSQL 17 (Supabase) | Permitido por el docente; Supabase ofrece hosting gratuito y mismo PostgreSQL real |
| Conector BD | `pg` (node-postgres) con SSL | Estándar para Node.js + PostgreSQL; SSL requerido por Supabase |
| Hosting frontend + backend | Vercel (plan free) | Deploy automático desde GitHub, soporta Node.js serverless |
| Hosting BD | Supabase (plan free) | PostgreSQL gestionado, dashboard SQL Editor, Connection Pooler |
| Repositorio | GitHub público | Versionado y enlace al deploy |

---

## URLs del Proyecto

- **Repositorio GitHub:** https://github.com/DanielDiaz8344/proyecto-bd-ventas
- **Aplicación desplegada:** (Vercel) — el enlace público se incluirá en el documento final de entrega
- **Base de datos:** Supabase project `dsvbogtygnivdcscppcg` (región us-west-2)

---

## Notas

- Todos los prompts utilizados durante el desarrollo del proyecto deben quedar registrados en este documento.
- La bitácora se actualizará de forma incremental conforme avance el proyecto.
- Este archivo se incluirá como anexo del entregable final.
- El uso de IA se limitó a tareas de redacción, generación de código siguiendo decisiones tomadas por el estudiante, búsqueda de información y aplicación de configuraciones. Las decisiones de arquitectura (uso de Node.js, elección de Supabase, estructura de tablas, alcance de la entrega) fueron tomadas por el estudiante.
