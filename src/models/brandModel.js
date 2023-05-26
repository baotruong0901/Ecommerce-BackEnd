const mongoose = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    images: Array
}, { timestamps: true });

//Export the model
module.exports = mongoose.model('Brand', brandSchema);