const mongoose = require('mongoose');

const personUsersSchema = new mongoose.Schema(
    {
      name: {
          type: String
      },
      phone: {
          type: String,
          required: true
      },
      street: {
          type: String
      },
      house: {
          type: String
      },
      flat: {
          type: String
      },
      city: {
          type: String
      },
      smsCode: {
          type: String
      },
      timeSendCode: {
        type: Date
      }
    },
    {
        versionKey: false,
        timestamps: true,
    }
);
module.exports = mongoose.model('personUsersSchema', personUsersSchema);
