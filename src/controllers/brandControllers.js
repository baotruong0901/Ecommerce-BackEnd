const asyncHandler = require('express-async-handler')
const brandService = require('../services/brandService')
const validateMongoDbId = require('../utils/validateMongodbId')
module.exports = {
    createBrand: asyncHandler(async (req, res) => {
        try {
            const newBrand = await brandService.createBrand(req.body.name, req.files)
            res.json(newBrand)
        } catch (err) {
            throw new Error(err)
        }
    }),
    createArrayBrand: asyncHandler(async (req, res) => {
        try {
            const newBrands = await brandService.createArrayBrand(req.body.brand)
            res.json(newBrands)
        } catch (err) {
            throw new Error(err)
        }
    }),
    editBrand: asyncHandler(async (req, res) => {
        try {
            const resutl = await brandService.editBrand(req.body, req.files)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    deleteBrand: asyncHandler(async (req, res) => {
        try {
            let { id } = req.params
            const resutl = await brandService.deleteBrand(id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    getAllBrand: asyncHandler(async (req, res) => {
        try {
            const resutl = await brandService.getAllBrand()
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
}