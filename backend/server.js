// ============================================================================
// Servidor Express - Sistema Administrativo de Ventas e Inventario
// Compatible con ejecución local y serverless (Vercel)
// ============================================================================

const express = require('express');
const cors    = require('cors');
const path    = require('path');
require('dotenv').config();

const apiRouter = require('./routes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..', 'frontend')));

app.use('/api', apiRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Recurso no encontrado' });
});

app.use((err, req, res, next) => {
    console.error('Error no controlado:', err);
    res.status(500).json({ error: 'Error interno del servidor' });
});

if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}

module.exports = app;
