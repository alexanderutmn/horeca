const path = require('path');
const express = require('express');
const { adminFunctions } = require('../../functions/adminFunctions');
const fs = require('fs');
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid');
const sharp = require('sharp');
const multer = require('multer');
const uploadMem = multer({ storage: multer.memoryStorage() });
const uploadColorsFile = uploadMem.fields([{ name: 'LOAD_IMG' }, { name: 'BACKGROUND_IMAGE' }]);
const app = express();
const routes = require('express').Router();

routes.get('/delete/:id', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    idSales = req.params.id,
    pageOptions = {
      title: 'Акции',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
    };

  if (global.CONFIG_APP.OPTIONS[11] !== true) {
    res.render('admin_access_denied', pageOptions);
    return;
  }

  deleteSalesFlag = await adminFunctions.deleteSalesById(idSales);
  if (deleteSalesFlag) {
    pageOptions.sales = await adminFunctions.getAllSales(req);
    res.render('admin_sales', pageOptions);
  }
  else {
    pageOptions.message = {
      success: false,
      error: true,
      text: 'Ошибка - не удалось удалить акцию'
    };
    pageOptions.sales = await adminFunctions.getSalesById(idSales);
    if (pageOptions.sales.action == true) {
      pageOptions.ml = true;
    } else {
      pageOptions.gr = true;
    }
    pageOptions.name = pageOptions.sales.title;
    pageOptions._id = pageOptions.sales._id;
    pageOptions.description = pageOptions.sales.description;
    pageOptions.dateStartSales = pageOptions.sales.dateStartSales;
    pageOptions.dateFinishSales = pageOptions.sales.dateFinishSales;
    pageOptions.image = pageOptions.sales.image;
    res.render('admin_sales_detali', pageOptions);
  }
});

routes.get('/add', adminFunctions.checkAuthentication, (req, res) => {
  pageOptions = {
    title: 'Добавление акции',
    layout: 'adminLayout',
    setting: global.CONFIG_APP,
    item: {
      title: 'Добавление акции'
    }
  };
  res.render('admin_sales_add', pageOptions);
});
routes.post('/add', adminFunctions.checkAuthentication, uploadMem.single('new_img'), async (req, res) => {
  pageOptions = {
    title: 'Добавление',
    layout: 'adminLayout',
    setting: global.CONFIG_APP,
  },
    newFileName = false;

  if (global.CONFIG_APP.OPTIONS[11] !== true) {
    res.render('admin_access_denied', pageOptions);
    return;
  }

  if (req.file && req.file.originalname) {
    newFileName = md5(req.file.originalname) + '.webp';
    req.body.image = '/assets/images/sales-images/' + newFileName;
  }
  if (req.body.sort == '')
    req.body.sort = 500;
  //
  var result = await adminFunctions.addSales({ params: req.body });
  if (result) {
    if (req.file) {
      sharp(req.file.buffer)
        .resize(1200, 400, {
          fit: 'cover',
          position: 'center'
        })
        .webp({ quality: 70 })
        .toFile(path.join(__dirname, '../../../client/assets/images/sales-images/') + newFileName);
    }
    res.redirect('..');
  } else {
    pageOptions.categories = await adminFunctions.getAllSales();
    pageOptions.body = req.body;
    pageOptions.message = {
      success: false,
      error: true,
      text: 'Ошибка, попробуйте еще раз'
    };
    res.render('admin_sales_add', pageOptions);
  }
});

routes.post('/:id', adminFunctions.checkAuthentication, uploadMem.single('new_img'), async (req, res) => {
  pageOptions = {
    title: 'Добавление',
    layout: 'adminLayout',
    setting: global.CONFIG_APP,
  },
    newFileName = false;

  if (global.CONFIG_APP.OPTIONS[11] !== true) {
    res.render('admin_access_denied', pageOptions);
    return;
  }

  if (req.file && req.file.originalname) {
    newFileName = md5(req.file.originalname) + '.webp';
    req.body.image = '/assets/images/sales-images/' + newFileName;
  }
  if (req.body.sort == '')
    req.body.sort = 500;
  var result = await adminFunctions.updateSales({ params: req.body, id: req.params.id });
  if (result) {
    if (req.file) {
      sharp(req.file.buffer)
        .resize(1200, 400, {
          fit: 'cover',
          position: 'center'

        })
        .webp({ quality: 70 })
        .toFile(path.join(__dirname, '../../../client/assets/images/sales-images/') + newFileName);
    }
    res.redirect('..');
  } else {
    pageOptions.categories = await adminFunctions.getAllSales();
    pageOptions.body = req.body;
    pageOptions.message = {
      success: false,
      error: true,
      text: 'Ошибка, попробуйте еще раз'
    };
    res.render('admin_sales_detali', pageOptions);
  }
});
routes.get('/:id', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    idSales = req.params.id,
    pageOptions = {
      title: 'Акция',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
    };

  if (global.CONFIG_APP.OPTIONS[11] !== true) {
    res.render('admin_access_denied', pageOptions);
    return;
  }

  pageOptions.sales = await adminFunctions.getSalesById(idSales);
  if (pageOptions.sales.action == true) {
    pageOptions.ml = true;
  } else {
    pageOptions.gr = true;
  }
  pageOptions.name = pageOptions.sales.title;
  pageOptions._id = pageOptions.sales._id;
  pageOptions.description = pageOptions.sales.description;
  pageOptions.dateStartSales = pageOptions.sales.dateStartSales;
  pageOptions.dateFinishSales = pageOptions.sales.dateFinishSales;
  pageOptions.image = pageOptions.sales.image;
  res.render('admin_sales_detali', pageOptions);
});

routes.get('/', adminFunctions.checkAuthentication, uploadMem.single('new_img'), async (req, res) => {

  pageOptions = {
    title: 'Акции',
    layout: 'adminLayout',
    setting: global.CONFIG_APP,
  };
  if (global.CONFIG_APP.OPTIONS[11] !== true) {
    res.render('admin_access_denied', pageOptions);
    return;
  }
  pageOptions.sales = await adminFunctions.getAllSales(req);
  res.render('admin_sales', pageOptions);
});

module.exports = routes;
