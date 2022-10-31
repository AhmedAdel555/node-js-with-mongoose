const Product = require('../models/product') 
const Cart = require('../models/cart') 
exports.addProductPage = (req,res,next) => {
    // res.sendFile(path.join(routeDir, 'views', 'add_product.html'))
    res.render('admin/edit_product', {page_title: 'add products', path:req.originalUrl , edit:false})
}

exports.addProduct = (req,res,next) => {
    const product = new Product(req.body.title , req.body.image , req.body.price , req.body.description)
    product.save().then(() => {
        res.redirect('/admin/products')
    }).catch((err) => {
        console.log(err)
    })
    // Product.fetchAll((products) => {
    //     res.render('products' , {all_products: products, page_title: 'products page', path:req.originalUrl})
    // })
    // const products = Product.fetchAll()
    // res.render('products' , {all_products: products, page_title: 'products page', path:req.originalUrl})
    // res.sendFile(path.join(routeDir, 'views', 'products.html'))
}

exports.getEditPage = (req, res, next) => {
    const editMode = req.query.edit
    if(!editMode){
        return res.redirect('/')
    }
    Product.getById(req.params.productId)
    .then(([product]) => {
        res.render('admin/edit_product', {
            product:product[0] ,
            page_title: 'edit products',
            path:req.originalUrl,
            edit:editMode,
        })
    })
    .catch((err) => {
        console.og(err)
    })
}
exports.editProduct = (req, res, next) => {
    const product = new Product(req.body.title , req.body.image , req.body.price , req.body.description)
    Product.editProduct(req.body.id ,product)
    .then(() => {
        return Cart.editTotalPrice(req.user.id)
    })
    .then(() => {
        res.redirect('/admin/products')
    }).catch((err) => {
        console.log(err)
    })
}

exports.deleteProduct = (req, res, next) => {
   Product.deleteProduct(req.body.id)
   .then(() => {
        return Cart.editTotalPrice(req.user.id)
   })
   .then((test) => {
        res.redirect('/admin/products')
   }).catch((err) => {
        console.log(err)
   })
}

exports.productsListAdmin = (req,res,next) => {
    Product.fetchAll()
    .then(([rows,tableData]) => {
        res.render('admin/productsListAdmin', 
        {all_products: rows , 
        page_title: 'admin Products', 
        path:req.originalUrl})
    })
    .catch((err) => {
        console.log(err)
    })
}