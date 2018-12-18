const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const newsSchema = new Schema({
    userId: {
        ref: "users",
        type: Schema.Types.ObjectId
    },
    text: { type: String, required: true },
    theme: { type: String, required: true },
    date: { type: String, required: true },

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
    });

newsSchema.methods.getNews = function() {
    return  this.model('news').aggregate([{
        $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user"
        },
    },
        { $unwind: {path: "$user"}},
        { $project:
            {
                id: "$_id",
                userId: 1,
                text: 1,
                theme: 1,
                date: 1,
                user: {
                    id: "$_id",
                    access_token: 1,
                    firstName: 1,
                    middleName: 1,
                    surName: 1,
                    password: 1,
                    username: 1,
                    image: 1
                }
            }
        }])

}

module.exports = mongoose.model('news', newsSchema)
