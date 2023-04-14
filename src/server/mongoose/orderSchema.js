const mongoose = require('mongoose');
const counterOrdersSchema = mongoose.model('counterOrdersSchema');

const orderPersonSchema = new mongoose.Schema({
  name: {
    type: String
  },
  phone: {
    type: String
  },
  street: {
    type: String
  },
  city: {
    type: String
  },
  house: {
    type: String
  },
  flat: {
    type: String
  },
  entrance: {
    type: String
  },
  floor: {
    type: String
  }
});

// схема продуктов в юзерах
const productSchema = new mongoose.Schema({
  array_modification: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'modifiersSchema'
  }],
  count: {
    type: Number
  },
  id: {
    type: Number
  },
  img: {
    type: String
  },
  weight: {
    type: String
  },
  unit: {
    type: String
  },
  isTechMap: {
    type: String
  },
  modification: {
    type: String
  },
  price: {
    type: Number
  },
  title: {
    type: String
  },
  currency: {
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
    productSchema
  ]
});

const orderSchema = new mongoose.Schema(
  {
    incoming_order_id: {
      type: Number
    },
    /*
      0 — новый
      1 — Принят, готовится
      2 - Принят, готовится
      3 - У курьера
      4 - Выдан
      7 — отменён
    */
    orderStatus: {
      type: Number
    },
    // transaction_id: {
    //   type: Number
    // },
    check: { // обработан ли заказ
      type: Boolean
    },
    text: {
      type: String
    },
    commentHtml: {
      type: String
    },
    numberTable: {
      type: String,
      required: "required"
    },
    spotId: {
      type: String
    },
    hide: { // Заказ показывать для пользователей или нет
      type: Boolean
    },
    persons: [
      personSchema
    ],
    orderProducts: [
      productSchema
    ],
    orderPrice: {
      type: Number
    },
    isPaid: {
      type: Boolean
    },
    time: {
      type: String
    },
    comment: {
      type: String
    },
    /*
      1 - Здесь
      2 - С собой
      3 - Доставка
    */
    place: {
      type: Number
    },
    deliveryPrice: {
      type: Number
    },
    /*
      1 - Онлайн
      2 - картой / наличными
    */
    payment: {
      type: Number
    },
    orderPerson: orderPersonSchema,
    orderPersonId: {
      type: mongoose.Schema.Types.ObjectId, ref: 'userSchema'
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

orderSchema.pre('save', function (next) {
  var doc = this;
  counterOrdersSchema.findByIdAndUpdate({ _id: 'entityId' }, { $inc: { seq: 1 } }, function (error, counter) {
    if (error)
      return next(error);
    if (doc.incoming_order_id == false) {
      doc.incoming_order_id = counter.seq;
      // doc.transaction_id = counter.seq;
    }
    next();
  });
});

module.exports = mongoose.model('orderSchema', orderSchema);
