const Blog = require('../models/blogModel')
const cloudinaryUploadImg = require('../utils/cloundinary')
const fs = require("fs");
const { default: slugify } = require('slugify')

module.exports = {

    createBlog: (data, file, postBy) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { title, description, slug, topic } = data
                // hàm đưa và xử lí ảnh trên cloud
                const uploader = (path) => cloudinaryUploadImg(path, "images")
                const { path } = file[0]
                const newpath = await uploader(path)
                if (title) {
                    slug = slugify(title)
                }
                let resutl = await Blog.create({
                    image: newpath,
                    title,
                    slug,
                    topic,
                    description,
                    postBy
                })
                resolve({
                    success: true,
                    msg: "Create blog succeed!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    editBlog: (data, file) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { title, description, blogId } = data
                // hàm đưa và xử lí ảnh trên cloud
                const uploader = (path) => cloudinaryUploadImg(path, "images")
                const { path } = file[0]
                const newpath = await uploader(path)
                let resutl = await Blog.findByIdAndUpdate(blogId, {
                    image: newpath,
                    title,
                    description
                }, { new: true }
                )
                resolve({
                    success: true,
                    msg: "Update blog succeed!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    deleteBlog: (blogId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = await Blog.findByIdAndDelete(blogId)
                resolve({
                    success: true,
                    msg: "Delete blog succeed!"
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getAllBlog: () => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = (await Blog.find()).reverse()
                resolve({
                    success: true,
                    msg: "Get all blog succeed!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getABlog: (blogId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = await Blog.findById(blogId).populate('postBy')
                resolve({
                    success: true,
                    msg: "Get blog succeed!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    feelingBlog: (blogId, userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { action } = data
                let resutl = null
                if (action === "like") {
                    resutl = await Blog.findByIdAndUpdate(blogId, {
                        $pull: { dislikes: userId }, //Xoá userId trong dislikes
                        $addToSet: { likes: userId } //Thêm userId vào likes (nếu chưa tồn tại)
                    },
                        { new: true }
                    )
                } else if (action === "dislike") {
                    resutl = await Blog.findByIdAndUpdate(blogId, {
                        $pull: { likes: userId }, //Xoá userId trong likes
                        $addToSet: { dislikes: userId } //Thêm userId vào dislikes (nếu chưa tồn tại)
                    },
                        { new: true }
                    )
                }
                resolve({
                    success: true,
                    msg: "You just liked the blog!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    outstandingBlog: (blogId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = await Blog.findById(blogId);
                if (resutl) {
                    resutl.outstanding = !resutl.outstanding; // Chuyển đổi giá trị của trường outstanding
                    await resutl.save();
                }
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
}