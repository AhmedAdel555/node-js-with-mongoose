const Product = require('../models/product')
const User = require('../models/user')
exports.getMainPage = (req,res,next) => {
    Product.fetchAll()
    .then((products) => {
        res.render('shop/index', 
        {all_products: products ,
            page_title: 'Shop',
            path:req.originalUrl
        })
    })
    .catch((err) => {
        console.log(err)
    })
}
exports.getProductsPage = (req,res,next) => {
    Product.fetchAll()
    .then((products) => {
        res.render('shop/productsList', 
        {all_products: products , 
        page_title: 'productsList', 
        path:req.originalUrl})
    })
    .catch((err) => {
        console.log(err)
    })
}
exports.getProductDetiel = (req,res,next) => {
    const productId = req.params.productId
    Product.getById(productId)
    .then((product) => {
        res.render('shop/product_detial', 
        {product: product , 
        page_title: 'product', 
        path:req.originalUrl})
    }).catch((err) => {
        console.log(err)
    })
}
exports.addToCart = (req, res, next) => {
    User.addToCart(req.body.id, req.user._id)
    .then(() => {
        res.redirect('/cart')
    }).catch((err) => {
        console.log(err)
    })
}

exports.cart = (req,res,next) => {
    User.getCart(req.user._id)
    .then(async (cart) => {
        all_products = []
        totalPrice = 0
        for(let i = 0 ; i < cart.length ; i++){
            let product = await Product.getById(cart[i].productID)
            product.quantity = cart[i].quantity
            totalPrice+= product.price*product.quantity
            all_products.push(product)
        }
        return {products: all_products, totalPrice:totalPrice.toFixed(2)}
    })
    .then((cart) => {
        res.render('shop/cart', {all_products: cart.products , totalPrice:cart.totalPrice , page_title: 'cart', path:req.originalUrl})
    })
}

exports.deleteFromCart = (req ,res , next) => {
    User.deleteFromCart(req.body.id, req.user._id)
    .then(() => {
        res.redirect('/cart')  
    })
}

exports.orders = (req,res,next) => {
    User.getOrders(req.user._id)
    .then((orders) => {
        res.render('shop/orders', {page_title: 'orders',orders:orders ,path:req.originalUrl})
    })
}
exports.checkout = (req,res,next) => {
    User.addOrder(req.user._id)
    .then(() => {
        res.redirect('/orders')
    })
}