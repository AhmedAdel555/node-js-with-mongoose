const express = require("express");
const router = express.Router();
const multer  = require('multer')

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'images')
        },
        filename: function (req, file, cb) {
            const uniquePuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, uniquePuffix + '-' + file.originalname)
        }
        }),
    fileFilter: function (req, file, cb) {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
            cb(null, true);
        } else {
            cb(null, false);
        }
    },
})

const productController = require('../controllers/adminControl')

const auth = (req, res, next) => {
    console.log("A7aaaaaaaa1")
    if(!req.session.loginIn){
        return res.redirect('/')
    }
    console.log("A7aaaaaaaa2")
    next()
}

router.get('/add-product', auth, upload.single('image') ,productController.addProductPage)

router.get('/edit_product/:productId', auth, productController.getEditPage)

router.post('/product', auth, productController.addProduct)

router.post('/Edit-product', auth, productController.editProduct)

router.post('/delete-product', auth, productController.deleteProduct)

router.get('/products', auth, productController.productsListAdmin)

module.exports = router;
