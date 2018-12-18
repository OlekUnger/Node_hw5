const path = require('path')

module.exports = (req, res, next)=>{
    if (Object.keys(req.files).length == 0) {
        res.status(400).json('No files were uploaded.');
    }
    let file = req.files[req.params.id];
    let uploadDir = path.join(process.cwd(), './public/upload', file.name);

    file.mv(uploadDir, function(err) {
        if (err){
            next(err)
        } else {
            next()
        }
    });

}









