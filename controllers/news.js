const News = require('../models/News')
const User = require('../models/Users')

module.exports.getNews = async (req, res, next)=>{
    try{
        const model = new News()
        const news = await model.getNews();

        if(news.length){
            res.status(200).json(news);
        }

    } catch(err){
        next(err)
    }
}

module.exports.newNews = async (req, res, next)=>{
    try{
        const news = new News(req.body)
        const model = new News()

        await news.save()
        const newNews = await model.getNews();

        res.status(201).json(newNews)

    } catch(err){
        next(err)
    }
}

module.exports.updateNews = async (req, res, next)=>{
    try{
        const model = new News()

        await News.findOneAndUpdate(
            {_id: req.params.id},
            {$set: req.body},
            {new: true}
            )

        const newNews = await model.getNews();
        res.status(200).json(newNews)

    } catch(err){
        next(err)
    }
}

module.exports.deleteNews = async (req, res, next)=>{
    try {
        const model = new News()

        await News.deleteOne({_id: req.params.id})
        const news = await model.getNews();
        res.status(200).json(news)

    } catch(err){
        next(err)
    }
}