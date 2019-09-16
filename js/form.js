'use strict';
// Задание №4 - в задании №3 вернул первоначальные состояние слоев, отключил все рендеры
// Поля формы .ad-form заблокированы с помощью атрибута disabled, добавленного
// на них или на их родительские блоки fieldset.
(function () {

  var pinContainer = document.body.querySelector('.map__pins');
  var flatImgPreview = window.utils.form.element.querySelector('.ad-form__photo');
  var avatarPreview = window.utils.form.element.querySelector('.ad-form-header__preview > img');

  window.utils.form.deactivate();

  var deactivatePage = function () {
  // все заполненные поля стираются, метки похожих объявлений
  // и карточка активного объявления удаляются, метка адреса возвращается в исходное
  // положение, значение поля адреса корректируется соответственно положению метки.
    window.utils.form.element.reset();
    flatImgPreview.textContent = '';
    avatarPreview.src = 'img/muffin-grey.svg';
    disableCapacityFieldOptions();
    setMinPrice();
    window.pinMain.setAddres(window.pinMain.startX, window.pinMain.startY);
    window.pinMain.move(window.pinMain.startX, window.pinMain.startY);
    window.utils.form.deactivate();
    window.card.close();
    window.data.clearPinElements(window.data.pinElements.slice(0, 5));
    window.map.deactivate();
    window.filters.form.reset();
    window.data.newAdvertisements = window.data.randomAdvertisements.slice();
    window.data.createPinElements(window.data.newAdvertisements);
  };

  // 2.3. Поле «Тип жилья» влияет на минимальное значение поля «Цена за ночь»:
  // «Бунгало» — минимальная цена за ночь 0;
  // «Квартира» — минимальная цена за ночь 1 000;
  // «Дом» — минимальная цена 5 000;
  // «Дворец» — минимальная цена 10 000;
  // Вместе с минимальным значением цены нужно изменять и плейсхолдер.
  var typeField = window.utils.form.element.querySelector('#type');
  var priceField = window.utils.form.element.querySelector('#price');

  var setMinPrice = function () {
    var minPrice = null;
    switch (typeField.value) {
      case 'bungalo':
        minPrice = 0;
        break;
      case 'flat':
        minPrice = 1000;
        break;
      case 'house':
        minPrice = 5000;
        break;
      case 'palace':
        minPrice = 10000;
        break;
    }
    priceField.setAttribute('min', minPrice);
    priceField.placeholder = minPrice;
  };

  typeField.addEventListener('change', function () {
    setMinPrice();
  });

  // 2.5. Поля «Время заезда» и «Время выезда» синхронизированы: при изменении значения
  // одного поля, во втором выделяется соответствующее ему. Например, если время заезда
  // указано «после 14», то время выезда будет равно «до 14» и наоборот.
  var timeInField = window.utils.form.element.querySelector('#timein');
  var timeOutField = window.utils.form.element.querySelector('#timeout');

  var setTimeOut = function () {
    timeOutField.selectedIndex = timeInField.selectedIndex;
  };

  var setTimeIn = function () {
    timeInField.selectedIndex = timeOutField.selectedIndex;
  };

  timeInField.addEventListener('change', function () {
    setTimeOut();
  });

  timeOutField.addEventListener('change', function () {
    setTimeIn();
  });

  // 2.6. Поле «Количество комнат» синхронизировано с полем «Количество мест» таким
  // образом, что при выборе количества комнат вводятся ограничения на допустимые варианты
  // выбора количества гостей:
  // 1 комната — «для 1 гостя»;
  // 2 комнаты — «для 2 гостей» или «для 1 гостя»;
  // 3 комнаты — «для 3 гостей», «для 2 гостей» или «для 1 гостя»;
  // 100 комнат — «не для гостей»;
  // Допускаются разные способы ограничения допустимых значений поля «Количество мест»:
  // удаление из разметки соответствующих элементов  option , добавление
  // элементам  option  состояния  disabled  или другие способы ограничения, например,
  // с помощью метода  setCustomValidity.
  var roomNumberField = window.utils.form.element.querySelector('#room_number');
  var capacityField = window.utils.form.element.querySelector('#capacity');

  var disableCapacityFieldOptions = function () {
    if (roomNumberField.value === '100') {
      for (var i = 0; i < capacityField.options.length - 1; i++) {
        capacityField.options[i].setAttribute('disabled', 'disabled');
      }
      capacityField.selectedIndex = capacityField.options.length - 1;
      capacityField.options[capacityField.selectedIndex].removeAttribute('disabled');
    } else {
      for (i = 0; i < capacityField.options.length; i++) {
        if (i < +roomNumberField.value) {
          capacityField.options[i].removeAttribute('disabled');
        } else {
          capacityField.options[i].setAttribute('disabled', 'disabled');
        }
      }
      if (capacityField.selectedIndex >= +roomNumberField.value) {
        capacityField.selectedIndex = +roomNumberField.value - 1;
      }
    }
  };

  roomNumberField.addEventListener('change', function () {
    disableCapacityFieldOptions();
  });

  // 1.4. Страница реагирует на неправильно введённые значения в форму . Если данные,
  // введённые в форму , не соответствуют ограничениям, указанным в разделе, описывающем
  // поля ввода, форму невозможно отправить на сервер. При попытке отправить форму
  // с неправильными данными, отправки не происходит , а неверно заполненные поля
  // подсвечиваются красной рамкой. Способ добавления рамки и её стиль произвольные.
  var formIsValid = false;
  var validateForm = function () {
    formIsValid = true;
    window.utils.form.element.removeAttribute('novalidate');
    for (var i = 0; i < window.utils.form.inputs.length; i++) {
      if (!window.utils.form.inputs[i].validity.valid) {
        window.utils.form.inputs[i].classList.add('invalid');
        formIsValid = false;
      } else {
        window.utils.form.inputs[i].classList.remove('invalid');
      }
    }
  };

  var sendForm = function (evt) {
    if (!formIsValid) {
      return;
    }
    evt.preventDefault();
    var formData = new FormData(window.utils.form.element);
    window.backend.save(formData,
        function () {
          window.utils.form.onSendPopup('success');
          deactivatePage();
        },
        window.utils.form.onSendPopup);
    // window.utils.form.element.submit();
  };

  var submitForm = window.utils.form.element.querySelector('.ad-form__submit');
  submitForm.addEventListener('click', function (evt) {
    validateForm();
    sendForm(evt);
  });

  // 1.7. Нажатие на кнопку  .ad-form__reset  сбрасывает страницу в исходное неактивное
  // состояние без перезагрузки: все заполненные поля стираются, метки похожих объявлений
  // и карточка активного объявления удаляются, метка адреса возвращается в исходное
  // положение, значение поля адреса корректируется соответственно положению метки.
  var resetForm = window.utils.form.element.querySelector('.ad-form__reset');
  resetForm.addEventListener('click', function (evt) {
    deactivatePage();
    evt.preventDefault();
  });

})();
