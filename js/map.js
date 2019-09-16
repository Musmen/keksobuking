'use strict';

(function () {

  var map = {
    element: document.body.querySelector('.map')
  };

  var filtersContainer = map.element.querySelector('.map__filters-container');

  map.activate = function () {
    map.element.classList.remove('map--faded');
    filtersContainer.removeAttribute('hidden');
  };

  map.deactivate = function () {
    map.element.classList.add('map--faded');
    filtersContainer.setAttribute('hidden', 'hidden');
  };

  window.map = {
    element: map.element,

    activate: map.activate,
    deactivate: map.deactivate
  };

})();
