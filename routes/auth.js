const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth')

router.post('/authFromToken', controller.authFromToken)
router.post('/login', controller.login)
router.post('/saveNewUser', controller.saveNewUser)


module.exports = router