const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
    },
    brand: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Brand' }]
    },
    quantity: {
        type: Number,
        required: true
    },
    sold: {
        type: Number,
        default: 0,
    },
    images: [],
    tags: String,
    color: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Color' }]
    },
    size: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Size' }]
    },
    ratings: [
        {
            star: Number,
            comment: String,
            postedBy: {
                type: mongoose.Schema.Types.ObjectId, ref: "User"
            }
        }
    ],
    totalrating: {
        type: String,
        default: 0,
    },
    coupon: {
        type: String,
        default: 0,
    },
    stock: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Product', productSchema);