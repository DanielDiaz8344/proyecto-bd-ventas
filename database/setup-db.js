// ============================================================================
// setup-db.js - Aplica schema.sql + seed.sql a la base de datos configurada
//
// Uso:
//   node database/setup-db.js
// ============================================================================

const fs   = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config();

(async () => {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    });

    try {
        console.log('Conectando a la base de datos...');

        const schemaPath = path.join(__dirname, 'schema.sql');
        const seedPath   = path.join(__dirname, 'seed.sql');

        console.log('Aplicando schema.sql...');
        await pool.query(fs.readFileSync(schemaPath, 'utf8'));
        console.log('  Schema aplicado correctamente');

        console.log('Aplicando seed.sql...');
        await pool.query(fs.readFileSync(seedPath, 'utf8'));
        console.log('  Seed cargado correctamente');

        const conteo = await pool.query(`
            SELECT
                (SELECT COUNT(*) FROM usuario)   AS usuarios,
                (SELECT COUNT(*) FROM categoria) AS categorias,
                (SELECT COUNT(*) FROM producto)  AS productos,
                (SELECT COUNT(*) FROM cliente)   AS clientes,
                (SELECT COUNT(*) FROM venta)     AS ventas
        `);
        console.log('\nResumen de carga:');
        console.table(conteo.rows[0]);

        console.log('\nBase de datos lista.');
    } catch (err) {
        console.error('\nError al configurar la base de datos:');
        console.error(err.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
})();
