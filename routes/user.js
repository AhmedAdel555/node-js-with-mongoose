const express = require("express");
const router = express.Router();
const productController = require('../controllers/shopControl')
const User = require('../models/user')
const { check, body } = require('express-validator');

// const path = require('path')
// const routeDir = path.dirname(require.main.filename);

const auth = (req, res, next) => {
    if(!req.session.loginIn){
        return res.redirect('/')
    }
    next()
}

router.get('/', productController.getMainPage)

router.get('/products', productController.getProductsPage)

router.get('/products/:productId', productController.getProductDetiel)

router.post('/add-to-cart', auth, productController.addToCart)

router.post('/delete-product-cart', auth , productController.deleteFromCart)

router.get('/cart', auth, productController.cart)

router.get('/orders', auth, productController.orders)

router.post('/check-out', auth, productController.checkout)

router.get('/signUpPage', productController.signUpPage)

router.post('/signup',
    [
        check('email', 'invalid email')
        .isEmail()
        .trim()
        .custom((value, {req})=>{
            return User.findOne({email: value}).then((userDoc) => {
                    if(userDoc){
                        return Promise.reject('email already exist')
                    }
                })
        }),
        body('password', 'please write password with rules below')
        .isLength({min: 8}),
        body('confirmedPassword', 'password don\'t match')
        .custom((value, {req})=>{
            if(value !== req.body.password){
                throw new Error()
            }
            return true
        })
    ]
    ,productController.signUp)

router.get('/loginPage', productController.loginpage)

router.post('/login', productController.login)

router.get('/resetPassword', productController.resetPasswordPage)

router.get('/logout', auth, productController.logout)

router.post('/resetPassword', productController.resetPassword)

router.get('/reset/:token', productController.getNewPass)

router.post('/newPassword', productController.setNewPass)

module.exports = router