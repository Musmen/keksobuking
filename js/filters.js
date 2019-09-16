'use strict';

(function (){
  var filtersContainer = document.body.querySelector('.map__filters-container');
  var filtersForm = filtersContainer.querySelector('.map__filters');
  
  var ValueToPrice = {
    'middle': {
      min: 10000,
      max: 50000
    },
    'low': {
      min: 0,
      max: 10000
    },
    'high': {
      min: 50000,
      max: Infinity
    }
  };
  
  var FiltersNamesToFunction = {
    'housing-type': function (value) {
      return function(item) {
        return item.offer.type === value;
      };
    },

    'housing-price': function (value) {
      return function(item) {
        return ( (item.offer.price >= ValueToPrice[value].min) && (item.offer.price < ValueToPrice[value].max) );
      };
    },

    'housing-rooms': function (value) {
      return function(item) {
        return item.offer.rooms === +value;
      };
    },

    'housing-guests': function (value) {
      return function(item) {
        return item.offer.guests === +value;
      };
    },

    'features': function (valueFeatures) { // Передаем значения фильтров по Features из FormData типа ['wi-fi', ...]
      return function(item) { // В item попадает экземпляр объекта Объявления
        return valueFeatures.every( // Проверяем, чтобы каждый 
          function (valueFeature) { // элемент массива значений фильтров Features
            return ~item.offer.features.indexOf(valueFeature); // содержался в экземпляре объекта Объявления
          }                                                    // Тогда выводим его
        );
      };
    }

  };

  var filterPins = function () {
    window.data.clearPinElements(window.data.pinElements.slice(0, 5));
    
    window.data.newAdvertisements = window.data.randomAdvertisements.slice();
    var filtersFieldsValues = new FormData(filtersForm);

    for (var filterName of filtersFieldsValues.keys()) {
      var filterValue = (filterName === 'features') ? filtersFieldsValues.getAll(filterName) : filtersFieldsValues.get(filterName);
      
      if (filterValue === 'any') {
        continue;
      }

      window.data.newAdvertisements = window.data.newAdvertisements.
        filter( FiltersNamesToFunction[filterName](filterValue) );
    }
    
    window.data.createPinElements(window.data.newAdvertisements);
    window.data.renderPinElements(window.data.pinElements.slice(0, 5));
  };

  filtersForm.addEventListener('change', function () {
    window.card.close();
    window.utils.debounce(filterPins)();
  });

  window.filters = {
    form: filtersForm
  };

})();