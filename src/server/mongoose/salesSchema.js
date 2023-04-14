const mongoose = require('mongoose');

const salesSchema = new mongoose.Schema({
    action: {
        type: Boolean,
        default: true,
        required: true,
    },
    title: {
        type: String,
        minLength: 2,
        required: true,
    },
    description: {
        type: String,
        minLength: 2,
        required: true,
    },
    image: {
        type: String,
        required: true,
        minLength: 2,
    },
    dateStartSales: {
        type: Date,
    },
    dateFinishSales: {
        type: Date,
    }
});
module.exports = mongoose.model('salesSchema', salesSchema);