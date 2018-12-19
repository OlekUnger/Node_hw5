const bcrypt = require('bcryptjs')
const passport = require('passport')
const uuidv4 = require('uuid/v4')
const User = require('../models/Users')

module.exports.saveNewUser = async (req, res, next) => {
    const candidate = await User.findOne({username: req.body.username})

    if (candidate) {
        res.status(409).json({error: 'Имя занято'})
    } else {

        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            username: req.body.username,
            password: bcrypt.hashSync(password, salt),
            surName: req.body.surName,
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            img: req.body.image,
            permissionId: uuidv4(),
            access_token: uuidv4()

        })
        try {
            await user.save();
            req.logIn(user, err => {
                if (err) next(err)
                res.status(200).json(user)
            })

        } catch (err) {
            next(err);
        }
    }
}

module.exports.login = function (req, res, next) {
    passport.authenticate('local', async function (err, user) {
        try {
            if (!user) {
                res.json({error: 'Пользователь не найден'})
            } else {
                if (req.body.remembered) {
                    const token = uuidv4()
                    user.setToken(token)
                    await user.save()
                    res.cookie('token', token, {
                        path: '/',
                        httpOnly: true,
                        maxAge: 7 * 60 * 60 * 1000
                    })
                }

                req.logIn(user, (err) => {
                    if (err) {
                        next(err)
                    }
                    res.json(user)

                })
            }
        } catch (err) {
            next(err)
        }
    })(req, res, next)

}

module.exports.authFromToken = async (req, res, next) => {

    const token = req.cookies.token;
    if(token) {
        try {
            const user = await User.findOne({access_token: token})
            console.log(user)
            if(user){
                req.logIn(user, (err)=>{
                    if(err){
                        next(err)
                    }
                    res.status(200).json(user)
                })
            }
            next();
        } catch(err){
            next(err)
        }
    } else {
        next()
    }
}




