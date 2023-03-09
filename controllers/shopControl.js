const crypto = require('crypto')
const Product = require('../models/product')
const User = require('../models/user')
const Order = require('../models/order')
const bcrypt = require('bcryptjs')
const nodeMailer = require('nodemailer')
const { validationResult } = require('express-validator');
const { now } = require('mongoose')

// create reusable transporter object using the default SMTP transport
let transporter = nodeMailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ahmedbassiouni.262002@gmail.com',
        pass: 'vobhyaxlizkflexb'
    }
});


exports.getMainPage = (req,res,next) => {
    Product.find()
    .then((products) => {
        res.render('shop/index', 
        {all_products: products ,
            page_title: 'Shop',
            path:req.originalUrl,
        })
        console.log(res)
    })
    .catch((err) => {
        console.log(err)
    })
}
exports.getProductsPage = (req,res,next) => {
    console.log(req.session.loginIn)
    Product.find()
    .then((products) => {
        res.render('shop/productsList', 
        {all_products: products , 
        page_title: 'productsList', 
        path:req.originalUrl,
    })
    })
    .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}
exports.getProductDetiel = (req,res,next) => {
    
    const productId = req.params.productId
    Product.findById(productId)
    .then((product) => {
        res.render('shop/product_detial', 
        {product: product , 
        page_title: 'product', 
        path:req.originalUrl,
    })
    }).catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}
exports.addToCart = (req, res, next) => {
    req.user.addToCart(req.body.id)
    .then(() => {
        res.redirect('/cart')
    }).catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}

exports.cart = (req,res,next) => {
    req.user
    .populate('cart.items.productId')
    .then((user) => {
        all_products = user.cart.items
        let totalPrice = 0
        console.log(all_products)
        all_products.forEach(element => {
            totalPrice += element.quantity * element.productId.price
        });
        return {products: all_products, totalPrice:totalPrice.toFixed(2)}
    })
    .then((cart) => {
        res.render('shop/cart', {all_products: cart.products , totalPrice:cart.totalPrice , page_title: 'cart', path:req.originalUrl})
    })
    .catch((err) => {
        console.log(err)
        // const error = new Error(err)
        // error.httpStatusCode = 500
        // next(error)
    })
}

exports.deleteFromCart = (req ,res , next) => {
    req.user.deleteFromCart(req.body.id)
    .then(() => {
        res.redirect('/cart')  
    })
    .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}

exports.orders = (req,res,next) => {
    Order.find({'userId' : req.user._id})
    .then((orders) => {
        res.render('shop/orders', {page_title: 'orders',orders:orders ,path:req.originalUrl})
    })
    .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}
exports.checkout = (req,res,next) => {
    req.user
    .populate('cart.items.productId')
    .then((user) => {
        all_products = user.cart.items
        products = all_products.map((item) => {
            return {product: {...item.productId}, quantity: item.quantity}
        })
        const order = new Order({products: products , userId: req.user._id})
        return order.save()
    }).then(() => {
        req.user.cart = {items:[]}
        return req.user.save()
    }).then(() => {
        res.redirect('/orders')
    })
    .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}


exports.signUpPage = (req, res, next) => {
    let errorMessage = req.flash('errorEmailExist')
    let oldInput = req.flash('oldInput')
    if(errorMessage.length === 0){
        errorMessage = null
    }
    if(oldInput.length === 0){
        oldInput = {
            email: '',
            userName: ''
        }
    }else{
        oldInput = oldInput[0]
    }
    console.log(oldInput)
    res.render('shop/signup',
     {page_title: 'sign up Page',
        path:req.originalUrl,
        errorMessage: errorMessage,
        oldInput: oldInput
    })
}

exports.signUp = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.log(errors.array()[0])
        req.flash('errorEmailExist', errors.array()[0].msg)
        req.flash('oldInput', {email:req.body.email, userName:req.body.userName})
        return res.status(400).redirect('/signUpPage');
    }
    bcrypt.hash(req.body.password, 12)
    .then((hashedPassword) => {
        const user = new User({
            name: req.body.userName,
            email:req.body.email,
            password:hashedPassword,
            cart: {items: []}
        })
        return user.save()
    }).then((result) => {
        res.redirect('/loginPage')
    })
    .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}

exports.loginpage = (req, res, next) => {
    let errorMessage = req.flash('error')
    if(errorMessage.length === 0){
        errorMessage = null
    }
    console.log(errorMessage)
    console.log("Ahmed")
    res.render('shop/login',
     {page_title: 'Login Page',
      path:req.originalUrl,
      errorMessage: errorMessage
    })
}

exports.login = (req, res, next) => {
    // res.setHeader('Set-Cookie', 'LoginIn=true')
    User.findOne({email: req.body.email})
    .then((user) => {
        if(!user){
            req.flash('error', 'email is not valid')
            return res.redirect('/loginPage')
        }
        bcrypt.compare(req.body.password, user.password)
        .then((isTrue) => {
            if(!isTrue){
                req.flash('error', 'password is not valid')
                return res.redirect('/loginPage')
            }
            req.session.user = user
            req.session.loginIn = true
            req.session.save((err) => {
                console.log(err)
                res.redirect('/')
            })
        })
        .catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            next(error)
        })
    }).catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}

exports.logout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err)
        res.redirect('/')
    })
}

exports.resetPasswordPage = (req, res, next) => {
    let errorMessage = req.flash('error')
    if(errorMessage.length === 0){
        errorMessage = null
    }
    res.render('shop/resetPassword',
     {page_title: 'Login Page',
      path:req.originalUrl,
      errorMessage: errorMessage
    })
}

exports.resetPassword = (req, res, next) => {
    crypto.randomBytes(32, (err, buf) => {
        if(err){
            console.log(err)
            return res.redirect('/resetPassword')
        }
        const token = buf.toString('hex')
        User.findOne({email: req.body.email})
        .then((user) => 
        {
            if(!user){
                req.flash('error', 'email is not exist')
                return res.redirect('/resetPassword')
            }
            user.resetToken = token
            user.resetTokenExpiration = Date.now() + 3600000
            user.save().then(()=>
            {
                // setup email data with unicode symbols
                let mailOptions = 
                {
                    from: 'ahmedbassiouni.262002@gmail.com', // sender address
                    to: req.body.email, // list of receivers
                    subject: 'reset password', // Subject line
                    text: 'Hello world?', // plain text body
                    html: `
                        <p> <a href="http://localhost:8080/reset/${token}"> click here </a> </p>
                    ` // html body
                };

                // send mail with defined transport object
                res.render('checkMail',
                {page_title: 'check mail',
                path:req.originalUrl,
                })
                transporter.sendMail(mailOptions, (error, info) => 
                {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message %s sent: %s', info.messageId, info.response);
                 });
            })
        }
        ).catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            next(error)
        })
    })
    
}

exports.getNewPass = (req, res, next) => {
    User.findOne({resetToken: req.params.token, resetTokenExpiration:{$gt:Date.now()}})
    .then((user) => {
        if(!user){
            req.flash('error', 'token is not valid')
            return res.redirect('/resetPassword')
        }
        let errorMessage = req.flash('error')
        if(errorMessage.length === 0){
            errorMessage = null
        }
        res.render('shop/new-password',
        {page_title: 'new passowrd Page',
        path:req.originalUrl,
        errorMessage: errorMessage,
        userId: user._id
        })
    }).catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}

exports.setNewPass = (req, res, next) => {
    User.findOne({_id : req.body.userId})
    .then((user)=>{
        bcrypt.hash(req.body.password, 12)
        .then((hashedPassword) => {
            user.password = hashedPassword
            user.resetToken = ""
            return user.save()
        })
        .then((result)=>{
            res.redirect('/loginPage')
        })
    }).catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}