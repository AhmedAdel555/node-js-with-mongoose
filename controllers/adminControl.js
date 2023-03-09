const Product = require('../models/product')
const fs = require('fs')
let deleteFile = function(filePath){
    fs.unlink(filePath, (err) => {
        if(err){
            throw err
        }
    })
}
exports.addProductPage = (req,res,next) => {
    res.render('admin/edit_product',
     {page_title: 'add products',
      path:req.originalUrl ,
       edit:false})
}

exports.addProduct = (req,res,next) => {
    console.log("A7aaaaaaaaaaaaaaaaaaaaaaa")
    let image = req.file
    if(!image){
        throw new Error('dummy')
    }
    const product = new Product({title:req.body.title , image:req.file.path , price:req.body.price , description:req.body.description, userId:req.user._id})
    console.log(req.file)
    product.save()
    .then(() => {
        res.redirect('/admin/products')
    }).catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}

exports.getEditPage = (req, res, next) => {
    const editMode = req.query.edit
    if(!editMode){
        return res.redirect('/')
    }
    Product.findById(req.params.productId)
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
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}
exports.editProduct = (req, res, next) => {
    let image = req.file
    if(!image){
        throw new Error('dummy')
    }
    Product.findByIdAndUpdate(req.body.id, {title:req.body.title , image:req.file.path , price:req.body.price , description:req.body.description , userId:req.user._id})
    .then(() => {
        res.redirect('/admin/products')
    }).catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}

exports.deleteProduct = (req, res, next) => {
   Product.findById(req.body.id)
   .then((product) => {
        Product.findByIdAndRemove(req.body.id)
        .then(() => {
            res.redirect('/admin/products')
        }).catch((err) => {
            const error = new Error(err)
            error.httpStatusCode = 500
            next(error)
        })
        deleteFile(product.image)
   })
   .catch((err) => {
    const error = new Error(err)
    error.httpStatusCode = 500
    next(error)
})
}

exports.productsListAdmin = (req,res,next) => {
    Product.find()
    .then((products) => {
        res.render('admin/productsListAdmin', 
        {all_products: products , 
        page_title: 'admin Products', 
        path:req.originalUrl,
    })
    })
    .catch((err) => {
        const error = new Error(err)
        error.httpStatusCode = 500
        next(error)
    })
}