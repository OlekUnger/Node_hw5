const express = require('express')
const router = express.Router()
const controller = require('../controllers/auth')


router.post('/login', controller.login)
router.post('/saveNewUser', controller.saveNewUser)
router.post('/authFromToken', controller.authFromToken)

module.exports = router