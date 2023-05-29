const Category = require('../models/category')
const cloudinaryUploadImg = require('../utils/cloundinary')
const fs = require("fs");

module.exports = {

    createCategory: (name, file) => {
        return new Promise(async (resolve, reject) => {
            try {
                // hàm đưa và xử lí ảnh trên cloud
                const uploader = (path) => cloudinaryUploadImg(path, "images")
                const { path } = file[0]
                const newpath = await uploader(path)
                let resutl = await Category.create({
                    name,
                    image: newpath
                })
                resolve({
                    success: true,
                    msg: "Create category succed!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getAllCategory: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = await Category.find({})
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
    deleteCategory: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                await Category.findByIdAndDelete(id)
                resolve({
                    success: true,
                    msg: "Delete succeed!",
                })
            } catch (error) {
                reject(error)
            }
        })
    },
    editCategory: (data, file) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { id, name } = data
                // hàm đưa và xử lí ảnh trên cloud
                let resutl = []
                if (file[0]?.path) {
                    const uploader = (path) => cloudinaryUploadImg(path, "images")
                    const path = file[0]?.path
                    const newpath = await uploader(path)
                    resutl = await Category.findByIdAndUpdate(id, {
                        name,
                        image: newpath
                    },
                        {
                            new: true
                        }
                    )
                } else {
                    resutl = await Category.findByIdAndUpdate(id, {
                        name
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
}