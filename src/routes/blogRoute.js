const express = require('express')
const router = express.Router()
const blogControllers = require('../controllers/blogControllers')
const { authMiddleware, isAdmin } = require("../middewares/authMiddleware")
const { uploadPhoto, productImgResize } = require('../middewares/uploadImg')

router.post('/blog', authMiddleware, isAdmin, uploadPhoto.array('image', 1), productImgResize, blogControllers.createBlog)
router.put('/blog', authMiddleware, isAdmin, uploadPhoto.array('image', 1), productImgResize, blogControllers.editBlog)
router.delete('/blog/:id', authMiddleware, isAdmin, blogControllers.deleteBlog)
router.get('/blogs', blogControllers.getAllBlog)
router.get('/blog/:id', blogControllers.getABlog)
router.put('/feeling/:id', authMiddleware, blogControllers.feelingBlog)
router.put('/outstanding/:id', authMiddleware, isAdmin, blogControllers.outstandingBlog)


module.exports = router
