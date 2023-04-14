const path = require("path");
const express = require("express");
const moment = require("moment");
const { CONFIG_APP } = require("../options");
const { appFunctions } = require("../functions/appFunctions");
const { md5NumberTables } = require("../../client/assets/js/numberTables");
const fetch = require("node-fetch");
const { v4: uuidv4 } = require("uuid");
const passport = require("passport");
const flash = require("connect-flash");
const { adminFunctions } = require("../functions/adminFunctions");
const app = express();
const routes = require("express").Router();
const { telegramBot } = require("../telegram/telegramBot");

routes.get("/", async (req, res) => {
  var queryParams = getMainParams(req),
    isRemoteOrder = false,
    categoriesFind = {},
    url = req.url,
    pageOptions = {
      buttonsList: global.CONFIG_APP.OPTIONS[2]
        ? global.CONFIG_APP.BUTTONS_LIST
        : false,
      showBottomCart: true,
      showOrderLink: true,
      showProductsControl: true,
      mainPage: true,
      showNamePopup: false,
      titleSeo: global.CONFIG_APP.TITLE_REST,
      descriptionSeo: global.CONFIG_APP.SEO.description,
      keywordsSeo: global.CONFIG_APP.SEO.keyworws,
      urlSeo: global.CONFIG_APP.SEO.url,
      cssTime: new Date().getTime(),
      items: [],
      cartSum: 0,
      numberTable:
        queryParams.numberTable == undefined ? false : queryParams.numberTable,
      yandexMetrika: global.CONFIG_APP.yandexMetrika,
      imgLoad: await appFunctions.getLoadImage(),
      tipsLayoutID: global.CONFIG_APP.tipsLayoutID,
      enableTips: global.CONFIG_APP.enableTips,
      isAuthenticated: req.isAuthenticated(),
      isBooking:
        global.CONFIG_APP.OPTIONS[6] && global.CONFIG_APP.enableBooking
          ? true
          : false,
      showPersonLink: true,
      currentCurrency: global.CONFIG_APP.currentCurrency
    };
    // console.log(global.CONFIG_APP.currentCurrency)
  if (queryParams.numberPerson == undefined) {
    queryParams.numberPerson = uuidv4();
    res.cookie("numberPerson", queryParams.numberPerson, {
      path: "/",
      expires: new Date(
        Date.now() + CONFIG_APP.TIMES.cookieLife * 60 * 60 * 1000
      ),
    });
  }
  if (queryParams.numberTable == undefined) {
    queryParams.isRemoteOrder = true;
    pageOptions.buttonsList = false;
    queryParams.numberTable = queryParams.numberPerson;
    await appFunctions.addPersonName({
      numberTable: queryParams.numberTable,
      numberPerson: queryParams.numberPerson,
      personName: "Remote Order",
    });
  } else {
    if (global.CONFIG_APP.OPTIONS[3] === true) {
      var personName = await appFunctions.checkNamePerson({
        numberPerson: queryParams.numberPerson,
        numberTable: queryParams.numberTable,
      });
      if (personName.message == "error") {
        pageOptions.showNamePopup = true;
      }
    }
  }
  if (global.CONFIG_APP.OPTIONS[0] === true) {
    pageOptions.showBottomCart = false;
    pageOptions.showOrderLink = false;
    pageOptions.showProductsControl = false;
    pageOptions.showPersonLink = false;
  }
  if (global.CONFIG_APP.OPTIONS[1] === true) {
    pageOptions.wantOrder = true;
    pageOptions.showOrderLink = false;
    pageOptions.showPersonLink = false;
  }
  if (global.CONFIG_APP.OPTIONS[8] === true) {
    pageOptions.showWeight = true;
  }
  if (global.CONFIG_APP.OPTIONS[11] === true) {
    var sales = await appFunctions.getSales();
    if (sales.message == "success") {
      pageOptions.sales = sales.data;
      if (sales.data.length > 0) {
        pageOptions.showSales = true;
      } else {
        pageOptions.showSales = false;
      }
    }
  }

  var cart = await appFunctions.checkCartPerson({
      numberPerson: queryParams.numberPerson,
      numberTable: queryParams.numberTable,
    }),
    arIdsProducts = [];
  if (cart.message == "success") {
    for (var i = 0; i < cart.data.length; i++) {
      pageOptions.cartSum +=
        parseInt(cart.data[i].price) * parseInt(cart.data[i].count);
      arIdsProducts.push({ _id: cart.data[i]._id, count: cart.data[i].count });
    }
  }

  // pageOptions.items = await appFunctions.getProducts({ numberPerson:queryParams.numberPerson, categoryId: queryParams.categoryId, arIdsProducts });

  var categories = await appFunctions.getCategories({ findParent: true });
  categories = categories.data;
  pageOptions.categoryList = categories;

  for (var i = 0; i < categories.length; i++) {
    categories[i].subCategories = await appFunctions.getCategories({
      parentId: categories[i]._id,
    });
    categories[i].subCategories = categories[i].subCategories.data;
    pageOptions.categoryList[i].subCategories = categories[i].subCategories;
    if (categories[i].subCategories) {
      //
      for (var j = 0; j < categories[i].subCategories.length; j++) {
        categories[i].subCategories[j].products =
          await appFunctions.getProducts({
            numberPerson: queryParams.numberPerson,
            categoryId: categories[i].subCategories[j]._id,
            arIdsProducts,
          });
        categories[i].subCategories[j].products =
          categories[i].subCategories[j].products.data;
        if (categories[i].subCategories[j].products.length) {
          categories[i].subCategories[j].products.map((item) => {
            item.activeModifiers = false;
            if (item.modifiers.length > 0) {
              getAllModifiers(item.modifiers)
                .then((resultArrayModifiers) => {
                  if (resultArrayModifiers.length > 0) {
                    item.activeModifiers = true;
                  }
                  item.modifiers = JSON.stringify(resultArrayModifiers); //готовим информацию о модификаторах к передаче в шаблон
                })
                .catch((err) => console.log(err));
            } else {
              item.modifiers = JSON.stringify([]);
            }
            if (item.groupModifiers.length > 0) {
              getAllGroupModifiers(item.groupModifiers)
                .then((resultArrayGroupModifiers) => {
                  if (resultArrayGroupModifiers.length > 0) {
                    item.activeModifiers = true;
                  }
                  item.groupModifiers = JSON.stringify(resultArrayGroupModifiers);
                })
                .catch((err) => console.log(err));
            } else {
              item.groupModifiers = JSON.stringify([]);
            }
          });
        }
      }
    } else {
      categories[i].products = await appFunctions.getProducts({
        numberPerson: queryParams.numberPerson,
        categoryId: categories[i]._id,
        arIdsProducts,
      });
      categories[i].products = categories[i].products.data;
      if (categories[i].products.length) {
        categories[i].products.map((item) => {
          item.activeModifiers = false;
          if (item.modifiers.length > 0) {
            getAllModifiers(item.modifiers)
              .then((resultArrayModifiers) => {
                if (resultArrayModifiers.length > 0) {
                  item.activeModifiers = true;
                }
                item.modifiers = JSON.stringify(resultArrayModifiers); //готовим информацию о модификаторах к передаче в шаблон
              })
              .catch((err) => console.log(err));
          } else {
            item.modifiers = JSON.stringify([]);
          }
          if (item.groupModifiers.length > 0) {
            getAllGroupModifiers(item.groupModifiers)
              .then((resultArrayGroupModifiers) => {
                if (resultArrayGroupModifiers.length > 0) {
                  item.activeModifiers = true;
                }
                item.groupModifiers = JSON.stringify(resultArrayGroupModifiers);
              })
              .catch((err) => console.log(err));
          } else {
            item.groupModifiers = JSON.stringify([]);
          }
        });
      }
    }
  }

  pageOptions.linkItem = url + pageOptions.linkItem;
  pageOptions.items = categories;
  pageOptions.linkCart = queryParams.isRemoteOrder
    ? "/cart/"
    : "/cart/?numberTable=" + queryParams.numberTable;
  pageOptions.title = global.CONFIG_APP.TITLE_REST;
  if (
    !queryParams.isRemoteOrder &&
    queryParams.typeMenuId == undefined &&
    queryParams.categoryId == undefined
  )
    pageOptions.title +=
      ` ${global.CONFIG_APP.TITLE_TABLE} № ` +
      md5NumberTables[queryParams.numberTable];

  res.render("main_home", pageOptions);
});
routes.get("/cart", async (req, res) => {
  var queryParams = getMainParams(req),
    categoriesFind = {},
    url = req.url,
    pageOptions = {
      isRemoteOrder: false,
      showNamePopup: false,
      wantOrder: false,
      titleSeo: global.CONFIG_APP.TITLE_REST,
      descriptionSeo: global.CONFIG_APP.SEO.description,
      keywordsSeo: global.CONFIG_APP.SEO.keyworws,
      urlSeo: global.CONFIG_APP.SEO.url,
      showOrderLink: true,
      buttonsList: global.CONFIG_APP.OPTIONS[2]
        ? global.CONFIG_APP.BUTTONS_LIST
        : false,
      cssTime: new Date().getTime(),
      title: "Корзина",
      cartSum: 0,
      cities: global.CONFIG_APP.CITIES,
      numberTable:
        queryParams.numberTable == undefined ? false : queryParams.numberTable,
      enableDelivery: global.CONFIG_APP.enableDelivery,
      enablePickup: global.CONFIG_APP.enablePickup,
      enableInHall: global.CONFIG_APP.enableInHall,
      yandexMetrika: global.CONFIG_APP.yandexMetrika,
      imgLoad: await appFunctions.getLoadImage(),
      enablePayment: global.CONFIG_APP.enablePayment,
      paymentPublicID: global.CONFIG_APP.paymentPublicID,
      singleMessagePayment: global.CONFIG_APP.singleMessagePayment,
      tipsLayoutID: global.CONFIG_APP.tipsLayoutID,
      enableTips: global.CONFIG_APP.enableTips,
      isAuthenticated: req.isAuthenticated(),
      isBooking:
        global.CONFIG_APP.OPTIONS[6] && global.CONFIG_APP.enableBooking
          ? true
          : false,
      openTime: global.CONFIG_APP.openTime,
      closeTime: global.CONFIG_APP.closeTime,
      showPersonLink: true,
      currentCurrency: global.CONFIG_APP.currentCurrency
    };

  if (!global.CONFIG_APP.OPTIONS[5])
    pageOptions.hidePayment = true

  if (global.CONFIG_APP.OPTIONS[0] === true) {
    if (queryParams.numberTable == undefined) {
      res.redirect("/");
    } else {
      res.redirect("/?numberTable=" + queryParams.numberTable);
    }
  }
  if (global.CONFIG_APP.OPTIONS[1] === true) {
    pageOptions.title = "Хочу заказать";
    pageOptions.wantOrder = true;
    pageOptions.showOrderLink = false;
    pageOptions.showPersonLink = false;
  }

  if (queryParams.numberPerson == undefined) {
    queryParams.numberPerson = uuidv4();
    res.cookie("numberPerson", queryParams.numberPerson, {
      path: "/",
      expires: new Date(
        Date.now() + CONFIG_APP.TIMES.cookieLife * 60 * 60 * 1000
      ),
    });
  }
  if (queryParams.numberTable == undefined) {
    pageOptions.isRemoteOrder = true;
    pageOptions.buttonsList = false;
    queryParams.numberTable = queryParams.numberPerson;
    await appFunctions.addPersonName({
      numberTable: queryParams.numberTable,
      numberPerson: queryParams.numberPerson,
      personName: "Remote Order",
    });
  } else {
    if (global.CONFIG_APP.OPTIONS[3] === true) {
      var personName = await appFunctions.checkNamePerson({
        numberPerson: queryParams.numberPerson,
        numberTable: queryParams.numberTable,
      });
      if (personName.message == "error") {
        if (queryParams.numberTable == undefined) {
          res.redirect("/");
        } else {
          res.redirect("/?numberTable=" + queryParams.numberTable);
        }
      }
    }
  }

  if (pageOptions.isRemoteOrder)
    pageOptions.delivery = global.CONFIG_APP.DELIVERY_PRICE;
  else pageOptions.delivery = 0;
  pageOptions.cartSum += pageOptions.delivery;

  if (pageOptions.isRemoteOrder && !pageOptions.wantOrder)
    pageOptions.showSwichDelivery = true;

  if (
    pageOptions.isRemoteOrder &&
    pageOptions.cities &&
    pageOptions.cities.length > 1
  ) {
    pageOptions.showCitySelect = true;
  }

  if (pageOptions.isAuthenticated) {
    pageOptions.authPerson = JSON.parse(JSON.stringify(req.user));
  }

  res.render("main_cart", pageOptions);
});


function getMainParams(req) {
  return {
    numberTable: req.query.numberTable,
    numberPerson: req.cookies.numberPerson,
    place: req.query.place,
    typeMenuId: req.query.typeMenuId,
    categoryId: req.query.categoryId,
    getOrderFromDate: req.query.getOrderFromDate,
    getOrderToDate: req.query.getOrderToDate,
    getOrderByStatus: req.query.getOrderByStatus,
  };
}

async function getAllGroupModifiers(groupModifiers) {
  let groupModifier;
  const resultArrayNotSortGroupModifiers = [];
  const resultArrayIdGroupModifiersSort = [];
  for (const item of groupModifiers) {
    groupModifier = await adminFunctions.getModifiersCategoryById({ category_id: item.idEasyQr });
    if (groupModifier.active) {
      resultArrayNotSortGroupModifiers.push(groupModifier);
    }
  };
  resultArrayNotSortGroupModifiers.sort((a, b) => b.sort - a.sort);
  resultArrayNotSortGroupModifiers.forEach((group) => {
    resultArrayIdGroupModifiersSort.push(group._id);
  });
  return new Promise(async (resolve, reject) => {
    resolve(resultArrayIdGroupModifiersSort);
  });
}
async function getAllModifiers(modifiers) {
  let groupModifier;
  const resultArrayNotSortModifiers = [];
  const resultArrayIdModifiersSort = [];
  for (const item of modifiers) {
    groupModifier = await adminFunctions.getModifiersById({
      category_id: item,
    });
    resultArrayNotSortModifiers.push(groupModifier);
  }
  resultArrayNotSortModifiers.sort((a, b) => b.sort - a.sort);
  resultArrayNotSortModifiers.forEach((modifier) => {
    resultArrayIdModifiersSort.push(modifier._id);
  });
  return new Promise(async (resolve, reject) => {
    resolve(resultArrayIdModifiersSort);
  });
}

module.exports = routes;
