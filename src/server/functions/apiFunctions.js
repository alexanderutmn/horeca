const mongoose = require('mongoose');
const moment = require('moment');
const telegramUsersSchema = mongoose.model('telegramUsersSchema');
const orderSchema = mongoose.model('orderSchema');
const tablesSchema = mongoose.model('tablesSchema');
const menuSchema = mongoose.model('menuSchema');
const categoriesSchema = mongoose.model('categoriesSchema');

module.exports.apiFunctions = {
  getProducts: async (data) => {
    var result = {
				  message: 'error',
				  data: false
			  },
        find = { };

    return new Promise(async (resolve, reject) => {
      var products = await menuSchema.find(find).sort({ sort: -1 }).populate('id_category');

  		if (!products.length) {
  			resolve(false);
        return;
  		}

  		resolve(JSON.parse(JSON.stringify(products)));
    });
  },
  getCategories: async (data) => {
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
  }
}
