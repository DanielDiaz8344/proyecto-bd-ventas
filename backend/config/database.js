// ============================================================================
// Conexión a PostgreSQL (compatible con Supabase + Vercel serverless)
// ============================================================================
//
// Soporta dos formas de configuración via .env:
//   1. DATABASE_URL completo (recomendado, formato Supabase/Vercel)
//   2. Variables individuales (DB_HOST, DB_PORT, etc.) para desarrollo local
//
// Exporta:
//   - query(text, params): ejecutar consultas simples
//   - connect():           obtener un cliente del pool (para transacciones)
// ============================================================================

const { Pool } = require('pg');
require('dotenv').config();

const config = process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
    }
    : {
        host:     process.env.DB_HOST,
        port:     process.env.DB_PORT,
        database: process.env.DB_NAME,
        user:     process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        ssl:      process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
    };

const pool = new Pool({
    ...config,
    max: 10,
    idleTimeoutMillis: 30000,
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
