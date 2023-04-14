const mongoose = require('mongoose');
const moment = require('moment');
const termsSchema = mongoose.model('termsSchema');
const orderSchema = mongoose.model('orderSchema');
const colorsSchema = mongoose.model('colorsSchema');
const tablesSchema = mongoose.model('tablesSchema');
const menuSchema = mongoose.model('menuSchema');
const categoriesSchema = mongoose.model('categoriesSchema');
const salesSchema = mongoose.model('salesSchema');
const userSchema = mongoose.model('userSchema');
const bookingSchema = mongoose.model('bookingSchema');
const telegramUsersSchema = mongoose.model('telegramUsersSchema');

module.exports.appFunctions = {
  getSales: async (data) => {
    moment.locale('ru');
    return new Promise(async (resolve, reject) => {
      var sales = await salesSchema.find({ action: true });
      var dbResult = {};

      if (sales.length == 0)
        dbResult.data = false;
      else {
        dbResult.data = [];
        const result = JSON.parse(JSON.stringify(sales));
        const currentDate = moment().set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString();
        result.map((item) => {
          if (item.dateFinishSales) {
            let dataItem = moment(item.dateFinishSales).set({ hour: 0, minute: 0, second: 0, millisecond: 0 }).toISOString()
            if (dataItem >= currentDate) {
              dbResult.data.push(item);
            }
          }
          else {
            dbResult.data.push(item);
          }
        })
        dbResult.data.map((item) => {
          if (item.dateStartSales) item.dateStartSales = moment(item.dateStartSales).format('LL');
          if (item.dateFinishSales) item.dateFinishSales = moment(item.dateFinishSales).format('LL');
        });

      }
      dbResult.message = 'success';

      resolve(dbResult);
    })
  },
  getOrderById: async (data) => {
    var numberTable = data.numberTable,
      incoming_order_id = data.incoming_order_id,
      result = {
        message: 'error',
        data: false
      };

    return new Promise(async (resolve, reject) => {
      var orders = await orderSchema.find({ incoming_order_id });

      if (!orders.length) {
        resolve(result);
        return;
      }

      result.message = 'success';
      result.data = JSON.parse(JSON.stringify(orders));
      resolve(result);
    });

  },
  getMenuById: async (data) => {
    var incoming_id = data._id;
    var result = {
      message: 'error',
      data: false
    };
    return new Promise(async (resolve, reject) => {
      menuSchema.findById(incoming_id)
        .then((menu) => {
          if(menu){
            result.message = 'success';
            result.data = JSON.parse(JSON.stringify(menu));
          }
          resolve(result);
        })
        .catch((err) => {
          resolve(result);
        })
    })
  },
  getOrders: async (data) => {
    var numberTable = data.numberTable,
      result = {
        message: 'error',
        data: false
      };

    return new Promise(async (resolve, reject) => {
      var orders = await orderSchema.find({ numberTable, hide: false }).sort({ incoming_order_id: -1 });

      if (!orders) {
        resolve(result);
        return;
      }

      result.message = 'success';
      result.data = JSON.parse(JSON.stringify(orders));
      resolve(result);
    });

  },
  getTelegramUsers: async (data) => {
    var telegramBotId = data.telegramBotId,
      result = {
        message: 'error',
        data: false
      };

    if(telegramBotId == undefined)
      resolve(result);

    return new Promise(async (resolve, reject) => {
      const users = await telegramUsersSchema.find({ telegramBotId: telegramBotId });

      if (!users) {
        resolve(result);
        return;
      }

      result.message = 'success';
      result.data = JSON.parse(JSON.stringify(users));
      resolve(result);
    });

  },
  getPersonOrders: async (data) => {
    var idPerson = data.idPerson,
      result = {
        message: 'error',
        data: false
      };

    return new Promise(async (resolve, reject) => {
      var orders = await orderSchema.find({ orderPersonId: idPerson }).sort({ incoming_order_id: -1 });

      if (!orders) {
        resolve(result);
        return;
      }

      result.message = 'success';
      result.data = JSON.parse(JSON.stringify(orders));
      resolve(result);
    });

  },
  getCartTable: async (data) => {
    var numberTable = data.numberTable,
      result = {
        message: 'error',
        data: false,
        numberTable,
      };
    return new Promise(async (resolve, reject) => {
      await tablesSchema.findOne({ numberTable }, function (err, table) {
        if (err) {
          // console.log(err);
          resolve(result);
        } else {
          if (table) {
            result.message = 'success';
            result.data = table.persons;
            resolve(result);
          }
        }
      });
    });
  },
  addPersonName: async (data) => {
    var numberPerson = data.numberPerson,
      numberTable = data.numberTable,
      personName = data.personName,
      result = {
        message: 'error',
        data: false,
        numberPerson,
        numberTable,
      };

    return new Promise(async (resolve, reject) => {
      var table = await tablesSchema.findOne({ numberTable });


      if (!table) {
        var table = new tablesSchema({
          numberTable,
          actionTime: new Date(),
          persons: []
        });
      }

      var tablePerson = await tablesSchema.findOne({ numberTable, 'persons.id': numberPerson });

      if (!tablePerson) {
        table.persons.push({
          id: numberPerson,
          personName: personName
        });
      }
      table.save(function (err, doc) {
        if (err) {
          result.message = 'error';
          result.data = err;
          resolve(result);
        } else {
          result.message = 'success';
          result.data = personName;
          resolve(result);
        }
      });
    });
  },
  addBooking: async (data) => {
    var result = {
      message: 'error',
      data: false,
    };
    if (data == undefined) {
      resolve(false);
    }
    return new Promise(async (resolve, reject) => {
      bookingSchema.create(data)
        .then((result) => resolve({
          message: 'success',
          data: true,
        }))
        .catch((e) => resolve({
          message: 'error',
          data: e,
        }))
    });
  },
  checkNamePerson: async (data) => {
    var numberPerson = data.numberPerson,
      numberTable = data.numberTable,
      result = {
        message: 'error',
        data: false,
        numberPerson,
        numberTable,
      };

    return new Promise((resolve, reject) => {
      tablesSchema.findOne({ numberTable, 'persons.id': numberPerson }, function (err, tablePersons) {
        if (err) {
          resolve(result);
        } else {
          if (tablePersons) {
            for (var i = 0; i < tablePersons.persons.length; i++) {
              if (tablePersons.persons[i].id == numberPerson) {
                result.message = 'success';
                result.data = tablePersons.persons[i].personName;
              }
            }
          }
          resolve(result);
        }
      });
    });
  },
  checkCartPerson: async (data) => {
    var numberPerson = data.numberPerson,
      numberTable = data.numberTable,
      result = {
        message: 'error',
        data: false,
        numberPerson,
      };

    return new Promise((resolve, reject) => {
      tablesSchema.findOne({ numberTable }, function (err, table) {
        if (err) {
          resolve({ message: 'error', data: false });
        } else {
          if (table) {
            var tablePerson = table.persons.filter(function (person) {
              return person.id == numberPerson;
            }).pop();
            if (tablePerson) {
              result.message = 'success';
              result.data = tablePerson.products;
            }
          }
          resolve(result);
        }
      });
    });
  },
  getProducts: async (data) => {
    var find = { id_category: mongoose.Types.ObjectId(data.categoryId), active: true };

    return new Promise(async (resolve, reject) => {
      var menu = await menuSchema.find(find).sort({ sort: -1 });
      var dbResult = {};
      menu = JSON.parse(JSON.stringify(menu));

      if (menu.length == 0)
        dbResult.data = false;
      else {
        if (data.arIdsProducts.length > 0) {
          for (var i = 0; i < menu.length; i++) {
            if (global.CONFIG_APP.OPTIONS[9] === true) {
              var sliced = menu[i].title.slice(0, 25);
              if (sliced.length < menu[i].title.length) {
                sliced += '...';
              }
              menu[i].shortTitle = sliced;
            } else {
              menu[i].shortTitle = menu[i].title;
            }
            // var count = data.arIdsProducts.find(prod => prod._id == menu[i]._id);
            var arCounts = data.arIdsProducts.filter(prod => prod._id == menu[i]._id);
            var count = 0;
            for (var j = 0; j < arCounts.length; j++) {
              count += arCounts[j].count;
            }
            if (count != 0) {
              menu[i].countInCart = count;
            } else {
              menu[i].countInCart = 0;
            }
            if (menu[i].img == '')
              menu[i].img = '/assets/images/no_photo.png';
          }
        } else {
          for (var i = 0; i < menu.length; i++) {
            if (global.CONFIG_APP.OPTIONS[9] === true) {
              var sliced = menu[i].title.slice(0, 25);
              if (sliced.length < menu[i].title.length) {
                sliced += '...';
              }
              menu[i].shortTitle = sliced;
            } else {
              menu[i].shortTitle = menu[i].title;
            }
            if (menu[i].img == '')
              menu[i].img = '/assets/images/no_photo.png';
          }
        }
        dbResult.data = menu;
      }
      dbResult.message = 'success';
      resolve(dbResult);
      // collection.find(find).sort({ sort: -1 }).toArray(function (err, promResult) {
      //   var dbResult = {};
      //
      //   if (err) {
      //     dbResult.data = false;
      //     dbResult.message = 'error';
      //     resolve(dbResult);
      //   }
      //
      //   if(promResult.length == 0)
      //     dbResult.data = false;
      //   else{
      //     if(data.arIdsProducts.length > 0){
      //       for (var i = 0; i < promResult.length; i++) {
      //         if(global.CONFIG_APP.OPTIONS[9] === true){
      //           var sliced = promResult[i].title.slice(0,25);
      //     			if (sliced.length < promResult[i].title.length) {
      //     				sliced += '...';
      //     			}
      //           promResult[i].shortTitle = sliced;
      //         } else {
      //           promResult[i].shortTitle = promResult[i].title;
      //         }
      //         var count = data.arIdsProducts.find(prod => prod.id == promResult[i].id);
      //         if(count != undefined){
      //           promResult[i].countInCart = count.count;
      //         } else {
      //           promResult[i].countInCart = 0;
      //         }
      //       }
      //     } else {
      //       for (var i = 0; i < promResult.length; i++) {
      //         if(global.CONFIG_APP.OPTIONS[9] === true){
      //           var sliced = promResult[i].title.slice(0,25);
      //     			if (sliced.length < promResult[i].title.length) {
      //     				sliced += '...';
      //     			}
      //           promResult[i].shortTitle = sliced;
      //         } else {
      //           promResult[i].shortTitle = promResult[i].title;
      //         }
      //       }
      //     }
      //     dbResult.data = promResult;
      //   }
      //   dbResult.message = 'success';
      //   resolve(dbResult);
      // });
    });
  },
  getCategories: async (data) => {
    var find = { active: true };

    if (global.CONFIG_APP.OPTIONS[6] === true && typeof data.typeMenuId != 'undefined')
      find = { type_menu: data.typeMenuId };

    if (data.findParent == true)
      find.parent_id = null;

    if (data.parentId)
      find.parent_id = mongoose.Types.ObjectId(data.parentId);

    return new Promise(async (resolve, reject) => {
      var categories = await categoriesSchema.find(find).sort({ sort: -1 });

      var dbResult = {};

      if (categories.length == 0)
        dbResult.data = false;
      else
        dbResult.data = JSON.parse(JSON.stringify(categories));
      dbResult.message = 'success';

      resolve(dbResult);

      // collection.find(find).sort({ sort: -1 }).toArray(function (err, promResult) {
      //   var dbResult = {};
      //
      //   if (err) {
      //     dbResult.data = false;
      //     dbResult.message = 'error';
      //     resolve(dbResult);
      //   }
      //
      //   if(promResult.length == 0)
      //     dbResult.data = false;
      //   else
      //     dbResult.data = promResult;
      //   dbResult.message = 'success';
      //
      //   resolve(dbResult);
      // })
    });
  },
  getRestTerms: async() => {
    return new Promise(async(resolve, reject) => {
      await termsSchema.findById('entityId', async function(err, result){
        if(err){
          console.error(err);
          resolve(false);
        }
        // resolve({JURY_ADDRESS, PHYSICAL_ADDRESS,PHONE_NUMBER,EMAIL_ADDRESS,BANK_DETAILS});
        resolve(result);
      });
    })
  },
  getLoadImage: async(data) =>{
      return new Promise(async (resolve, reject) => {
        await colorsSchema.findById('entityId', async function (err, result) {
          if (err) {
            console.log(err);
            resolve(false);
          }
          resolve(result.USE_LOADER_IMG);
        });
      })
  },
  getLoadUrlImage: async(data) =>{
      return new Promise(async (resolve, reject) => {
        await optionsSchema.findById('entityId', async function (err, result) {
          if (err) {
            console.log(err);
            resolve(false);
          }
          resolve(result.url);
        });
      })
  },
  checkAuthentication: (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      if(req.query.numberTable == undefined){
          res.redirect("/person-sign-in");
      } else {
        res.redirect("/person-sign-in?numberTable=" + req.query.numberTable);
      }
    }
  },
  savePerson: async (data) => {
    var result = {
      message: 'error',
      data: false
    };

    if (data.params == undefined || data.params.phone == '') {
      return false;
    }

    return new Promise(async (resolve, reject) => {
      await userSchema.findByIdAndUpdate(data.idPerson, data.params, async function (err, doc) {
        if (err) {
          console.log(err);
          resolve(false);
        }
        resolve(true);
      });
    });
  },
  getPersonInfo: async (data) => {
    var idPerson = data.idPerson,
      result = {
        message: 'error',
        data: false
      };

    return new Promise(async (resolve, reject) => {
      var person = await userSchema.findById(idPerson).lean();

      if (!person) {
        resolve(result);
        return;
      }

      result.message = 'success';
      result.data = person;
      resolve(result);
    });
  }
}
function formatDate(date) {

  var dd = date.getDate();
  if (dd < 10) dd = '0' + dd;

  var mm = date.getMonth() + 1;
  if (mm < 10) mm = '0' + mm;

  var yy = date.getFullYear() % 100;
  if (yy < 10) yy = '0' + yy;

  return dd + '.' + mm + '.' + yy;
};
