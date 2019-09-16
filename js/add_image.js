'use strict';

(function() {
  var MAX_FLAT_IMG_COUNT = 5;

  var avatarFormField = window.utils.form.element.querySelector('.ad-form__field > input[type="file"]');
  var avatarPreview = window.utils.form.element.querySelector('.ad-form-header__preview > img');
  var avatarDropZone = window.utils.form.element.querySelector('.ad-form-header__drop-zone');

  var flatImgFileField = window.utils.form.element.querySelector('.ad-form__upload > input[type="file"]');
  var flatImgPreview = window.utils.form.element.querySelector('.ad-form__photo');
  var flatImgDropZone = window.utils.form.element.querySelector('.ad-form__drop-zone');

  var isValidFileType = function (inputFile) {
    return inputFile.type.split('/')[0] === 'image';
  };

  var renderAvatarImage = function (previewContainer, dataURL) {
    previewContainer.src = dataURL;
  };

  var renderFlatImage = function (previewContainer, dataURL) {
    var img = document.createElement('img');
    img.setAttribute('width', 70);
    img.setAttribute('height', 70);
    img.setAttribute('alt', 'Фотография жилья');
    // img.style.float = 'left';
    img.src = dataURL;
    previewContainer.appendChild(img);
  };

  var readNewImage = function (previewContainer, inputFile, appendImg) {
    var reader = new FileReader();

    reader.addEventListener('error',
        function (evt) {
          window.utils.form.onSendPopup('error', 'Ошибка загрузки файла');
        }
    );

    reader.addEventListener('load',
        function (evt) {
          appendImg(previewContainer, evt.target.result);
        }
    );

    reader.readAsDataURL(inputFile);
  };

  var chooseFile = function (previewContainer,inputFiles, appendImg) {
    for (var i = inputFiles.length; i--;) {
      if (!isValidFileType(inputFiles[i])) {
        window.utils.form.onSendPopup('error', 'Неверный тип файла');
        return;
      }
      if (previewContainer.querySelectorAll('img').length >= MAX_FLAT_IMG_COUNT) {
        window.utils.form.onSendPopup('error', 'Загружено максимальное количество фотографий');
        return;
      }
      readNewImage(previewContainer, inputFiles[i], appendImg);
    }
  };

  var setOnInputFileChangeHandler = function(formField, previewContainer, dropZone, appendImg) {
    formField.addEventListener('change',
      function (evt) {
        chooseFile(previewContainer, evt.target.files, appendImg);
      }
    );

    dropZone.addEventListener('dragover',
        function(evt) {
          evt.preventDefault();
        }
    );

    dropZone.addEventListener('drop',
        function(evt) {
          evt.preventDefault();
          chooseFile(previewContainer, evt.dataTransfer.files, appendImg);
        }
    );
  };

  setOnInputFileChangeHandler(avatarFormField, avatarPreview, avatarDropZone, renderAvatarImage);
  setOnInputFileChangeHandler(flatImgFileField, flatImgPreview, flatImgDropZone, renderFlatImage);
})();

// 6. Необязательная функциональность!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
// 6.1. В форме подачи объявления показывается аватарка пользователя и фотографии
// объявления при изменении значений соответствующих полей.
