const mongoose = require('mongoose');

const modifierSchema = new mongoose.Schema({
  idFromIiko: {
    type: String
  },

  minAmount: {
    type: Number
  },
  maxAmount: {
    type: Number
  },

  required: {
    type: Boolean
  },

  name: {
    type: String
  },

  hideIfDefaultAmount: {
    type: Boolean
  },

  defaultAmount: {
    type: Number
  },

  splittable: {
    type: Boolean
  },

  freeOfChargeAmount: {
    type: Number
  },

  idEasyQr: {
    type: mongoose.Schema.Types.ObjectId, ref: 'modifiersSchema'
  }
});
const groupModifierSchema = new mongoose.Schema({
  idFromIiko: {
    type: String
  },

  minAmount: {
    type: Number
  },
  maxAmount: {
    type: Number
  },

  required: {
    type: Boolean
  },

  name: {
    type: String
  },

  hideIfDefaultAmount: {
    type: Boolean
  },

  defaultAmount: {
    type: Number
  },

  splittable: {
    type: Boolean
  },

  freeOfChargeAmount: {
    type: Number
  },

  childModifiers: [modifierSchema],

  idEasyQr: {
    type: mongoose.Schema.Types.ObjectId, ref: 'categoriesModifiersSchema'
  }

});

//login, password, description, displayName, rights
const menuSchema = new mongoose.Schema(
  {
    // id: {
    //   type: Number
    // },
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
    imgQr: {
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
      // type: Number
      type: mongoose.Schema.Types.ObjectId, ref: 'categoriesSchema',
      required: true
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
    descriptionQr: {
      type: String
    },
    colorQr: {
      type: String
    },
    fontFamilyQr: {
      type: String
    },
    idFromIiko: {
      type: String
    },
    modifiers: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'modifiersSchema' }]
    },
    groupModifiers: {
      type: [groupModifierSchema]
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model('menuSchema', menuSchema);
