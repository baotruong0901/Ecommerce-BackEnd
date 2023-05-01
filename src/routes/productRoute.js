const express = require('express')
const router = express.Router()
const productControllers = require('../controllers/productControllers')
const { authMiddleware, isAdmin } = require("../middewares/authMiddleware")
const { uploadPhoto, productImgResize } = require('../middewares/uploadImg')
router.post('/product', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, productControllers.createProduct)
router.put('/product/rating', authMiddleware, productControllers.rating)
router.put('/product/upload/:id', authMiddleware, isAdmin, uploadPhoto.array('images', 10), productImgResize, productControllers.uploadImages)
router.get('/product/:id', productControllers.getaProduct)

router.put('/product/:id', authMiddleware, isAdmin, productControllers.editProduct)
router.delete('/product/:id', authMiddleware, isAdmin, productControllers.deleteProduct)
router.get('/products-by-brand', productControllers.getAllProductByBrand)
router.get('/products-by-category/:id', productControllers.getAllProductByCategory)
router.get('/products', productControllers.getAllProduct)

router.post('/product/size', authMiddleware, isAdmin, productControllers.createSize)
router.get('/sizes', productControllers.getSize)

router.post('/product/color', authMiddleware, isAdmin, productControllers.createColor)
router.get('/colors', productControllers.getColor)


module.exports = router
