const asyncHandler = require('express-async-handler')
const productService = require('../services/productService')
const validateMongodbId = require('../utils/validateMongodbId')
module.exports = {
    createProduct: asyncHandler(async (req, res) => {
        try {
            const newProduct = await productService.createProduct(req.body, req.files)
            res.json(newProduct)
        } catch (err) {
            throw new Error(err)
        }
    }),
    getaProduct: asyncHandler(async (req, res) => {
        try {
            let { id } = req.params
            validateMongodbId(id)
            const resutl = await productService.getaProduct(req.query, id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    getAllProduct: asyncHandler(async (req, res) => {
        try {
            const resutl = await productService.getAllProduct(req.query)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    addcoupon: asyncHandler(async (req, res) => {
        try {
            const resutl = await productService.addcoupon(req.params.id, req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    deleteProduct: asyncHandler(async (req, res) => {
        try {
            let { id } = req.params
            const resutl = await productService.deleteProduct(id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    editProduct: asyncHandler(async (req, res) => {
        try {
            let { id } = req.params
            const resutl = await productService.editProduct(id, req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    getAllProductByBrand: asyncHandler(async (req, res) => {
        try {
            const resutl = await productService.getAllProductByBrand(req.body.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    getAllProductByCategory: asyncHandler(async (req, res) => {
        try {
            // console.log(req.params.id);
            // return
            const resutl = await productService.getAllProductByCategory(req.params.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    uploadImages: asyncHandler(async (req, res) => {
        try {
            const resutl = await productService.uploadImages(req.params.id, req.files)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    rating: asyncHandler(async (req, res) => {
        try {
            let { _id } = req.user
            const resutl = await productService.rating(_id, req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    createSize: asyncHandler(async (req, res) => {
        try {
            const resutl = await productService.createSize(req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    getSize: asyncHandler(async (req, res) => {
        try {
            const resutl = await productService.getSize()
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),

    createColor: asyncHandler(async (req, res) => {
        try {
            const resutl = await productService.createColor(req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    getColor: asyncHandler(async (req, res) => {
        try {
            const resutl = await productService.getColor()
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
}


