const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const termsSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  JURY_ADDRESS: {
    type: String,
    default: "не указан",
  },
  PHYSICAL_ADDRESS: {
    type: String,
    default: "не указан",
  },
  EMAIL_ADDRESS: {
    type: String,
    default: "не указан",
  },
  PHONE_NUMBER: {
    type: String,
    default: "не указан",
  },
  SHORT_NAME: {
    type: String,
    default: "не указан",
  },
  WEB_SITE: {
    type: String,
    default: "не указан",
  },
  BANK_DETAILS: {
    type: String,
    default: "не указаны",
  },
});

module.exports = mongoose.model("termsSchema", termsSchema);
