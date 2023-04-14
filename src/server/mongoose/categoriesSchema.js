const mongoose = require('mongoose');

//login, password, description, displayName, rights
const categoriesSchema = new mongoose.Schema(
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
      // type: Number,
      type: mongoose.Schema.Types.ObjectId, ref: 'categoriesSchema'
    },
    noImagesCategory: {
      type: Boolean,
      default: false,
    },
    idFromIiko: {
      type: String
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('categoriesSchema', categoriesSchema);
