const salesLinks = document.querySelectorAll('.events-block__link');
const popupElement = document.querySelector('.popup-sales');
const buttonPopupClose = document.getElementById('popup__button-close');
if (buttonPopupClose) {
    buttonPopupClose.addEventListener('click', popupClose);
}

Array.from(salesLinks).map((item) => {
    item.addEventListener('click', showPopupWithSales);
});
function showPopupWithSales(e) {
    const element = e.target.closest('.events-block__link');
    const dateStartSales = element.querySelector('.dateStartSales').textContent;
    const dateFinishSales = element.querySelector('.dateFinishSales').textContent;
    const descriptionSales = element.querySelector('.descriptionSales').textContent;
    const imageSales = element.querySelector('.imageSales').src;
    const imagePopup = popupElement.querySelector('.popup__image');
    const descriptionPopup = popupElement.querySelector('.popup__description');
    const startSalesPopup = popupElement.querySelector('.popup__start-sales');
    imagePopup.src = imageSales;
    imagePopup.alt = "";
    descriptionPopup.textContent = descriptionSales;
    if (dateStartSales.length > 0) {
        startSalesPopup.textContent = "Акция действует с " + dateStartSales + " до " + dateFinishSales;
    }

    const fadeIN = (el, timeout, display) => {
      el.style.opacity = 0;
      el.style.display = display || 'block';
      el.style.transition = `opacity ${timeout}ms`;
      setTimeout(() => {
        el.style.opacity = 1;
      }, 10);
    };

    fadeIN(popupElement,500,'flex');
}
function popupClose() {
    const fadeOut = (el, timeout) => {
      el.style.opacity = 1;
      el.style.transition = `opacity ${timeout}ms`;
      el.style.opacity = 0;

      setTimeout(() => {
        el.style.display = 'none';
      }, timeout);
    };

    fadeOut(popupElement,500);
}
if (popupElement) {
    popupElement.addEventListener('click', (evt) => {
        if (!evt.target.closest('.popup__container')) {
            popupClose();
        }
    });
}
