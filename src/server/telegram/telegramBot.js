const { Telegraf } = require('telegraf');
const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
// const { CONFIG_APP } = require('../options');
const commandParts = require('telegraf-command-parts');
const session = require('telegraf/session');
const mongoose = require('mongoose');
const moment = require('moment'); // require
const telegramUsersSchema = mongoose.model('telegramUsersSchema');
const orderSchema = mongoose.model('orderSchema');
const mailer = require('../email/emailSendler');
// const { telegramBotId } = require('./botId');

const roles = {
  '1': 'Администратор',
  '2': 'Официант'
};
const telegramOrders = [];

var isMessageForSupport = false;
var messageForSupport = false;
var whichOrdersWhow = false;
var lastSwich = {};
var mailOptions = {
  from: 'support@easyqr.ru',
  to: 'support@easyqr.ru',
  subject: 'Сообщение из Телеграм Бота',
  text: 'emty Message'
};

// ctx.state. - используется для передачи данных между контекстами

const telegramBot = new Telegraf(global.CONFIG_APP.telegramBotId);

telegramBot.catch((err, ctx) => {
  console.log(`OOPS, ERROR: ${ctx.updateType}`, err);
});

// telegramBot.use(Telegraf.log())
telegramBot.use(commandParts());
// telegramBot.use(session())

telegramBot.start((ctx) => {
  ctx.reply('Добро пожаловать! \n\n Чтобы получать сообщеня от бота, активируйте его с помощью 8-ми значного кода. \n\n /active [код]',
    Markup.keyboard([
      ['🔍 Заказы', '👥 Персонал'], // Row1 with 2 buttons
      ['✅ Активация бота', '💬 Написать нам'], // Row2 with 2 buttons
      ['❌ Выйти']
    ])
      // .oneTime()
      .resize()
      .extra()
  )
});

// Активация бота
telegramBot.command('active', async (ctx) => {
  var args = ctx.state.command.args,
    user = ctx.update.message.from;

  isMessageForSupport = false;

  if (ctx.state.command.args.length != 8) {
    ctx.reply('Ошибка кода');
    return;
  }

  if (await hasUser(user.id)) {
    ctx.reply('Бот уже активирован');
    return;
  }

  if (args == global.CONFIG_APP.adminCode) {
    user.role = 1;
    user.telegramBotId = global.CONFIG_APP.telegramBotId;
    const newUser = new telegramUsersSchema(user);
    await newUser.save();
    ctx.reply('Бот активирован');
  } else if (args == global.CONFIG_APP.waiterCode) {
    user.role = 2;
    user.telegramBotId = global.CONFIG_APP.telegramBotId;
    const newUser = new telegramUsersSchema(user);
    await newUser.save();
    ctx.reply('Бот активирован');
  } else {
    ctx.reply('Ошибка кода');
    return;
  }
});

telegramBot.command('quit', async (ctx) => {
  // Explicit usage
  // ctx.telegram.leaveChat(ctx.message.chat.id)

  var user = ctx.update.message.from;

  isMessageForSupport = false;

  await deleteUser(user.id);
  ctx.reply('Вы вышли');

  // Using context shortcut
  // ctx.leaveChat()
})

//menu
telegramBot.command('menu', (ctx) => {
  return ctx.reply('Главное меню',
    Markup.inlineKeyboard([
      [
        Markup.callbackButton('🔍 Заказы', 'orders'),
        Markup.callbackButton('👥 Персонал', 'personal')
      ],
      [
        Markup.callbackButton('✅ Активация бота', 'active'),
        Markup.callbackButton('💬 Написать нам', 'write_me')
      ],
      [
        Markup.callbackButton('❌ Выйти', 'exit'),
      ]
    ]).extra(),
  )
})

// выйти
telegramBot.action('exit', async (ctx) => {
  var user = ctx.update.callback_query.from;

  isMessageForSupport = false;

  await deleteUser(user.id);
  ctx.editMessageText('Вы вышли',
    {
      chat_id: ctx.update.callback_query.message.chat.id,
      message_id: ctx.update.callback_query.message.message_id,
      parse_mode: 'HTML'
    }
  );
})
telegramBot.hears('❌ Выйти', async (ctx) => {
  var user = ctx.update.message.from;

  isMessageForSupport = false;

  await deleteUser(user.id);
  ctx.reply('Вы вышли',
    {
      chat_id: ctx.update.message.chat.id,
      message_id: ctx.update.message.message_id,
      parse_mode: 'HTML'
    }
  );
});

// заказы
telegramBot.action('orders', async (ctx) => {
  // await ctx.answerCbQuery()
  var user = ctx.update.callback_query.from;

  isMessageForSupport = false;

  if (!await hasUser(user.id)) {
    ctx.editMessageText('Активируйте бота');
    return;
  }

  if (!await isAdmin(user.id)) {
    ctx.editMessageText('Нет доступа');
    return;
  }
  ctx.editMessageText('Какие заказы отобразить', Telegraf.Extra.markdown().markup((m) =>
    m.inlineKeyboard([
      [
        Markup.callbackButton('🤵‍ В заведении', 'whichOrders_here'),
        Markup.callbackButton('🥡 С собой', 'whichOrders_yourself')
      ],
      [
        Markup.callbackButton('🚚 Доставка', 'whichOrders_delivery')
      ]
    ]
    )
  )
  );
})
telegramBot.hears('🔍 Заказы', async (ctx) => {
  var user = ctx.update.message.from;

  isMessageForSupport = false;
  if (!await hasUser(user.id)) {
    ctx.reply('Активируйте бота');
    return;
  }
  if (!await isAdmin(user.id)) {
    ctx.reply('Нет доступа');
    return;
  }

  ctx.reply('Какие заказы отобразить', Telegraf.Extra.markdown().markup((m) =>
    m.inlineKeyboard([
      [
        Markup.callbackButton('🤵‍ В заведении', 'whichOrders_here'),
        Markup.callbackButton('🥡 С собой', 'whichOrders_yourself')
      ],
      [
        Markup.callbackButton('🚚 Доставка', 'whichOrders_delivery')
      ]
    ]
    )
  )
  );

});

// активация бота
telegramBot.action('active', async (ctx) => {
  // await ctx.answerCbQuery()
  var user = ctx.update.callback_query.from,
    mess = '';

  isMessageForSupport = false;

  if (await hasUser(user.id)) {
    mess = 'Бот уже активирован';
  }
  mess = 'Для активации введите /active 8-ми значный код';
  ctx.editMessageText(mess,
    {
      chat_id: ctx.update.callback_query.message.chat.id,
      message_id: ctx.update.callback_query.message.message_id,
      parse_mode: 'HTML'
    }
  );
});
telegramBot.hears('✅ Активация бота', async (ctx) => {
  var user = ctx.update.message.from,
    mess = '';

  isMessageForSupport = false;
  if (await hasUser(user.id)) {
    mess = 'Бот уже активирован';
  }
  mess = 'Для активации введите /active 8-ми значный код';
  ctx.reply(mess,
    {
      chat_id: ctx.update.message.chat.id,
      message_id: ctx.update.message.message_id,
      parse_mode: 'HTML'
    }
  );
});

// список персонала
telegramBot.action('personal', async (ctx) => {
  var user = ctx.update.callback_query.from;

  isMessageForSupport = false;

  if (!await hasUser(user.id)) {
    ctx.reply('Активируйте бота');
    return;
  }

  if (!await isAdmin(user.id)) {
    ctx.reply('Нет доступа');
    return;
  }

  const users = await telegramUsersSchema.find({ telegramBotId: global.CONFIG_APP.telegramBotId });
  var mess = '';
  for (var i = 0; i < users.length; i++) {
    var last_name = users[i].last_name;
    if (last_name == undefined)
      last_name = "";
    mess = mess + `\r\n@${users[i].username} ${users[i].first_name} ${last_name} <b>${roles[users[i].role]}</b>`;
  }

  ctx.editMessageText(mess,
    {
      chat_id: ctx.update.callback_query.message.chat.id,
      message_id: ctx.update.callback_query.message.message_id,
      parse_mode: 'HTML'
    }
  );

  return;
})
telegramBot.hears('👥 Персонал', async (ctx) => {
  var user = ctx.update.message.from;

  isMessageForSupport = false;

  if (!await hasUser(user.id)) {
    ctx.reply('Активируйте бота');
    return;
  }

  if (!await isAdmin(user.id)) {
    ctx.reply('Нет доступа');
    return;
  }

  const users = await telegramUsersSchema.find({ telegramBotId: global.CONFIG_APP.telegramBotId });
  var mess = '';
  for (var i = 0; i < users.length; i++) {
    var last_name = users[i].last_name;
    if (last_name == undefined)
      last_name = "";
    mess = mess + `\r\n@${users[i].username} ${users[i].first_name} ${last_name} <b>${roles[users[i].role]}</b>`;
    // ctx.replyWithHTML(mess);
  }

  ctx.reply(mess,
    {
      chat_id: ctx.update.message.chat.id,
      message_id: ctx.update.message.message_id,
      parse_mode: 'HTML'
    }
  );
});

telegramBot.action('back', async (ctx) => {
  ctx.editMessageText('Какие заказы отобразить', Telegraf.Extra.markdown().markup((m) =>
    m.inlineKeyboard([
      [
        Markup.callbackButton('🤵‍ В заведении', 'whichOrders_here'),
        Markup.callbackButton('🥡 С собой', 'whichOrders_yourself')
      ],
      [
        Markup.callbackButton('🚚 Доставка', 'whichOrders_delivery')
      ]
    ]
    )
  )
  );
  return;
})

// написать нам
telegramBot.action('write_me', async (ctx) => {
  // await ctx.answerCbQuery()
  var user = ctx.update.callback_query.from;
  isMessageForSupport = true;
  ctx.editMessageText('⬇️ Напишите сообщение для службы поддержки ⬇️',
    {
      chat_id: ctx.update.callback_query.message.chat.id,
      message_id: ctx.update.callback_query.message.message_id,
      parse_mode: 'HTML'
    }
  );

})
telegramBot.hears('💬 Написать нам', async (ctx) => {
  var user = ctx.update.message.from;
  isMessageForSupport = true;
  ctx.reply('⬇️ Напишите сообщение для службы поддержки ⬇️',
    {
      chat_id: ctx.update.message.chat.id,
      message_id: ctx.update.message.message_id,
      parse_mode: 'HTML'
    }
  );
});

telegramBot.on('callback_query', async (ctx) => {
  var mess = ctx.update.callback_query.data.split('_');
  var command = mess[0];
  var text = ctx.update.callback_query.message.text;
  isMessageForSupport = false;

  if (command == 'skip') {
    var id = mess[1],
      status = 7;
    text += `\r\n\r\n Отклонен ❌`;
    processOrder(id, status, text, ctx);
  } else if (command == 'agree') {
    var id = mess[1],
      status = 1;
    text += `\r\n\r\n Принят, готовится ✅`;
    processOrder(id, status, text, ctx);
  } else if (command == 'oncourier') {
    var id = mess[1],
      status = 3;
    text += `\r\n\r\n У курьера 🚚`;
    processOrder(id, status, text, ctx);
  } else if (command == 'ready') {
    var id = mess[1],
      status = 4;
    text += `\r\n\r\n Выдан 📦`;
    processOrder(id, status, text, ctx);
  } else if (command == 'info') {
    var id = mess[1];
    showInfoOrder(id, text, ctx);
  } else if (command == 'whichOrders') {
    whichOrdersWhow = mess[1];
    showWhichOrders(text, ctx); // выбор какие заказы отображать
  } else if (command == 'showOrders') {
    var showOrders = mess[1];
    showOrdersFunc(text, ctx, showOrders); // показать заказы
  }
});

// отображение заказов
async function showOrdersFunc(text, ctx, showOrders) {
  var start = moment().startOf('day'); // set to 12:00 am today
  var end = moment().endOf('day'); // set to 23:59 pm today
  var dateFind = { createdAt: { $gte: start, $lt: end } };
  var filter = {};
  var place1 = 1,
      place2 = 1;

  if(whichOrdersWhow == 'yourself') place1 = 2;
  if(whichOrdersWhow == 'delivery') place1 = 3;
  place2 = place1;
  if(whichOrdersWhow == 'here') { place1 = 1; place2 = 4 };

  if(showOrders == 'skip'){
    filter = {
      $and: [
        { check: false },
        { createdAt: {$gte: start, $lt: end} }
      ],
      $or: [ { place: place1 }, { place: place2 } ]
    };
  } else if(showOrders == 'cancel'){
    filter = {
      $and: [
        { check: true },
        { orderStatus: 7 },
        { createdAt: {$gte: start, $lt: end} }
      ],
      $or: [ { place: place1 }, { place: place2 } ]
    };
  } else if(showOrders == 'agree'){
    filter = {
      $and: [
        { check: true },
        { orderStatus: 1 },
        { createdAt: {$gte: start, $lt: end} }
      ],
      $or: [ { place: place1 }, { place: place2 } ]
    };
  } else if(showOrders == 'onCourier'){
    filter = {
      $and: [
        { check: true },
        { orderStatus: 3 },
        { createdAt: {$gte: start, $lt: end} }
      ],
      $or: [ { place: place1 }, { place: place2 } ]
    };
  } else if(showOrders == 'ready'){
    filter = {
      $and: [
        { check: true },
        { orderStatus: 4 },
        { createdAt: {$gte: start, $lt: end} }
      ],
      $or: [ { place: place1 }, { place: place2 } ]
    };
  // if (whichOrdersWhow == 'here') place = 1;
  // if (whichOrdersWhow == 'yourself') place = 2;
  // if (whichOrdersWhow == 'delivery') place = 3;
  //
  // if (showOrders == 'skip') {
  //   filter = { check: false, createdAt: { $gte: start, $lt: end }, place: place };
  // } else if (showOrders == 'cancel') {
  //   filter = { check: true, orderStatus: 7, createdAt: { $gte: start, $lt: end }, place: place };
  // } else if (showOrders == 'agree') {
  //   filter = { check: true, orderStatus: 1, createdAt: { $gte: start, $lt: end }, place: place };
  // } else if (showOrders == 'onCourier') {
  //   filter = { check: true, orderStatus: 3, createdAt: { $gte: start, $lt: end }, place: place };
  // } else if (showOrders == 'ready') {
  //   filter = { check: true, orderStatus: 4, createdAt: { $gte: start, $lt: end }, place: place };
  }

  if (isEmpty(filter)) {
    ctx.reply('Заказы не найдены');
    return;
  }

  const orders = await orderSchema.find(filter);
  if (orders.length == 0) {
    ctx.reply('Заказы не найдены');
  } else {
    for (var i = 0; i < orders.length; i++) {
      var text = `Заказ № ${orders[i].incoming_order_id} \r\n\r\n`;
          text += `${global.CONFIG_APP.PLACE[place1]}\r\n\r\n`;
          if(orders[i].time == 'yes')
    				text += `К какому времени: сейчас\r\n\r\n`;
    			else
    				text += `К какому времени: ${orders[i].time}\r\n\r\n`;
          text += `Заказ создан: ${moment(orders[i].createdAt).locale('ru').format('LLL')}\r\n\r\n`;
          text += `${orders[i].text}`;
      // text += `${global.CONFIG_APP.PLACE[place]}\r\n\r\n`;
      // if (orders[i].time == 'yes')
      //   text += `К какому времени: сейчас\r\n\r\n`;
      // else
      //   text += `К какому времени: ${orders[i].time}\r\n\r\n`;
      // text += `Заказ создан: ${moment(orders[i].createdAt).locale('ru').format('LLL')}\r\n\r\n`;
      // text += `${orders[i].text}`;
      // const totalSum = Math.round(orders[i].orderPrice * 100) / 100;
      // text += `\r\n Сумма заказа: ${totalSum}`;

      var arKey = [];
      if (orders[i].orderStatus == 0) {
        arKey.push([
          Markup.callbackButton('❌ Отклонить', 'skip_' + orders[i].incoming_order_id),
          Markup.callbackButton('✅ Принять', 'agree_' + orders[i].incoming_order_id)
        ]);
      }
      if(
        (orders[i].orderStatus == 1 && place1 == 2) ||
        (orders[i].orderStatus == 3 && place1 == 3) ||
        (orders[i].orderStatus == 1 && place1 == 1)
      ){
      // if (
      //   (orders[i].orderStatus == 1 && place == 2) ||
      //   (orders[i].orderStatus == 3 && place == 3) ||
      //   (orders[i].orderStatus == 1 && place == 1)
      // ) {
        arKey.push([
          Markup.callbackButton('❌ Отменить', 'skip_' + orders[i].incoming_order_id),
          Markup.callbackButton('📦 Выдать', 'ready_' + orders[i].incoming_order_id)
        ]);
      }
      if(orders[i].orderStatus == 1 && place1 == 3){
      // if(orders[i].orderStatus == 1 && place == 3) {
        arKey.push([
          Markup.callbackButton('❌ Отменить', 'skip_' + orders[i].incoming_order_id),
          Markup.callbackButton('🚚 Передан курьеру', 'oncourier_' + orders[i].incoming_order_id)
        ]);
        arKey.push([
          Markup.callbackButton('📦 Выдать', 'ready_' + orders[i].incoming_order_id)
        ]);
      }

      if (orders[i].orderStatus == 1) text += `\r\n\r\n Принят, готовится ✅`;
      if (orders[i].orderStatus == 7) text += `\r\n\r\n Отклонен ❌`;
      if (orders[i].orderStatus == 3) text += `\r\n\r\n У курьера 🚚`;
      if (orders[i].orderStatus == 4) text += `\r\n\r\n Выдан 📦`;

      if (orders[i].place != 1) {
        arKey.unshift([
          Markup.callbackButton('ℹ Информация', 'info_' + orders[i].incoming_order_id),
        ]);
      }

      // await ctx.reply(text);
      await ctx.reply(text, Markup.inlineKeyboard(arKey).extra());
    }
  }
}

// выбор какие заказы отобразить
function showWhichOrders(text, ctx) {
  var arKey = [
    [
      Markup.callbackButton('❌ Отмененные', 'showOrders_cancel'),
      Markup.callbackButton('👨🏻‍🍳 Готовятся', 'showOrders_agree')
    ],
    [
      Markup.callbackButton('🙈 Пропущенные', 'showOrders_skip'),
      Markup.callbackButton('📦 Выданные', 'showOrders_ready')
    ]
  ],
    place = 1;

  if (whichOrdersWhow == 'here') { place = 1; text = '🤵‍ В заведении'; }
  if (whichOrdersWhow == 'yourself') { place = 2; text = '🥡 С собой'; }
  if (whichOrdersWhow == 'delivery') { place = 3; text = '🚚 Доставка'; }

  if (place == 3) {
    arKey.push([
      Markup.callbackButton('🚚 У курьера', 'showOrders_onCourier')
    ]);
  }
  arKey.push([
    Markup.callbackButton('⏪ Назад', 'back')
  ]);
  lastSwich.text = text;
  lastSwich.arKey = arKey;
  ctx.editMessageText(text, Telegraf.Extra.markdown().markup((m) =>
    m.inlineKeyboard(
      arKey
    )
  )
  );
}

// изменяется статус заказа
async function processOrder(id, status, text, ctx) {
  var filter = { incoming_order_id: id };
  var newField = { orderStatus: status, check: true };

  const order = await orderSchema.findOneAndUpdate(
    filter,
    newField,
    (err, res) => {
      ctx.editMessageText(
        text,
        ctx.update.callback_query.message.message_id
      );
    }
  );
}

// показать информацию о заказе
async function showInfoOrder(id, text, ctx) {
  await orderSchema.findOne(
    {
      incoming_order_id: id
    },
    (err, res) => {
      text += `\r\n\r\n ---ИНФОРМАЦИЯ О ЗАКАЗЕ---`;
      text += `\r\n Имя: ${res.orderPerson.name}`;
      text += `\r\n Телефон: ${res.orderPerson.phone}`;
      if (res.place == 3) {
        if (res.orderPerson.street != '') text += `\r\n Улица: ${res.orderPerson.street}`;
        if (res.orderPerson.house != '') text += `\r\n Дом: ${res.orderPerson.house}`;
        if (res.orderPerson.flat != '') text += `\r\n Этаж: ${res.orderPerson.flat}`;
      }
      if (res.comment != '') text += `\r\n Комментарий: ${res.comment}`;
      const totalSum = Math.round(res.orderPrice * 100) / 100;
      text += `\r\n Сумма заказа: ${totalSum}`;
      var arKey = [];

      if (res.orderStatus == 0)
        arKey = [
          Markup.callbackButton('❌ Отклонить', 'skip_' + res.incoming_order_id),
          Markup.callbackButton('✅ Принять', 'agree_' + res.incoming_order_id)
        ];
      if (res.orderStatus == 1 && res.place == 2)
        arKey = [
          Markup.callbackButton('❌ Отклонить', 'skip_' + res.incoming_order_id),
          Markup.callbackButton('📦 Выдать', 'ready_' + res.incoming_order_id)
        ];
      if (res.orderStatus == 1 && res.place == 3)
        arKey = [
          [
            Markup.callbackButton('❌ Отклонить', 'skip_' + res.incoming_order_id),
            Markup.callbackButton('🚚 Передан курьеру', 'oncourier_' + res.incoming_order_id)
          ],
          [
            Markup.callbackButton('📦 Выдать', 'ready_' + res.incoming_order_id)
          ]
        ];
      if (res.orderStatus == 3 && res.place == 3)
        arKey = [
          [
            Markup.callbackButton('❌ Отклонить', 'skip_' + res.incoming_order_id),
            Markup.callbackButton('📦 Выдать', 'ready_' + res.incoming_order_id)
          ]
        ];
      if (res.orderStatus == 4) arKey = [];
      ctx.editMessageText(text, Telegraf.Extra.markdown().markup((m) =>
        m.inlineKeyboard(arKey)
      )
      );
      // ctx.editMessageText(text);
    }
  );
}

telegramBot.on('text', async (ctx) => {
  if (isMessageForSupport == true) {
    messageForSupport = ctx.message.text;
    mailOptions.text = `${ctx.botInfo.first_name}\n\n${ctx.botInfo.username}\n\n${ctx.message.text}`;
    mailer(mailOptions);
    isMessageForSupport = false;
    ctx.reply('Спасибо! Ваше сообщение отправлено в нашу службу поддержки, скоро с вами свяжутся.');
  } else {
    ctx.reply('Добро пожаловать! \n\nЧтобы получать сообщеня от бота, активируйте его с помощью 8-ми значного кода. \n\n/active [код]')
  }
})

async function hasUser(id) {
  const result = await telegramUsersSchema.findOne({ id: id, telegramBotId: global.CONFIG_APP.telegramBotId });
  if (result == null) {
    return false;
  } else {
    return true;
  }
}

async function deleteUser(id) {
  const result = await telegramUsersSchema.find({ id: id, telegramBotId: global.CONFIG_APP.telegramBotId }).deleteOne().exec();
}

async function isAdmin(id) {
  const result = await telegramUsersSchema.findOne({ id: id, telegramBotId: global.CONFIG_APP.telegramBotId });
  if (result != null && result.role == 1) {
    return true;
  } else {
    return false;
  }
}

function isEmpty(obj) {
  for (var prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      return false;
    }
  }

  return JSON.stringify(obj) === JSON.stringify({});
}

module.exports.telegramBot = telegramBot;
