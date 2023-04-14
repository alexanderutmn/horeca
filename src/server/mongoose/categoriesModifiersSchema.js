const mongoose = require('mongoose');

const categoriesModifiersSchema = new mongoose.Schema(
    {
        active: {
            type: Boolean,
            default: true
        },
        title: {
            type: String,
            required: true,
            unique: true
        },
        sort: {
            type: Number,
        },
        type_menu: {
            type: Number,
        },
        parent_id: {
            type: mongoose.Schema.Types.ObjectId, ref: 'categoriesModifiersSchema'
        },
        idFromIiko: {
            type: String
        },
        isGroupModifierCategoryRadio: {
            type: Boolean,
            default: false
        },
        isGroupModifierRequired: {
            type: Boolean,
            default: false
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);
module.exports = mongoose.model('categoriesModifiersSchema', categoriesModifiersSchema);
