const mongoose = require('mongoose');

//login, password, description, displayName, rights
const modifiersSchema = new mongoose.Schema(
    {
        active: {
            type: Boolean,
            default: true
        },
        img: {
            type: String
        },
        img_origin: {
            type: String
        },
        title: {
            type: String,
            required: true
        },
        sort: {
            type: Number
        },
        price: {
            type: Number,
            required: true
        },
        id_category: {
            type: mongoose.Schema.Types.ObjectId, ref: 'categoriesModifiersSchema'
        },
        unit: {
            type: String
        },
        weight: {
            type: String,
            required: true
        },
        description: {
            type: String
        },
        idFromIiko: {
            type: String
        }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

module.exports = mongoose.model('modifiersSchema', modifiersSchema);
