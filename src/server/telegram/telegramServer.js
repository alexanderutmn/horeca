const http = require('http');
const path = require('path');
const { MongoClient } = require('mongodb');
const config = require(`../../../config/${process.env.NODE_ENV}.config.json`);
const mongoose = require('mongoose');
const redisAdapter = require('socket.io-redis');
const moment = require('moment'); // require
const { CONFIG_APP } = require('../options');
const fs = require('fs');

mongoose.connection.on('error', err => console.log('Mongoose Connection ERROR: ' + err.message));
mongoose.connection.once('open', () => console.log('MongoDB Connected!'));
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

require('../mongoose/telegramUserSchema.js');
require('../mongoose/counters/counterOrdersSchema.js');
require('../mongoose/menuSchema.js');
require('../mongoose/orderSchema.js');
require('../mongoose/optionsSchema.js');
require('../mongoose/tablesSchema.js');
require('../mongoose/userSchema.js');
require('../mongoose/eventButtonsSchema.js');

const PORT = process.env.PORT || config.telegramBot.port || 8888,
      HOST = process.env.HOSTNAME || config.telegramBot.host || 'localhost',
      clientD = process.env.DB_CLIENT || config.db.client || 'mongodb',
      host = process.env.DB_HOST || config.db.connection.host || 'localhost',
      port = process.env.DB_PORT || config.db.connection.port || '27017',
      dbName = process.env.DB_NAME || config.db.connection.dbName || 'SYSTEM',
      url = `${clientD}://${host}:${port}/${dbName}`;

const orderSchema = mongoose.model('orderSchema');
const tablesSchema = mongoose.model('tablesSchema');
const menuSchema = mongoose.model('menuSchema');

(async () => {
  const options = { useUnifiedTopology: true, useNewUrlParser: true };
  const clientMongoose = await mongoose.connect(url, options);
  var optionsApp = await mongoose.model('optionsSchema').findOne({ _id: 'entityId' }).lean();
  global.CONFIG_APP = optionsApp;
  // define global client, fast work speed
  global.dbClientMongoose = clientMongoose;

  // MONGO ON WINDOWS LOAD SO BAD, we deal connection on start app
  async function listenCallback() {
    try {
      process.send('ready');
    } catch (err) {
      console.log(err);
    }
    finally {
      console.log(`Server started at: http://${HOST}:${PORT}`);
    }
  }

	if(global.CONFIG_APP.OPTIONS[10] === true && global.CONFIG_APP.telegramBotId){
		const { telegramBot } = require('./telegramBot');
    // запуск бота
    telegramBot.launch();
	}
})();


// чистим ненужные изображения
setInterval(() => {
  var imgPath = path.join(__dirname, '../../client/assets/images/product-images/');
  fs.readdir(imgPath, (err, files) => {
    files.forEach(file => {
      menuSchema.find({ $or: [{ img: { $regex: file } }, { imgQr: { $regex: file } }] }, function (err, doc) {
        var file2 = file;
        if(err){
          console.log(err);
        } else if(doc.length){
          console.log('FIND - ' + file2);
        } else {
          fs.unlink(imgPath + file2, (err) => {
            if (err) {
              console.error(err)
              return
            }
            console.log('DELETE - ' + file2);
          })
        }
      })
    });
  })
}, 60 * 1000 * 60 * 24);

if (CONFIG_APP.TIMES) {
  // чистим корзину если за столом никого нет
  setInterval(() => {
  	tablesSchema.deleteMany(
  		{
        actionTime: {
          $lte: moment(new Date()).subtract(CONFIG_APP.TIMES.tableMinDisable, 'minutes')
        },
        hasOrder: false
      },
  		(err, res) => {
  			if(err){
          console.log('ERROR TABLES');
          console.log(err);
        }
  		}
  	);
    tablesSchema.deleteMany(
  		{
        actionTime: {
          $lte: moment(new Date()).subtract(CONFIG_APP.TIMES.tableMaxDisable, 'minutes')
        },
        hasOrder: true
      },
  		(err, res) => {
  			if(err){
          console.log('ERROR TABLES');
          console.log(err);
        }
  		}
  	);
  }, 60 * 1000 * CONFIG_APP.TIMES.tableCheck);

  // чистим заказы если за столом никого нет
  setInterval(async () => {
  	var tables = await orderSchema.aggregate([
  		{
  			$match: {
  				hide: false
  			}
  		},
  		{
  			$group: {
  				'_id': '$numberTable',
  				Files: {
  					$push: "$$ROOT"
  				}
  			}
  		}
  	]);

  	for (var i = 0; i < tables.length; i++) {
  		for (var j = 0; j < tables[i].Files.length; j++) {
  			var order = tables[i].Files[j];

  			if ((order.orderStatus == 7 || order.orderStatus == 4) && order.check == true) {
  				orderSchema.findOneAndUpdate(
  					{
  						_id: order._id
  					},
  					{
  						hide: true
  					},
  					(err, res) => {
  						console.log('delete orders');
  					}
  				);

  				tablesSchema.deleteMany(
  					{
  						actionTime: { $lte: moment(new Date()).subtract(CONFIG_APP.TIMES.tableMinDisable, 'minutes') },
  						hasOrder: true,
  						numberTable: order.numberTable
  					},
  					(err, res) => {
  						if(err) {
                console.log('ERROR TABLES WITH ORDER');
                console.log(err);
              } 
  					}
  				);
  			}
  		}
  	}
  }, 60 * 1000 * CONFIG_APP.TIMES.orderCheck);
}


process.on('SIGINT', async() => {
  console.log('Received SIGINT.  Press Control-D to exit.');
  await global.dbClientMongoose.connection.close();
  process.exit(0);
});

process.on('message', async msg => {
  if (msg === 'shutdown') {
    console.log('Closing all connections...');
    await global.dbClientMongoose.connection.close();
    process.exit(0);
  }
});
