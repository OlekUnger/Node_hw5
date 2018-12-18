const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const Schema = mongoose.Schema

const userSchema = new Schema({
    username: {type: String, require: true, unique: true},
    password: {type: String, require: true},
    firstName: {type: String, default: ''},
    middleName: {type: String, default: ''},
    surName: {type: String, default: '',},
    image: {type: String, default: ''},
    access_token: {type: String, default: ''},
    permissionId: {type: String, default: ''},
    permission: {
        chat: {
            C: {type: Boolean, default: true},
            R: {type: Boolean, default: true},
            U: {type: Boolean, default: true},
            D: {type: Boolean, default: true}
        },
        news: {
            C: {type: Boolean, default: true},
            R: {type: Boolean, default: true},
            U: {type: Boolean, default: true},
            D: {type: Boolean, default: true}
        },
        setting: {
            C: {type: Boolean, default: true},
            R: {type: Boolean, default: true},
            U: {type: Boolean, default: true},
            D: {type: Boolean, default: true}
        },
    }
},
    {
    toObject: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    },

    toJSON: {
        transform: function (doc, ret) {
            ret.id = ret._id;
            delete ret._id;
            delete ret.__v;
        }
    }
})

userSchema.methods.setPassword = function(password) {
    let salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(password, salt)
}

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.setToken = function(token) {
    this.access_token = token
}

module.exports = mongoose.model('users', userSchema)


