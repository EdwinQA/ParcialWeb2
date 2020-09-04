const { Router } = require('express');
const router = Router();
const control = require('../controller/Admin.controller');

router.get('/', control.inicio);
router.get('/admin', control.admin);
router.post('/nuevo_proyecto', control.nuevo_proyecto); 
router.post('/nuevo_trabajo', control.nuevo_trabajo);
router.get('/eliminar_proyecto', control.eliminar_proyecto);
router.get('/eliminar_trabajo', control.eliminar_trabajo);
router.get('/modificar_proyecto', control.modificar_proyecto);
router.get('/modificar_trabajo', control.modificar_trabajo);
module.exports = router;
