const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    buyingPrice: {
        type: String,
        default: '0.0'
    },
    sellingPrice: {
        type: String,
        default: '0.0'
    },
    count: {
        type: Number,
        default: 0
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true,
    toJSON: {virtuals: true}
})

const Product = mongoose.model('Product', productSchema)

module.exports = Product