'use strict';
// Задание №3
// 1. Создайте массив, состоящий из 8 сгенерированных JS объектов, которые
// будут описывать похожие объявления неподалёку.
(function () {
  var createRandomAdvertisements = function () {

    var NUMBER_OF_ADVERTISEMENT = 8;
    var LOCATION_X = 600;
    var LOCATION_Y = 350;
    var MIN_PRICE = 1000;
    var MAX_PRICE = 100000; //1000000;
    var MIN_ROOMS = 1;
    var MAX_ROOMS = 3; //5
    var TYPES = ['palace', 'flat', 'house', 'bungalo'];
    // var TYPES = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];
    var CHECK_TIMES = ['12:00', '13:00', '14:00'];
    var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
    var MIN_Y_COORDINATE = 130;
    var MAX_Y_COORDINATE = 630;
    var NUMBER_OF_GUESTS_BY_ROOM = 1; //2
    var PHOTOS_URLS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
    var TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец',
      'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негоcтеприимный домик',
      'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
    var titles = TITLES;

    var getRandomInt = function (minRange, maxRange) {
      return Math.floor(Math.random() * (++maxRange - minRange) + minRange);
    };

    var Avatars = function () {
      this.NUMBER_OF_AVATARS = NUMBER_OF_ADVERTISEMENT;

      this.setImgPaths = function () {
        var imgPaths = [];
        for (var i = 1; i <= this.NUMBER_OF_AVATARS; i++) {
          imgPaths.push('img/avatars/user0' + i + '.png');
        }
        return imgPaths;
      };

      this.imgPaths = this.setImgPaths(); // Обязательно хранить вне функции для уникальности выбора элемента в дальнейшем

      this.getImgPath = function () {
        return this.imgPaths.splice(getRandomInt(0, this.imgPaths.length - 1), 1)[0];
      };
    };

    var getRandomSubArray = function (resultArrayLength, deleteFromInputArrayFlag, inputArray) {
      var resultArray = [];
      if (!resultArrayLength) {
        resultArrayLength = inputArray.length;
        inputArray = inputArray.slice();
      }
      for (var i = 0; i < resultArrayLength; i++) {
        if (deleteFromInputArrayFlag) {
          resultArray.push(inputArray.splice(getRandomInt(0, inputArray.length - 1), 1)[0]);
        } else {
          resultArray.push(inputArray[getRandomInt(0, inputArray.length - 1)]);
        }
      }
      if ((resultArrayLength === 1) && (~inputArray.indexOf(resultArray))) {
        return resultArray[0];
      }
      return resultArray;
    };

    var getRandomArrayItem = getRandomSubArray.bind(null, 1, 0);
    var getRandomArrayUniqueItem = getRandomSubArray.bind(null, 1, 1);
    var randomizeArray = getRandomSubArray.bind(null, 0, 1);

    var avatars = new Avatars();

    var Advertisement = function () {
      this.author = {
        avatar: avatars.getImgPath()
      };

      this.offer = {
        title: getRandomArrayUniqueItem(titles),
        address: LOCATION_X + ', ' + LOCATION_Y,
        price: getRandomInt(MIN_PRICE, MAX_PRICE),
        type: getRandomArrayItem(TYPES)[0],
        rooms: getRandomInt(MIN_ROOMS, MAX_ROOMS),
        checkin: getRandomArrayItem(CHECK_TIMES),
        checkout: getRandomArrayItem(CHECK_TIMES),
        features: getRandomSubArray(getRandomInt(1, FEATURES.length), 1, randomizeArray(FEATURES)),
        description: '',
        photos: randomizeArray(PHOTOS_URLS)
      };
      this.offer.guests = this.offer.rooms * NUMBER_OF_GUESTS_BY_ROOM;

      this.location = {
        x: getRandomInt(0, parseInt(window.getComputedStyle(
            document.body.querySelector('.map__pins')
        ).width, 10)),
        y: getRandomInt(MIN_Y_COORDINATE, MAX_Y_COORDINATE)
      };
    };

    var randomAdvertisements = [];
    for (var i = 0; i < NUMBER_OF_ADVERTISEMENT; i++) {
      randomAdvertisements.push(new Advertisement());
    }

    return randomAdvertisements;
  };

  // var randomAdvertisements = createRandomAdvertisements();

  // 2. У блока .map уберите класс .map--faded.
  // document.body.querySelector('.map').classList.remove('map--faded');

  // 3. На основе данных, созданных в первом пункте, создайте DOM-элементы,
  // соответствующие меткам на карте, и заполните их данными из массива.
  // Итоговую разметку метки .map__pin можно взять из шаблона .map__card.
  // o  У метки должны быть следующие данные:
  // o  Координаты:style="left: {{location.x}}px; top: {{location.y}}px;"
  // o  src="{{author.avatar}}"
  // o  alt="{{заголовок объявления}}"
  // Обратите внимание
  // Координаты X и Y, которые вы вставите в разметку, это не координаты
  // левого верхнего угла блока метки, а координаты, на которые указывает
  // метка своим острым концом. Чтобы найти эту координату нужно учесть
  // размеры элемента с меткой.
  var pinElements = null;
  var createPinElements = function (advertisments) {
    pinElements = [];
    for (var i = 0; i < advertisments.length; i++) {
      var pinElement = document.body.querySelector('#pin').content.querySelector('.map__pin').cloneNode(true);
      pinElement.style.left = advertisments[i].location.x + 'px';
      pinElement.style.top = advertisments[i].location.y + 'px';
      pinElement.querySelector('img').src = advertisments[i].author.avatar;
      pinElement.querySelector('img').alt = advertisments[i].offer.title;
      pinElements.push(pinElement);
    }

    window.data.pinElements = pinElements.slice();
    // return pinElements;
  };

  var randomAdvertisements = [];
  var loadAdvertisements = function (advertisments) {
    randomAdvertisements = advertisments;
    createPinElements(advertisments);
    window.data.randomAdvertisements = randomAdvertisements.slice();
    window.data.newAdvertisements = randomAdvertisements.slice();

  };
  // var pinElements = createPinElements(randomAdvertisements);

  // 4. Отрисуйте сгенерированные DOM-элементы в блок .map__pins. Для вставки
  // элементов используйте DocumentFragment.

  var pinContainer = document.body.querySelector('.map__pins');
  var renderPinElements = function (pinElementsArray) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < pinElementsArray.length; i++) {
      fragment.appendChild(pinElementsArray[i]);
    }
    pinContainer.appendChild(fragment);

    for (i = 0; i < pinElementsArray.length; i++) {
      pinElementsArray[i].style.left =
        (window.data.newAdvertisements[i].location.x - Math.round(pinElementsArray[i].offsetWidth / 2)) +
        'px';
      pinElementsArray[i].style.top =
        (window.data.newAdvertisements[i].location.y - pinElementsArray[i].offsetHeight) +
        'px';
    }
  };

  var clearPinElements = function (pinElementsArray) {
    for (var i = 0; i < pinElementsArray.length; i++) {
      pinContainer.removeChild(pinElementsArray[i]);
    }
  };

  window.data = {
    loadAdvertisements: loadAdvertisements,
    createPinElements: createPinElements,
    // pinElements: pinElements,
    renderPinElements: renderPinElements,
    clearPinElements: clearPinElements
  };
    
  // window.backend.load('window.data.loadAdvertisements', window.utils.form.onSendPopup);  ВКЛЮЧИТЬ ЗАГРУЗКУ ДАННЫХ!!!

window.data.loadAdvertisements(createRandomAdvertisements());
})();
