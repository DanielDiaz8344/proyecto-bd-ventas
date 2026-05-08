const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/ventasController');

router.get('/',           ctrl.listar);
router.get('/:id',        ctrl.obtener);
router.post('/',          ctrl.crear);
router.put('/:id/anular', ctrl.anular);

module.exports = router;
