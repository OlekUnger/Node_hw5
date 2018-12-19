const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const passport = require('passport')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')

const MongoStore = require('connect-mongo')(session)
const createError = require('http-errors')
const keys = require('./config/keys')

const authRoutes = require('./routes/auth')
const userRoutes = require('./routes/user')
const newsRoutes = require('./routes/news')
const homeRoutes = require('./routes/index')

const app = express()
app.use(fileUpload());

mongoose.connect(keys.mongoURI, {useCreateIndex: true, useNewUrlParser: true})
    .then(() => console.log('db connected'))
    .catch(err => console.log(err))

app.use(express.static(path.join(__dirname, 'public')))

app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(session({
    secret: 'keyboard cat',
    cookie: {
        path: '/',
        httpOnly: true,
        maxAge: 7 * 60 * 60 * 1000
    },
    saveUninitialized: false,
    resave: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
}));

require('./middleware/passport')(passport)
app.use(passport.initialize())
app.use(passport.session());

app.use('/api', userRoutes)
app.use('/api', authRoutes)
app.use('/api', newsRoutes)
app.use('/', homeRoutes)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send('error');
});

module.exports = app