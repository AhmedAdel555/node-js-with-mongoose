// for only revision with routes.js for revising the syntax of creating server by only node js 
// const http = require('http')
// const routes = require('./routes')
// const server = http.createServer(routes.handler)

const express = require('express')
const app = express()
const port = 8080
const path = require('path')

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}));

const adminRoutes = require('./routes/admin')
const userRoutes = require('./routes/user')
app.use(express.static(path.join(__dirname, 'public')))
const db = require('./util/database').mongoConnect

app.use('/admin',adminRoutes)
app.use(userRoutes)
app.use('/',(req, res, next) => {
    // res.status(404).sendFile(path.join(__dirname ,'views', 'errorPage.html'))
    res.status(404).render('errorPage', {page_title: 'Page not found' , path: req.originalUrl})
})

db(() => {
    app.listen(8080)
})