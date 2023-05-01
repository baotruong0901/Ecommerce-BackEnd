const mongoose = require('mongoose'); // Erase if already required
const mongoose_delete = require('mongoose-delete');
// Declare the Schema of the Mongo model
var brandSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    images: Array
}, { timestamps: true });
brandSchema.plugin(mongoose_delete, { overrideMethods: 'all' });
//Export the model
module.exports = mongoose.model('Brand', brandSchema);