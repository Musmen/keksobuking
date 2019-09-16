'use strict';

(function () {

  var ESC_KEYCODE = 27;

  var isEscPressed = function (evt, action) {
    if (evt.keyCode === ESC_KEYCODE) {
      action();
    }
  };

  var form = {
    element: document.body.querySelector('.ad-form')
  };

  form.fieldsets = form.element.querySelectorAll('fieldset');
  form.inputs = form.element.querySelectorAll('input');

  form.activate = function () {
    form.element.classList.remove('ad-form--disabled');
    for (var i = 0; i < form.fieldsets.length; i++) {
      form.fieldsets[i].removeAttribute('disabled');
    }
  };

  form.deactivate = function () {
    for (var i = 0; i < form.fieldsets.length; i++) {
      form.fieldsets[i].setAttribute('disabled', 'disabled');
    }

    for (i = 0; i < form.inputs.length; i++) {
      form.inputs[i].classList.remove('invalid');
    }

    form.element.classList.add('ad-form--disabled');
  };

  form.onSendPopup = function (result, errorMessage, xhr) {
    var popupTemplate = document.body.querySelector('#' + result);
    var popup = popupTemplate.content.querySelector('.' + result).cloneNode(true);
    if (errorMessage) {
      var popupMessage = popup.querySelector('.error__message');
      if (xhr) {
        errorMessage += ' Статус: ' + xhr.status;
      }
      popupMessage.textContent = errorMessage;
    }

    var onPopupClick = function () {
      document.removeEventListener('click', onPopupClick);
      document.removeEventListener('keyup', onPopupKeyUp);
      document.body.removeChild(popup);
    };

    var onPopupKeyUp = function (evt) {
      isEscPressed(evt, onPopupClick);
    };

    document.addEventListener('click', onPopupClick);
    document.addEventListener('keyup', onPopupKeyUp);

    document.body.appendChild(popup);
  };

  var timerId = null;
  var debounce = function (callBack) {
    if (timerId) {
      clearTimeout(timerId);
    }
    timerId = setTimeout(callBack, 500);
  };

  // var debounce = function (callBack) {
  //   var timerId = null;
    
  //   return function() {
  //     var args = arguments;
  //     if (timerId) {
  //       clearTimeout(timerId);
  //     }
  //     timerId = setTimeout(
  //       function() {
  //         callBack.apply(null, args);
  //       }, 500);
  //   };
  // };

  window.utils = {
    isEscPressed: isEscPressed,

    // timerId: timerId,
    debounce: debounce,

    form: {
      element: form.element,
      fieldsets: form.fieldsets,
      inputs: form.inputs,

      activate: form.activate,
      deactivate: form.deactivate,

      onSendPopup: form.onSendPopup
    }
  };

})();
