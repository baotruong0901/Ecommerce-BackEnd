const cloudinary = require('cloudinary');


// Configuration 
cloudinary.config({
    cloud_name: "di4ljnck0",
    api_key: "565785546322663",
    api_secret: "oLsM30jevijiLTnwnHdVUdXxZXo"
});
//tải ảnh lên cloud xử lý và resolve url
const cloudinaryUploadImg = async (fileToUploads) => {
    return new Promise((resolve) => {
        cloudinary.uploader.upload(fileToUploads, (result) => {
            resolve(
                {
                    url: result.secure_url
                },
                {
                    resoure_type: "auto"
                }
            )
        })
    })
}

module.exports = cloudinaryUploadImg
