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
      title: 'Интеграция базы данных из Iiko',
      layout: 'adminLayout',
      today: moment().format('YYYY-MM-DD'),
      setting: global.CONFIG_APP,
      integrationWithIiko: false
    };
  pageOptions.showApiLoginFromIiko = pageOptions.setting.isIntegrationWithIiko;
  pageOptions.NameIiko = pageOptions.setting.NameIiko;
  res.render('admin_start_iiko', pageOptions);
});
routes.post('/', adminFunctions.checkAuthentication, async (req, res) => {

  pageOptions = {
    title: 'Подтвердите свои данные для интеграции с Iiko',
    layout: 'adminLayout',
    today: moment().format('YYYY-MM-DD'),
    setting: global.CONFIG_APP,
    jsonDataError: [],
    jsonDataIs: true,
    integrationWithIiko: false
  };
  const result = await iikoFunctions.getToken({ apiLogin: req.body.NameIiko });
  if (result.success) {
    optionsSchema.findOneAndUpdate({ _id: 'entityId' }, req.body, async function (err, doc) {
      if (err) {
        console.log(err);
      }
      else {
        await adminFunctions.sleep(100);
      }
    });
    const apiToken = result.token;
    if (req.body.NameRestaurant) {
      const resultId = await iikoFunctions.getOrganizationsFromIikoByNameRestaurant({ nameRestaurant: req.body.NameRestaurant, apiToken: apiToken });
      if (resultId.success) {
        const resultMenu = await iikoFunctions.getMenuFromIiko({ apiToken: apiToken, idRestaurant: resultId.id_restaurant });
        if (resultMenu.success) {
          pageOptions.title = "Интеграция прошла успешна - база импортирована из Iiko";
          pageOptions.integrationWithIiko = true;
          pageOptions.jsonDataError = await iikoFunctions.importMenuFromIiko(resultMenu);
        }
      }
    }
    else {
      const resultRequestOrganizations = await iikoFunctions.getOrganizationsFromIiko({ apiToken: apiToken });
      if (resultRequestOrganizations.success) {
        if (resultRequestOrganizations.arrayOrganizations.length === 1) {
          pageOptions.NameRestaurant = resultRequestOrganizations.arrayOrganizations[0].name;
          pageOptions.ShowNameRestaurantFromIiko = true;
        }
        else if (resultRequestOrganizations.arrayOrganizations.length > 1) {
          pageOptions.ShowNameOrganizations = true;
          pageOptions.restaurants = resultRequestOrganizations.arrayOrganizations;
        }
        else {
          pageOptions.message = {
            success: false,
            error: true,
            text: 'Произошла ошибка при интеграции - отсутствует организация'
          };
        }
      }
    }
  }
  else {
    pageOptions.message = {
      success: false,
      error: true,
      text: 'Произошла ошибка при интеграции - неверный apiLogin'
    };
  }
  pageOptions.setting = global.CONFIG_APP;
  pageOptions.showApiLoginFromIiko = pageOptions.setting.isIntegrationWithIiko;
  pageOptions.NameIiko = pageOptions.setting.NameIiko;
  res.render('admin_start_iiko', pageOptions);
});

module.exports = routes;
