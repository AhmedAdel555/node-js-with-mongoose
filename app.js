// for only revision with routes.js for revising the syntax of creating server by only node js 
// const http = require('http')
// const routes = require('./routes')
// const server = http.createServer(routes.handler)

const express = require('express')
const app = express()
const session = require('express-session')
const mongoSessions = require('connect-mongodb-session')(session)
const mongoose = require('mongoose')
const csrf = require('csurf')
const User = require('./models/user')
const port = 3300
const path = require('path')
const flash = require('connect-flash');


app.set('view engine', 'ejs')
app.use(express.urlencoded({extended: true}));
const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')
app.use(express.static(path.join(__dirname, 'public')))
app.use('/images', express.static(path.join(__dirname, 'images')) )

const store = new mongoSessions({
    uri: 'mongodb+srv://ahmedadel:Ahmed3ff72@cluster0.wktfawr.mongodb.net/shop',
    collection: "sessions"
})

app.use(
    session({
        secret: "the secret", 
        resave: false, 
        saveUninitialized: false,
        store: store
    })
)

app.use(csrf())
app.use(flash())
app.use((req, res, next) => {
    if(!req.session.user){
        return next()
    }
    User.findById(req.session.user._id)
    .then((user) => {
        console.log(req)
        req.user = user
        next()
    }).catch((err) => {
        console.log(err)
    })
})

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.loginIn
    res.locals.csrfToken = req.csrfToken()
    next()
})

app.use('/admin',adminRoutes)
app.use(userRoutes)
app.use('/',(req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname ,'views', 'errorPage.html'))
    res.status(404).render('errorPage', {page_title: 'Page not found' , path: req.originalUrl})
})
app.use((error, req, res, next) => {
    res.status(error.httpStatusCode).render('errorServerSide', {page_title: 'error', path:req.originalUrl})
})
mongoose.connect('mongodb+srv://ahmedadel:****************@cluster0.wktfawr.mongodb.net/shop?retryWrites=true&w=majority')
.then((result) => {
    app.listen(port)
}).catch((err) => {
    throw err
})
