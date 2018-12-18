const express = require('express');
const router = express.Router();
const path = require('path');

router.get('*', async (req, res, next) =>{
    res.sendFile(path.join(process.cwd(), 'public/index.html'));
});

module.exports = router;