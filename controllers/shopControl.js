const Product = require('../models/product')
const Cart = require('../models/cart') 
const Order = require('../models/order')
exports.getMainPage = (req,res,next) => {
    Product.fetchAll()
    .then(([rows,tableData]) => {
        res.render('shop/index', 
        {all_products: rows ,
            page_title: 'Shop',
            path:req.originalUrl
        })
    })
    .catch((err) => {
        console.log(err)
    })
    // res.sendFile(path.join(routeDir,'views', 'shop.html'))
    // res.render('shop', {all_products: products , page_title: 'Shop', path:req.originalUrl})
}
exports.getProductsPage = (req,res,next) => {
    Product.fetchAll()
    .then(([rows,tableData]) => {
        res.render('shop/productsList', 
        {all_products: rows , 
        page_title: 'productsList', 
        path:req.originalUrl})
    })
    .catch((err) => {
        console.log(err)
    })
    // res.sendFile(path.join(routeDir,'views', 'shop.html'))
    // res.render('shop', {all_products: products , page_title: 'Shop', path:req.originalUrl})
}
exports.getProductDetiel = (req,res,next) => {
    const productId = req.params.productId
    Product.getById(productId)
    .then(([product]) => {
        console.log(product[0])
        res.render('shop/product_detial', 
        {product: product[0] , 
        page_title: 'product', 
        path:req.originalUrl})
    }).catch((err) => {
        console.log(err)
    })
    
    // res.sendFile(path.join(routeDir,'views', 'shop.html'))
    // res.render('shop', {all_products: products , page_title: 'Shop', path:req.originalUrl})

}
exports.addToCart = (req, res, next) => {
    Product.getById(req.body.id)
    .then(([product]) => {
        return Cart.addToCart(req.user.id ,product[0].id , product[0].price)
    })
    .then(() => {
        res.redirect('/cart')
    }).catch((err) => {
        console.log(err)
    })
}

exports.cart = (req,res,next) => {
    Cart.getcart(req.user.id)
    .then((cart) => {
        res.render('shop/cart', {all_products: cart.products , totalPrice:cart.totalPrice , page_title: 'cart', path:req.originalUrl})
    })
    // Cart.getcart((cart) => {
    //     Product.fetchAll((products) => {
    //         let cartProducts = []
    //         cart.products.forEach(element => {
    //             products.forEach((prod) => {
    //                 if(element.id === prod.id){
    //                     cartProducts.push({...prod , qnt:element.qnt})
    //                 }
    //             })
    //         });
    //         res.render('shop/cart', {all_products: cartProducts , totalPrice:cart.totalPrice , page_title: 'cart', path:req.originalUrl})
    //     })
    // })
    // res.sendFile(path.join(routeDir,'views', 'shop.html'))
    // res.render('shop', {all_products: products , page_title: 'Shop', path:req.originalUrl})
}

exports.deleteFromCart = (req ,res , next) => {
    Product.getById(req.body.id)
    .then(([product]) => {
            return Cart.deleteFromCart(req.user.id,product[0].id , product[0].price)  
    }).then(() => {
        res.redirect('/cart')  
    })
}

exports.orders = (req,res,next) => {
    Order.getOrders(req.user.id)
    .then((orders) => {
        res.render('shop/orders', {page_title: 'orders',orders:orders ,path:req.originalUrl})
    })
    // res.sendFile(path.join(routeDir,'views', 'shop.html'))
    // res.render('shop', {all_products: products , page_title: 'Shop', path:req.originalUrl})
}
exports.checkout = (req,res,next) => {
    Order.addOrder(req.user.id)
    .then(() => {
        res.redirect('/orders')
    })
    // res.render('shop/checkout', {page_title: 'checkout', path:req.originalUrl})
    // res.sendFile(path.join(routeDir,'views', 'shop.html'))
    // res.render('shop', {all_products: products , page_title: 'Shop', path:req.originalUrl})
}