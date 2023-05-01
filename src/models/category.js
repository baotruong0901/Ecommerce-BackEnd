const mongoose = require('mongoose'); // Erase if already required
const mongoose_delete = require('mongoose-delete');
// Declare the Schema of the Mongo model
var categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    image: Array
}, { timestamps: true });
categorySchema.plugin(mongoose_delete, { overrideMethods: 'all' });
//Export the model
module.exports = mongoose.model('Category', categorySchema);