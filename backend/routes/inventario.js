const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/inventarioController');

router.get('/',                       ctrl.listarStock);
router.get('/alertas',                ctrl.alertasStock);
router.get('/kardex/:idProducto',     ctrl.kardexProducto);
router.post('/ajuste',                ctrl.ajusteManual);

module.exports = router;
