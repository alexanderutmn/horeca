const express = require('express');
const moment = require('moment');
const { adminFunctions } = require('../../functions/adminFunctions');
const { iikoFunctions } = require('../../route/api');
const { v4: uuidv4 } = require('uuid');
const mongoose = require('mongoose');
const optionsSchema = mongoose.model('optionsSchema');
const app = express();
const routes = require('express').Router();


routes.get('/', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    categoriesFind = {},
    pageOptions = {
      title: 'Импорт меню из Iiko',
      layout: 'adminLayout',
      today: moment().format('YYYY-MM-DD'),
      setting: global.CONFIG_APP,
    };
  pageOptions.NameRestaurant = pageOptions.setting.NameRestaurant;
  pageOptions.NameIiko = pageOptions.setting.NameIiko;
  res.render('admin_importmenu_from_iiko', pageOptions);
});
routes.post('/', adminFunctions.checkAuthentication, async (req, res) => {

  pageOptions = {
    title: 'Вы обновили меню из Iiko',
    layout: 'adminLayout',
    today: moment().format('YYYY-MM-DD'),
    setting: global.CONFIG_APP,
    jsonDataError: [],
    jsonDataIs: true
  };
  if (req.body.enableLoadingDataFromIiko) {
    if (pageOptions.setting.NameIiko && pageOptions.setting.NameRestaurant) {
      const result = await iikoFunctions.getToken({ apiLogin: pageOptions.setting.NameIiko });
      if (result.success) {
        const apiToken = result.token;
        optionsSchema.findOneAndUpdate({ _id: 'entityId' }, req.body, async function (err, doc) {
          if (err) {
            console.log(err);
          }
          else {
            await adminFunctions.sleep(100);
          }
        });
        const resultId = await iikoFunctions.getOrganizationsFromIikoByNameRestaurant({ nameRestaurant: pageOptions.setting.NameRestaurant, apiToken: apiToken });
        if (resultId.success) {
          const resultMenu = await iikoFunctions.getMenuFromIiko({ apiToken: apiToken, idRestaurant: resultId.id_restaurant });
          if (resultMenu.success) {
            pageOptions.jsonDataError = await iikoFunctions.importMenuFromIiko(resultMenu);
          }
        }
      }
    }
    else {
      pageOptions.message = {
        success: false,
        error: true,
        text: 'Сначало надо сделать первоначальную интеграцию с Iiko в настройках'
      };
    }

  }
  else {
    pageOptions.message = {
      success: false,
      error: true,
      text: 'Вы не поставили галочку для старта обновления меню'
    };
  }
  res.render('admin_importmenu_from_iiko', pageOptions);

});

module.exports = routes;
