const Product = require('../models/product') 
exports.addProductPage = (req,res,next) => {
    res.render('admin/edit_product', {page_title: 'add products', path:req.originalUrl , edit:false})
}

exports.addProduct = (req,res,next) => {
    const product = new Product(req.body.title , req.body.image , req.body.price , req.body.description, req.user._id)
    product.save()
    .then(() => {
        res.redirect('/admin/products')
    }).catch((err) => {
        console.log(err)
    })
}

exports.getEditPage = (req, res, next) => {
    const editMode = req.query.edit
    if(!editMode){
        return res.redirect('/')
    }
    Product.getById(req.params.productId)
    .then((product) => {
        if(!product){
            return res.redirect('/')
        }
        res.render('admin/edit_product', {
            product:product ,
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
        res.redirect('/admin/products')
    }).catch((err) => {
        console.log(err)
    })

    // .then(() => {
    //     return Cart.editTotalPrice(req.user.id)
    // })
}

exports.deleteProduct = (req, res, next) => {
   Product.deleteById(req.body.id)
   .then(() => {
        res.redirect('/admin/products')
   }).catch((err) => {
        console.log(err)
   })
    //    .then(() => {
    //     return Cart.editTotalPrice(req.user.id)
    //     })
}

exports.productsListAdmin = (req,res,next) => {
    Product.fetchAll()
    .then((products) => {
        res.render('admin/productsListAdmin', 
        {all_products: products , 
        page_title: 'admin Products', 
        path:req.originalUrl})
    })
    .catch((err) => {
        console.log(err)
    })
}