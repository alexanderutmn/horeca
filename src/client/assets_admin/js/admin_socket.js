"use strict";
// import { CONFIG_APP } from '../../../server/options';
var connectionOptions = {
	"transports": ["websocket", "polling"]
};
var socket = io('/', connectionOptions),
	getParams = getQueryParams();
// sound = new buzz.sound("/assets_admin/ayfon-sms", {
// 		formats: [ "ogg" ],
// 		preload: true,
// 		loop: false
// });

$(document).ready(function () {
	socket.emit("GET_NOTIFICATIONS", {});
	$('body').on('click', '.change-order-status', function () {
		var orderStatus = $(this).attr('data-order-status'),
			orderId = $(this).attr('data-order-id');
		socket.emit("ADMIN_CHANGE_ORDER_STATUS", {
			orderStatus,
			orderId
		});
	});
	$('body').on('click', '.delete-product-order', function () {
		var orderProductId = $(this).attr('data-product-id'),
			orderId = $(this).attr('data-order-id'),
			remove = confirm("Удалить?");
		if (remove) {
			socket.emit("ADMIN_REMOVE_ORDER_PRODUCT", {
				orderProductId,
				orderId
			});
		}
	});
	$('body').on('click', '.notification-item', function () {
		var notifyId = $(this).attr('data-id');
		socket.emit("ADMIN_CHECK_NOTIFY", {
			notifyId
		});
	});
	$('body').on('click', '.remove-product', function () {
		var removeProductId = $(this).attr('data-id'),
			remove = confirm("Удалить?");
		if (remove)
			socket.emit("ADMIN_REMOVE_PRODUCT", {
				removeProductId
			});
	});
	$('body').on('click', '.deactive-product', function () {
		var deactiveProductId = $(this).attr('data-id');
		socket.emit("ADMIN_DEACTIVE_PRODUCT", {
			deactiveProductId
		});
	});
	$('body').on('click', '.active-product', function () {
		var activeProductId = $(this).attr('data-id');
		socket.emit("ADMIN_ACTIVE_PRODUCT", {
			activeProductId
		});
	});

	$('body').on('click', '.remove-category', function () {
		var removeCategoryId = $(this).attr('data-id'),
			remove = confirm("Удалить?");
		if (remove)
			socket.emit("ADMIN_REMOVE_CATEGORY", {
				removeCategoryId
			});
	});
	$('body').on('click', '.deactive-category', function () {
		var deactiveCategoryId = $(this).attr('data-id');
		socket.emit("ADMIN_DEACTIVE_CATEGORY", {
			deactiveCategoryId
		});
	});
	$('body').on('click', '.active-category', function () {
		var activeCategoryId = $(this).attr('data-id');
		socket.emit("ADMIN_ACTIVE_CATEGORY", {
			activeCategoryId
		});
	});
	$('body').on('click', '.remove-category-modifiers', function () {
		var removeCategoryId = $(this).attr('data-id'),
			remove = confirm("Удалить?");
		if (remove)
			socket.emit("ADMIN_REMOVE_MODIFIERS_CATEGORY", {
				removeCategoryId
			});
	});
	$('body').on('click', '.deactive-category-modifiers', function () {
		var deactiveCategoryId = $(this).attr('data-id');
		socket.emit("ADMIN_DEACTIVE_MODIFIERS_CATEGORY", {
			deactiveCategoryId
		});
	});
	$('body').on('click', '.active-category-modifiers', function () {
		var activeCategoryId = $(this).attr('data-id');
		socket.emit("ADMIN_ACTIVE_MODIFIERS_CATEGORY", {
			activeCategoryId
		});
	});
	$('body').on('click', '.remove-modifiers', function () {
		var removeCategoryId = $(this).attr('data-id'),
			remove = confirm("Удалить?");
		if (remove)
			socket.emit("ADMIN_REMOVE_MODIFIERS", {
				removeCategoryId
			});
	});
	$('body').on('click', '.deactive-modifiers', function () {
		var deactiveCategoryId = $(this).attr('data-id');
		socket.emit("ADMIN_DEACTIVE_MODIFIERS", {
			deactiveCategoryId
		});
	});
	$('body').on('click', '.active-modifiers', function () {
		var activeCategoryId = $(this).attr('data-id');
		socket.emit("ADMIN_ACTIVE_MODIFIERS", {
			activeCategoryId
		});
	});
	$('body').on('click', '.remove-user', function () {
		var removeUserId = $(this).attr('data-id'),
			remove = confirm("Удалить?");
		if (remove)
			socket.emit("ADMIN_REMOVE_USER", {
				removeUserId
			});
	});
	$('body').on('click', '.deactive-user', function () {
		var deactiveUserId = $(this).attr('data-id');
		socket.emit("ADMIN_DEACTIVE_USER", {
			deactiveUserId
		});
	});
	$('body').on('click', '.active-user', function () {
		var activeUserId = $(this).attr('data-id');
		socket.emit("ADMIN_ACTIVE_USER", {
			activeUserId
		});
	});
	$('body').on('click', '.add-modifier-for-menu', function () {
		const idProduct = $(this).attr('data-id');
		const selectModifiers = document.getElementById('id_modifier_for_menu');
		if (!selectModifiers.value) {
			return;
		}
		const selectedOption = selectModifiers.options.selectedIndex;
		const remove = confirm("Добавить модификатор в блюдо?");
		const idModifier = selectModifiers.options[selectedOption].value;

		if (remove)
			socket.emit("ADMIN_ADD_MODIFIER_IN_MENU", {
				idModifier, idProduct
			});
	});
	$('body').on('click', '.add-group-modifier-for-menu', function () {
		const idProduct = $(this).attr('data-id');
		const selectModifiers = document.getElementById('id_group_modifier_for_menu');
		if (!selectModifiers.value) {
			return;
		}
		const selectedOption = selectModifiers.options.selectedIndex;
		const remove = confirm("Добавить групповой модификатор в блюдо?");
		const idGroupModifier = selectModifiers.options[selectedOption].value;

		if (remove)
			socket.emit("ADMIN_ADD_GROUP_MODIFIER_IN_MENU", {
				idGroupModifier, idProduct
			});
	});
	$('body').on('click', '.remove-modifier-from-menu', function () {
		const idModifier = $(this).attr('data-id');
		const idProduct = $('.add-modifier-for-menu').attr('data-id');
		const remove = confirm("Удалить модификатор из блюда?");

		if (remove)
			socket.emit("ADMIN_DELETE_MODIFIER_FROM_MENU", {
				idModifier, idProduct
			});
	});
	$('body').on('click', '.remove-group-modifier-from-menu', function () {
		const idGroupModifier = $(this).attr('data-id');
		const idProduct = $('.add-group-modifier-for-menu').attr('data-id');
		const remove = confirm("Удалить групповой модификатор из блюда?");

		if (remove)
			socket.emit("ADMIN_DELETE_GROUP_MODIFIER_FROM_MENU", {
				idGroupModifier, idProduct
			});
	});
	$('body').on('click', '.deactive-group-modifiers', function () {
		var deactiveCategoryId = $(this).attr('data-id');
		socket.emit("ADMIN_DEACTIVE_GROUP_MODIFIERS", {
			deactiveCategoryId
		});
	});
	$('body').on('click', '.active-group-modifiers', function () {
		var activeCategoryId = $(this).attr('data-id');
		socket.emit("ADMIN_ACTIVE_GROUP_MODIFIERS", {
			activeCategoryId
		});
	});
});


socket.on("GET_NOTIFICATIONS", function (answer) {
	if (answer.length > 0) {
		$('#notify-icon').removeClass('primary');
		$('#notify-icon').addClass('warning');
		$('#notify-icon .pulse-css').show();
		$('#DZ_W_Notification1 ul').html('');
		for (var i = 0; i < answer.length; i++) {
			$('#DZ_W_Notification1 ul').append(`<li data-id="${answer[i]._id}" class="notification-item">
									 <div class="timeline-panel">
										  <div class="media mr-2">
												 <img style="display: none;" alt="image" width="50" src="/assets_admin/images/qr-code.png">
										  </div>
										  <div class="media-body">
												 <h6 class="mb-1">${answer[i].title}</h6>
												 <small class="d-block">${answer[i].dateTimeString}</small>
										  </div>
									 </div>
							  </li>`);

		}
		// setTimeout(function(){
		// 	sound.play();
		// 	console.log(sound.play());
		// 	console.log('sdadasdsa');
		// }, 2000);
		// window.location.reload(false);
	} else {
		$('#notify-icon').addClass('primary');
		$('#notify-icon').removeClass('warning');
		$('#notify-icon .pulse-css').hide();
	}
});

socket.on("ADMIN_CHECK_NOTIFY", function (answer) {
	if (answer.message == 'success' && answer.data != false) {
		// window.location.reload(false);
		socket.emit("GET_NOTIFICATIONS", {});
	} else {
		$.notify("Ошибка! Попробуйте снова", "error", {
			position: "top center"
		});
	}
	console.log(answer);
});
socket.on("ADMIN_CHANGE_ORDER_STATUS", function (answer) {
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! Попробуйте снова", "error", {
			position: "top center"
		});
	}
	console.log(answer);
});

socket.on("ADMIN_REMOVE_ORDER_PRODUCT", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});

socket.on("ADMIN_REMOVE_PRODUCT", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_DEACTIVE_PRODUCT", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_ACTIVE_PRODUCT", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});




socket.on("ADMIN_REMOVE_CATEGORY", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_DEACTIVE_CATEGORY", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_ACTIVE_CATEGORY", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_REMOVE_MODIFIERS_CATEGORY", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_DEACTIVE_MODIFIERS_CATEGORY", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_ACTIVE_MODIFIERS_CATEGORY", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_REMOVE_MODIFIERS", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_DEACTIVE_MODIFIERS", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_ACTIVE_MODIFIERS", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_ADD_MODIFIER_IN_MENU", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_DELETE_MODIFIER_FROM_MENU", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_ADD_GROUP_MODIFIER_IN_MENU", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_DELETE_GROUP_MODIFIER_FROM_MENU", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_ACTIVE_GROUP_MODIFIERS", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
socket.on("ADMIN_DEACTIVE_GROUP_MODIFIERS", function (answer) {
	console.log(answer);
	if (answer.message == 'success' && answer.data != false) {
		window.location.reload(false);
	} else {
		$.notify("Ошибка! " + answer.message, "error", {
			position: "top center"
		});
	}
});
function getQueryParams() {
	return window.location.search.replace("?", "").split("&").reduce(function (p, e) {
		var a = e.split("=");
		p[decodeURIComponent(a[0])] = decodeURIComponent(a[1]);
		return p;
	}, {});
}
