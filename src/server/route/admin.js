const express = require('express');
const moment = require('moment');
const { adminFunctions } = require('../functions/adminFunctions');
const md5 = require('md5');
const passport = require('passport');
const mongoose = require('mongoose');
const userSchema = mongoose.model('userSchema');
const optionsSchema = mongoose.model('optionsSchema');

const routes = require('express').Router();
const routeAdminMenu = require('./admin/menu.js');
const routeAdminCategories = require('./admin/categories.js');
const routeAdminSales = require('./admin/sales.js');
const routeAdminModifiers = require('./admin/modifiers.js');
const routeAdminModifiersCategories = require('./admin/modifiers-categories.js');
const routeAdminPersonalizatsiya = require('./admin/personalizatsiya.js');
const routeAdminOrders = require('./admin/orders.js');
const routeAdminImportMenu = require('./admin/importmenu.js');
const routeAdminImportMenuFromIiko = require('./admin/importmenu-from-iiko.js');
const routeAdminStartIiko = require('./admin/start-iiko.js');
const routeAdminPayment = require('./admin/payment.js');
const routeAdminTips = require('./admin/tips.js');
const routeAdminBooking = require('./admin/booking.js');
const routeAdminTerms = require('./admin/terms.js');
const routeAdminUsers = require('./admin/users.js');

routes.get('/', adminFunctions.checkAuthentication, async (req, res) => {
  res.redirect('/admin/menu/');
});

routes.use('/menu', routeAdminMenu);
routes.use('/categories', routeAdminCategories);
routes.use('/sales', routeAdminSales);
routes.use('/modifiers', routeAdminModifiers);
routes.use('/modifiers-categories', routeAdminModifiersCategories);
routes.use('/personalizatsiya', routeAdminPersonalizatsiya);
routes.use('/orders', routeAdminOrders);
routes.use('/importmenu', routeAdminImportMenu);
routes.use('/importmenu-from-iiko', routeAdminImportMenuFromIiko);
routes.use('/start-iiko', routeAdminStartIiko);
routes.use('/payment', routeAdminPayment);
routes.use('/tips', routeAdminTips);
routes.use('/booking', routeAdminBooking);
routes.use('/terms', routeAdminTerms);
routes.use('/users', routeAdminUsers);

routes.get('/telegram', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    categoriesFind = {},
    pageOptions = {
      title: 'Телеграм Бот',
      layout: 'adminLayout',
      today: moment().format('YYYY-MM-DD'),
      telegramBotId: global.CONFIG_APP.telegramBotId,
      telegramBotName: global.CONFIG_APP.telegramBotName,
      waiterCode: global.CONFIG_APP.waiterCode,
      adminCode: global.CONFIG_APP.adminCode,
      setting: global.CONFIG_APP,
    }

    if (global.CONFIG_APP.OPTIONS[3] !== true || global.CONFIG_APP.OPTIONS[4] !== true) {
      res.render('admin_access_denied', pageOptions);
      return;
    }

    res.render('admin_telegram', pageOptions);


});

routes.post('/signup', function (req, res, next) {
  console.log('registering user');

  if (req.query.key != 'a9408b7becd5e96bf344de7138b24dc4027a7332afd3992d4e4925d807c5ad4a93c96d13c3813161c6b6739154733285493d196898f9a9d6d601b4120e6e9711' ||
    req.query.username == '' || req.query.password == '' || req.body.auth.domain != 'vls-company.bitrix24.ru') {
    console.log('EEEEERRRRRROR');
    return;
  }

  optionsSchema.findById('entityId', function (err, result) {
    if (!err) {
      if (result) {
        result.SEO.url = 'http://' + req.query.username + '.easyqr.ru';
        result.SEO.title = req.query.titleRest + ' | Easy QR | Электронное меню';
        result.SEO.keywords = req.query.titleRest + ', Электронное меню, меню, Easy QR, VLS, QR, qr код, qr меню, создать qr код, бесплатный qr код, кафе, ресторан';
        result.TITLE_REST = req.query.titleRest;
        result.markModified('SEO');
        result.save();
      }
    }
  });

  userSchema.register(new userSchema({ username: req.query.username, phone: 'empty', isAdmin: true }), req.query.password, function (err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }

    console.log('user registered!');

    // res.redirect('/admin/signin');
  });
});
routes.get('/signin', function (req, res) {
  var pageOptions = {
    layout: 'enterLayout',
    user: req.user,
    message: req.flash('error'),
    title: 'Авторизация'
  };
  if(req.isAuthenticated() && req.user.isAdmin){
    res.redirect('/admin/menu/');
  }
  res.render('enter_signin', pageOptions);
});
routes.post('/signin', passport.authenticate('local', { failureRedirect: '/admin/signin', failureFlash: true }), function (req, res) {
  res.redirect('/admin/menu/');
});
routes.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/admin/signin');
});

routes.get('/qr-code', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    categoriesFind = {},
    pageOptions = {
      title: 'Генерация QR кода',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
      today: moment().format('YYYY-MM-DD'),
      url: global.CONFIG_APP.SEO.url,
      tables: [],
      titleTable: global.CONFIG_APP.TITLE_TABLE
    };

  if (global.CONFIG_APP.OPTIONS[3] == true) {
    for (var i = 0; i < global.CONFIG_APP.COUNT_TABLE; i++) {
      pageOptions.tables.push({ number: i + 1, hash: md5(i), title: global.CONFIG_APP.TITLE_TABLE });
    }
  }
  res.render('admin_qr_code', pageOptions);
});
routes.get('/changetitletable', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req);
  pageOptions = {
    setting: global.CONFIG_APP,
  };
  optionsSchema.updateOne({ _id: 'entityId' }, { $set: { TITLE_TABLE: req.query.TITLE_TABLE } }, async function (err, doc) {
    if (err) {
      console.log(err);
    }
    setTimeout(function () {
      res.redirect('/admin/qr-code');
    }, 1000);
  });


});


routes.get('/settings', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    categoriesFind = {},
    pageOptions = {
      title: 'Настройки',
      layout: 'adminLayout',
      today: moment().format('YYYY-MM-DD'),
      setting: global.CONFIG_APP
    };

  if (req.query.isAdmin == '5712457124') {
    pageOptions.isIntegrationWithIiko = pageOptions.setting.isIntegrationWithIiko ? 'checked' : '';
    pageOptions.enableDishesQr = pageOptions.setting.enableDishesQr ? 'checked' : '';
    res.render('admin_settings_pro', pageOptions);
  } else {
    pageOptions.showDeliveryOptions = global.CONFIG_APP.OPTIONS[4] == true;
    pageOptions.setting.enableDelivery = pageOptions.setting.enableDelivery ? 'checked' : '';
    pageOptions.setting.enablePickup = pageOptions.setting.enablePickup ? 'checked' : '';
    pageOptions.setting.enableInHall = pageOptions.setting.enableInHall ? 'checked' : '';
    pageOptions.setting.enableBooking = pageOptions.setting.enableBooking ? 'checked' : '';
    res.render('admin_settings', pageOptions);
  }
});
routes.post('/settings', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    categoriesFind = {},
    pageOptions = {
      title: 'Настройки',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
      today: moment().format('YYYY-MM-DD')
    };
  if (req.query.isAdmin != '5712457124' && req.body.enableDelivery != 'true' && req.body.enablePickup != 'true' && global.CONFIG_APP.OPTIONS[4] == true) {
    pageOptions.message = {
      error: true,
      text: 'Вы не указали способы доставки'
    }
    pageOptions.setting = global.CONFIG_APP;
    pageOptions.setting.enableDelivery = pageOptions.setting.enableDelivery ? 'checked' : '';
    pageOptions.setting.enableInHall = pageOptions.setting.enableInHall ? 'checked' : '';
    pageOptions.setting.enablePickup = pageOptions.setting.enablePickup ? 'checked' : '';
    res.render('admin_settings', pageOptions);
    return;
  }
  if (req.query.isAdmin != '5712457124') {
    if (req.body.enableDelivery != 'true') req.body.enableDelivery = false;
    if (req.body.enableInHall != 'true') req.body.enableInHall = false;
    if (req.body.enablePickup != 'true') req.body.enablePickup = false;
    if (req.body.enableBooking != 'true') req.body.enableBooking = false;
  }
  if (req.query.isAdmin === '5712457124') {
    if (req.body.isIntegrationWithIiko != 'true') req.body.isIntegrationWithIiko = false;
    if (req.body.enableDishesQr != 'true') req.body.enableDishesQr = false;
  }
  if(adminFunctions.saveOptions({params: req.body})){
    setTimeout(function () {
      res.redirect('/admin/settings/');
    }, 1000);
  } else {
    pageOptions.message = {
     error: true,
     text: 'Попробуйте позже'
   };
   res.render('admin_settings', pageOptions);
  }
});

module.exports = routes;
