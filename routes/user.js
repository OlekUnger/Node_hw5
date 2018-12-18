const express = require('express')
const router = express.Router()
const controller = require('../controllers/user')

router.get('/getUsers', controller.getUsers)
router.put('/updateUserPermission/:id', controller.updateUserPermission)
router.put('/updateUser/:id', controller.updateUser)
router.post('/saveUserImage/:id', controller.saveUserImage)
router.delete('/deleteUser/:id', controller.deleteUser)


module.exports = router