const mongoose = require('mongoose'); // Erase if already required
const mongoose_delete = require('mongoose-delete');
// Declare the Schema of the Mongo model
var cartSchema = new mongoose.Schema({
    products: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product"
        },
        count: Number,
        color: String,
        size: String,
        price: Number
    }],
    cartTotal: Number,
    totalAfterDisCount: Number,
    orderBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Cart', cartSchema);