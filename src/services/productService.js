const { default: slugify } = require('slugify')
const Product = require('../models/productModel')
const Size = require('../models/sizeModel')
const Color = require('../models/colorModel')
const aqp = require('api-query-params')
const cloudinaryUploadImg = require('../utils/cloundinary')
const fs = require("fs");

module.exports = {
    createProduct: (data, files) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { title, description, price, quantity, size, color, brand, category, slug } = data
                let newColors, newSizes, newCategory = []
                if (color) {
                    newColors = color.split(',')
                }
                if (size) {
                    newSizes = size.split(',')
                }
                if (category) {
                    newCategory = category.split(',')
                }
                // hàm đưa và xử lí ảnh trên cloud
                const uploader = (path) => cloudinaryUploadImg(path, "images")
                // tạo array chưa URL
                const url = []
                //vòng lặp files ảnh tải lên
                for (const file of files) {
                    // lấy đường link path
                    const { path } = file
                    // đưa ảnh lên clound xử lý trả về 1 đường URL mới là newpath
                    const newpath = await uploader(path)
                    // console.log(path);
                    //push vào array chưa URL
                    url.push(newpath)
                    fs.unlinkSync(path)

                }

                if (title) {
                    slug = slugify(title)
                }
                const result = await Product.create({
                    title,
                    slug,
                    price,
                    quantity,
                    description,
                    color: newColors,
                    size: newSizes,
                    brand,
                    category: newCategory,
                    images: url.map((file) => {
                        return file
                    })
                })
                resolve({
                    success: true,
                    msg: "Create product succeed!",
                    data: result
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getaProduct: (data, id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let product = await Product.findById(id).populate("brand").populate("color").populate("size").populate("category").populate({
                    path: "ratings.postedBy",
                    select: "firstname lastname email" // lấy tên và email của user
                });
                let page = data.page
                let limit = data.limit
                let offset = (page - 1) * limit

                const ratings = product.ratings.slice(offset, offset + limit);
                resolve({
                    success: true,
                    msg: "Succeed!",
                    data: { ...product._doc, ratings }
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getAllProduct: (data) => {
        return new Promise(async (resolve, reject) => {
            try {

                const { filter, limit, population } = aqp(data);
                let query
                let dataObj = { ...data }
                let excludeFields = ["page", "sort", "limit", "fields"]
                excludeFields.forEach((el) => delete dataObj[el])
                console.log("exclude", excludeFields);

                // filtering
                //lấy ra product có price trong điều kiện bên dưới
                let dataStr = JSON.stringify(dataObj)
                console.log("dataStr", dataStr);
                dataStr = dataStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
                query = Product.find(JSON.parse(dataStr)).populate("category").populate("brand").populate("color")


                //sorting
                //sắp xêp các product trong điều kiện sort vd: sort=acs / desc
                if (data.sort) {
                    let sortBy = data.sort.split(",").join(' ')
                    query = query.sort({ price: sortBy })
                } else {
                    query = query.sort("-createdAt")
                }

                //limiting the fields
                //lấy ra product có các trường được gọi vd:fields=title,description,price

                if (data.fields) {
                    let fields = data.fields.split(',').join(' ')
                    query = query.select(fields)
                } else {
                    query = query.select("-__v")
                }

                if (data.category) {
                    query = query.find({ category: data.category })
                }
                if (data.color) {
                    query = query.find({ color: data.color })
                }

                if (data.size) {
                    query = query.find({ size: data.size })
                }

                //pagination 
                //phân trang

                let page = data.page
                let ofset = (page - 1) * limit
                delete filter.page
                query = query.skip(ofset).limit(limit)
                if (data.page) {
                    let productCoutnt = await Product.countDocuments()
                    if (ofset >= productCoutnt) throw new Error("This Page does not exsits!")
                }
                let resutl = await query
                resolve({
                    success: true,
                    msg: "Succeed!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    deleteProduct: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = await Product.findByIdAndDelete(id)
                resolve({
                    success: true,
                    msg: "Delete succeed!"
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    editProduct: (id, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                if (data.title) {
                    data.slug = slugify(data.title)
                }
                let resutl = await Product.findByIdAndUpdate(id, data, { new: true })

                resolve({
                    success: true,
                    msg: "Edit succeed!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getAllProductByBrand: (id) => {
        return new Promise(async (resolve, reject) => {
            try {

                let resutl = await Product.find({ brand: id })
                resolve({
                    success: true,
                    msg: "succeed!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getAllProductByCategory: (id) => {
        return new Promise(async (resolve, reject) => {
            try {

                let resutl = await Product.find({ category: id }).populate("brand")
                resolve({
                    success: true,
                    msg: "succeeddd!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    uploadImages: (id, files) => {
        return new Promise(async (resolve, reject) => {
            try {
                // console.log(files);
                // hàm đưa và xử lí ảnh trên cloud
                const uploader = (path) => cloudinaryUploadImg(path, "images")
                // tạo array chưa URL
                const url = []
                //vòng lặp files ảnh tải lên
                for (const file of files) {
                    // lấy đường link path
                    const { path } = file
                    // đưa ảnh lên clound xử lý trả về 1 đường URL mới là newpath
                    const newpath = await uploader(path)
                    // console.log(path);
                    //push vào array chưa URL
                    url.push(newpath)
                    fs.unlinkSync(path)
                }
                // tìm và update từng đường URL ảnh vào trong trường images của product
                const result = await Product.findByIdAndUpdate(
                    id,
                    {
                        images: url.map((file) => {
                            return file
                        })
                    },
                    {
                        new: true
                    })
                resolve({
                    success: true,
                    msg: "succeed!",
                    data: result
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    rating: (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { star, productId, comment } = data
                const product = await Product.findById(productId)
                let alreadyRated = product.ratings.find((rating) => rating.postedBy.toString() === userId.toString())
                // console.log(data);
                // console.log(alreadyRated);
                // return
                if (alreadyRated) {
                    const updateRating = await Product.updateOne(
                        {
                            ratings: { $elemMatch: alreadyRated }
                        },
                        {
                            $set: { "ratings.$.star": star, "ratings.$.comment": comment }
                        },
                        {
                            new: true
                        }
                    )
                } else {
                    const rateProduct = await Product.findByIdAndUpdate(productId,
                        {
                            $push: {
                                ratings: {
                                    star: star,
                                    comment,
                                    postedBy: userId
                                }
                            }
                        },
                        {
                            new: true
                        }
                    )
                    // resolve({
                    //     success: true,
                    //     data: rateProduct
                    // })
                }
                const getallratings = await Product.findById(productId)
                let totalRating = getallratings.ratings.length
                let ratingsum = getallratings.ratings.map((item) => item.star).reduce((prev, current) => prev + current, 0)
                let actualRating = Math.round(ratingsum / totalRating)
                let result = await Product.findByIdAndUpdate(
                    productId,
                    {
                        totalrating: actualRating
                    },
                    { new: true }
                )
                resolve({
                    success: true,
                    data: result
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    createSize: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Size.create(data)
                resolve({
                    success: true,
                    data: result
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getSize: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Size.find({})
                resolve({
                    success: true,
                    data: result
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    createColor: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Color.create(data)
                resolve({
                    success: true,
                    data: result
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getColor: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Color.find({})
                resolve({
                    success: true,
                    data: result
                })
            } catch (err) {
                reject(err)
            }

        })
    },
}