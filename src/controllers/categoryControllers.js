const categoryService = require('../services/categoryService')
const asyncHandler = require('express-async-handler')



module.exports = {
    createCategory: asyncHandler(async (req, res) => {
        try {
            const newCategory = await categoryService.createCategory(req.body.name, req.files)
            res.json(newCategory)
        } catch (err) {
            throw new Error(err)
        }
    }),
    getAllCategory: asyncHandler(async (req, res) => {
        try {
            const resutl = await categoryService.getAllCategory()
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
}