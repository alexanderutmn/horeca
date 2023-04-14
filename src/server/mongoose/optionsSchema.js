const mongoose = require('mongoose');

// const timesSchema = new mongoose.Schema({
//   tableCheck: {
//     type: Number,
//     default: 1
//   }, // Проверка столов каждые N минут
//   orderCheck: {
//     type: Number,
//     default: 10
//   }, // Проверка заказов каждые N минут,
//   tableMinDisable: {
//     type: Number,
//     default: 10
//   }, // время неактивности за столом,
//   tableMaxDisable: {
//     type: Number,
//     default: 120
//   }, // время неактивности за столом, после которого все удаляется
//   cookieLife: {
//     type: Number,
//     default: 24
//   }, // время жизни куки в часах
// });
const seoSchema = new mongoose.Schema({
  title: {
    type: String,
    default: 'Easy QR | Easy QR | Электронное меню'
  },
  description: {
    type: String,
    default: 'Электронное меню, созданное с помощью сервиса Easy QR'
  },
  keywords: {
    type: String,
    default: 'Easy QR, Электронное меню, меню, Easy QR, VLS, QR, qr код, qr меню, создать qr код, бесплатный qr код, кафе, ресторан'
  },
  url: {
    type: String,
    default: 'http://vls.easyqr.ru'
  }
});
const buttonSchema = new mongoose.Schema({
  target: {
    type: String,
    default: 'Официант'
  },
  text: {
    type: String,
    default: 'Подозвать официанта'
  }
});
const placeSchema = new mongoose.Schema({
  1: {
    type: String,
    default: 'В заведении'
  },
  2: {
    type: String,
    default: 'С собой'
  },
  3: {
    type: String,
    default: 'Доставка'
  },
  4: {
    type: String,
    default: 'В зале'
  }
});
const orderStatusSchema = new mongoose.Schema({
  0: {
    type: String,
    default: 'Новый'
  },
  1: {
    type: String,
    default: 'Принят, готовится'
  },
  3: {
    type: String,
    default: 'У курьера'
  },
  4: {
    type: String,
    default: 'Выдан'
  },
  7: {
    type: String,
    default: 'Отменён'
  }
});
const optSchema = new mongoose.Schema({
  0: {
    type: Boolean,
    default: false,
  }, // Меню без корзины и заказов
  1: {
    type: Boolean,
    default: false
  }, // Меню с Хочу заказать
  2: {
    type: Boolean,
    default: true
  }, // Вызов персонала
  3: {
    type: Boolean,
    default: true
  }, // Заказы в заведении
  4: {
    type: Boolean,
    default: true
  }, // Заказы на доставку / самовывоз
  5: {
    type: Boolean,
    default: false
  }, // Онлайн оплата
  6: {
    type: Boolean,
    default: false
  }, // Онлайн бронирование
  7: {
    type: Boolean,
    default: false
  }, // Типы меню
  8: {
    type: Boolean,
    default: true
  }, // Отображать вес
  9: {
    type: Boolean,
    default: true
  }, // Обрезать название
  10: {
    type: Boolean,
    default: true
  }, // Использовать телеграм бота,
  11: {
    type: Boolean,
    default: true
  }, // Показывать акции
  12: {
    type: Boolean,
    default: true
  } // Изменять цвета
});
const citiesSchema = new mongoose.Schema({
  title: {
    type: String
  },
  delivery: {
    type: Number
  },
  minSummOrder: {
    type: Number
  },
  deliveryFree: {
    type: Number
  }
});

//login, password, description, displayName, rights
const optionsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      required: true
    },
    // TIMES: timesSchema,
    TITLE_REST: {
      type: String,
      default: 'Easy QR' // Название заведения
    },
    COUNT_TABLE: {
      type: Number,
      default: 30
    },
    TITLE_TABLE: {
      type: String,
      default: "Стол"
    },
    enableDishesQr: {
      type: Boolean,
      default: false
    },
    SEO: seoSchema,
    OPTIONS: optSchema,
    TARIFF: {
      type: Number,
      default: 0
    }, // 0 - пробный, 1 - стандарт, 2 - оптимальный, 3 - профи, 4 - премиум

    CITIES: [citiesSchema],
    //   {
    //     id: 1,
    //     title: 'Пыть-Ях',
    //     delivery: 99,
    //     phoneNumber: '89129967927',
    //     minSummOrder: 0,
    //     deliveryFree: 1000
    //   },
    //   {
    //     id: 2,
    //     title: 'Тюмень',
    //     delivery: 150,
    //     phoneNumber: '89129967927',
    //     minSummOrder: 700,
    //     deliveryFree: 999999999
    //   }

    BUTTONS_LIST: [buttonSchema],
    DELIVERY_PRICE: {
      type: Number,
      default: 1000
    }, // Стоимость доставки
    PLACE: placeSchema,
    ORDER_STATUS: orderStatusSchema,
    telegramBotId: {
      type: String
    },
    adminCode: {
      type: String
    },
    waiterCode: {
      type: String
    },
    telegramBotName: {
      type: String
    },
    enableDelivery: {
      type: Boolean,
      default: true
    },
    enablePickup: {
      type: Boolean,
      default: true
    },
    enableInHall: {
      type: Boolean,
      default: false
    },
    yandexMetrika: {
      type: Number
    },
    isIntegrationWithIiko: {
      type: Boolean,
      default: false
    },
    NameIiko: {
      type: String
    },
    NameRestaurant: {
      type: String
    },
    yandexMetrika: {
      type: Number
    },
    enablePayment: {
      type: Boolean,
      default: false
    },
    paymentPublicID: {
      type: String,
    },
    singleMessagePayment: {
      type: Boolean,
      default: true,
    },
    enableTips: {
      type: Boolean
    },
    tipsLayoutID: {
      type: String,
    },
    enableBooking: {
      type: Boolean
    },
    openTime: {
      type: String
    },
    closeTime: {
      type: String
    },
    currentCurrency:{
      type: String,
	  default: "₽"
    }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// optionsSchema.pre('save', function(next) {
//     var doc = this;
//     console.log('preSave');
//     console.log(doc.OPTIONS);
//     next();
//     // counterOrdersSchema.findByIdAndUpdate({_id: 'entityId'}, {$inc: { seq: 1} }, function(error, counter)   {
//     //     if(error)
//     //         return next(error);
//     //     if(doc.incoming_order_id == false){
//     //       doc.incoming_order_id = counter.seq;
//     //       // doc.transaction_id = counter.seq;
//     //     }
//     //     next();
//     // });
// });
optionsSchema.pre("findOneAndUpdate", async function (next) {
  var tariff = this._update.TARIFF;
  if (!tariff) {
    return next();
  }
  try {
    const docToUpdate = await this.model.findOne(this.getQuery());
    if (tariff == 0) {
      docToUpdate.OPTIONS = {
        0: false, // Меню без корзины и заказов
        1: false, // Меню с Хочу заказать
        2: true, // Вызов персонала
        3: true, // Заказы в заведении
        4: true, // Заказы на доставку / самовывоз
        5: false, // Онлайн оплата
        6: true, // Онлайн бронирование
        7: false, // Типы меню
        8: true, // Отображать вес
        9: true, // Обрезать название
        10: true, // Использовать телеграм бота,
        11: true, // Показывать акции
        12: true // Изменять цвета
      };
    } else if (tariff == 1) {
      docToUpdate.OPTIONS = {
        0: true, // Меню без корзины и заказов
        1: false, // Меню с Хочу заказать
        2: false, // Вызов персонала
        3: false, // Заказы в заведении
        4: false, // Заказы на доставку / самовывоз
        5: false, // Онлайн оплата
        6: false, // Онлайн бронирование
        7: false, // Типы меню
        8: true, // Отображать вес
        9: true, // Обрезать название
        10: false, // Использовать телеграм бота,
        11: false, // Показывать акции
        12: false // Изменять цвета
      };
    } else if (tariff == 2) {
      docToUpdate.OPTIONS = {
        0: false, // Меню без корзины и заказов
        1: true, // Меню с Хочу заказать
        2: false, // Вызов персонала
        3: false, // Заказы в заведении
        4: false, // Заказы на доставку / самовывоз
        5: false, // Онлайн оплата
        6: false, // Онлайн бронирование
        7: false, // Типы меню
        8: true, // Отображать вес
        9: true, // Обрезать название
        10: false, // Использовать телеграм бота,
        11: true, // Показывать акции
        12: true // Изменять цвета
      };
    } else if (tariff == 3) {
      docToUpdate.OPTIONS = {
        0: false, // Меню без корзины и заказов
        1: false, // Меню с Хочу заказать
        2: true, // Вызов персонала
        3: true, // Заказы в заведении
        4: true, // Заказы на доставку / самовывоз
        5: true, // Онлайн оплата
        6: true, // Онлайн бронирование
        7: false, // Типы меню
        8: true, // Отображать вес
        9: true, // Обрезать название
        10: true, // Использовать телеграм бота,
        11: true, // Показывать акции
        12: true // Изменять цвета
      };
    } else if (tariff == 4) {
      docToUpdate.OPTIONS = {
        0: false, // Меню без корзины и заказов
        1: false, // Меню с Хочу заказать
        2: true, // Вызов персонала
        3: true, // Заказы в заведении
        4: true, // Заказы на доставку / самовывоз
        5: true, // Онлайн оплата
        6: true, // Онлайн бронирование
        7: false, // Типы меню
        8: true, // Отображать вес
        9: true, // Обрезать название
        10: true, // Использовать телеграм бота,
        11: true, // Показывать акции
        12: true // Изменять цвета
      };
    } else {
      docToUpdate.OPTIONS = {
        0: true, // Меню без корзины и заказов
        1: false, // Меню с Хочу заказать
        2: false, // Вызов персонала
        3: false, // Заказы в заведении
        4: false, // Заказы на доставку / самовывоз
        5: false, // Онлайн оплата
        6: false, // Онлайн бронирование
        7: false, // Типы меню
        8: true, // Отображать вес
        9: true, // Обрезать название
        10: false, // Использовать телеграм бота,
        11: false, // Показывать акции
        12: false // Изменять цвета
      };
    }
    docToUpdate.save();
    next();
  } catch (error) {
    return next(error);
  }
});

module.exports = mongoose.model('optionsSchema', optionsSchema);
