const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var addressSchema = new mongoose.Schema({
    address: {
        type: String,
    },
    city: {
        type: String,
    },
    fullName: {
        type: String
    },
    phoneNumber: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Address', addressSchema);