'use strict';
// Заполнение поля адреса
// Кроме активации формы, перемещение метки приводит к заполнению поля
// адреса. В значении поля записаны координаты, на которые метка указывает
// своим острым концом. Поэтому в обработчике события mouseup на элементе
// метки, кроме вызова метода, переводящего страницу в активное состояние,
// должен находиться вызов метода, который устанавливает значения поля ввода
// адреса.

(function () {

  var adressField = window.utils.form.element.querySelector('#address');
  var mapOverlay = window.map.element.querySelector('.map__overlay');

  var pinMain = {
    element: document.body.querySelector('.map__pin--main'),

    MIN_X: mapOverlay.offsetLeft,
    MIN_Y: 130,
    MAX_X: mapOverlay.offsetLeft + mapOverlay.clientWidth,
    MAX_Y: 630
  };

  pinMain.width = pinMain.element.offsetWidth;
  pinMain.height = pinMain.element.offsetHeight + parseInt(window.getComputedStyle(pinMain.element, ':after').height, 10) - 6;

  pinMain.startX = pinMain.element.offsetLeft + Math.round(pinMain.width / 2);
  pinMain.startY = pinMain.element.offsetTop + pinMain.height;

  pinMain.setCoordinates = function (x, y) {
    var setValue = function (coordinate, MIN_VALUE, MAX_VALUE) {
      coordinate = Math.max(coordinate, MIN_VALUE);
      coordinate = Math.min(coordinate, MAX_VALUE);
      return coordinate;
    };

    x = x - pinMain.shiftX + Math.round(pinMain.width / 2);
    y = y - pinMain.shiftY + pinMain.height;

    pinMain.x = setValue(x, pinMain.MIN_X, pinMain.MAX_X);
    pinMain.y = setValue(y, pinMain.MIN_Y, pinMain.MAX_Y);
  };

  pinMain.setAddres = function (x, y) {
    x = x || pinMain.x;
    y = y || pinMain.y;

    adressField.value = x + ', ' + y;
    adressField.setAttribute('value', adressField.value);
  };

  pinMain.move = function (x, y) {
    x = x || pinMain.x;
    y = y || pinMain.y;

    x = x - Math.round(pinMain.width / 2);
    y = y - pinMain.height;

    pinMain.element.style.left = x + 'px';
    pinMain.element.style.top = y + 'px';
  };

  pinMain.setAddres(pinMain.startX, pinMain.startY);

  var onMapPinMainMouseDown = function (evtMouseDown) {
    evtMouseDown.preventDefault();
    pinMain.shiftX = evtMouseDown.clientX - pinMain.element.offsetLeft;
    pinMain.shiftY = evtMouseDown.clientY - pinMain.element.offsetTop;

    var onMapPinMainMouseMove = function (evtMouseMove) {
      evtMouseMove.preventDefault();
      pinMain.setCoordinates(evtMouseMove.clientX, evtMouseMove.clientY);
      pinMain.move();
      pinMain.setAddres();
    };

    // Нужно добавить обработчик события mouseup на элемент .map__pin--main.
    // Обработчик события mouseup должен вызывать функцию, которая будет отменять
    // изменения DOM-элементов, описанные в пункте «Неактивное состояние» технического задания.
    var onMapPinMainMouseUp = function (evtMouseUp) {
      evtMouseUp.preventDefault();
      if (window.map.element.classList.contains('map--faded')) {
        window.map.activate();
        window.utils.form.activate();
        // Просмотр подробной информации о похожих объявлениях
        // После перевода страницы в активный режим, нужно отрисовать на карте похожие
        // объявления. Позже, в разделе про сеть, перевод в активный режим будет
        // запускать загрузку объявлений, но пока что можно показать объявления сразу.
        window.data.renderPinElements(window.data.pinElements.slice(0, 5));
      }

      document.removeEventListener('mousemove', onMapPinMainMouseMove);
      document.removeEventListener('mouseup', onMapPinMainMouseUp);
    };

    document.addEventListener('mousemove', onMapPinMainMouseMove);
    document.addEventListener('mouseup', onMapPinMainMouseUp);
  };

  pinMain.element.addEventListener('mousedown', onMapPinMainMouseDown);

  window.pinMain = {
    startX: pinMain.startX,
    startY: pinMain.startY,
    setAddres: pinMain.setAddres,
    move: pinMain.move
  };

})();
