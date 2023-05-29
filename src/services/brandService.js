const Brand = require('../models/brandModel')
const cloudinaryUploadImg = require('../utils/cloundinary')
const fs = require("fs");

module.exports = {
    createBrand: (name, file) => {
        return new Promise(async (resolve, reject) => {
            try {
                // hàm đưa và xử lí ảnh trên cloud
                const uploader = (path) => cloudinaryUploadImg(path, "images")
                const { path } = file[0]
                const newpath = await uploader(path)
                let resutl = await Brand.create({
                    name,
                    images: newpath
                })

                resolve({
                    success: true,
                    msg: "Create brand succed!",
                    data: resutl
                })

            } catch (err) {
                reject(err)
            }

        })
    },
    createArrayBrand: (array) => {
        return new Promise(async (resolve, reject) => {
            try {
                let newBrands = await Brand.insertMany(array)
                resolve({
                    success: true,
                    msg: "Succeed!",
                    data: newBrands
                })
            } catch (error) {
                reject(error)
            }
        })
    },
    editBrand: (data, file) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { id, name } = data
                // hàm đưa và xử lí ảnh trên cloud
                let resutl = []
                if (file[0]?.path) {
                    const uploader = (path) => cloudinaryUploadImg(path, "images")
                    const path = file[0]?.path
                    const newpath = await uploader(path)
                    resutl = await Brand.findByIdAndUpdate(id, {
                        name,
                        images: newpath
                    },
                        {
                            new: true
                        }
                    )
                } else {
                    resutl = await Brand.findByIdAndUpdate(id, {
                        name,
                    },
                        {
                            new: true
                        }
                    )
                }
                resolve({
                    success: true,
                    msg: "Update succeed!",
                    data: resutl
                })
            } catch (error) {
                reject(error)
            }
        })
    },
    deleteBrand: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                await Brand.findByIdAndDelete(id)
                resolve({
                    success: true,
                    msg: "Delete succeed!",
                })
            } catch (error) {
                reject(error)
            }
        })
    },
    getAllBrand: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = await Brand.find({})
                resolve({
                    success: true,
                    msg: "Succeed!",
                    data: resutl
                })
            } catch (error) {
                reject(error)
            }
        })
    },
}