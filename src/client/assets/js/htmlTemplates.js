module.exports.htmlTemplates = {
	productTemplate: function productTemplate(id, description, img, title, price, old_price, weight, unit, shortTitle) {
		var sliced = title;
		if(shortTitle === true){
			sliced = title.slice(0,20);
			if (sliced.length < title.length) {
				sliced += '...';
			}
		}
		var html = `<div class="product-container"><div class="product"
				data-product-id="${id}"
				data-product-description="${description}"
				data-product-old-price="${old_price}"
				data-product-title="${title}"
			>
	    <div class="product__img" style="background-image: url(${img});">
	    </div>
	    <div class="product__title">${sliced}</div>
	    <div class="product__params">
	      <div class="product__params-price">${price} валюта1</div>
	      <div class="product__params-weight">${weight} ${unit}</div>
	    </div>
			<div class="product__modification"></div>
	  </div></div>`;
		return html;
	},
	cartPersonTemplate: function cartPersonTemplate(personNumber, show){
		if(show)
			return `<div class="cart-person-products-block" data-person-id="${personNumber}"></div>`;
		else
			return `<div class="cart-person-products-block" data-person-id="${personNumber}" style="display: none;"></div>`;

	},
	orderPersonTemplate: function orderPersonTemplate(personNumber, name){
		var s = `<div class="cart__person" data-person-number="${personNumber}">
			<div class="cart__person-summary">
				<div class="cart__person-name">${name}</div>
				<div class="cart__person-price"></div>
			</div>
			<div class="cart__person-products"></div>
		</div>`;
		return s;
	},
	cartItemTemplate: function cartItemTemplate(prodId, prodTitle, prodImg, prodUnit, prodWeight, prodPrice, prodCount, personNumber, arrayModification, currency) {
		var htmlModifications = '';
		for (var i = 0; i < arrayModification.length; i++) {
			if(arrayModification[i].title != undefined)
			htmlModifications += `<div class="cart-product__title-modifier">
				- ${arrayModification[i].title}
			</div>`;
		}
		// console.log("CAART: ",currency)
		return `<div class="cart-product" data-person-id="${personNumber}" data-product-id="${prodId}">
			<div class="cart-product__image" style="background-image: url(${prodImg})">
			</div>
			<div class="cart-product__title">
				${prodTitle}, <span class="cart-product__title-unit">${prodWeight} ${prodUnit}</span>
				${htmlModifications}
			</div>
			<div class="cart-product__controls">
				<div class="cart-product__controls-price">
					<span id="cart-product__controls-price" class="price-val" style="padding-right: 5px;">${prodPrice}</span>${currency}
				</div>
				<div class="cart-product__controls-buttons loght">
					<div class="cart-product__controls-buttons-minus main-color-svg">
						<svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M0.923077 0.0769043H5.07692H6.92308H11.0769C11.5867 0.0769043 12 0.49018 12 0.999981C12 1.50978 11.5867 1.92306 11.0769 1.92306H6.92308H5.07692H0.923077C0.413276 1.92306 0 1.50978 0 0.999981C0 0.49018 0.413276 0.0769043 0.923077 0.0769043Z" fill="#40BFFF"/>
						</svg>
					</div>
					<div class="cart-product__controls-buttons-count">
						<span id="cart-product__controls-buttons-count">${prodCount}</span> шт
					</div>
					<div class="cart-product__controls-buttons-plus main-color-svg">
						<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path fill-rule="evenodd" clip-rule="evenodd" d="M6.92308 5.07692V0.923077C6.92308 0.413276 6.5098 0 6 0C5.4902 0 5.07692 0.413276 5.07692 0.923077V5.07692H0.923077C0.413276 5.07692 0 5.4902 0 6C0 6.5098 0.413276 6.92308 0.923077 6.92308H5.07692V11.0769C5.07692 11.5867 5.4902 12 6 12C6.5098 12 6.92308 11.5867 6.92308 11.0769V6.92308H11.0769C11.5867 6.92308 12 6.5098 12 6C12 5.4902 11.5867 5.07692 11.0769 5.07692H6.92308Z" fill="#40BFFF"/>
						</svg>
					</div>
				</div>
			</div>
		</div>`;
	},
	orderItemTemplate: function orderItemTemplate(prodId, prodTitle, prodImg, prodPrice, prodCount, personNumber) {
		var s = `<div class="cart__product" data-product-id="${prodId}" data-person-number="${personNumber}">
			<div class="cart__product-delete" style="display:none;">
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path d="M3 6.375H21" stroke="#9098B1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
					<path d="M8.625 3H15.375" stroke="#9098B1" stroke-width="2" stroke-linecap="round"
						stroke-linejoin="round" />
					<path d="M18.75 6.375H5.25V21H18.75V6.375Z" stroke="#9098B1" stroke-width="2" stroke-linecap="round"
						stroke-linejoin="round" />
				</svg>
			</div>
			<div class="cart__product-img" style="background-image: url(${prodImg});">

			</div>
			<div class="cart__product-values">
				<div class="cart__product-title">${prodTitle}</div>
				<div class="cart__product-params"></div>
				<div class="cart__product-but_price">
					<div class="buttons">
						<span style="margin-right: 10px;">${prodCount} шт </span>
					</div>
					<div class="cart__product-price">
						${prodPrice}
					</div>
				</div>
			</div>
		</div>`;
		return s;
	},
	orderMoreTemplate: function orderMoreTemplate(orderPerson, place) {
		var s = '';
		if(orderPerson != false){
			s += `<div class="order__more">
							<a class="order__more-title" href="javascript:void(0);">
							<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
								 viewBox="0 0 386.257 386.257" style="enable-background:new 0 0 386.257 386.257;fill: #000000c2;width: 30px;transition: all .5s;" xml:space="preserve">
								<polygon points="0,96.879 193.129,289.379 386.257,96.879 "/>
								</svg>
							</a>
							<div class="order__more-body">
								<div class="order__more-body-title">Данные о заказе</div>
								<div class="order__more-field"><span>Имя:</span> ${orderPerson.name}</div>
								<div class="order__more-field">Телефон: ${orderPerson.phone}</div>`;
								if(orderPerson.house) s+= `<div class="order__more-field">Дом: ${orderPerson.house}</div>`;
								if(orderPerson.street) s+= `<div class="order__more-field">Улица: ${orderPerson.street}</div>`;
								if(orderPerson.flat) s+= `<div class="order__more-field">Квартира: ${orderPerson.flat}</div>`;
								if(orderPerson.floor) s+= `<div class="order__more-field">Этаж: ${orderPerson.floor}</div>`;
								if(orderPerson.entrance) s+= `<div class="order__more-field">Подъезд: ${orderPerson.entrance}</div>`;
							s += `</div>
						</div>`;
		}
		return s;
	},
	orderTemplate: function orderTemplate(incoming_order_id, orderStatus, place){
		var s = `<div class="order" data-order-number="${incoming_order_id}">
			<div class="order_header">
				<div class="order_number">
					Заказ № ${incoming_order_id}
				</div>
				<div class="order_place">
					${place}
				</div>
			</div>
			<div class="order_status">
				${orderStatus}
			</div>`;

		s += `</div>`;
		return s;
	},
	modificationsTemplate: function modificationsTemplate(id, name, nameProduct, weight, price, first){
		var f = '';
		if(first == true)
			f = 'checked="checked"';
		var s = `<label class="popup__modifications-radio">
					${name} (${price} р)
					<input type="radio" name="product__modification" ${f}
						value="${id}"
						data-weight="${weight}"
						data-price="${price}"
						data-name-product="${nameProduct}"
						data-name-modification="${name}"
					/>
					<div class="popup__modifications-indicator"></div>
			</label>`;
		return s;
	},
	groupModificationsTemplate: function groupModificationsTemplate(id, idGroup, name, nameProduct, weight, price, first, numMin){
		var f = '';
		if(first == true)
			f = 'checked="checked"';
		var s = `<label class="popup__modifications-radio">
					${name} (${price} р)
					<input type="radio" name="product__modification_${idGroup}" ${f}
						value="${id}"
						data-weight="${weight}"
						data-price="${price}"
						data-num-min="${numMin}"
						data-name-product="${nameProduct}"
						data-name-modification="${name}"
					/>
					<div class="popup__modifications-indicator"></div>
			</label>`;
		return s;
	},
	titleGroupModificationsTemplate: function titleGroupModificationsTemplate(name){
		var s = `<label class="popup__modifications-radio title">
					${name}
			</label>`;
		return s;
	}
};
