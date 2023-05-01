const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require('bcrypt')
const crypto = require('crypto')
const mongoose_delete = require('mongoose-delete');
// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: true,
    },
    lastname: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    mobile: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        default: "user"
    },
    cart: {
        type: Array,
        default: []
    },
    address: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Address" }]
    },
    wishlist: {
        type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Product" }]
    },
    isBlocked: {
        type: Boolean,
        default: false
    },
    refreshToken: {
        type: String
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date
}, { timestamps: true });

userSchema.plugin(mongoose_delete, { overrideMethods: 'all' });

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next()
    }
    const satl = await bcrypt.genSaltSync(10)
    this.password = await bcrypt.hash(this.password, satl)
})
userSchema.methods.isPasswordMatched = async function (password) {
    return await bcrypt.compare(password, this.password)
}
userSchema.methods.createPasswordResetToken = async function () {
    const resetToken = crypto.randomBytes(32).toString("hex")
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex")
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000//10 min
    return resetToken
}


//Export the model
module.exports = mongoose.model('User', userSchema);