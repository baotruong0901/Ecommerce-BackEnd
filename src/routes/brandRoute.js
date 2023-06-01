const express = require('express')
const router = express.Router()
const brandControllers = require('../controllers/brandControllers')
const { authMiddleware, isAdmin } = require("../middewares/authMiddleware")
const { uploadPhoto, productImgResize } = require('../middewares/uploadImg')

router.post('/brand', authMiddleware, isAdmin, uploadPhoto.array('image', 1), brandControllers.createBrand)
router.post('/brands', authMiddleware, isAdmin, brandControllers.createArrayBrand)
router.get('/brands', brandControllers.getAllBrand)
router.put('/brand', authMiddleware, isAdmin, uploadPhoto.array('image', 1), brandControllers.editBrand)
router.delete('/brand/:id', authMiddleware, isAdmin, brandControllers.deleteBrand)

module.exports = router
