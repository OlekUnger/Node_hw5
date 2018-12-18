const express = require('express')
const router = express.Router()
const controller = require('../controllers/news')

router.get('/getNews', controller.getNews)
router.put('/updateNews/:id', controller.updateNews)
router.delete('/deleteNews/:id', controller.deleteNews)
router.post('/newNews',  controller.newNews)

module.exports = router