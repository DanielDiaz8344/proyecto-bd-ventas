const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/usuariosController');

router.get('/',      ctrl.listar);
router.post('/',     ctrl.crear);
router.post('/login', ctrl.login);

module.exports = router;
