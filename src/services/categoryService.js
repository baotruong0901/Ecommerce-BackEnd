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
}