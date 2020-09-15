var express = require('express')
var router = express.Router()
var bicicletaControllerAPI = require('../../controllers/api/bicicletaControllerAPI')

router.get('/', bicicletaControllerAPI.bicicleta_list)
router.post('/create', bicicletaControllerAPI.bicicleta_create)
router.delete('/delete', bicicletaControllerAPI.bicicleta_delete)
router.post('/:id/update',bicicletaControllerAPI.bicicleta_update_post)

module.exports = router