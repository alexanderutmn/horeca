const path = require('path');
const express = require('express');
const moment = require('moment');
const { adminFunctions } = require('../../functions/adminFunctions');
const { md5NumberTables } = require('../../../client/assets/js/numberTables');
const { v4: uuidv4 } = require('uuid');
const app = express();
const routes = require('express').Router();


routes.get('/', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    categoriesFind = {},
    pageOptions = {
      title: 'Заказы',
      layout: 'adminLayout',
      setting: global.CONFIG_APP
    };

  if (global.CONFIG_APP.OPTIONS[3] !== true || global.CONFIG_APP.OPTIONS[4] !== true) {
    res.render('admin_access_denied', pageOptions);
    return;
  }

  pageOptions.orders = await adminFunctions.getAllOrders(queryParams);
  pageOptions.notifications = await adminFunctions.getAllNotify();

  if (!pageOptions.orders.data) {
    pageOptions.orders = false;
  } else {
    pageOptions.orders = pageOptions.orders.data;
    for (var i = 0; i < pageOptions.orders.length; i++) {
      pageOptions.orders[i].placeText = global.CONFIG_APP.PLACE[pageOptions.orders[i].place];
      pageOptions.orders[i].orderStatusText = global.CONFIG_APP.ORDER_STATUS[pageOptions.orders[i].orderStatus];
      pageOptions.orders[i].createdAt = moment(pageOptions.orders[i].createdAt).locale("ru").format('LLL');
      pageOptions.orders[i].buttonColor = adminFunctions.getOrderStatusColor(pageOptions.orders[i].orderStatus);
    }
  }

  res.render('admin_orders', pageOptions);
});
routes.get('/:id', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    categoriesFind = {},
    idOrder = req.params.id,
    pageOptions = {
      title: 'Заказ #' + idOrder,
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
      idOrder: idOrder
    };
  if (global.CONFIG_APP.OPTIONS[3] !== true || global.CONFIG_APP.OPTIONS[4] !== true) {
    res.render('admin_access_denied', pageOptions);
    return;
  }

  pageOptions.order = await adminFunctions.getOrderByIdAdmin({ incoming_order_id: idOrder });

  pageOptions.notifications = await adminFunctions.getAllNotify();

  if (!pageOptions.order.data) {
    pageOptions.order = false;
  } else {
    pageOptions.order = pageOptions.order.data;
    if (pageOptions.order.place == 1) {
      pageOptions.order.placeText = global.CONFIG_APP.PLACE[pageOptions.order.place] + ` - ${global.CONFIG_APP.TITLE_TABLE} ` + md5NumberTables[pageOptions.order.numberTable];
    } else {
      pageOptions.order.placeText = global.CONFIG_APP.PLACE[pageOptions.order.place];
      pageOptions.order.isRemoteOrder = true;
      if (pageOptions.order.time == 'yes')
        pageOptions.order.time = 'Сейчас'
    }

    pageOptions.order.orderStatusText = global.CONFIG_APP.ORDER_STATUS[pageOptions.order.orderStatus];
    pageOptions.order.createdAt = moment(pageOptions.order.createdAt).locale("ru").format('LLL');
    pageOptions.order.orderPerson.address = pageOptions.order.orderPerson.street + ' ' + pageOptions.order.orderPerson.house + ' ' + pageOptions.order.orderPerson.flat;
    if (pageOptions.order.orderPerson.city) {
      pageOptions.order.orderPerson.address = pageOptions.order.orderPerson.city + ' ' + pageOptions.order.orderPerson.address;
    }
    pageOptions.order.buttonColor = adminFunctions.getOrderStatusColor(pageOptions.order.orderStatus);

    if (pageOptions.order.orderStatus == 4 || pageOptions.order.orderStatus == 7) {
      pageOptions.order.canChange = false;
    } else {
      pageOptions.order.canChange = true;
    }

    if ((pageOptions.order.orderStatus == 4 || pageOptions.order.orderStatus == 7) && pageOptions.order.isRemoteOrder) {
      pageOptions.order.canRemove = false;
    } else if (pageOptions.order.place != 1) {
      pageOptions.order.canRemove = true;
    }
  }
  if (pageOptions.order.payment === 1) {
    pageOptions.typePayment = 'Картой онлайн';
  } else if(pageOptions.order.payment === 2) {
    pageOptions.typePayment = 'Картой при получении';
  } else {
    pageOptions.typePayment = 'Наличными при получении';
  }
  res.render('admin_detail_order', pageOptions);
});

module.exports = routes;
