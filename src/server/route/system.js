const path = require('path');
const express = require('express');
const fs = require('fs');
const fetch = require('node-fetch');
const app = express();
const routes = require('express').Router();
const mongoose = require('mongoose');
const menuSchema = mongoose.model('menuSchema');
const categoriesSchema = mongoose.model('categoriesSchema');


// routes.post('/', async (req, res) => {
//   res.send('red');
// });

// персонализация
routes.post('/save-personalization', async (req, res) => {

  // var body = req.body;
  //
  //   var styles = `
  //     * {
  //       color: ${body.UF_MAIN_TEXT_COLOR} !important;
  //     }
  //     .topline__slide-menu-button path{
  //       fill: ${body.UF_MAIN_TEXT_COLOR} !important;
  //     }
  //     .categories-main-button path{
  //       fill: ${body.UF_MAIN_TEXT_COLOR} !important;
  //     }
  //     .loght {
  //       background: ${body.UF_LOGHT} !important;
  //     }
  //     .slick-dots li button:before{
  //       color: ${body.UF_LOGHT} !important;
  //     }
  //     .main-color-button {
  //       background-color: ${body.UF_BUTTON_COLOR} !important;
  //       color: ${body.UF_BUTTON_TEXT_COLOR} !important;
  //     }
  //     .main-color-button path{
  //       fill: ${body.UF_BUTTON_TEXT_COLOR} !important;
  //     }
  //     .main-color-text {
  //       color: ${body.UF_MAIN_COLOR} !important;
  //     }
  //     .main-color-svg path{
  //       fill: ${body.UF_MAIN_COLOR} !important;
  //     }
  //     .cart-delivery-block__item.active{
  //       background: ${body.UF_BUTTON_COLOR} !important;
  //       color: ${body.UF_MAIN_COLOR} !important;
  //     }
  //     .cart-delivery-block__item{
  //       background: ${body.UF_BUTTON_COLOR} !important;
  //       color: ${body.UF_BUTTON_TEXT_COLOR} !important;
  //     }
  //     .button-inverse{
  //       border: 1px solid ${body.UF_MAIN_COLOR} !important;
  //       color: ${body.UF_MAIN_COLOR} !important;
  //     }
  //     .slick-dots li.slick-active button:before{
  //       color: ${body.UF_MAIN_COLOR} !important;
  //     }
  //     .slide-menu__close path{
  //       fill: ${body.UF_BUTTON_TEXT_COLOR} !important;
  //     }
  //     /* IN CART */
  //     .product.in-cart .product__price{
  //       color: ${body.UF_BUTTON_TEXT_COLOR} !important;
  //     }
  //     .product.in-cart .product__price-block {
  //         background: ${body.UF_MAIN_COLOR} !important;
  //     }
  //     .product.in-cart .product__minus path,
  //     .product.in-cart .product__plus path {
  //         fill: ${body.UF_BUTTON_TEXT_COLOR} !important;
  //     }
  //     .text-light {
  //       color: ${body.UF_TEXT_LIGHT} !important;
  //     }
  //     .in-cart__count{
  //       color: ${body.UF_TEXT_LIGHT} !important;
  //     }
  //     /* stroke */
  //     .topline,
  //     #categories-main,
  //     .slide-menu__li,
  //     .cart-product,
  //     .params-user, .params-adress,
  //     .product-popup__info,
  //     .cart-detail__general-summ,
  //     .cart-detail__general-delivery,
  //     .order-detail__general-summ,
  //     .order-detail__general-delivery,
  //     .slide-categories-item{
  //         border-bottom: 1px solid ${body.UF_STROKE} !important;
  //     }
  //     .product-popup__count,
  //     .popup-name__form-input input,
  //     .popup__form-input input,
  //     .popup__form-input select {
  //         border: 1px solid ${body.UF_STROKE} !important;
  //     }
  //     .order-product+.order-product,
  //     .order+.order{
  //       border-top: 1px solid ${body.UF_STROKE} !important;
  //     }
  //     /* ORDER MADE */
  //     .order-made-block{
  //       background: ${body.UF_ORDER_MADE_BLOCK} !important;
  //     }
  //     .order-made-block__top{
  //       color: ${body.UF_BUTTON_TEXT_COLOR} !important;
  //     }
  //     .order-made-but-color{
  //       background: ${body.UF_LOGHT} !important;
  //       color: ${body.UF_MAIN_COLOR} !important;
  //     }
  //     .order-made-but-color path{
  //       fill: ${body.UF_MAIN_COLOR} !important;
  //     }
  //     .order-made-block__icon path{
  //       fill: ${body.UF_MAIN_COLOR} !important;
  //     }
  //     .order-made-block__icon circle{
  //       fill: ${body.UF_BUTTON_TEXT_COLOR} !important;
  //     }
  //     .cart-detail{
  //       background: ${body.UF_BACKGROUND_COLOR} !important;
  //       box-shadow: 0 5px 32px ${body.UF_BACKGROUND_COLOR};
  //     }
  //     .background-color{
  //       background: ${body.UF_BACKGROUND_COLOR} !important;
  //     }
  //
  //     .cart-persons-name, .categories-main__category {
  //       background: ${body.UF_LOGHT} !important;
  //       color: ${body.UF_MAIN_COLOR} !important;
  //     }
  //     .cart-persons-name.slick-current, .categories-main__category.active{
  //       background: ${body.UF_BUTTON_COLOR} !important;
  //       color: ${body.UF_BUTTON_TEXT_COLOR} !important;
  //     }
  //     .popup__form{
  //       background: ${body.UF_POPUP_BACKUP} !important;
  //       border: 1px solid ${body.UF_STROKE} !important;
  //     }
  //     .popup__form input[type="text"]{
  //       color: ${body.UF_POPUP_INPUT_COLOR} !important;
  //     }
  //     .popup__form-input select{
  //       color: ${body.UF_POPUP_INPUT_COLOR} !important;
  //     }
  //     .product-popup__img.show-back{
  //       background-color: ${body.UF_MAIN_COLOR} !important;
  //     }
  //
  //   `;
  //   var arPromise = [];
  //
  //   if(body.UF_LOAD_IMG != false){
  //     styles = styles + `
  //       #loader{
  //         background: ${body.UF_BACKGROUND_COLOR} !important;
  //       }
  //       #loader>.loader_img{
  //         background-image: url('/assets/css/loader.jpeg') !important;
  //         animation: 2s linear 0s normal none infinite running rot;
  //         -webkit-animation: 2s linear 0s normal none infinite running rot;
  //         top: calc(50% - 100px) !important;
  //         left: calc(50% - 100px) !important;
  //       }
  //       #loader svg{
  //         display: none !important;
  //       }
  //     `;
  //     const response = await fetch(body.UF_LOAD_IMG);
  //     const buffer = await response.buffer();
  //
  //     arPromise.push(fs.writeFile(path.join(__dirname, '../../client/assets/css/loader.jpeg'), buffer, async function(err, file) {
  //       if (err) {
  //         res.json({status: 'error', message: err});
  //         throw err;
  //       }
  //     }));
  //   }
  //
  //   if(body.UF_BACKGROUND_IMAGE != false){
  //     styles = styles + `
  //       .fixed-crossbrowser-background{
  //         display: block;
  //       }
  //     `;
  //     // body{
  //     //     background: url('/assets/css/background-body.jpeg') center fixed !important;
  //     //     background-position: center !important;
  //     //     background-size: cover !important;
  //     //     background-attachment: fixed !important;
  //     //   }
  //     const response = await fetch(body.UF_BACKGROUND_IMAGE);
  //     const buffer = await response.buffer();
  //     arPromise.push(fs.writeFile(path.join(__dirname, '../../client/assets/css/background-body.jpeg'), buffer, async function(err, file) {
  //       if (err) {
  //         res.json({status: 'error', message: err});
  //         throw err;
  //       }
  //     }));
  //   } else {
  //     styles = styles + `body{
  //         background: ${body.UF_BACKGROUND_COLOR} !important;
  //       }
  //     `;
  //   }
  //
  //   Promise.all(arPromise).then(async function(){
  //     await fs.writeFile(path.join(__dirname, '../../client/assets/css/colors.css'), styles, function (err, file) {
  //       if (err) {
  //         res.json({status: 'error', message: err});
  //         console.log(err);
  //         throw err;
  //       }
  //     });
  //     res.json({status: 'success'});
  //   });

});
// сохранить меню
routes.post('/save-menu', async (req, res) => {
  var body = req.body;

  // const db = global.dbClient.db("app");
  // const collection = db.collection("menu");
  menuSchema.deleteMany({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      // res.send(result);
    }
  });

  if(body.length == 0){
    res.json({status: 'success'});
  } else {
    menuSchema.insertMany(body, async function(err, result){
        if(err){
            res.json({status: 'error', message: err});
            return console.error(err);
        }

        var directory = path.join(__dirname, '../../client/assets/images/product-images/');
        await fs.readdir(directory, async (err, files) => {
          if (err) throw err;

          for (var file of files) {
            if(file != '.empty'){
              await fs.unlink(path.join(directory, file), err => {
                if (err) throw err;
              });
            }
          }
        });


        for (var i = 0; i < result.length; i++) {
          if(result[i].img == '' || result[i].img_origin == '') continue;
          var s = path.join(__dirname, '../../client'+result[i].img);
          const response = await fetch(result[i].img_origin);
          const buffer = await response.buffer();
          await fs.writeFile(s, buffer, async function(err, file) {
            if (err) {
              console.log(err);
            }
          });
        }
        res.json({status: 'success'});
    });
  }
});
// сохранить категории
routes.post('/save-categories', async (req, res) => {
  var body = req.body;

  // const db = global.dbClient.db("app");
  // const collection = db.collection("categories");
  categoriesSchema.deleteMany({}, function(err, result) {
    if (err) {
      res.send(err);
    } else {
      // res.send(result);
    }
  });

  if(body.length == 0){
    res.json({status: 'success'});
  } else {
    categoriesSchema.insertMany(body, async function(err, result){

        if(err){
            res.json({status: 'error', message: err});
            return console.error(err);
        }

        // var directory = path.join(__dirname, '../../client/assets/images/category-images/');
        // await fs.readdir(directory, async (err, files) => {
        //   if (err) throw err;
        //
        //   for (var file of files) {
        //     if(file != '.empty'){
        //       await fs.unlink(path.join(directory, file), err => {
        //         if (err) throw err;
        //       });
        //     }
        //   }
        // });
        //
        // for (var i = 0; i < result.ops.length; i++) {
        //   if(result.ops[i].img_origin == '' || result.ops[i].img == '') continue;
        //   var s = path.join(__dirname, '../client'+result.ops[i].img);
        //   const response = await fetch(result.ops[i].img_origin);
        //   const buffer = await response.buffer();
        //   await fs.writeFile(s, buffer, async function(err, file) {
        //     if (err) {
        //       console.log(err);
        //     }
        //   });
        // }

        res.json({status: 'success'});
    });
  }
});
// сохранить категории
routes.post('/save-type-menu', (req, res) => {
  var body = req.body;

  const db = global.dbClient.db("app");
  const collection = db.collection("type-menu");
  collection.deleteMany();

  if(body.length == 0){
    res.json({status: 'success'});
  } else {
    collection.insertMany(body, function(err, result){

        if(err){
            res.json({status: 'error', message: err});
            return console.error(err);
        }

        res.json({status: 'success'});
    });
  }
});

module.exports = routes;
