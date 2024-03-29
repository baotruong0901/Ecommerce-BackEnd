const User = require('../models/userModel')
const Cart = require('../models/cartModel')
const Product = require('../models/productModel')
const Booking = require('../models/bookingModel')
const Address = require('../models/addressModel')
const jwtToken = require('../config/jwtToken')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const { generateRefreshToken } = require('../config/refreshToken')
const sendEmail = require('../controllers/emailControllers')
const { log } = require('console')


const checkEmail = (email) => {
    return new Promise(async (resolve, reject) => {
        try {
            //fine email
            let check = await User.findOne({ email }).exec();
            if (check) {
                resolve(true)
            } else {
                resolve(false)
            }
        } catch (error) {
            reject(error)
        }
    })
}
module.exports = {
    createUser: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let check = await checkEmail(data.email)
                if (!check) {
                    const newUser = await User.create(data)
                    resolve({
                        success: true,
                        msg: "Create user succed!",
                        data: newUser
                    })
                } else {
                    resolve({
                        msg: "your email already exists. pleaser enter another email!",
                        success: false
                    })
                }
            } catch (err) {
                reject(err)
            }

        })
    },
    login: (data, res) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { email, password } = data
                let check = await checkEmail(email)
                if (check) {
                    let findUser = await User.findOne({ email }).populate('wishlist')
                    if (findUser.isBlocked === true) {
                        resolve({
                            success: false,
                            msg: "Account does not exist!"
                        })
                    } else {
                        if (findUser && await findUser.isPasswordMatched(password)) {
                            let refreshToken = await generateRefreshToken(findUser?._id)
                            let updateUser = await User.findByIdAndUpdate(
                                findUser?._id,
                                {
                                    refreshToken
                                },
                                { new: true }
                            )
                            res.cookie("refreshToken", refreshToken, {
                                httpOnly: true,
                                maxAge: 72 * 60 * 60 * 1000
                            })

                            resolve({
                                success: true,
                                msg: "Login succeed!",
                                data: {
                                    _id: findUser?._id,
                                    firstname: findUser?.firstname,
                                    lastname: findUser?.lastname,
                                    email: findUser?.email,
                                    mobile: findUser?.mobile,
                                    role: findUser?.role,
                                    token: jwtToken.generateToken(findUser?._id),
                                    wishlist: findUser?.wishlist
                                }
                            })
                        } else {
                            resolve({
                                success: false,
                                msg: "Invalid password!"
                            })
                        }
                    }

                } else {
                    resolve({
                        msg: "your email does not exist. pleaser enter another email!",
                        success: false
                    })
                }
            } catch (err) {
                reject(err)
            }

        })
    },
    handlerRefreshToken: (refreshToken) => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = await User.findOne({ refreshToken })
                let accessToken
                if (!resutl) throw new Error("No refresh token present in db or not matched!")
                jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
                    if (err || resutl.id !== decoded.id) {
                        throw new Error("There is something wrong with refresh token")
                    }
                    accessToken = jwtToken.generateToken(resutl?._id)
                })
                resolve({
                    success: true,
                    accessToken
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    logout: (refreshToken) => {
        return new Promise(async (resolve, reject) => {
            try {
                // let resutl = await User.findOne({ refreshToken })
                let resutl = await User.findOneAndUpdate({ refreshToken }, {
                    refreshToken: ""
                }, { new: true })
                resolve({
                    success: true,
                    msg: "Logout succeed!",
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getUsers: (type) => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = []
                if (type === "ALL") {
                    resutl = await User.find({ isBlocked: { $ne: true } }).select('-password')
                }
                console.log(resutl);

                if (type === "BLOCK") {
                    resutl = await User.find({ isBlocked: true }).select('-password')
                }
                resolve({
                    success: true,
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getUser: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = await User.findById(id).select('-password -refreshToken').populate("wishlist")
                resolve({
                    success: true,
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    deleteUser: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                await User.deleteById(id)
                resolve({
                    success: true,
                    msg: `Delete user succeed!`
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    editUser: (id, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { firstname, lastname, mobile, email } = data
                let resutl = await User.findByIdAndUpdate(
                    id,
                    {
                        firstname, lastname, mobile, email
                    },
                    {
                        new: true
                    })
                resolve({
                    success: true,
                    msg: `Update user succeed!`,
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    blockUser: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let findUser = await User.findById(id)
                if (findUser.role === "admin") {
                    resolve({
                        success: false,
                        msg: `This is an admin account, you can't block it!`,
                    })
                }
                else {
                    let resutl = await User.findByIdAndUpdate(
                        id,
                        {
                            isBlocked: true
                        },
                        {
                            new: true
                        })
                    resolve({
                        success: true,
                        msg: `Block user succeed!`,
                        data: resutl
                    })
                }
            } catch (err) {
                reject(err)
            }

        })
    },
    unBlockUser: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                let resutl = await User.findByIdAndUpdate(
                    id,
                    {
                        isBlocked: false
                    },
                    {
                        new: true
                    })
                resolve({
                    success: true,
                    msg: `UnBlock user succeed!`,
                    data: resutl
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    updatePassword: (id, password) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await User.findById(id)
                let check = await user.isPasswordMatched(password)
                if (check) {
                    resolve({
                        success: false,
                        msg: `Change password failded!New password match old password.`
                    })
                }
                user.password = password
                await user.save()
                resolve({
                    success: true,
                    msg: `Change password succeed!`
                })

            } catch (err) {
                reject(err)
            }

        })
    },
    forgotPasswordToken: (email) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await User.findOne({ email })
                if (!email) {
                    throw new Error("User not found with this email!")
                }

                let token = await user.createPasswordResetToken()
                await user.save()
                let resetURL = `Hi ${user.firstname}!<br/> Plesase follow this link to reset Your Password.
                <br/>This link is valid till 10 min from now.
                <br/>
                <a href='${process.env.URL_REACT}/reset-password/${token}'>Click here</a>
                `
                let data = {
                    to: email,
                    html: resetURL
                }
                sendEmail(data)
                resolve({
                    success: true,
                    msg: "Succesfully! Please check your email",
                    token
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    resetPassword: (password, token) => {
        return new Promise(async (resolve, reject) => {
            try {
                let hashedToken = crypto.createHash("sha256").update(token).digest("hex")
                let user = await User.findOne({
                    passwordResetToken: hashedToken,
                    passwordResetExpires: { $gt: Date.now() }
                })

                if (!user) {
                    resolve({
                        success: false,
                        msg: "Token Expired, Please try again later"
                    })
                }
                user.password = password
                user.passwordResetToken = undefined
                user.passwordResetExpires = undefined
                await user.save()

                resolve({
                    success: true,
                    data: user
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getWishlist: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                console.log(userId);
                // return
                let findUser = await User.findById(userId).populate('wishlist')
                let wishlist = findUser.wishlist
                resolve({
                    success: true,
                    wishlist
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    putProductToWishList: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { userId, productId } = data
                let user = await User.findById(userId)
                if (user.wishlist.some(p => p._id.toString() === productId)) {
                    resolve({
                        success: false,
                        msg: "The product already exists in your favorites list!",
                        data: null
                    })
                } else {
                    user.wishlist.push(productId);
                    let result = await user.save();
                    resolve({
                        success: true,
                        msg: "The product has been added to your wishlist!",
                        data: result.wishlist.toObject()
                    })
                }
            } catch (err) {
                reject(err)
            }

        })
    },
    deleteProductToWishList: (productId, userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let user = await User.findById(userId)
                user.wishlist.pull(productId);
                let result = await user.save();
                resolve({
                    success: true,
                    msg: "The product has been removed from your wishlist!",
                    data: result.wishlist.toObject()
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    cartUser: (userId, productData) => {
        return new Promise(async (resolve, reject) => {
            try {
                // tìm user
                const user = await User.findById(userId)

                // tìm cart của user trong model Cart
                let cart = await Cart.findOne({ orderBy: user?._id })
                //nếu tìm thấy cart thì:
                if (cart) {
                    //lọc data client gửi lên
                    for (let i = 0; i < productData.length; i++) {
                        //tìm xem data gửi lên có tồn tại trong cart?
                        const product = cart.products.find((p) => p.product.toString() === productData[i].productId
                            && p.color === productData[i].color)
                        // && p.size === productData[i].size

                        if (product) {
                            //nếu tồn tại
                            let getPrice = await Product.findById(productData[i].productId).select("price coupon").exec()
                            console.log(getPrice);
                            //cập nhật count
                            product.count += productData[i].count
                            product.price = (getPrice.price * (1 - (+getPrice?.coupon / 100))) * product.count
                        } else {
                            //nếu không tồn tại thêm mới vào cart
                            let getPrice = await Product.findById(productData[i].productId).select("price coupon").exec()
                            const newProduct = {
                                product: productData[i].productId,
                                count: productData[i].count,
                                color: productData[i].color,
                                size: productData[i].size,
                                price: (getPrice.price * (1 - (+getPrice?.coupon / 100))) * productData[i].count
                            };
                            cart.products.push(newProduct);
                        }
                    }
                    // tính tổng tiền
                    const cartTotal = cart.products.reduce((acc, curr) => acc + (curr?.price), 0);
                    cart.cartTotal = cartTotal;

                    await cart.save();
                } else {
                    //nếu không tìm thấy cart trong model Cart thì thêm mới cart
                    for (let i = 0; i < productData.length; i++) {
                        let getPrice = await Product.findById(productData[i].productId).select("price coupon").exec()
                        const newProduct = {
                            product: productData[i].productId,
                            count: productData[i].count,
                            color: productData[i].color,
                            size: productData[i].size,
                            price: (getPrice.price * (1 - (+getPrice?.coupon / 100))) * productData[i].count
                        };
                        cart = new Cart({
                            products: newProduct,
                            orderBy: user?._id,
                        });

                    }
                    // tính tổng tiền
                    const cartTotal = cart.products.reduce((acc, curr) => acc + (curr.price), 0);
                    cart.cartTotal = cartTotal;

                    await cart.save();
                }


                resolve({
                    success: true,
                    msg: "The product has been added to your Cart!",
                    data: cart
                })

            } catch (err) {
                reject(err)
            }

        })
    },
    getCart: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let products = await Cart.findOne({ orderBy: userId }).populate("orderBy").populate("products.color").populate("products.product")

                if (products) {
                    resolve({
                        success: true,
                        data: products
                    })
                } else {
                    resolve({
                        success: false,
                        data: []
                    })
                }

            } catch (err) {
                reject(err)
            }

        })
    },
    updateCartProduct: (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { productId, newCount } = data
                let cartUser = await Cart.findOne(
                    { orderBy: userId }
                ).populate('products.product')
                let findProductId = cartUser.products.findIndex((item) => item._id.toString() === productId)
                if (findProductId !== -1) {
                    cartUser.products[findProductId].count = newCount;
                    cartUser.products[findProductId].price = newCount * cartUser.products[findProductId].product.price;
                    cartUser.cartTotal = cartUser.products.reduce((acc, curr) => acc + curr.price, 0)
                    await cartUser.save()
                }
                resolve({
                    success: true,
                    data: cartUser
                })

            } catch (err) {
                reject(err)
            }

        })
    },
    emptyCart: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findById(userId)
                const cart = await Cart.findOneAndRemove({ orderBy: user?._id })
                resolve({
                    success: true
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    deleteAllProduct: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {

                const user = await User.findById(userId)

                const result = await Cart.findOneAndUpdate({ orderBy: user?._id }, {
                    products: [],
                    cartTotal: 0
                }, { new: true })
                resolve({
                    success: true,
                    data: result
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    deleteProductCart: (userId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { productId, color, size } = data
                const user = await User.findById(userId)
                const cart = await Cart.findOne({ orderBy: user?._id })
                for (let i = 0; i < cart.products.length; i++) {
                    if (cart?.products[i]?.product?.toString() === productId && cart?.products[i]?.color.toString() === color) {
                        cart?.products.splice(i, 1);
                    }
                }
                const cartTotal = cart.products.reduce((acc, curr) => acc + curr.price, 0);
                cart.cartTotal = cartTotal;


                await cart.save()
                resolve({
                    success: true,
                    msg: "Delete product successfully!",
                    data: cart
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    postBooking: (data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { products, userId, customer, address, phoneNumber, total } = data
                console.log(data);
                // return
                if (!products || !customer || !address || !phoneNumber) {
                    resolve({
                        success: true,
                        msg: "Please enter full information!",
                    })
                }
                const result = await Booking.create({
                    products,
                    userId,
                    address,
                    phoneNumber,
                    customer,
                    total
                })
                resolve({
                    success: true,
                    msg: "Booking successfully!",
                    data: result
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getABooking: (bookingId) => {
        return new Promise(async (resolve, reject) => {
            try {

                let result = await Booking.findById(bookingId).populate('products').populate({
                    path: 'products',
                    populate: {
                        path: 'product',
                        populate: {
                            path: 'brand',
                            model: 'Brand'
                        }
                    }
                })

                resolve({
                    success: true,
                    data: result
                })

            } catch (err) {
                reject(err)
            }
        })
    },
    getBooking: (data, userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                // const product = await Cart.find({ orderBy: userId })
                // const productId = product.map((product) => product._id);
                let { type } = data
                let page = data.page
                let limit = data.limit
                let offset = (page - 1) * limit
                let result = []
                if (type === "1") {
                    result = await Booking.findById(bookingId).populate('products').populate({
                        path: 'products',
                        populate: {
                            path: 'product',
                            populate: {
                                path: 'brand',
                                model: 'Brand'
                            }
                        }
                    })
                }
                if (type === "ALL") {
                    result = await Booking.find({ userId }).populate('products').populate({
                        path: 'products',
                        populate: {
                            path: 'product',
                            populate: {
                                path: 'brand',
                                model: 'Brand'
                            }
                        }
                    }).skip(offset).limit(limit);

                }
                if (type === "CONFIRM") {
                    result = await Booking.find({ userId, status: "CONFIRM" }).populate('products').populate({
                        path: 'products',
                        populate: {
                            path: 'product',
                            populate: {
                                path: 'brand',
                                model: 'Brand'
                            }
                        }
                    }).skip(offset).limit(limit);
                }
                if (type === "RECEIVE") {
                    result = await Booking.find({ userId, status: "RECEIVE" }).populate('products').populate({
                        path: 'products',
                        populate: {
                            path: 'product',
                            populate: {
                                path: 'brand',
                                model: 'Brand'
                            }
                        }
                    }).skip(offset).limit(limit);
                }
                if (type === "CANCELLED") {
                    result = await Booking.find({ userId, status: "CANCELLED" }).populate('products').populate({
                        path: 'products',
                        populate: {
                            path: 'product',
                            populate: {
                                path: 'brand',
                                model: 'Brand'
                            }
                        }
                    }).skip(offset).limit(limit);
                }
                if (type === "COMPLETED") {
                    result = await Booking.find({ userId, status: "COMPLETED" }).populate('products').populate({
                        path: 'products',
                        populate: {
                            path: 'product',
                            populate: {
                                path: 'brand',
                                model: 'Brand'
                            }
                        }
                    }).skip(offset).limit(limit);
                }
                resolve({
                    success: true,
                    data: result
                })

            } catch (err) {
                reject(err)
            }
        })
    },
    getAllBooking: () => {
        return new Promise(async (resolve, reject) => {
            try {
                const result = await Booking.find({})
                    .populate({
                        path: 'userId',
                        select: 'firstname lastname mobile  email'
                    }).populate({
                        path: 'products',
                        populate: {
                            path: 'product',
                            populate: {
                                path: 'brand',
                                model: 'Brand'
                            }
                        }
                    })
                resolve({
                    success: true,
                    data: result
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    getBookingforMonth: (month) => {
        return new Promise(async (resolve, reject) => {
            try {
                let bookings = null
                const year = new Date().getFullYear(); // Lấy năm hiện tại
                if (month === 'all') {
                    const startDate = new Date(year, 0, 1); // Ngày bắt đầu của năm
                    const endDate = new Date(year, 11, 31); // Ngày kết thúc của năm
                    bookings = await Booking.find({
                        createdAt: { $gte: startDate, $lte: endDate }
                    });
                } else {
                    const startDate = new Date(year, month - 1, 1); // Thiết lập ngày bắt đầu của tháng
                    const endDate = new Date(year, month, 0); // Thiết lập ngày kết thúc của tháng
                    // Truy vấn cơ sở dữ liệu để lấy danh sách sản phẩm của tháng
                    bookings = await Booking.find({
                        createdAt: { $gte: startDate, $lte: endDate }
                    });
                }
                // Phân loại sản phẩm thành công và thất bại dựa trên trường status
                const completedBookings = bookings.filter(booking => booking.status === "COMPLETED");
                const receivedBookings = bookings.filter(booking => booking.status === "RECEIVE");
                const cancelledBookings = bookings.filter(booking => booking.status === 'CANCELLED');
                const confirmBookings = bookings.filter(booking => booking.status === 'CONFIRM');
                resolve({
                    success: true,
                    data: {
                        completedBookings, receivedBookings, cancelledBookings, confirmBookings
                    }
                })
            } catch (err) {
                reject(err)
            }

        })
    },
    confimBooking: (bookingId, data, useId) => {
        return new Promise(async (resolve, reject) => {
            try {
                const { type } = data
                const findUser = await User.findById(useId)
                if (type === "CONFIRM") {
                    let findBooking = await Booking.findById(bookingId)
                    if (findBooking?.status === "CONFIRM") {
                        let result = await Booking.findByIdAndUpdate(bookingId,
                            {
                                status: "RECEIVE"
                            }, { new: true })
                        resolve({
                            success: true,
                            msg: "Confirm sucessfully!",
                            data: result
                        })
                    } else {
                        resolve({
                            success: false
                        })
                    }
                }

                if (type === "CANCELLED") {
                    let result = []
                    if (findUser?.role === "user") {
                        result = await Booking.findByIdAndUpdate(bookingId,
                            {
                                status: "CANCELLED",
                                cancelBy: `Cancel by ${findUser?.firstname}.`
                            }, { new: true })
                    } else {
                        result = await Booking.findByIdAndUpdate(bookingId,
                            {
                                status: "CANCELLED",
                                cancelBy: "Cancel by admin."
                            }, { new: true })
                    }
                    resolve({
                        success: true,
                        msg: "Cancel booking sucessfully!",
                        data: result
                    })

                }
                if (type === "COMPLETED") {
                    let result = await Booking.findByIdAndUpdate(bookingId,
                        {
                            status: "COMPLETED"
                        }, { new: true })
                    let prdId = result.products.map((item) => {
                        return {
                            id: item.product._id,
                            count: item.count
                        }
                    })
                    for (let i = 0; i < prdId.length; i++) {
                        let productId = prdId[i].id;
                        let sold = prdId[i].count;
                        await Product.findByIdAndUpdate(productId, { $inc: { sold } });
                    }
                    resolve({
                        success: true,
                        msg: "Complete!",
                        data: result
                    })
                }

            } catch (err) {
                reject(err)
            }

        })
    },
    deleteBooking: (bookingId) => {
        return new Promise(async (resolve, reject) => {
            try {
                await Booking.findByIdAndDelete(bookingId)
                resolve({
                    success: true,
                    msg: "Delete sucessfully!",
                })

            } catch (err) {
                reject(err)
            }

        })
    },
    postAddress: (data, userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let { address, city, phoneNumber, fullName } = data
                let result = await Address.create({
                    address,
                    city,
                    phoneNumber,
                    fullName,
                    userId
                })
                resolve({
                    success: true,
                    msg: "Create succeed!",
                    data: result
                })

            } catch (err) {
                reject(err)
            }

        })
    },
    getAddress: (userId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Address.find({ userId })
                resolve({
                    success: true,
                    data: result
                })

            } catch (err) {
                reject(err)
            }

        })
    },
    getAnAddress: (addressId) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Address.findById(addressId)
                resolve({
                    success: true,
                    data: result
                })

            } catch (err) {
                reject(err)
            }

        })
    },
    deleteAddress: (id) => {
        return new Promise(async (resolve, reject) => {
            try {
                await Address.findByIdAndDelete(id)
                resolve({
                    success: true,
                    msg: "Delete sucessfully!",
                })

            } catch (err) {
                reject(err)
            }

        })
    },
    putAddress: (addressId, data) => {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await Address.findByIdAndUpdate(addressId, {
                    address: data?.address,
                    city: data?.city,
                    phoneNumber: data?.phoneNumber,
                    fullName: data?.fullName
                }, { new: true })
                resolve({
                    success: true,
                    msg: "Update sucessfully!",
                    data: result
                })

            } catch (err) {
                reject(err)
            }

        })

    },
    // payment: () => {
    //     return new Promise(async (resolve, reject) => {
    //         try {

    //             resolve({
    //                 success: true,
    //                 msg: "Update sucessfully!",
    //                 data: result
    //             })

    //         } catch (err) {
    //             reject(err)
    //         }

    //     })

    // },
}