const mongoose = require('mongoose');

const personModificationsSchema = new mongoose.Schema({
  id: {
    type: String
  },
  num_min: {
    type: String
  }
});

const tableProductSchema = new mongoose.Schema({
  count: {
    type: Number
  },
  id: {
    type: Number
  },
  img: {
    type: String
  },
  modification: {
    type: String
  },
  isModification: {
    type: Boolean
  },
  isTechMap: {
    type: Boolean
  },
  array_modification: [
    // personModificationsSchema
    // String
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'modifiersSchema'
    }
  ],
  price: {
    type: Number
  },
  hash: {
    type: String
  },
  title: {
    type: String
  },
  unit: {
    type: String
  },
  weight: {
    type: String
  }
});

const personSchema = new mongoose.Schema({
  id: {
    type: String
  },
  personName: {
    type: String
  },
  products: [
    tableProductSchema
  ]
});

//login, password, description, displayName, rights
const tablesSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },
    numberTable: {
      type: String,
    },
    persons: [
      personSchema
    ],
    actionTime: {
      type: Date
    },
    spotId: {
      type: String
    },
    hasOrder: {
      type: Boolean,
      default: false
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('tablesSchema', tablesSchema);
