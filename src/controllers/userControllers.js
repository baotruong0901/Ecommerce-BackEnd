const userService = require('../services/userService')
const asyncHandler = require('express-async-handler')
const validateMongoDbId = require('../utils/validateMongodbId')

module.exports = {
    createUser: asyncHandler(async (req, res) => {
        try {
            const newUser = await userService.createUser(req.body)
            res.json(newUser)
        } catch (err) {
            throw new Error(err)
        }
    }),
    login: asyncHandler(async (req, res) => {
        try {
            const resutl = await userService.login(req.body, res)
            // console.log(resutl.data.refreshToken);
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    //handler refreshtoken
    handlerRefreshToken: asyncHandler(async (req, res) => {
        try {
            let cookie = req.cookies
            if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
            let refreshToken = cookie.refreshToken
            const resutl = await userService.handlerRefreshToken(refreshToken)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    logout: asyncHandler(async (req, res) => {
        try {
            let cookie = req.cookies
            console.log("cookie", cookie);
            // return
            if (!cookie?.refreshToken) throw new Error('No Refresh Token in Cookies')
            let refreshToken = cookie.refreshToken
            const resutl = await userService.logout(refreshToken)
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true
            })
            return res.json(resutl)//forbidden
        } catch (err) {
            throw new Error(err)
        }
    }),
    getUsers: asyncHandler(async (req, res) => {
        try {
            const resutl = await userService.getUsers(req.query.type)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    getUser: asyncHandler(async (req, res) => {
        try {
            let { id } = req.params
            const resutl = await userService.getUser(id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    deleteUser: asyncHandler(async (req, res) => {
        try {
            let { id } = req.params
            validateMongoDbId(id)
            const resutl = await userService.deleteUser(id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    editUser: asyncHandler(async (req, res) => {
        try {
            let { _id } = req.user
            validateMongoDbId(_id)
            const resutl = await userService.editUser(_id, req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    blockUser: asyncHandler(async (req, res) => {
        try {
            let { id } = req.params
            validateMongoDbId(id)
            const resutl = await userService.blockUser(id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    unBlockUser: asyncHandler(async (req, res) => {
        try {
            let { id } = req.params
            validateMongoDbId(id)
            const resutl = await userService.unBlockUser(id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    updatePassword: asyncHandler(async (req, res) => {
        try {
            let { _id } = req.user
            let { password } = req.body
            const resutl = await userService.updatePassword(_id, password)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    forgotPasswordToken: asyncHandler(async (req, res) => {
        try {
            let { email } = req.body
            const resutl = await userService.forgotPasswordToken(email)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    resetPassword: asyncHandler(async (req, res) => {
        try {
            let { password } = req.body
            let { token } = req.params
            const resutl = await userService.resetPassword(password, token)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    getWishlist: asyncHandler(async (req, res) => {
        try {
            let { _id } = req.user
            const resutl = await userService.getWishlist(_id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }
    }),
    putProductToWishList: asyncHandler(async (req, res) => {
        try {
            const resutl = await userService.putProductToWishList(req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    deleteProductToWishList: asyncHandler(async (req, res) => {
        try {
            const resutl = await userService.deleteProductToWishList(req.body.productId, req.params.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    cartUser: asyncHandler(async (req, res) => {
        let { _id } = req.user
        let { cart } = req.body
        try {
            const resutl = await userService.cartUser(_id, cart)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    getCart: asyncHandler(async (req, res) => {
        let { _id } = req.user
        try {
            const resutl = await userService.getCart(_id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    updateCartProduct: asyncHandler(async (req, res) => {
        let { _id } = req.user
        // let productId = req.params.id
        try {
            const resutl = await userService.updateCartProduct(_id, req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    emptyCart: asyncHandler(async (req, res) => {
        let { _id } = req.user
        try {
            const resutl = await userService.emptyCart(_id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    deleteAllProduct: asyncHandler(async (req, res) => {
        let { _id } = req.user
        try {
            const resutl = await userService.deleteAllProduct(_id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    deleteProductCart: asyncHandler(async (req, res) => {
        let { _id } = req.user
        try {
            const resutl = await userService.deleteProductCart(_id, req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    postBooking: asyncHandler(async (req, res) => {
        try {
            const resutl = await userService.postBooking(req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    getBooking: asyncHandler(async (req, res) => {
        let { _id } = req.user
        try {
            const resutl = await userService.getBooking(req.query, _id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    getABooking: asyncHandler(async (req, res) => {
        try {
            const resutl = await userService.getABooking(req.params.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    getAllBooking: asyncHandler(async (req, res) => {
        try {
            const resutl = await userService.getAllBooking()
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    getBookingforMonth: asyncHandler(async (req, res) => {
        try {
            console.log(req.params.id);
            // return
            const resutl = await userService.getBookingforMonth(req.params.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    confimBooking: asyncHandler(async (req, res) => {
        try {
            let { _id } = req.user
            const resutl = await userService.confimBooking(req.params.id, req.body, _id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    deleteBooking: asyncHandler(async (req, res) => {
        try {
            const resutl = await userService.deleteBooking(req.params.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    postAddress: asyncHandler(async (req, res) => {
        try {
            let { _id } = req.user
            // console.log(req.body, _id);
            // return
            const resutl = await userService.postAddress(req.body, _id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    getAddress: asyncHandler(async (req, res) => {
        try {
            let { _id } = req.user
            const resutl = await userService.getAddress(_id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    getAnAddress: asyncHandler(async (req, res) => {
        try {
            const resutl = await userService.getAnAddress(req.params.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    deleteAddress: asyncHandler(async (req, res) => {
        try {
            const resutl = await userService.deleteAddress(req.params.id)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    putAddress: asyncHandler(async (req, res) => {
        try {
            // let { _id } = req.user
            const resutl = await userService.putAddress(req.params.id, req.body)
            res.json(resutl)
        } catch (err) {
            throw new Error(err)
        }

    }),
    // payment: asyncHandler(async (req, res) => {
    //     try {
    //         const resutl = await userService.putAddress(req.params.id, req.body)
    //         res.json(resutl)
    //     } catch (err) {
    //         throw new Error(err)
    //     }

    // }),
}