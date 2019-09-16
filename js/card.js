'use strict';
// 5. На основе первого по порядку элемента из сгенерированного массива
// и шаблона .map__card создайте DOM-элемент объявления, заполните его
// данными из объекта и вставьте полученный DOM-элемент
// в блок .map перед блоком.map__filters-container:
// o  Выведите заголовок объявления offer.title в заголовок .popup__title.
// o  Выведите адрес offer.address в блок .popup__text--address.
// o  Выведите цену offer.price в блок .popup__text--price строкой
// вида {{offer.price}}₽/ночь. Например, 5200₽/ночь.
// o  В блок .popup__type выведите тип
// жилья offer.type: Квартира для flat, Бунгало для bungalo, Дом для house, Дво
// рец для palace.
// o  Выведите количество гостей
// и комнат offer.rooms и offer.guests в блок .popup__text--capacityстрокой
// вида {{offer.rooms}} комнаты для {{offer.guests}} гостей. Например,
// 2 комнаты для 3 гостей.
// o  Время заезда и выезда offer.checkin и offer.checkout в блок .popup__text--time строкой вида Заезд после {{offer.checkin}}, выезд до
// {{offer.checkout}}. Например, заезд после 14:00, выезд до 12:00.
// o  В список .popup__features выведите все доступные удобства в объявлении.
// o  В блок .popup__description выведите описание объекта
// недвижимости offer.description.
// o  В блок .popup__photos выведите все фотографии из списка offer.photos.
// Каждая из строк массива photos должна записываться
// как src соответствующего изображения.
// Замените src у аватарки пользователя — изображения, которое записано
// в .popup__avatar — на значения поля author.avatar отрисовываемого
// объекта.

(function () {

  var closeCard = function () {
    var card = window.map.element.querySelector('.map__card');
    if (card) {
      window.map.element.removeChild(card);
      document.removeEventListener('keydown', onCardEscPressed);
      activePin.classList.remove('map__pin--active');
    }
  };

  var onCardEscPressed = function (evt) {
    window.utils.isEscPressed(evt, closeCard);
  };

  var onMapPinClick = function (evt) {
    var target = evt.target;
    while (target !== mapPinsContainer) {
      var index = window.data.pinElements.indexOf(target);
      if (~index) {
        closeCard();
        target.classList.add('map__pin--active');
        activePin = target;
        var cardElements = generateCardElements(window.data.newAdvertisements[index]);
        renderCardElements(cardElements);
        window.map.element.querySelector('.popup__close').addEventListener('click', function () {
          closeCard();
        });
        document.addEventListener('keydown', onCardEscPressed);
        return;
      }
      target = target.parentNode;
    }
  };

  var activePin = null;
  var mapPinsContainer = window.map.element.querySelector('.map__pins');
  mapPinsContainer.addEventListener('click', onMapPinClick);

  var generateCardElements = function (advertisment) {
    var types = {
      flat: 'Квартира',
      bungalo: 'Бунгало',
      house: 'Дом',
      palace: 'Дворец'
    };

    var template = document.body.querySelector('#card').content.querySelector('.map__card').cloneNode(true);

    var setValue = function (elementClass, value, callBack) {
      if (value) {
        callBack(template.querySelector(elementClass), value);
        return;
      }
      template.querySelector(elementClass).classList.add('hidden');
    };

    setValue('.popup__title', advertisment.offer.title,
        function (element, value) {
          element.textContent = value;
        }
    );

    setValue('.popup__text--address', advertisment.offer.address,
        function (element, value) {
          element.textContent = value;
        }
    );

    setValue('.popup__text--price', advertisment.offer.price,
        function (element, value) {
          element.innerHTML = value + '&#x20bd;/ночь';
        }
    );

    setValue('.popup__type', advertisment.offer.type,
        function (element, value) {
          element.textContent = types[value];
        }
    );

    setValue('.popup__text--capacity', advertisment.offer.rooms,
        function (element, value) {
          element.textContent = value + ' комнаты';
        }
    );

    setValue('.popup__text--capacity', advertisment.offer.guests,
        function (element, value) {
          element.textContent += ' для ' + value + ' гостей';
        }
    );

    setValue('.popup__text--time', advertisment.offer.checkin,
        function (element, value) {
          element.textContent = 'Заезд после ' + value;
        }
    );

    setValue('.popup__text--time', advertisment.offer.checkout,
        function (element, value) {
          element.textContent += ', выезд до ' + value;
        }
    );

    setValue('.popup__features', advertisment.offer.features,
        function (element, values) {
          for (var i = 0; i < values.length; i++) {
            element.querySelector('.popup__feature--' + values[i]).classList.add('popup__feature--active');
          }
        }
    );

    setValue('.popup__description', advertisment.offer.description,
        function (element, value) {
          element.textContent = value;
        }
    );

    setValue('.popup__photo', advertisment.offer.photos,
        function (element, values) {
          for (var i = 0; i < values.length; i++) {
            var photoElement = element.cloneNode(true);
            photoElement.src = values[i];
            photoElement.hidden = false;
            element.parentElement.appendChild(photoElement);
          }
        }
    );

    setValue('.popup__avatar', advertisment.author.avatar,
        function (element, value) {
          element.src = value;
        }
    );

    return template;
  };

  var renderCardElements = function (cardElements) {
    window.map.element.insertBefore(cardElements, document.body.querySelector('.map__filters-container'));
  };

  window.card = {
    close: closeCard
  };

})();
