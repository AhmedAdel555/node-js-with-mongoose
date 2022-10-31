const express = require("express");
const router = express.Router();

const productController = require('../controllers/shopControl')
// const path = require('path')
// const routeDir = path.dirname(require.main.filename);

router.get('/', productController.getMainPage)
router.get('/products', productController.getProductsPage)

router.get('/products/:productId', productController.getProductDetiel)

router.post('/add-to-cart', productController.addToCart)

router.post('/delete-product-cart' , productController.deleteFromCart)

router.get('/cart', productController.cart)

router.get('/orders', productController.orders)

router.post('/check-out', productController.checkout)

module.exports = router