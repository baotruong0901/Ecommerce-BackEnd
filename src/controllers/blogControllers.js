const blogService = require('../services/blogService')
const asyncHandler = require('express-async-handler')



module.exports = {
    createBlog: asyncHandler(async (req, res) => {
        try {
            let { _id } = req.user
            const resutl = await blogService.createBlog(req.body, req.files, _id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    editBlog: asyncHandler(async (req, res) => {
        try {
            const resutl = await blogService.editBlog(req.body, req.files)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    deleteBlog: asyncHandler(async (req, res) => {
        try {
            const resutl = await blogService.deleteBlog(req.params.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    getAllBlog: asyncHandler(async (req, res) => {
        try {
            const resutl = await blogService.getAllBlog()
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    getABlog: asyncHandler(async (req, res) => {
        try {
            const resutl = await blogService.getABlog(req.params.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    feelingBlog: asyncHandler(async (req, res) => {
        try {
            let { _id } = req.user
            const resutl = await blogService.feelingBlog(req.params.id, _id, req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    outstandingBlog: asyncHandler(async (req, res) => {
        try {
            // let { _id } = req.user
            const resutl = await blogService.outstandingBlog(req.params.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),

}