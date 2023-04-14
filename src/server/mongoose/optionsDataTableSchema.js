const mongoose = require('mongoose');
const optionsDataTableSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    gridMenu: {
        type: Boolean,
        default: false
    },
    lengthDataTableMenu: {
        type: Number,
        default: 10
    },
    productMenuByCategory: {
        type: String,
        default: '#'
    },
    lengthDataTableCategories: {
        type: Number,
        default: 10
    },
    productCategoriesByCategory: {
        type: String,
        default: '#'
    },
    lengthDataTableModifiersCategories: {
        type: Number,
        default: 10
    },
    productModifiersCategoriesByCategory: {
        type: String,
        default: '#'
    },
    lengthDataTableModifiers: {
        type: Number,
        default: 10
    },
    productModifiersByCategory: {
        type: String,
        default: '#'
    },
});
module.exports = mongoose.model('optionsDataTableSchema', optionsDataTableSchema);
