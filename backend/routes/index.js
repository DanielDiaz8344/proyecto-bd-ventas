// ============================================================================
// Router principal - centraliza todas las rutas de la API
// ============================================================================

const express = require('express');
const router  = express.Router();

router.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

router.use('/clientes',    require('./clientes'));
router.use('/productos',   require('./productos'));
router.use('/categorias',  require('./categorias'));
router.use('/proveedores', require('./proveedores'));
router.use('/almacenes',   require('./almacenes'));
router.use('/inventario',  require('./inventario'));
router.use('/ventas',      require('./ventas'));
router.use('/usuarios',    require('./usuarios'));

module.exports = router;
