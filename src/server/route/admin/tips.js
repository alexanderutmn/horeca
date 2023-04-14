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
      title: 'Настройка чаевых',
      layout: 'adminLayout',
      today: moment().format('YYYY-MM-DD'),
      setting: global.CONFIG_APP,
    };

    if (global.CONFIG_APP.OPTIONS[12] !== true) {
      res.render('admin_access_denied', pageOptions);
      return;
    }

  res.render('admin_tips', pageOptions);
});
routes.post('/', adminFunctions.checkAuthentication, async (req, res) => {
  var pageOptions = {
    title: 'Настройка чаевых',
    layout: 'adminLayout',
    today: moment().format('YYYY-MM-DD'),
    setting: global.CONFIG_APP,
  };

  if (global.CONFIG_APP.OPTIONS[12] !== true) {
    res.render('admin_access_denied', pageOptions);
    return;
  }

  if(req.body.enableTips == undefined)
    req.body.enableTips = false;

  if(req.body.enableTips == 'true' && req.body.tipsLayoutID == ''){
    pageOptions.message = {
     error: true,
     text: 'Укажите Layout ID'
   };
   res.render('admin_tips', pageOptions);
 } else {
   if(adminFunctions.saveOptions({params: req.body})){
     setTimeout(function () {
       res.redirect('/admin/tips/');
     }, 1000);
   } else {
     pageOptions.message = {
      error: true,
      text: 'Попробуйте позже'
    };
    res.render('admin_tips', pageOptions);
   }
 }
});

module.exports = routes;
