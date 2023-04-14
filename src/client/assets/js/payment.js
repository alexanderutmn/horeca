import { paymentSocket } from './socketNames';
var connectionOptions = {
	"transports": ["websocket"]
};
var socket = io('/', connectionOptions);

var numberPerson = $.cookie("numberPerson"),
    getParams = getQueryParams(),
    numberTable = getParams["numberTable"],
    spotId = getParams["spotId"],
    incoming_order_id = getParams['incoming_order_id'];

$(document).ready(function (){
	if (typeof numberPerson === "undefined" || numberTable == '' || spotId == '' || incoming_order_id == '') {
		return;
	}
  socket.emit(paymentSocket.CREATE_PAYMENT, {
    numberPerson,
    spotId,
    numberTable,
    incoming_order_id
  });
});

socket.on(paymentSocket.CREATE_PAYMENT, function (answer) {
  if(answer == false) return;

  if(answer.numberPerson != numberPerson) return;

  var url = 'http://vls.easyqr.ru/order/';
      url += '?numberTable='+answer.numberTable;
      if(spotId != undefined)
        url += '&spotId='+answer.spotId;

  // if(!answer.confirmation.confirmation_token) return;
  //
  const checkout = new window.YooMoneyCheckoutWidget({
      confirmation_token: answer.payment.confirmation.confirmation_token, //Токен, который перед проведением оплаты нужно получить от ЮKassa
      return_url: url, //Ссылка на страницу завершения оплаты
      error_callback: function(error) {
          //Обработка ошибок инициализации
      }
  });

  //Отображение платежной формы в контейнере
  checkout.render('payment-form')
  //После отображения платежной формы метод render возвращает Promise (можно не использовать).
    .then(() => {
       //Код, который нужно выполнить после отображения платежной формы.
    });

  console.log(answer);
});


function getQueryParams() {
	return window.location.search.replace("?", "").split("&").reduce(function (p, e) {
		var a = e.split("=");
		p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
		return p;
	}, {});
}
