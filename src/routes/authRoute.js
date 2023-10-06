const express = require('express')
const router = express.Router()

const userControllers = require("../controllers/userControllers")
const { authMiddleware, isAdmin } = require("../middewares/authMiddleware")


let initAuthRoutes = (app) => {
    router.post('/user/register', userControllers.createUser)
    router.post('/user/login', userControllers.login)
    router.post('/user/forgot-password', userControllers.forgotPasswordToken)
    router.put('/user/reset-password/:token', userControllers.resetPassword)
    router.put('/user/change-password', authMiddleware, userControllers.updatePassword)
    router.get('/user/refresh', userControllers.handlerRefreshToken)
    router.get('/user/logout', userControllers.logout)
    router.get('/get-users', userControllers.getUsers)
    router.get('/user/:id', authMiddleware, userControllers.getUser)
    router.put('/user/edit', authMiddleware, userControllers.editUser)
    router.get("/wishlist", authMiddleware, userControllers.getWishlist);


    //cart
    router.post('/cart', authMiddleware, userControllers.cartUser)
    router.get('/carts', authMiddleware, userControllers.getCart)
    router.put('/cart', authMiddleware, userControllers.updateCartProduct)
    router.delete('/empty-cart', authMiddleware, userControllers.emptyCart)
    router.put('/carts', authMiddleware, userControllers.deleteAllProduct)
    router.delete('/cart', authMiddleware, userControllers.deleteProductCart)
    //wishlist
    router.put('/wish-list', authMiddleware, userControllers.putProductToWishList)
    router.delete('/wish-list/:id', authMiddleware, userControllers.deleteProductToWishList)

    //checkout
    router.post('/booking', authMiddleware, userControllers.postBooking)
    router.get('/booking', authMiddleware, userControllers.getBooking)
    router.get('/booking/:id', authMiddleware, userControllers.getABooking)
    router.get('/booking/month/:id', authMiddleware, isAdmin, userControllers.getBookingforMonth)
    router.get('/bookings', authMiddleware, isAdmin, userControllers.getAllBooking)
    router.put('/booking/:id', authMiddleware, userControllers.confimBooking)
    router.delete('/booking/:id', authMiddleware, userControllers.deleteBooking)
    //address
    router.post('/address', authMiddleware, userControllers.postAddress)
    router.get('/address', authMiddleware, userControllers.getAddress)
    router.get('/address/:id', authMiddleware, userControllers.getAnAddress)
    router.delete('/address/:id', authMiddleware, userControllers.deleteAddress)
    router.put('/address/:id', authMiddleware, userControllers.putAddress)

    //block
    router.put('/unblock/:id', authMiddleware, isAdmin, userControllers.unBlockUser)
    router.put('/block/:id', authMiddleware, isAdmin, userControllers.blockUser)

    router.delete('/:id', userControllers.deleteUser)
    // router.post('/payment', authMiddleware, userControllers.payment)
    return app.use("/api", router);

}

module.exports = initAuthRoutes
