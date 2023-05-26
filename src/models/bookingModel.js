const mongoose = require('mongoose'); // Erase if already required
const mongoose_delete = require('mongoose-delete');
// Declare the Schema of the Mongo model
var bookingSchema = new mongoose.Schema({
    products: Array,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    customer: String,
    address: String,
    city: String,
    mobile: Number,
    total: String,
    cancelBy: String,
    status: {
        type: String,
        default: "CONFIRM"
    },
    payment: {
        type: String,
        default: "Cash"
    }
}, { timestamps: true });

bookingSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

//Export the model
module.exports = mongoose.model('Booking', bookingSchema);