'use strict';

(function () {
  var URL = 'https://js.dump.academy/keksobooking';
  var backend = {};

  backend.load = function (callbackName, onError) {
    var script = document.createElement('script');
    script.src = URL + '/data?callback=' + callbackName;
    script.addEventListener('error', function () {
      onError('error', 'Ошибка соединения с сервером.');
    });
    document.body.appendChild(script);
  };

  backend.save = function (data, onSuccess, onError) {
    var xhr = new XMLHttpRequest();
    // xhr.response = 'json';
    xhr.timeout = 2000;

    var onRequestLoad = function (_xhr, _onSuccess, _onError) {
      var errorMessage = '';
      switch (_xhr.status) {
        case 200:
          _onSuccess();
          break;
        case 300:
          errorMessage = 'Искомый ресурс переехал.';
          break;
        case 400:
          errorMessage = 'Ошибка запроса.';
          break;
        case 404:
          errorMessage = 'Запрашиваемый ресурс не найден.';
          break;
        default:
          errorMessage = 'Ошибка соединения с сервером.';
          break;
      }

      if (errorMessage) {
        _onError('error', errorMessage, _xhr);
      }
    };

    var onRequestError = function (_xhr, _onError, errorMessage) {
      _onError('error', errorMessage, _xhr);
    };

    xhr.open('POST', URL, true);

    xhr.addEventListener('load', function (evt) {
      onRequestLoad(evt.target, onSuccess, onError);
    });
    xhr.addEventListener('error', function (evt) {
      onRequestError(evt.target, onError, 'Ошибка соединения с сервером.');
    });
    xhr.addEventListener('timeout', function (evt) {
      onRequestError(evt.target, onError, 'Превышено время ожидания: ' + xhr.timeout + ' мс.');
    });

    xhr.send(data);
  };

  window.backend = {
    load: backend.load,
    save: backend.save
  };

})();
