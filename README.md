# Proyecto BD Ventas / Inventario / Almacén

Sistema administrativo web para la gestión de ventas, inventario y almacén.

## Información Académica

- **Materia:** Programación I - Módulo 2
- **Universidad:** UNETI
- **Profesor:** Rodolfo Caccamo
- **Estudiante:** Daniel Díaz
- **Evaluación:** 30% (6 puntos) - Diseño y creación de Base de Datos
- **Fecha de entrega:** Domingo 17 de marzo de 2026

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend | HTML5, CSS3, Bootstrap 5 |
| Backend | Node.js + Express |
| Base de datos | PostgreSQL |
| Conector | pg (node-postgres) |
| Hosting | Render.com / Railway (free tier) |

## Estructura del Proyecto

```
Proyecto BD Ventas/
├── bitacora_ia.md              # Registro de uso de IA (requerido por el docente)
├── README.md                   # Este archivo
├── .gitignore                  # Archivos ignorados por Git
├── .env.example                # Plantilla de variables de entorno
├── package.json                # Dependencias del proyecto (se genera con npm init)
│
├── frontend/                   # Interfaz de usuario
│   ├── index.html              # Página principal
│   ├── css/                    # Estilos personalizados
│   ├── js/                     # Lógica del cliente (fetch a la API)
│   ├── img/                    # Imágenes y recursos gráficos
│   └── pages/                  # Subpáginas (productos, ventas, etc.)
│
├── backend/                    # Servidor Node.js + Express
│   ├── server.js               # Punto de entrada del servidor
│   ├── config/                 # Configuración (conexión a BD, etc.)
│   ├── routes/                 # Rutas de la API REST
│   ├── controllers/            # Lógica de negocio por entidad
│   └── models/                 # Acceso a la base de datos
│
├── database/                   # Todo lo relacionado a la BD
│   ├── schema.sql              # Script de creación de tablas
│   ├── seed.sql                # Datos iniciales de prueba
│   └── diccionario_datos.md    # Documentación de tablas y campos
│
└── docs/                       # Documentación del proyecto
    ├── investigacion.md        # Investigación sobre sistemas administrativos
    ├── modelo_entidad_relacion.md  # Modelo ER explicado
    └── entrega/                # PDF final + documento para subir
```

## Instalación (cuando esté listo)

```bash
npm install
cp .env.example .env
# Editar .env con las credenciales de PostgreSQL
npm start
```

## Despliegue

La aplicación se desplegará en Render.com o Railway con plan gratuito. El enlace público se incluirá en el documento de entrega.
