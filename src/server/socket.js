const {
	cart, api, person, order, reservation, paymentSocket, socTypeMenu
} = require('../client/assets/js/socketNames');
const { md5NumberTables } = require('../client/assets/js/numberTables');
// const { CONFIG_2APP } = require('./options');
const { posterConfig } = require('./poster/posterConfig');
const { telegramBot } = require('./telegram/telegramBot');
const { adminFunctions } = require('./functions/adminFunctions');
const moment = require('moment'); // require
const mongoose = require('mongoose');
const telegramUsersSchema = mongoose.model('telegramUsersSchema');
const orderSchema = mongoose.model('orderSchema');
const eventButtonsSchema = mongoose.model('eventButtonsSchema');
const counterOrdersSchema = mongoose.model('counterOrdersSchema');
const tablesSchema = mongoose.model('tablesSchema');
const menuSchema = mongoose.model('menuSchema');
const categoriesSchema = mongoose.model('categoriesSchema');
const userSchema = mongoose.model('userSchema');
const categoriesModifiersSchema = mongoose.model('categoriesModifiersSchema');
const modifiersSchema = mongoose.model('modifiersSchema');
const { YooCheckout, ICreatePayment } = require('@a2seven/yoo-checkout');
const { uid } = require('uid');
const SMSru = require('sms_ru');


var timeRabotaFrom = 8;
var timeRabotaTo = 24;

module.exports = socket => {
	console.log(`Client connected: ${socket.id}`);

	socket.on(order.CREATE_ORDER, async (data) => {
		var numberTable = data.numberTable,
			orderPerson = data.orderPerson,
			numberPerson = data.numberPerson,
			place = data.place,
			payment = data.payment,
			time = data.time,
			orderComment = data.comment,
			objData = {},
			deliveryPrice = data.deliverySum,
			orderPrice = 0,
			isRemoteOrder = false,
			personId = data.personId,
			result = {
				message: 'error',
				data: false,
				numberTable
			};

		if (place == 3 || place == 2 || place == 4) {
			isRemoteOrder = true;
		}

		var table = await tablesSchema.findOne({ numberTable }).populate('persons.products.array_modification')



		if (!table) {
			socket.emit(order.CREATE_ORDER, result);
			return;
		}

		var comment = '',
			commentHtml = '',
			arPersons = [];

		if (isRemoteOrder) {
			table.persons[0].personName = orderPerson.name;
		} else {
			comment = `${global.CONFIG_APP.TITLE_TABLE} - ` + md5NumberTables[numberTable] + " \r\n";
			deliveryPrice = 0;
		}

		var orderProducts = [];
		for (var i = 0; i < table.persons.length; i++) {
			var personName = table.persons[i].personName;
			arPersons.push(
				{
					personName,
					id: table.persons[i].id,
					products: []
				}
			);
			if (table.persons[i].products.length > 0) {
				commentHtml += '<h6 class="my-0 text-black">' + personName + '</h6>' + '<br><ul class="list-icons">';
				for (var j = 0; j < table.persons[i].products.length; j++) {
					var product = table.persons[i].products[j];
					arPersons[arPersons.length - 1].products.push(product);

					var est = false;
					for (var k = 0; k < orderProducts.length; k++) {
						if (orderProducts[k].hash == product.hash) {
							est = k;
						}
					}
					if (est !== false) {
						orderProducts[est].count += product.count;
					} else {
						orderProducts.push(product);
					}

					orderPrice += product.price * product.count;
					if (isRemoteOrder) {
						comment += product.title + ': ' + product.count + ' шт ';
						if (product.array_modification.length > 0) {
							for (var modifier in product.array_modification) {
								comment += '\r\n -' + product.array_modification[modifier].title;
							}
						}
						comment += '\r\n';
					} else {
						commentHtml += '<li><span class="align-middle mr-2"><i class="ti-angle-right"></i></span>' + product.title + ': ' + product.count + ' шт </li>';
						comment += personName + ' - ' + product.title + ': ' + product.count + ' шт ';
						if (product.array_modification.length > 0) {
							for (var modifier in product.array_modification) {
								comment += '\r\n -' + product.array_modification[modifier].title;
							}
						}
						comment += '\r\n';
					}
				}
				comment += '\r\n';
				commentHtml += '</ul><br>';
			}
		}

		if (!isRemoteOrder && orderComment != '') {
			comment += 'Комментарий: ' + orderComment + '\r\n\r\n';
		}


		var counter = await counterOrdersSchema.find({ _id: 'entityId' });
		if (counter.length == 0) {
			new counterOrdersSchema({
				_id: 'entityId'
			}).save();
		}

		const newOrderSchema = new orderSchema({
			hide: false,
			place: place,
			check: false,
			text: comment,
			commentHtml: commentHtml,
			orderStatus: 0,
			comment: orderComment,
			time: time,
			payment: payment,
			persons: arPersons,
			orderPrice: orderPrice,
			orderPerson: orderPerson,
			numberTable: numberTable,
			incoming_order_id: false,
			deliveryPrice: deliveryPrice,
			orderProducts: orderProducts,
			orderPersonId: personId != '0' ? personId : null
		});
		await newOrderSchema.save();
		if (payment == 1) {
			socket.emit('CREATE_CLOUD_PAYMENT', {
				newOrderSchema,
				isRemoteOrder
			});

		}
		else {
			for (var i = 0; i < table.persons.length; i++) {
				table.persons[i].products = undefined;
			}
			table.hasOrder = true;
			await table.save();
			const Markup = require('telegraf/markup');
			const arKey = [
				[
					Markup.callbackButton('❌ Отклонить', 'skip_' + newOrderSchema.incoming_order_id),
					Markup.callbackButton('✅ Принять', 'agree_' + newOrderSchema.incoming_order_id)
				]
			];
			if (isRemoteOrder)
				arKey.unshift([
					Markup.callbackButton('ℹ Информация', 'info_' + newOrderSchema.incoming_order_id),
				]);

			const inlineMessageRatingKeyboard = Markup.inlineKeyboard(arKey).extra();

			if (global.CONFIG_APP.OPTIONS[10] === true) {
				const users = await telegramUsersSchema.find({ telegramBotId: global.CONFIG_APP.telegramBotId });
				var date = moment(newOrderSchema.createdAt).locale('ru').format('LLL');
				var text = `Заказ № ${newOrderSchema.incoming_order_id}\r\n\r\n`;
				text += `${global.CONFIG_APP.PLACE[place]}\r\n\r\n`;

				if (place != 1) {
					if (newOrderSchema.time == 'yes')
						text += `К какому времени: сейчас\r\n\r\n`;
					else
						text += `К какому времени: ${newOrderSchema.time}\r\n\r\n`;
				}

				text += `Заказ создан: ${date}\r\n\r\n`;
				text += `${comment}`;
				if (payment == 2)
					text += ' Способ оплаты: картой при получении';
				else if (payment == 3)
					text += ' Способ оплаты: наличными при получении';
				const totalSum = Math.round(newOrderSchema.orderPrice * 100) / 100;
				text += `\r\n Сумма заказа: ${totalSum}`
				for (var i = 0; i < users.length; i++) {
					if (users[i].role == 1) {
						telegramBot.telegram.sendMessage(users[i].id, text, inlineMessageRatingKeyboard);
					}
				}
			}
			result.message = 'success';
			result.data = true;
			result.numberPerson = numberPerson;
			result.incoming_order_id = newOrderSchema.incoming_order_id;
			socket.broadcast.emit(order.CREATE_ORDER, result);
			socket.emit(order.CREATE_ORDER, result);
		}
	});
	
	socket.on(order.CHECK_ORDER, async (data) => {
		var numberTable = data.numberTable,
			spotId = data.spotId,
			result = {
				message: 'error',
				data: false
			};
		let { PosterApi } = require('./poster/posterapi');
		const posterConfig = global.posterConfig;

		var orders = await orderSchema.find({ numberTable, hide: false, spotId });

		if (orders.length <= 0) {
			socket.emit(order.CHECK_ORDER, result);
			return;
		}
		if (posterConfig !== false) {
			var arPromise = [];
			for (var i = 0; i < orders.length; i++) {
				arPromise.push(
					PosterApi.makePosterRequest(
						'incomingOrders.getOwnIncomingOrders', 'GET',
						{
							'incoming_order_id': orders[i].incoming_order_id
						}
					)
				);
			}
			Promise.all(arPromise).then(async (arAnswer) => {
				result.message = 'success';
				for (var i = 0; i < arAnswer.length; i++) {
					if (arAnswer[i].message != 'success')
						continue;

					for (var j = 0; j < arAnswer[i].data.length; j++) {
						var incoming_order_id = arAnswer[i].data[j].incoming_order_id,
							orderStatus = arAnswer[i].data[j].status,
							transaction_id = arAnswer[i].data[j].transaction_id;

						if (orders[j].incoming_order_id == incoming_order_id) {
							await orderSchema.findOneAndUpdate(
								{ _id: orders[j]._id },
								{
									orderStatus,
									transaction_id
								}
							);
						}
					}
				}
				result.data = arAnswer;
				result.orders = orders;
				socket.emit(order.CHECK_ORDER, result);
			});
		} else {
			result.data = true;
			result.message = 'success';
			result.orders = orders;
			socket.emit(order.CHECK_ORDER, result);
		}
	});

	

	socket.on(cart.MINUS_PRODUCT_CART, async (data) => {
		var numberPerson = data.cartNumberPerson,
			numberTable = data.numberTable,
			prodId = data.prodId,
			result = {
				message: 'error',
				prodId,
				numberTable,
				numberPerson,
				method: cart.MINUS_PRODUCT_CART
			},
			count = 0;

		await tablesSchema.findOne({ numberTable, 'persons.id': numberPerson }, function (err, tablePersons) {
			if (tablePersons == null) {
				socket.emit(cart.MINUS_PRODUCT_CART, result);
				return;
			}
			var tablePerson = tablePersons.persons.filter(function (person) {
				return person.id == numberPerson;
			}).pop();

			var product = tablePerson.products.filter(function (product) {
				return product.hash == prodId;
			}).pop();

			if (product != undefined) {
				if (product.count > 1)
					product.count = product.count - 1;
				else
					product.count = 1;
				count = product.count;
			} else {

			}

			tablePersons.save(function (err, doc) {
				if (err) {
					result.message = 'error';
					result.data = err;
				} else {
					result.message = 'success';
					result.count = count;
				}
				socket.emit(cart.MINUS_PRODUCT_CART, result);
				result.broadcast = true;
				socket.broadcast.emit(cart.MINUS_PRODUCT_CART, result);
			});
		});
	});
	socket.on(cart.PLUS_PRODUCT_CART, async (data) => {
		var numberPerson = data.cartNumberPerson,
			numberTable = data.numberTable,
			prodId = data.prodId,
			result = {
				message: 'error',
				prodId,
				numberTable,
				numberPerson,
				method: cart.PLUS_PRODUCT_CART
			},
			count = 0;

		await tablesSchema.findOne({ numberTable, 'persons.id': numberPerson }, function (err, tablePersons) {
			if (tablePersons == null) {
				socket.emit(cart.MINUS_PRODUCT_CART, result);
				return;
			}
			var tablePerson = tablePersons.persons.filter(function (person) {
				return person.id == numberPerson;
			}).pop();

			var product = tablePerson.products.filter(function (product) {
				return product.hash == prodId;
			}).pop();

			if (product != undefined) {
				product.count += 1;
				count = product.count;
			} else {

			}

			tablePersons.save(function (err, doc) {
				if (err) {
					result.message = 'error';
					result.data = err;
				} else {
					result.message = 'success';
					result.count = count;
				}
				socket.emit(cart.PLUS_PRODUCT_CART, result);
				result.broadcast = true;
				socket.broadcast.emit(cart.PLUS_PRODUCT_CART, result);
			});
		});
	});
	
};

function removeByAttr(arr, attr, value) {
	var i = arr.length;
	while (i--) {
		if (arr[i]
			&& arr[i].hasOwnProperty(attr)
			&& (arguments.length > 2 && arr[i][attr] === value)) {

			arr.splice(i, 1);

		}
	}
	return arr;
}

function checkSpot(spotId, spots) {
	var id = spots.length + 1;
	return found = spots.some(function (el) {
		return el.spot_id === spotId;
	});
}

/*
  объект продукта
*/
function getProdObj(id, count, price, title, img) {
	return { // product
		id,
		count,
		price,
		title,
		img
	};
}
/*
  пустой объект
*/
function isEmpty(obj) {
	for (let key in obj) {
		// если тело цикла начнет выполняться - значит в объекте есть свойства
		return false;
	}
	return true;
}
