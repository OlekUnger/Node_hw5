const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('../models/Users')

module.exports = passport => {

    passport.serializeUser((user, done)=>{
        done(null, user.id)
    })

    passport.deserializeUser((id, done)=>{
        User.findById(id, (err, user)=>{
            done(err, user)
        })
    })

    passport.use('local',
        new LocalStrategy( async(username, password, done)=> {
            try {
                const user = await User.findOne({username: username})

                if(user) {
                    done(null, user)
                } else {
                    done('Польователь не найден', false)
                }
            } catch (err) {
                console.log('Ошибка');
                done(err);
            }
        })
    )

}