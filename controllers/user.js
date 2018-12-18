const User = require('../models/Users')
const path = require('path')
const fs = require('fs')
const moment = require('moment')

module.exports.getUsers = async (req, res, next)=>{
    try{
        const users = await User.find({})
        if(users.length){
            res.status(200).json(users);
        }

    } catch(err){
        next(err)
    }
}

module.exports.updateUser = async (req, res, next)=>{
    try {
        const user = await User.findById(req.params.id)

        if (req.body.oldPassword && req.body.password) {
            if (user.validPassword(req.body.oldPassword)) {
                user.setPassword(req.body.password)
            } else {
                res.status(400).json({error:'Неверный пароль!'})
            }
        }

        Array.from(Object.keys(req.body))
            .filter(key=>{return (key !== 'id' && key !== 'oldPassword' && key !== 'password' && key !== 'image')})
            .map(key=> user[key] = req.body[key])

        await user.save()
        res.json(user)

    } catch(err){
        next(err)
    }
}

module.exports.updateUserPermission = async (req, res, next)=>{
    try{
        const user = await User.findOne({permissionId: req.params.id})

        user.permission = {
            chat: {... user.permission.chat, ...req.body.permission.chat},
            news: {... user.permission.news, ...req.body.permission.news},
            setting: {... user.permission.setting, ...req.body.permission.setting},
        };

        await user.save()

        const users = await User.find({})
        res.status(200).json(users)

    } catch(err){
        next(err)
    }
}

module.exports.deleteUser = async function(req, res, next) {
    try {
        await User.deleteOne({_id: req.params.id})

    } catch(err){
        next(err)
    }
}

module.exports.saveUserImage = async (req, res, next)=>{
    try {

        if (Object.keys(req.files).length == 0) {
            res.status(400).json('No files were uploaded.');
        }
        let file = req.files[req.params.id];
        let uploadDir = './public/assets/img';

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir);
        }
        let user = await User.findById(req.params.id)
        let extName = path.extname(file.name)
        let fileName = `${req.params.id}-${moment().format('DDMMYYY-HHMMss_SSS')}${extName}`

        let dest = path.join(process.cwd(), uploadDir, fileName);

        file.mv(dest, async function(err) {
            if (err){
                res.json({err: 'Ошибка'});

            } else {
                let oldPath = user.image.substr(user.image.indexOf(req.params.id));
                if(oldPath){
                    await fs.unlinkSync(path.join(process.cwd(), uploadDir, oldPath));
                }

                user = await User.findOneAndUpdate(
                    {_id: req.params.id},
                    {$set: {image: `../../../assets/img/${fileName}`}},
                    {new: true}
                )
                res.json({path: user.image});
            }
        });


    } catch(err){
        next(err)
    }
}



