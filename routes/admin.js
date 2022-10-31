const express = require("express");
const router = express.Router();

const productController = require('../controllers/adminControl')


router.get('/add-product', productController.addProductPage)

router.get('/edit_product/:productId', productController.getEditPage)

router.post('/product', productController.addProduct)

router.post('/Edit-product', productController.editProduct)

router.post('/delete-product', productController.deleteProduct)

router.get('/products', productController.productsListAdmin)

module.exports = router;

// module.exports = products;

// module.exports = {
//     routers : router,
//     prods : products
// }
