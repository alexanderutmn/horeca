const mongoose = require('mongoose');
const moment = require('moment');
const { resolve } = require('q');
const menuSchema = mongoose.model('menuSchema');
const eventButtonsSchema = mongoose.model('eventButtonsSchema');
const categoriesSchema = mongoose.model('categoriesSchema');
const orderSchema = mongoose.model('orderSchema');
const salesSchema = mongoose.model('salesSchema');
const optionsDataTableSchema = mongoose.model('optionsDataTableSchema');
const categoriesModifiersSchema = mongoose.model('categoriesModifiersSchema');
const modifiersSchema = mongoose.model('modifiersSchema');
const optionsSchema = mongoose.model('optionsSchema');
const userSchema = mongoose.model('userSchema');
const bookingSchema = mongoose.model('bookingSchema');
var http = require('http');
var querystring = require('querystring');

module.exports.adminFunctions = {
  addCategory: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.params == undefined) {
      resolve(false);
    }

    if (data.params.parent_id == '#')
      data.params.parent_id = null;

    return new Promise(async (resolve, reject) => {
      var result = new categoriesSchema(data.params);
      await result.save();
      if (result) {
        resolve(result);
      } else {
        resolve(false);
      }
    });
  },
  addCategoryFromFile: async (data) => {
    if (data == undefined) {
      resolve(false);
    }
    return new Promise(async (resolve, reject) => {
      categoriesSchema.create(data)
        .then((result) => resolve(result))
        .catch((e) => reject(e))
    });
  },
  addCategoryModifiersFromIiko: async (data) => {
    if (data == undefined) {
      resolve(false);
    }
    return new Promise(async (resolve, reject) => {
      categoriesModifiersSchema.create(data)
        .then((result) => resolve(result))
        .catch((e) => reject(e))
    });
  },
  addCategoryModifiers: async (data) => {
    if (data == undefined) {
      resolve(false);
    }
    if (data.parent_id == '#')
      data.parent_id = null;

    return new Promise(async (resolve, reject) => {
      categoriesModifiersSchema.create(data)
        .then((result) => resolve(result))
        .catch((e) => reject(e))
    });
  },
  addModifiers: async (data) => {
    if (data == undefined) {
      resolve(false);
    }
    if (data.id_category == '#')
      data.id_category = undefined;
    return new Promise(async (resolve, reject) => {
      modifiersSchema.create(data)
        .then((result) => resolve(result))
        .catch((e) => reject(e))
    });
  },
  updateCategory: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.idCategory == undefined || data.params == undefined) {
      resolve(false);
    }

    if (data.params.parent_id == '#')
      data.params.parent_id = null;

    return new Promise(async (resolve, reject) => {
      var result = await categoriesSchema.findByIdAndUpdate(data.idCategory, data.params, async function (err, doc) {
        if (err) {
          console.log(err);
          resolve(false);
        }
      });
      resolve(true);
    });
  },
  updateModifiersCategory: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.idCategory == undefined || data.params == undefined) {
      resolve(false);
    }

    if (data.params.parent_id == '#')
      data.params.parent_id = null;
    return new Promise(async (resolve, reject) => {
      var result = await categoriesModifiersSchema.findByIdAndUpdate(data.idCategory, data.params, async function (err, doc) {
        if (err) {
          console.log(err);
          resolve(false);
        }
      });
      resolve(true);
    });
  },
  updateModifiers: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.idModifier == undefined || data.params == undefined) {
      resolve(false);
    }
    if (data.params.id_category == '#')
      data.params.id_category = null;

    return new Promise(async (resolve, reject) => {
      var result = await modifiersSchema.findByIdAndUpdate(data.idModifier, data.params, async function (err, doc) {
        if (err) {
          console.log(err);
          resolve(false);
        }
      });
      resolve(true);
    });
  },
  addProduct: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.params == undefined) {
      resolve(false);
    }

    return new Promise(async (resolve, reject) => {
      var result = new menuSchema(data.params);
      if (data.isImg) {
        result.img = '/assets/images/product-images/' + md5(result._id) + path.extname(fileName);
      }
      await result.save();
      if (result) {
        resolve(result);
      } else {
        resolve(false);
      }
    });
  },
  addProductFromFile: async (data) => {
    if (data == undefined) {
      resolve(false);
    }
    return new Promise(async (resolve, reject) => {
      menuSchema.create(data)
        .then((result) => resolve(result))
        .catch((e) => reject(e))

    });
  },
  addModifierFromIiko: async (data) => {
    if (data == undefined) {
      resolve(false);
    }
    return new Promise(async (resolve, reject) => {
      modifiersSchema.create(data)
        .then((result) => resolve(result))
        .catch((e) => reject(e))

    });
  },
  addSales: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.params == undefined) {
      resolve(false);
    }
    if (data.params.dateFinishSales) {
      const dateFinish = data.params.dateFinishSales.split(" ");
      dateFinish[1] = switchMonth(dateFinish[1]);
      data.params.dateFinishSales = new Date(dateFinish[2], dateFinish[1], dateFinish[0]);
    }
    if (data.params.dateStartSales) {
      const dateStart = data.params.dateStartSales.split(" ");
      dateStart[1] = switchMonth(dateStart[1]);
      data.params.dateStartSales = new Date(dateStart[2], dateStart[1], dateStart[0]);
    }
    return new Promise(async (resolve, reject) => {
      var result = new salesSchema(data.params);
      if (data.isImage) {
        result.image = '/assets/images/sales-images/' + md5(result._id) + path.extname(fileName);
      }
      await result.save();
      if (result) {
        resolve(result);
      } else {
        resolve(false);
      }
    });
  },
  addUser: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.params == undefined) {
      resolve(result);
    }
    return new Promise(async (resolve, reject) => {

      userSchema.register(new userSchema({ username: data.params.userName }), data.params.userPassword, function (err) {
        if (err) {
          console.log(err);
          result.message = err;
          resolve(result);
        } else {
          result = {
            message: 'success',
            data: true
          };
          resolve(result);
        }
      });
    });
  },
  updateUser: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.id == undefined || data.params == undefined) {
      resolve(false);
    }

    /* Добавить проверку обновления пароля  */

    if(true){
      var result = await userSchema.findByIdAndUpdate(data.id, data.params, async function (err, doc) {
        if (err) resolve(false);
      });

      if (result) {
        resolve(result);
      } else {
        resolve(false);
      }
    } else {
      await userSchema.findByIdAndUpdate(data.id, data.params, async function (err, user) {
        if (err) resolve(false);
        user.setPassword('password', (err,user) => {
  				 if(err) console.log(err);
  				 user.save();
           if (result) {
             resolve(result);
           } else {
             resolve(false);
          }
  			});
      });
    }
  },
  updateSales: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.id == undefined || data.params == undefined) {
      resolve(false);
    }
    if (data.params.dateFinishSales) {
      const dateFinish = data.params.dateFinishSales.split(" ");
      dateFinish[1] = switchMonth(dateFinish[1]);
      data.params.dateFinishSales = new Date(dateFinish[2], dateFinish[1], dateFinish[0]);
    }
    if (data.params.dateStartSales) {
      const dateStart = data.params.dateStartSales.split(" ");
      dateStart[1] = switchMonth(dateStart[1]);
      data.params.dateStartSales = new Date(dateStart[2], dateStart[1], dateStart[0]);
    }
    return new Promise(async (resolve, reject) => {
      var result = await salesSchema.findByIdAndUpdate(data.id, data.params, async function (err, doc) {
        if (err) resolve(false);
      });


      if (data.isImage) {
        result.image = '/assets/images/sales-images/' + md5(result._id) + path.extname(fileName);
      }
      await result.save();
      if (result) {
        resolve(result);
      } else {
        resolve(false);
      }
    });
  },
  updateProduct: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.idProduct == undefined || data.params == undefined) {
      resolve(false);
    }
    return new Promise(async (resolve, reject) => {
      var result = await menuSchema.findByIdAndUpdate(data.idProduct, data.params, async function (err, doc) {
        if (err) resolve(false);
      });
      resolve(true);
    });
  },
  getAllOrders: async (data) => {
    var result = {
      message: 'error',
      data: false
    },
      find = {};

    if (data.getOrderFromDate != undefined && data.getOrderToDate != undefined) {
      find.createdAt = { $gte: new Date(data.getOrderFromDate), $lte: moment(data.getOrderToDate, 'YYYY-MM-DD').endOf('day') };
    }
    if (data.getOrderByStatus != undefined) {
      find.orderStatus = data.getOrderByStatus;
    }

    return new Promise(async (resolve, reject) => {
      var orders = await orderSchema.find(find).sort({ incoming_order_id: -1 });

      if (!orders.length) {
        resolve(result);
        return;
      }

      result.message = 'success';
      result.data = JSON.parse(JSON.stringify(orders));
      resolve(result);
    });

  },
  getUserById: async (data) => {
    var idUser = data.idUser,
      result = {
        message: 'error',
        data: false
      };

    return new Promise(async (resolve, reject) => {
      var user = await userSchema.findOne({ _id: idUser }).lean();

      if (!user) {
        resolve(result);
        return;
      }

      result.message = 'success';
      result.data = user;
      resolve(result);
    });

  },
  getOrderByIdAdmin: async (data) => {
    var incoming_order_id = data.incoming_order_id,
      result = {
        message: 'error',
        data: false
      };

    return new Promise(async (resolve, reject) => {
      var orders = await orderSchema.findOne({ incoming_order_id }).lean().populate('orderProducts.array_modification');

      if (!orders) {
        resolve(result);
        return;
      }

      result.message = 'success';
      // result.data = JSON.parse(JSON.stringify(orders));
      result.data = orders;
      resolve(result);
    });

  },
  getAllProducts: async (data) => {
    var result = {
      message: 'error',
      data: false
    },
      find = {};

    if (data.getOrderByCategory != undefined) {
      find.id_category = data.getOrderByCategory;
    }

    if (data.getProductByCategory != undefined) {
      find.id_category = data.getProductByCategory;
    }

    return new Promise(async (resolve, reject) => {
      var products = await menuSchema.find(find).sort({ sort: -1 }).populate('id_category');

      if (!products.length) {
        resolve(false);
        return;
      }

      resolve(JSON.parse(JSON.stringify(products)));
    });

  },
  getAllCategories: async (data) => {
    var result = {
      message: 'error',
      data: false
    },
      find = {};

    return new Promise(async (resolve, reject) => {
      var categories = await categoriesSchema.find(find).sort({ sort: -1 }).populate('parent_id');

      if (!categories.length) {
        resolve(false);
        return;
      }

      resolve(JSON.parse(JSON.stringify(categories)));
    });

  },
  getAllModifiersCategories: async (data) => {
    var result = {
      message: 'error',
      data: false
    },
      find = {};

    return new Promise(async (resolve, reject) => {
      var categories = await categoriesModifiersSchema.find(find).sort({ sort: -1 }).populate('parent_id');
      if (!categories.length) {
        resolve(false);
        return;
      }

      resolve(JSON.parse(JSON.stringify(categories)));
    });

  },
  getAllModifiers: async (data) => {
    var result = {
      message: 'error',
      data: false
    },
      find = {};

    return new Promise(async (resolve, reject) => {
      var modifiers = await modifiersSchema.find(find).sort({ sort: -1 }).populate('parent_id');
      if (!modifiers.length) {
        resolve(false);
        return;
      }

      resolve(JSON.parse(JSON.stringify(modifiers)));
    });

  },
}
function switchMonth(date) {
  switch (date) {
    case "января": date = 0; break;
    case "февраля": date = 1; break;
    case "марта": date = 2; break;
    case "апреля": date = 3; break;
    case "мая": date = 4; break;
    case "июня": date = 5; break;
    case "июля": date = 6; break;
    case "августа": date = 7; break;
    case "сентября": date = 8; break;
    case "октября": date = 9; break;
    case "ноября": date = 10; break;
    case "декабря": date = 11; break;
  };
  return date
};
