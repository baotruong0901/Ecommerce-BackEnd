const express = require('express')
const router = express.Router()
const categoryControllers = require('../controllers/categoryControllers')
const { authMiddleware, isAdmin } = require("../middewares/authMiddleware")
const { uploadPhoto, productImgResize } = require('../middewares/uploadImg')

router.post('/category', authMiddleware, isAdmin, uploadPhoto.array('image', 1), productImgResize, categoryControllers.createCategory)
// router.post('/brands', authMiddleware, isAdmin, categoryControllers.createArrayBrand)
router.get('/categorys', categoryControllers.getAllCategory)
router.put('/category', authMiddleware, isAdmin, uploadPhoto.array('image', 1), productImgResize, categoryControllers.editCategory)
router.delete('/category/:id', authMiddleware, isAdmin, categoryControllers.deleteCategory)

module.exports = router
