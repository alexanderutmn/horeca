"use strict";
import '../css/style.css';
import {
	cart, api, person, order,
	socTypeMenu
} from './socketNames';
import { md5NumberTables } from './numberTables';
import { htmlTemplates } from './htmlTemplates';
var connectionOptions = {
	"transports": ["websocket"]
};

var socket = io('/', connectionOptions),
	numberPerson = $.cookie("numberPerson"),
	getParams = getQueryParams(),
	numberTable = getParams["numberTable"],
	spotId = getParams["spotId"],
	place = getParams['place'],
	typeMenuId = getParams["typeMenuId"],
	categoryId = getParams["categoryId"],
	oldNumberTable = numberTable,
	isRemoteOrder = false,
	canCreateOrder = true, // для проверки минимальной суммы заказа
	messageMinSummOrder = '', // сообщение для минимальной суммы заказа
	scrollEvent = false,
	objOpenProduct = {},
	showSlideCategories = false,
	$categories = $(".categories-main"),
	errorQRcode = false;

$('.lazy').lazy();

const buttonPopupCloseDish = document.querySelector('.popup__button-close-dish');
const buttonPopupCloseDishLine = document.getElementById('popup__button-close-dish-line');
const popupElementDish = document.querySelector('.popup-open-dish');
const popupContainerDish = document.querySelector('.popup__container-dish');

$(document).ready(function () {
	formatPrice();

	if (numberTable == undefined) {
		isRemoteOrder = true;
		numberTable = numberPerson;
	}
	if (!isRemoteOrder && (numberTable == "" || md5NumberTables[numberTable] == undefined)) {
		$.notify("Ошибка QR. Попробуйте снова", "error", {
			position: "top center"
		});
		errorQRcode = true;
	}

	if (window.location.pathname == '/cart/') {
		checkCartTable();
		$('.cart-delivery-block__item').removeClass('active');
		$('.cart-delivery-block__item:not(.disable)').first().addClass('active');
		$('.cart-delivery-block__item.active').trigger('click');
		if (!isRemoteOrder) {
			$('#cart-delivery-block__item_payment-card').text('Картой официанту');
			$('#cart-delivery-block__item_payment-cash').text('Наличными официанту');
		}
		else {
			$('#cart-delivery-block__item_payment-card').text('Картой при получении');
			$('#cart-delivery-block__item_payment-cash').text('Наличными при получении');
		}
	}

	if (window.location.pathname != '/') {
		scrollEvent = true;
	}
	checkWindowWidth();

	$('.cart-detail input[name="phone"]').mask("+7(999) 999-9999");
	$('.person-sign #personPhone').mask("+7(999) 999-9999");
	$('.person-page-update #personPhone').mask("+7(999) 999-9999");
	$('.booking #booking-phone').mask("+7(999) 999-9999");

	new Promise((resolve, reject) => {
		/*
		  multipleFilterMasonry
		*/
		if ($(window).width() > 768) {
			window.dispatchEvent(new Event('resize'));
		}
		/*
		  multipleFilterMasonry
		*/
		/*
		  swipe
		*/
		$("#popup__button-close-dish-line").swipe({
			swipeDown: function (event, direction, distance, duration, fingerCount, fingerData) {
				popupCloseDish()
			},
			threshold: 30
		});
		$(".product-popup__img-line").swipe({
			swipeDown: function (event, direction, distance, duration, fingerCount, fingerData) {
				closeProduct();
			},
			threshold: 30
		});
		$(".product-popup__img-line_no_image").swipe({
			swipeDown: function (event, direction, distance, duration, fingerCount, fingerData) {
				closeProductNoImage();
			},
			threshold: 30
		});
		$("#slide-menu").swipe({
			swipeLeft: function (event, direction, distance, duration, fingerCount, fingerData) {
				closeSlideMenu();
			},
			threshold: 30
		});
		$(".order-detail__line").swipe({
			swipeDown: function (event, direction, distance, duration, fingerCount, fingerData) {
				closeDetailOrder();
			},
			threshold: 30
		});
		$(".popup__button-close-with-modifiers-line").swipe({
			swipeDown: function (event, direction, distance, duration, fingerCount, fingerData) {
				closePopupWithModifiers(false);
			},
			threshold: 30
		});
		/*
			  swipe
			*/
		/*
		  slick
		*/
		$('.cart-persons-block').slick({
			infinite: false,
			variableWidth: true,
			swipeToSlide: true,
			arrows: false,
			centerMode: true,
		});
		$('.order-detail__products').slick({
			slidesToShow: 1,
			slidesToScroll: 1,
			dots: true,
			arrows: false
		});
		$('.events-block').slick({
			autoplay: true,
			arrows: false,
			slidesToShow: 1,
			slidesToScroll: 1,
			infinite: true,
			mobileFirst: true,
			dots: true,
		});
		/*
		  slick
		*/
		reject(true);
	})
		.then((e) => { })
		.catch((e) => { })

	/*
		По скроллу выбор категории
	  */
	$(window).scroll(function () {
		if (scrollEvent) return;
		var $categoriesBlocks = $(".category-block"),
			scrollHeight = $(document).height(),
			scrollPosition = $(window).height() + $(window).scrollTop(),
			firstCat = $('.category-block')[0].offsetTop;
		if ($(window).scrollTop() > firstCat && !showSlideCategories) {
			showSlideCategories = true;
		} else if ($(window).scrollTop() < firstCat && showSlideCategories) {
			showSlideCategories = false;
		}

		if ((scrollHeight - scrollPosition) / scrollHeight === 0) {
			bottomPosition();
			return;
		} else if ($(window).scrollTop() == 0) {
			topPosition();
			return;
		}
		$categoriesBlocks.each(function (i, el) {
			checkScrollCat(el);
		});
	});

	setTimeout(function () {
		if (window.location.pathname == '/') {
			$categories.owlCarousel({
				margin: 10,
				autoWidth: true,
				items: 3,
				dots: false,
			});
		}
		topPosition();
		hideLoader();
	}, 2000)
});


$("body").on("click", "#send-code", function (e) {
	var personPhone = $('#personPhone').val(),
		personCode = $('#personCode').val();

	if (personPhone == '' || personPhone == undefined) {
		$.notify("Введите номер телефона", "error", {
			position: "top center"
		});
		return;
	}
	if ($('#person-sign__code-input').hasClass('hidden')) {
		socket.emit("GET_CODE", {
			personPhone
		});
	} else {
		if (personCode == '' || personCode == undefined) {
			$.notify("Введите код", "error", {
				position: "top center"
			});
			return;
		}
		$('#person-sign-form').trigger('submit');

	}
});

$("body").on("submit", ".popup-name__form", function (e) {
	e.preventDefault();
	var val = $('.popup-name__form-input input').val();
	if (val == '') {
		$.notify("Пустое поле", "error", {
			position: "top center"
		});
	} else {
		if (errorQRcode) {
			$.notify("Ошибка QR. Попробуйте снова", "error", {
				position: "top center"
			});
			e.preventDefault();
			return false;
		} else {
			socket.emit(person.ADD_PERSON_NAME, {
				personName: val,
				numberPerson,
				numberTable
			});
		}
	}

});




socket.on(order.CREATE_ORDER, function (answer) {
	if (answer.numberTable == numberTable) {
		if (answer.message == 'success' && answer.data != false) {

			if (answer.numberPerson == numberPerson && answer.payment == 1) {
				if (spotId != undefined)
					window.location.href = '/payment/?numberTable=' + numberTable + '&incoming_order_id=' + answer.incoming_order_id;
				else
					window.location.href = '/payment/?numberTable=' + numberTable + '&incoming_order_id=' + answer.incoming_order_id;
			} else {
				if (isRemoteOrder)
					window.location.href = '/order-made/?incoming_order_id=' + answer.incoming_order_id;
				else
					window.location.href = '/order-made/?numberTable=' + answer.numberTable + '&incoming_order_id=' + answer.incoming_order_id;
			}

		} else {
			$.notify("Ошибка создания заказа", "error", {
				position: "top center"
			});
		}
	}
});
socket.on(cart.REMOVE_PRODUCT, function (answer) {
	if (answer.numberTable != numberTable) return;
	if (answer.message == 'success') {
		checkCartTable();
		if (answer.numberPerson == numberPerson) {
			checkCartPerson();
		}
	}
});
socket.on(order.GET_ORDER, function (answer) {
	// console.log("GET_ORDER: ",answer)
	if (answer.data.numberTable == numberTable) {
		if (answer.message == 'success' && answer.data != false) {
			var orderResult = answer.data,
				finalPrice = orderResult.orderPrice;
			if (orderResult.place == 1) {
				$('.params-user').hide();
				$('.params-adress').hide();
				$('.order-detail__general-delivery').hide();
			} else if (orderResult.place == 2 || orderResult.place == 4) {
				$('#params-user__value').html(orderResult.orderPerson.name + ', ' + orderResult.orderPerson.phone);
				$('.order-detail__general-delivery').hide();
				$('.params-user').show();
				$('.params-adress').hide();
			} else {
				$('#params-user__value').html(orderResult.orderPerson.name + ', ' + orderResult.orderPerson.phone);
				$('#params-adress__value').html(orderResult.orderPerson.street + ', ' + orderResult.orderPerson.house + ', ' + orderResult.orderPerson.flat);
				$('#order-detail__general-delivery-value').html(orderResult.deliveryPrice);
				finalPrice += orderResult.deliveryPrice;
				$('.params-user').show();
				$('.params-adress').show();
			}
			$('#order-detail__general-summ-value').html(orderResult.orderPrice);
			$('#order-detail__general-final-value').html(finalPrice);
			var productBlock = `<div class="order-detail__products-list">`;
			var counter = 0,
				flag = false;

			for (var j = 0; j < orderResult.orderProducts.length; j++) {
				flag = false;
				productBlock += `<div class="order-product">
					<div class="order-product__image" style="background-image: url(${orderResult.orderProducts[j].img})">
					</div>
					<div class="order-product__title">
						${orderResult.orderProducts[j].title}, <span class="order-product__title-unit">${orderResult.orderProducts[j].weight} ${orderResult.orderProducts[j].unit}</span>`;
				for (var k = 0; k < orderResult.orderProducts[j].array_modification.length; k++) {
					if (orderResult.orderProducts[j].array_modification[k].title != undefined)
						productBlock += `<div class="cart-product__title-modifier">
								- ${orderResult.orderProducts[j].array_modification[k].title}
							</div>`;
				};
				productBlock += `</div>
					<div class="order-product__controls">
						<div class="order-product__controls-price">
							<span id="order-product__controls-price" class="price-val">${orderResult.orderProducts[j].price}</span> ${answer.currency}
						</div>
						<div class="order-product__controls-buttons loght">
							<div class="order-product__controls-buttons-count">
								${orderResult.orderProducts[j].count} шт
							</div>
						</div>
					</div>
				</div>`;
				counter++;
				if (counter == 3) {
					counter = 0;
					flag = true;
					productBlock += `</div><div class="order-detail__products-list">`;
				}
			}
			productBlock += `</div>`;
			$('.order-detail__products').slick('unslick');
			$('.order-detail__products').html('');
			$('.order-detail__products').append(productBlock);
			if (flag) $('.order-detail__products .order-detail__products-list:last').remove();
			$('.order-detail__products').slick({
				dots: true,
				arrows: false,
				slidesToShow: 1,
				slidesToScroll: 1,
			});
			formatPrice();
			openDetailOrder();
		} else {
			$.notify("Ошибка, попробуйте позже", "error", {
				position: "top center"
			});
		}
	} else {
		$.notify("Ошибка, попробуйте позже", "error", {
			position: "top center"
		});
	}
});
socket.on("GET_ORDER_PERSON", function (answer) {
	if (answer.message == 'success' && answer.data != false) {
		var orderResult = answer.data,
			finalPrice = orderResult.orderPrice;
		if (orderResult.place == 1) {
			$('.params-user').hide();
			$('.params-adress').hide();
			$('.order-detail__general-delivery').hide();
		} else if (orderResult.place == 2 || orderResult.place == 4) {
			$('#params-user__value').html(orderResult.orderPerson.name + ', ' + orderResult.orderPerson.phone);
			$('.order-detail__general-delivery').hide();
			$('.params-user').show();
			$('.params-adress').hide();
		} else {
			$('#params-user__value').html(orderResult.orderPerson.name + ', ' + orderResult.orderPerson.phone);
			$('#params-adress__value').html(orderResult.orderPerson.street + ', ' + orderResult.orderPerson.house + ', ' + orderResult.orderPerson.flat);
			$('#order-detail__general-delivery-value').html(orderResult.deliveryPrice);
			finalPrice += orderResult.deliveryPrice;
			$('.params-user').show();
			$('.params-adress').show();
		}
		$('#order-detail__general-summ-value').html(orderResult.orderPrice);
		$('#order-detail__general-final-value').html(finalPrice);
		var productBlock = `<div class="order-detail__products-list">`;
		var counter = 0,
			flag = false;

		for (var j = 0; j < orderResult.orderProducts.length; j++) {
			flag = false;
			productBlock += `<div class="order-product">
					<div class="order-product__image" style="background-image: url(${orderResult.orderProducts[j].img})">
					</div>
					<div class="order-product__title">
						${orderResult.orderProducts[j].title}, <span class="order-product__title-unit">${orderResult.orderProducts[j].weight} ${orderResult.orderProducts[j].unit}</span>`;
			for (var k = 0; k < orderResult.orderProducts[j].array_modification.length; k++) {
				if (orderResult.orderProducts[j].array_modification[k].title != undefined)
					productBlock += `<div class="cart-product__title-modifier">
								- ${orderResult.orderProducts[j].array_modification[k].title}
							</div>`;
			};
			productBlock += `</div>
					<div class="order-product__controls">
						<div class="order-product__controls-price">
							<span id="order-product__controls-price" class="price-val">${orderResult.orderProducts[j].price}</span> ${answer.currency}
						</div>
						<div class="order-product__controls-buttons loght">
							<div class="order-product__controls-buttons-count">
								${orderResult.orderProducts[j].count} шт
							</div>
						</div>
					</div>
				</div>`;
			counter++;
			if (counter == 3) {
				counter = 0;
				flag = true;
				productBlock += `</div><div class="order-detail__products-list">`;
			}
		}
		productBlock += `</div>`;
		$('.order-detail__products').slick('unslick');
		$('.order-detail__products').html('');
		$('.order-detail__products').append(productBlock);
		if (flag) $('.order-detail__products .order-detail__products-list:last').remove();
		$('.order-detail__products').slick({
			dots: true,
			arrows: false,
			slidesToShow: 1,
			slidesToScroll: 1,
		});
		formatPrice();
		openDetailOrder();
	} else {
		$.notify("Ошибка, попробуйте позже", "error", {
			position: "top center"
		});
	}

});
socket.on(cart.ADD_2_CART, function (answer) {
	// console.log("ANS2: ",answer)
	if (answer.numberTable != numberTable) return;
	if (answer.message == 'success') {
		closeProduct();
		if (answer.broadcast == true && window.location.pathname == '/cart/')
			checkCartTable();
		else
			checkCartPerson();
	} else {
	}

});
socket.on(person.CHECK_PERSON_NAME, function (answer) {
	if (answer.message == 'success' && answer.data != false) { } else {
		if (window.location.pathname != '/' || categoryId != undefined || typeMenuId != undefined) {
			if (isRemoteOrder) {
				window.location.href = '/';
			} else {
				window.location.href = '/?numberTable=' + numberTable;
			}
			return;
		}
		popupNameShow();
	}
});
socket.on(person.ADD_PERSON_NAME, function (answer) {
	if (answer.message == 'success' && answer.data != false) {
		popupNameHide();
	}
});
socket.on(cart.CHECK_CART_PERSON, function (answer) {
	if (answer.message == 'success' && answer.data != false) {
		var price = 0,
			oldPrice = parseInt($("#bottom-line__cart-sum").attr('data-value'));
		for (var product in answer.data) {
			$('.product[data-id="' + answer.data[product]._id + '"] .in-cart__count').html(answer.data[product].count);
			$('.product[data-id="' + answer.data[product]._id + '"]').addClass('in-cart');
			price += answer.data[product].count * answer.data[product].price;
		}
		$("#bottom-line__cart-sum").attr('data-value', price);
		$({ numberValue: oldPrice }).animate({ numberValue: price }, {
			duration: 500, // Продолжительность анимации, где 500 = 0,5 одной секунды, то есть 500 миллисекунд
			easing: "linear",
			step: function (val) {
				$("#bottom-line__cart-sum").html(Math.ceil(val)); // Блок, где необходимо сделать анимацию
			},
			complete: function () {
				formatPrice();
			}
		});
	} else {
		$("#bottom-line__cart-sum").html(0);
	}
});
socket.on(cart.PLUS_PRODUCT_MAIN, function (answer) {
	if (answer.numberTable != numberTable) return;
	if (answer.numberPerson == numberPerson) {
		checkCartPerson();
	} else if (window.location.pathname == '/cart/') {
		checkCartTable();
	}
});
socket.on(cart.MINUS_PRODUCT_MAIN, function (answer) {
	if (answer.numberTable != numberTable) return;
	if (answer.numberPerson == numberPerson) {
		checkCartPerson();
	} else if (window.location.pathname == '/cart/') {
		checkCartTable();
	}
});
socket.on(cart.PLUS_PRODUCT_CART, function (answer) {
	if (answer.numberTable != numberTable) return;
	checkCartTable();
});
socket.on(cart.MINUS_PRODUCT_CART, function (answer) {
	if (answer.numberTable != numberTable) return;
	checkCartTable();
});
socket.on(cart.REMOVE_PRODUCT, function (answer) {
	if (answer.numberTable != numberTable) return;
	if (answer.message == 'success') {
		checkCartTable();
		if (answer.numberPerson == numberPerson) {
			checkCartPerson();
		}
	} else {
	}
});
socket.on("EVENT_BUTTONS", function (answer) {
	if (answer.numberTable != numberTable) return;
	if (answer.message == 'success') {
		$.notify("Уведомление отправлено", "success", {
			position: "top center"
		});
	} else {
		console.error("error EVENT_BUTTONS");
	}
});
socket.on("GET_TITLE_GROUP_MODIFIER", function (answer) {
	if (!answer.idGroupModifier) return;

});
socket.on("GET_MODIFIER", function (answer) {
	if (!answer.idModifier) return;

});
/*
	  Клик по категории
	*/
$("body").on("click", ".categories-main__category", function () {
	var th = $(this),
		categoryId = th.attr("data-category-id");
	if (categoryId) {
		categoryClick(th, categoryId);
	}
});
/*
  Прокрутка дошла до верха
*/
function topPosition() {
	var id = $(".category-block").first().attr("data-category-id"),
		$selectCategory = $(".categories-main__category" + '[data-category-id="' + id + '"]'),
		index = $selectCategory.parent().index();
	$categories.trigger('to.owl.carousel', [index]);
	$(".categories-main__category").removeClass("active");
	$selectCategory.addClass("active");
}
/*
  Прокрутка дошла до низа
*/
function bottomPosition() {
	var id = $(".category-block").last().attr("data-category-id"),
		$selectCategory = $(".categories-main__category" + '[data-category-id="' + id + '"]'),
		index = $selectCategory.parent().index();
	$categories.trigger('to.owl.carousel', [index]);
	$(".categories-main__category").removeClass("active");
	$selectCategory.addClass("active");
}
/*
  Меняется выбранная категория от позиции
*/
function checkScrollCat(el) {
	var top = $(el).offset().top;
	var bottom = top + $(el).height();
	var scroll = $(window).scrollTop() + 126;
	var id = $(el).attr("data-category-id");
	if (scroll > top && scroll < bottom) {
		var $selectCategory = $(".categories-main__category" + '[data-category-id="' + id + '"]'),
			index = $selectCategory.parent().index();
		$categories.trigger('to.owl.carousel', [index]);
		$(".categories-main__category").removeClass("active");
		$selectCategory.addClass("active");
	}
}
/*
  Выбор категории
*/
function categoryClick(th, categoryId) {
	scrollEvent = true;
	var index = th.parent().index();
	$categories.trigger('to.owl.carousel', [index]);
	$(".categories-main__category").removeClass("active");
	th.addClass("active");
	var selector = ".category-block" + '[data-category-id="' + categoryId + '"]';
	// var t = $(selector).offset().top - 60;
	var t = $(selector).offset().top - 106;
	$("html").animate({
		scrollTop: t,
	}, 700, "linear", function () {
		scrollEvent = false;
	});
}
function checkCartPerson() {
	if (typeof numberPerson == 'undefined' || typeof numberTable == 'undefined') return false;
	socket.emit(cart.CHECK_CART_PERSON, {
		numberPerson,
		numberTable
	});
}
function checkNamePerson() {
	if (typeof numberPerson == 'undefined' || typeof numberTable == 'undefined') return false;
	socket.emit(person.CHECK_PERSON_NAME, {
		numberPerson,
		numberTable
	});
}
function popupNameShow() {
	$("#popup-name").fadeIn(200);
}
function popupNameHide() {
	$("#popup-name").fadeOut(200);
}
function popupCloseDish() {
	popupContainerDish.classList.add('fadeOutDish');
	popupElementDish.classList.add('fadeOutDishOverlay');
	setTimeout(() => {
		popupElementDish.classList.add('closePopupDish');
	}, 1000);
	bodyScroll();
}
function add2cart() {
	var data = {
		_id: objOpenProduct._id,
		img: objOpenProduct.img,
		title: objOpenProduct.title,
		count: parseInt($('.product-popup__count-value').html()),
		price: objOpenProduct.price,
		unit: objOpenProduct.unit,
		weight: objOpenProduct.weight,
		numberPerson: numberPerson,
		numberTable: numberTable,
		idFromIiko: objOpenProduct.idFromIiko,
		modifiers: objOpenProduct.modifiers,
		groupModifiers: objOpenProduct.groupModifiers,
		currency: objOpenProduct.currentCurrency
	};
	if (data.modifiers.length > 0 || data.groupModifiers.length > 0) {
		const result = {
			modifiers: [],
			count: 1,
			id: "",
			sum: 0
		};
		const validateChecksInGroupModifiers = checkIsGroupModifierRequired();
		if (validateChecksInGroupModifiers) {
			const nodeCollectionInputsWithModifiers = document.querySelectorAll('.input-childModifier');
			Array.from(nodeCollectionInputsWithModifiers).forEach((input) => {
				if (input.checked) {
					result.modifiers.push(input.id);
				}
			});
			const dishCountElement = document.getElementById('product-popup__count-value');
			result.count = Number(dishCountElement.textContent);
			const sumElement = document.getElementById('product-popup-modifier__price');
			result.sum = Number(sumElement.textContent) / result.count;
			objOpenProduct.modifiers = result.modifiers;
			objOpenProduct.count = result.count;
			objOpenProduct.price = result.sum;
			//
			var data = {
				_id: objOpenProduct._id,
				img: objOpenProduct.img,
				title: objOpenProduct.title,
				count: objOpenProduct.count,
				price: objOpenProduct.price,
				unit: objOpenProduct.unit,
				weight: objOpenProduct.weight,
				numberPerson: numberPerson,
				numberTable: numberTable,
				idFromIiko: objOpenProduct.idFromIiko,
				modifiers: objOpenProduct.modifiers,
				groupModifiers: objOpenProduct.groupModifiers,
				currency: objOpenProduct.currentCurrency
			};
			closeProduct();
			socket.emit(cart.ADD_2_CART, data);

		}
		else {
			$.notify("Что-то пошло не так \r\n в ", "error", {
				position: "top center"
			});
			return false;
		}
	}
	else {
		socket.emit(cart.ADD_2_CART, data);
	}

}
function checkCartTable() {
	if (numberTable == undefined) return false;
	showLoader();
	socket.emit(cart.CHECK_CART_TABLE, {
		numberTable,
		numberPerson
	});
}
function openProduct($product) {
	//$('.product-popup__img').addClass('show-back');
	bodyNoScroll();
	var product = getProductParam($product);
	objOpenProduct = product;
	$('.product-popup__img img').css({ opacity: 0 });
	$('.product-popup__img img').attr('src', product.img);
	// $('.product-popup__img').css({backgroundImage: 'url('+product.img+')'});
	$('.product-popup__description').html(product.description);
	const widthDisplay = window.innerWidth;
	if (widthDisplay > 767) {
		$('.product-popup__title-value').html(product.title + ',');
	}
	else {
		$('.product-popup__title-value').html(product.title);
	}
	$('.product-popup__unit-value').html(product.weight + ' ' + product.unit);
	$('.product-popup__price-value').html(product.price + `&nbsp;${product.currentCurrency}`);
	if (product.modifiers.length > 0 || product.groupModifiers.length > 0) {
		openProductWithGroupModifier(product);
	}
	$('#product-popup__background').fadeIn(500);
	$('#product-popup').addClass('open');
	$('.product-popup__img img').on("load", function () {
		if (product.img == '/assets/images/no_photo.png') {
			//$('.product-popup__img').removeClass('show-back');
		}
		$('.product-popup__img img').fadeTo(1000, 1, function () {
		});
	});
}
