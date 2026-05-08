// ============================================================================
// Conexión a PostgreSQL
// ============================================================================
//
// Exporta:
//   - query(text, params): ejecutar consultas simples
//   - connect():           obtener un cliente del pool (para transacciones BEGIN/COMMIT)
// ============================================================================

const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    host:     process.env.DB_HOST,
    port:     process.env.DB_PORT,
    database: process.env.DB_NAME,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});

pool.on('connect', () => {
    console.log('Conectado a PostgreSQL');
});

pool.on('error', (err) => {
    console.error('Error en la conexión a PostgreSQL:', err);
});

module.exports = {
    query:   (text, params) => pool.query(text, params),
    connect: ()              => pool.connect(),
};
