"use strict";
import '../css/style.css';
import {
	cart, api, person, order, reservation
}
from './socketNames';
var connectionOptions =  {
    "transports" : ["websocket"]
};
var socket = io('/', connectionOptions),
	checkTables = true,
	arTimes = [],
	emptyTable = true;

$(document).ready(function() {
	showLoader();
	socket.emit(reservation.GET_SPOTS, {});
	$('input[name="phone"]').mask('+7 (000) 000 00 00', {placeholder: "+7 (___) ___ __ __"});
});

function showLoader() {
	$('#loader').fadeIn(200);
}
function hideLoader() {
	$('#loader').fadeOut(200);
}

$("body").on("submit", "#reservation-form", function(e) {
	showLoader();
	e.preventDefault();
	var count = $(this).find('input[name ="count"]').val(),
			date = $(this).find('input[name ="date"]').val(),
			time = $(this).find('input[name ="time"]:checked').val(),
			name = $(this).find('input[name ="name"]').val(),
			comment = $(this).find('textarea[name ="comment"]').val(),
			spotId = $('select[name="spot"] option').filter(':selected').val(),
			spotName = $('select[name="spot"] option').filter(':selected').text(),
			phone = $(this).find('input[name ="phone"]').val();

	if(emptyTable == true){
		$.notify("Вы не выбрали время", "error", {
			position: "top center"
		});
		return;
	}

	var timeIndex = $(this).find('input[name ="time"]:checked').attr('data-index');
	if(timeIndex == undefined){
		$.notify("Вы не выбрали время", "error", {
			position: "top center"
		});
		hideLoader();
		return;
	}
	if(arTimes[timeIndex].data.freeTables[0] == undefined){
		$.notify("Ошибка, попробуйте позже", "error", {
			position: "top center"
		});
		hideLoader();
		return;
	}

	var obj = {
		count,
		date,
		time,
		name,
		phone,
		comment,
		spotName,
		spot_id: spotId,
		table_id: arTimes[timeIndex].data.freeTables[0].table_id
	};
	socket.emit(reservation.CREATE_RESERVATION, obj);
});

$('input[name="date"]').on("change", function (e) {
	showLoader();
	var count = $('input[name ="count"]').val(),
			date = $('input[name ="date"]').val(),
			spotId = $('select[name="spot"] option').filter(':selected').val();

	if(count == '' || date == ''){
		$.notify("Не все поля заполнены", "error", {
			position: "top center"
		});
		hideLoader();
		return;
	}
	var obj = {
		count,
		date,
		spotId
	};
	socket.emit(reservation.CHECK_RESERVATION, obj);
});

$('select[name="spot"]').on("change", function (e) {
	showLoader();
	var count = $('input[name ="count"]').val(),
			date = $('input[name ="date"]').val(),
			spotId = $('select[name="spot"] option').filter(':selected').val();

	if(count == '' || date == ''){
		$.notify("Не все поля заполнены", "error", {
			position: "top center"
		});
		hideLoader();
		return;
	}
	var obj = {
		count,
		date,
		spotId
	};
	socket.emit(reservation.CHECK_RESERVATION, obj);
});

$('body').on('change', 'input[name="time"]', function (e) {
	if($(this).hasClass('time-disabled')){
		var id = $(this).attr('id');
		$(`#${id}`).prop('checked', false);
		$.notify("Время недоступно", "error", {
			position: "top center"
		});
		return;
	}
});

$("body").on("click", "#menu-button", function() {
	$('#slide-menu').addClass('open');
});
$("body").on("click", "#close-slide-menu", function() {
	$('#slide-menu').removeClass('open');
});


socket.on(reservation.GET_SPOTS, function(answer) {
	if(answer.message == 'success' && answer.data != false) {
		if(answer.data.length == 0){
			$.notify("Ошибка, попробуйте позже", "error", {
				position: "top center"
			});
			return;
		} else {
			for (var i = 0; i < answer.data.length; i++) {
				var s = '';
				if(i == 0) s = 'selected';
				$('.spots select').append(`<option ${s} value="${answer.data[i].spot_id}">${answer.data[i].spot_adress}</option>`);
			}
		}
	}
	hideLoader();
});
socket.on(reservation.CREATE_RESERVATION, function(answer) {
	console.log(answer);
	if(answer.message == 'success' && answer.data != false) {
		var finalData = answer.data,
				dateString = finalData.date_reservation,
				iosDate = dateString.replace(/-/g, '/'),
				d = new Date(iosDate).setHours(new Date(iosDate).getHours()+2),
				d2 = new Date(d).toLocaleString();

		$('#reservation #reservation-form').hide();
		$('#reservation .success').append('<div class="title" style="text-align: left;">Имя</div>');
		$('#reservation .success').append('<div>'+finalData.first_name+'</div>');
		$('#reservation .success').append('<div class="title" style="text-align: left;margin-top: 20px;">Телефон</div>');
		$('#reservation .success').append('<div>'+finalData.phone+'</div>');

		if(finalData.comment != null){
			$('#reservation .success').append('<div class="title" style="text-align: left;margin-top: 20px;">Комментарий</div>');
			$('#reservation .success').append('<div>'+finalData.comment+'</div>');
		}
		$('#reservation .success').append('<div class="title" style="text-align: left;margin-top: 20px;">Дата</div>');
		$('#reservation .success').append('<div>'+d2+'</div>');
		$('#reservation .success').append('<div class="title" style="text-align: left;margin-top: 20px;">Адрес</div>');
		$('#reservation .success').append('<div>'+finalData.spotName+'</div>');
		$('#reservation .success').fadeIn(400);
		hideLoader();
	}else{
		$.notify("Ошибка, попробуйте позже", "error", {
			position: "top center"
		});
		hideLoader();
	}
});
socket.on(reservation.CHECK_RESERVATION, function(answer) {
	console.log(answer);
	// return;
	if(answer.message == 'success' && answer.data != false) {
		arTimes = [];
		var index = 0;

		$('.time').html('');
		for (var i = answer.timeRabotaFrom; i < answer.timeRabotaTo; i++) {
			emptyTable = false;
			var disabled = '',
					className = '';

			if(
				answer.data[index].message == 'error' ||
				answer.data[index].data.freeTables.length == 0
			){
				disabled = 'disabled="disabled"';
				className = 'time-disabled';
			}
			arTimes.push(answer.data[index]);
			var j = i;

			if(j.toString().length == 1)
				j = '0'+j;
			j += ':00';

			$('.time').append(`<input ${disabled} type="radio" name="time" class="${className}" data-index="${index}" value="${j}" id="${j}">
				<label for="${j}" class="time-button ${className}">
					${j}
				</label>`);
			index++;
		}

		if(arTimes.length == 0){
			$.notify("Нет свободных столов", "error", {
				position: "top center"
			});
			emptyTable = true;
		} else {
			checkTables = false;
			$("#reservation-form .name, #reservation-form .phone, #reservation-form .time, #reservation-form .comment").fadeIn(400);
			// if(answer.spots.length > 1)
			// 	$('#reservation-form .spots').fadeIn(400);
			$("#reservation-form input[type='submit']").val('Забронировать').fadeIn(400);
		}
	} else {
		$.notify("Ошибка даты", "error", {
			position: "top center"
		});
	}
	hideLoader();
});
