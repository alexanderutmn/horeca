const mongoose = require('mongoose');

//login, password, description, displayName, rights
const telegramUsersSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    is_bot: {
      type: Boolean,
    },
    first_name: {
      type: String,
    },
    last_name: {
      type: String,
    },
    username: {
      type: String,
    },
    language_code: {
      type: String,
    },
    role: {
      type: Number,
      required: 'role is required!',
    },
    telegramBotId: {
      type: String,
      required: 'telegramBotId is required!'
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('telegramUsersSchema', telegramUsersSchema);
