const path = require('path');
const { adminFunctions } = require('../../functions/adminFunctions');
const md5 = require('md5');
const sharp = require('sharp');
const multer = require('multer');
const routes = require('express').Router();
const uploadMem = multer({ storage: multer.memoryStorage() });


routes.get('/add', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    pageOptions = {
      title: 'Добавление',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
      item: {
        title: 'Добавление'
      }
    };

  pageOptions.categories = await adminFunctions.getAllCategories();
  pageOptions.notifications = await adminFunctions.getAllNotify();


  res.render('admin_menu_add', pageOptions);
});
routes.post('/add', adminFunctions.checkAuthentication, uploadMem.single('new_img'), async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    pageOptions = {
      title: 'Добавление',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
    },
    newFileName = false;

  if (req.body.sort == '')
    req.body.sort = 500;

  var result = await adminFunctions.addProduct({ params: req.body });
  if (result) {
    if (req.file) {
      sharp(req.file.buffer)
        .webp({ quality: 70 })
        .toFile(path.join(__dirname, '../../../client/assets/images/product-images/') + newFileName);
    }
    res.redirect('..');
  } else {
    pageOptions.categories = await adminFunctions.getAllCategories();
    pageOptions.notifications = await adminFunctions.getAllNotify();

    pageOptions.body = req.body;
    pageOptions.message = {
      success: false,
      error: true,
      text: 'Ошибка, попробуйте еще раз'
    };
    res.render('admin_menu_add', pageOptions);
  }
});

routes.post('/add-cropp-image', uploadMem.single('new_img'), async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    pageOptions = {
      title: 'Добавление',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
    },
    newFileName = false,
    pathFile = '';

  if (req.file && req.file.originalname) {
    newFileName = md5(req.file.originalname+new Date().getTime().toString()) + '.webp';
    pathFile = '/assets/images/product-images/' + newFileName;
  }

  if (req.file) {
    sharp(req.file.buffer)
      .webp({ quality: 70 })
      .toFile(path.join(__dirname, '../../../client/assets/images/product-images/') + newFileName);
  }
  res.send(pathFile);
});

routes.post('/update-cropp-image', uploadMem.single('new_img'), async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    pageOptions = {
      title: 'Добавление',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
      isLoading: false
    },
    newFileName = false,
    idProduct;

  if (req.file && req.file.originalname) {
    newFileName = md5(req.file.originalname+new Date().getTime().toString()) + '.webp';
    //console.log(newFileName)
    req.body.img = '/assets/images/product-images/' + newFileName;
    idProduct = req.file.originalname;
  }
  //
  var result = await adminFunctions.updateProduct({ idProduct, params: { img: req.body.img } });
  if (result) {
    if (req.file) {
      await sharp(req.file.buffer)
        .webp({ quality: 70 })
        .toFile(path.join(__dirname, '../../../client/assets/images/product-images/') + newFileName);
      }
    }
    res.render('admin_menu_detail', pageOptions);
});

routes.get('/:id', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    idProduct = req.params.id,
    pageOptions = {
      title: 'Меню',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
      url: global.CONFIG_APP.SEO.url,
      isLoading: false
    };
  pageOptions.allGroupModifiersInSchema = await adminFunctions.getAllModifiersCategories();
  let filterGroupModifiersArray = pageOptions.allGroupModifiersInSchema;
  pageOptions.categories = await adminFunctions.getAllCategories();
  pageOptions.item = await adminFunctions.getProductById({ product_id: idProduct });
  pageOptions.modifiersArray = [];
  if (pageOptions.item.modifiers.length > 0) {
    pageOptions.item.modifiers.forEach((idModifier) => {
      adminFunctions.getModifiersById({ category_id: idModifier })
        .then((result) => {
          pageOptions.modifiersArray.push(result);
        }).catch((err) => console.log(err))

    })
  }
  pageOptions.allModifiersInSchema = await adminFunctions.getAllModifiers();
  let filterModifiersArray = pageOptions.allModifiersInSchema;
  if (pageOptions.item.modifiers.length > 0) {
    pageOptions.item.modifiers.forEach((idModifier) => {
      const result = filterModifiersArray.filter((modifier) =>
        modifier._id !== idModifier
      );
      filterModifiersArray = result;
    })
  }
  pageOptions.groupModifiersArray = [];
  if (pageOptions.item.groupModifiers.length > 0) {
    pageOptions.item.groupModifiers.forEach((groupModifier) => {
      adminFunctions.getModifiersCategoryById({ category_id: groupModifier.idEasyQr })
        .then((modifierCategory) => {
          pageOptions.groupModifiersArray.push(modifierCategory);
        }).catch((err) => console.log(err))
    })
  }
  if (pageOptions.item.groupModifiers.length > 0) {
    pageOptions.item.groupModifiers.forEach((groupModifier) => {
      const result = filterGroupModifiersArray.filter((group) =>
        group._id !== groupModifier.idEasyQr);
      filterGroupModifiersArray = result;
    })
  }
  pageOptions.allModifiers = filterModifiersArray;
  pageOptions.allGroupModifiers = filterGroupModifiersArray;
  pageOptions.notifications = await adminFunctions.getAllNotify();
  pageOptions.enableDishesQr = global.CONFIG_APP.enableDishesQr;

  if (pageOptions.item.unit == 'мл') {
    pageOptions.ml = true;
  } else if (pageOptions.item.unit == 'шт') {
    pageOptions.sht = true;
  } else {
    pageOptions.gr = true;
  }
  await adminFunctions.sleep(100);
  if (pageOptions.modifiersArray.length > 1) {
    pageOptions.modifiersArray.sort(function (a, b) {
      var nameA = a.title.toLowerCase(), nameB = b.title.toLowerCase();
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    });
  }
  if (pageOptions.allModifiers.length > 1) {
    pageOptions.allModifiers.sort(function (a, b) {
      var nameA = a.title.toLowerCase(), nameB = b.title.toLowerCase();
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    });
  }
  if (pageOptions.allGroupModifiers.length > 1) {
    pageOptions.allGroupModifiers.sort(function (a, b) {
      var nameA = a.title.toLowerCase(), nameB = b.title.toLowerCase();
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    });
  }
  if (pageOptions.groupModifiersArray.length > 1) {
    pageOptions.groupModifiersArray.sort(function (a, b) {
      var nameA = a.title.toLowerCase(), nameB = b.title.toLowerCase();
      if (nameA < nameB)
        return -1;
      if (nameA > nameB)
        return 1;
      return 0;
    });
  }
  res.render('admin_menu_detail', pageOptions);
});
routes.post('/:id', uploadMem.any(), adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    idProduct = req.params.id,
    pageOptions = {
      title: 'Меню',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
    },
    newFileName = false;

    if(req.body.img != '')
      delete req.body.img;
    // req.files.forEach((item) => {
    for await(item of req.files){
      newFileName = false;
      // if (item.fieldname === "new_img" && item.originalname) {
      //   newFileName = md5(item.originalname) + '.webp';
      //   req.body.img = '/assets/images/product-images/' + newFileName;
      // }
      if (item.fieldname === "new_img-qr" && item.originalname) {
        newFileName = md5(item.originalname) + '.webp';
        req.body.imgQr = '/assets/images/product-images/' + newFileName;
    }
    // })
      }

  if (req.body.sort == ''){req.body.sort = 500;};
  var result = await adminFunctions.updateProduct({ idProduct, params: req.body });
  if (result) {
    if (req.files) {
      for await(file of req.files){
      // req.files.forEach((file) => {
        newFileName = md5(file.originalname) + '.webp';
        sharp(file.buffer)
          .metadata()
          .then((metadata) => {
            if (metadata.width > metadata.height) {
              return sharp(file.buffer)
                .resize(1020, 1000, {
                  fit: 'outside'
                })
                .png({ quality: 70, palette: true })
                .toFile(path.join(__dirname, '../../../client/assets/images/product-images/') + newFileName);
            } else {
              const offset = Math.floor((metadata.height - metadata.width) / 2);
              return sharp(file.buffer)
                .extract({ left: 0, top: offset, width: metadata.width, height: metadata.width })
                .resize({
                  fit: sharp.fit.cover,
                  width: 1020,
                  height: 1000
                })
                .png({ quality: 70, palette: true })
                .toFile(path.join(__dirname, '../../../client/assets/images/product-images/') + newFileName);
            }
          })
          .catch((err) => console.log(err));
        }
      // })
    }
    res.redirect('..');
  } else {
    pageOptions.categories = await adminFunctions.getAllCategories();
    pageOptions.item = await adminFunctions.getProductById({ product_id: idProduct });
    if (pageOptions.item.unit == 'мл') {
      pageOptions.ml = true;
    } else if (pageOptions.item.unit == 'шт') {
      pageOptions.sht = true;
    } else {
      pageOptions.gr = true;
    }
    res.render('admin_menu_detail', pageOptions);
  }
  // console.log(result);
});

routes.get('/', adminFunctions.checkAuthentication, async (req, res) => {
  var queryParams = adminFunctions.getMainParams(req),
    pageOptions = {
      title: 'Меню',
      layout: 'adminLayout',
      setting: global.CONFIG_APP,
    };

  if (req.query.gridMenu) {
    const result = await adminFunctions.updateOptionsDataTable({ id: { _id: 'easyQRId' }, params: { gridMenu: true } });
    if (!result) {
      console.log('Error update gridMenu');
    }
  }
  if (req.query.gridMenuDelete) {
    const result = await adminFunctions.updateOptionsDataTable({ id: { _id: 'easyQRId' }, params: { gridMenu: false } });
    if (!result) {
      console.log('Error update gridMenu');
    }
  }
  if (req.query.lengthDataTableMenu) {
    const result = await adminFunctions.updateOptionsDataTable({ id: { _id: 'easyQRId' }, params: { lengthDataTableMenu: Number(req.query.lengthDataTableMenu) } });
  }
  if (req.query.getProductByCategory && req.query.getProductByCategory != 'ALL') {
    const result = await adminFunctions.updateOptionsDataTable({ id: { _id: 'easyQRId' }, params: { productMenuByCategory: req.query.getProductByCategory } });
  }
  if (req.query.getProductByCategory == 'ALL') {
    const result = await adminFunctions.updateOptionsDataTable({ id: { _id: 'easyQRId' }, params: { productMenuByCategory: '#' } });
  }
  const optionsDataTable = await adminFunctions.getOptionsDataTable({ _id: 'easyQRId' });
  if (optionsDataTable.productMenuByCategory != '#') {
    queryParams.getProductByCategory = optionsDataTable.productMenuByCategory
  }
  if (req.query.getProductByCategory == 'ALL') {
    delete queryParams.getProductByCategory;
  }
  pageOptions.grid = optionsDataTable.gridMenu;
  pageOptions.lengthDataTableMenu = optionsDataTable.lengthDataTableMenu;
  pageOptions.productMenuByCategory = optionsDataTable.productMenuByCategory;
  pageOptions.categories = await adminFunctions.getAllCategories();
  pageOptions.items = await adminFunctions.getAllProducts(queryParams);
  pageOptions.notifications = await adminFunctions.getAllNotify();

  res.render('admin_menu', pageOptions);
});

module.exports = routes;
