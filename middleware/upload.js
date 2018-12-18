const path = require('path')
const moment= require('moment')
const fs = require('fs')

module.exports = async (req, res, next)=>{
    if (Object.keys(req.files).length == 0) {
        res.status(400).json('No files were uploaded.');
    }
    let file = req.files[req.params.id];
    let uploadDir = './public/assets/img';

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }

    let extName = path.extname(file.name)
    let fileName = `${req.params.id}-${moment().format('DDMMYYY-HHMMss_SSS')}${extName}`

    let dest = path.join(process.cwd(), uploadDir, fileName);

    file.mv(dest, async function(err) {
        if (err){
            next(null, false);

        } else {
            req.app.locals.fileName = fileName;
            next()
        }
    });

}









