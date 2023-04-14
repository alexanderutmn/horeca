const moment = require('moment');
const { adminFunctions } = require('../../functions/adminFunctions');
const fs = require('fs');
const md5 = require('md5');
const routes = require('express').Router();
const multer = require('multer');
const XLSX = require('xlsx');
const axios = require('axios').default;
const uploadMem = multer({ storage: multer.memoryStorage() });
const sharp = require('sharp');
const { resolve } = require('path');



routes.get('/', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    categoriesFind = {},
    pageOptions = {
      title: 'Импорт меню',
      layout: 'adminLayout',
      today: moment().format('YYYY-MM-DD'),
      setting: global.CONFIG_APP,
      jsonDataIs: false
    };
  res.render('admin_importmenu', pageOptions);
});
routes.post('/', adminFunctions.checkAuthentication, uploadMem.single('new_img'), async (req, res) => {
  var workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
  var sheet_name_list = workbook.SheetNames;
  var jsonResult = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
  pageOptions = {
    title: 'Импортировали меню',
    layout: 'adminLayout',
    today: moment().format('YYYY-MM-DD'),
    setting: global.CONFIG_APP,
    jsonDataError: [],
    jsonDataIs: true
  };
  let SORT_CATEGORY = 1000;
  let SORT_PRODUCT = 1000;
  let i = 0;
  let newUrlImage = "";
  let oldUrlImage = "";
  let flagNoImage = false;
  if (jsonResult.length > 0) {
      adminFunctions.deleteAllCategories({})
      .then((result) => {
        adminFunctions.deleteAllMenu({})
          .then((result) => {

          })
          .catch((e) => {
            {
              pageOptions.jsonDataError.push({
                "Название": "Не удалось удалить все позиции меню перед началом импорта",
                "Причина": e
              });
            }
          })
      }).catch((e) => {
        {
          pageOptions.jsonDataError.push({
            "Название": "Не удалось удалить все категории перед началом импорта",
            "Причина": e
          });
        }
      })
      if (req.body.removeModifiers == 'true') {
        adminFunctions.deleteAllModifiers({})
          .then((result) => {

          })
          .catch((e) => {
            {
              pageOptions.jsonDataError.push({
                "Название": "Не удалось удалить все модификаторы перед началом импорта",
                "Причина": e
              });
            }
          })
      }
      if (req.body.removeGroupModifiers == 'true') {
        adminFunctions.deleteAllModifiersCategories({})
          .then((result) => {

          }).catch((e) => {
            {
              pageOptions.jsonDataError.push({
                "Название": "Не удалось удалить все групповые модификаторы перед началом импорта",
                "Причина": e
              });
            }
          })
      }

    while (i < jsonResult.length) {
      let item = jsonResult[i];
      // Нужно проверить - существует ли такая категория
      const newFileName = md5(item['Название']);
      if (item['Картинка']) {
        newUrlImage = `/assets/images/product-images/${newFileName}.webp`;
        oldUrlImage = item['Картинка'];
        flagNoImage = false;
      }
      else {
        newUrlImage = "";
        oldUrlImage = "";
        flagNoImage = true;
      }
      adminFunctions.getCategoryByTitle(item['Категория'])
        .then((resultSearchCategory) => {
          if (resultSearchCategory) {
            // если есть категория - то создаем продукт
            adminFunctions.addProductFromFile({
              img: newUrlImage,
              img_origin: oldUrlImage,
              title: item['Название'],
              price: Number(item['Цена']),
              id_category: resultSearchCategory._id,
              unit: item['гр/мл/шт'],
              weight: item['Вес'],
              description: item['Описание'] || "",
              sort: SORT_PRODUCT
            })
              .then((result) => {
                // если успешно создался продукт - тогда скачиваем изображение
                SORT_PRODUCT -= 5;
                if (!flagNoImage) {
                  const inputImg = axios({
                    method: 'get',
                    url: `${item['Картинка']}`,
                    responseType: 'arraybuffer'
                  })
                    .then(function (response) {
                      sharp(response.data)
                      .rotate()
                      .resize(1020, 1000, {
                        fit: 'outside'
                      })
                      .webp({ quality: 70 })
                      .toFile(`./src/client/assets/images/product-images/${newFileName}.webp`);
                    })
                    .catch(function (e) {
                      {
                        pageOptions.jsonDataError.push({
                          "Название": item['Название'] + " Проблемы со скачиванием картинки",
                          "Причина": e
                        });
                      }
                    });
                }
              }).catch((e) => {
                pageOptions.jsonDataError.push({
                  "Название": item['Название'],
                  "Причина": e
                });
              })
          }
          else {
            //сначала нужно создать категорию - потом продукт
            let typeMenu = null;
            if (item['Тип меню'] !== "") typeMenu = item['Тип меню'];
            adminFunctions.addCategoryFromFile({
              title: item['Категория'],
              parent_id: null,
              type_menu: typeMenu,
              sort: SORT_CATEGORY
            })
              .then((newCategory) => {
                // если есть категория - то создаем продукт
                SORT_CATEGORY -= 5;
                SORT_PRODUCT = 1000;
                adminFunctions.addProductFromFile({
                  img: newUrlImage,
                  img_origin: oldUrlImage,
                  title: item['Название'],
                  price: Number(item['Цена']),
                  id_category: newCategory._id,
                  unit: item['гр/мл/шт'],
                  weight: item['Вес'],
                  description: item['Описание'] || "",
                  sort: SORT_PRODUCT
                })
              })
              .then((result) => {
                // если успешно создался продукт - тогда скачиваем изображение
                SORT_PRODUCT -= 5;
                if (!flagNoImage) {
                  const inputImg = axios({
                    method: 'get',
                    url: `${item['Картинка']}`,
                    responseType: 'arraybuffer'
                  })
                    .then(function (response) {
                      sharp(response.data)
                      .rotate()
                      .resize(1020, 1000, {
                        fit: 'outside'
                      })
                      .webp({ quality: 70 })
                      .toFile(`./src/client/assets/images/product-images/${newFileName}.webp`);
                    })
                    .catch(function (e) {
                      {
                        pageOptions.jsonDataError.push({
                          "Название": item['Название'] + " Проблемы со скачиванием картинки",
                          "Причина": e
                        });
                      }
                    });
                }
              }).catch((e) => pageOptions.jsonDataError.push({
                "Название": item['Название'],
                "Причина": e
              }))
          }
        }).catch((e) => pageOptions.jsonDataError.push({
          "Название": item['Название'],
          "Причина": e
        }))
      await adminFunctions.sleep(100);
      i++;
    }
  }
  res.render('admin_importmenu', pageOptions);
})

module.exports = routes;
