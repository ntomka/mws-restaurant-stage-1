/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/main.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./js/dbhelper.js":
/*!************************!*\
  !*** ./js/dbhelper.js ***!
  \************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(fetch) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_idb__ = __webpack_require__(/*! idb */ "./node_modules/idb/lib/idb.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_idb___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_idb__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }



/**
 * Common database helper functions.
 */

var DBHelper = function () {
  function DBHelper() {
    _classCallCheck(this, DBHelper);
  }

  _createClass(DBHelper, null, [{
    key: '_validateResponse',
    value: function _validateResponse(response) {
      if (!response.ok) {
        throw Error(response.statusText);
      }
      return response;
    }
  }, {
    key: '_readResponseAsJSON',
    value: function _readResponseAsJSON(response) {
      return response.json();
    }

    /**
     * Fetch all restaurants.
     */

  }, {
    key: 'fetchRestaurants',
    value: function fetchRestaurants(callback) {
      var _this = this;

      fetch(DBHelper.DATABASE_URL).then(this._validateResponse).then(this._readResponseAsJSON).then(function (result) {
        // add new elements to db
        _this.DB.then(function (db) {
          var tx = db.transaction(_this.DB_STORE, 'readwrite'),
              dbStore = tx.objectStore(_this.DB_STORE);
          result.forEach(function (restaurant) {
            dbStore.put(restaurant);
          });
          return tx.complete;
        });
        callback(null, result);
      }).catch(function (error) {
        // offline or something, read from db
        _this.DB.then(function (db) {
          var tx = db.transaction(_this.DB_STORE),
              dbStore = tx.objectStore(_this.DB_STORE);

          return dbStore.getAll();
        }).then(function (restaurants) {
          return callback(null, restaurants);
        }).catch(function (error) {
          return callback(error, null);
        });
      });
    }

    /**
     * Fetch a restaurant by its ID.
     */

  }, {
    key: 'fetchRestaurantById',
    value: function fetchRestaurantById(id, callback) {
      var _this2 = this;

      fetch(DBHelper.DATABASE_URL + '/' + id).then(this._validateResponse).then(this._readResponseAsJSON).then(function (result) {
        // add this element to db if not exists
        _this2.DB.then(function (db) {
          var tx = db.transaction(_this2.DB_STORE, 'readwrite'),
              dbStore = tx.objectStore(_this2.DB_STORE);
          dbStore.put(result);
        });
        callback(null, result);
      }).catch(function (error) {
        _this2.DB.then(function (db) {
          var tx = db.transaction(_this2.DB_STORE),
              dbStore = tx.objectStore(_this2.DB_STORE);

          return dbStore.get(parseInt(id));
        }).then(function (restaurant) {
          return callback(null, restaurant);
        }).catch(function () {
          return callback('Restaurant does not exist', null);
        });
      });
    }

    /**
     * Fetch restaurants by a cuisine type with proper error handling.
     */

  }, {
    key: 'fetchRestaurantByCuisine',
    value: function fetchRestaurantByCuisine(cuisine, callback) {
      // Fetch all restaurants  with proper error handling
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given cuisine type
          var results = restaurants.filter(function (r) {
            return r.cuisine_type == cuisine;
          });
          callback(null, results);
        }
      });
    }

    /**
     * Fetch restaurants by a neighborhood with proper error handling.
     */

  }, {
    key: 'fetchRestaurantByNeighborhood',
    value: function fetchRestaurantByNeighborhood(neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Filter restaurants to have only given neighborhood
          var results = restaurants.filter(function (r) {
            return r.neighborhood == neighborhood;
          });
          callback(null, results);
        }
      });
    }

    /**
     * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
     */

  }, {
    key: 'fetchRestaurantByCuisineAndNeighborhood',
    value: function fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          var results = restaurants;
          if (cuisine != 'all') {
            // filter by cuisine
            results = results.filter(function (r) {
              return r.cuisine_type == cuisine;
            });
          }
          if (neighborhood != 'all') {
            // filter by neighborhood
            results = results.filter(function (r) {
              return r.neighborhood == neighborhood;
            });
          }
          callback(null, results);
        }
      });
    }

    /**
     * Fetch all neighborhoods with proper error handling.
     */

  }, {
    key: 'fetchNeighborhoods',
    value: function fetchNeighborhoods(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Get all neighborhoods from all restaurants
          var neighborhoods = restaurants.map(function (v, i) {
            return restaurants[i].neighborhood;
          });
          // Remove duplicates from neighborhoods
          var uniqueNeighborhoods = neighborhoods.filter(function (v, i) {
            return neighborhoods.indexOf(v) == i;
          });
          callback(null, uniqueNeighborhoods);
        }
      });
    }

    /**
     * Fetch all cuisines with proper error handling.
     */

  }, {
    key: 'fetchCuisines',
    value: function fetchCuisines(callback) {
      // Fetch all restaurants
      DBHelper.fetchRestaurants(function (error, restaurants) {
        if (error) {
          callback(error, null);
        } else {
          // Get all cuisines from all restaurants
          var cuisines = restaurants.map(function (v, i) {
            return restaurants[i].cuisine_type;
          });
          // Remove duplicates from cuisines
          var uniqueCuisines = cuisines.filter(function (v, i) {
            return cuisines.indexOf(v) == i;
          });
          callback(null, uniqueCuisines);
        }
      });
    }

    /**
     * Restaurant page URL.
     */

  }, {
    key: 'urlForRestaurant',
    value: function urlForRestaurant(restaurant) {
      return './restaurant.html?id=' + restaurant.id;
    }

    /**
     * Restaurant srcset image URL.
     */

  }, {
    key: 'imageSrcSetUrlForRestaurant',
    value: function imageSrcSetUrlForRestaurant(restaurant) {
      var finfo = restaurant.photograph ? restaurant.photograph.split(/\./) : [restaurant.id, 'jpg'];
      return '/img_dist/' + finfo[0] + '-660_2x.' + (finfo[1] || 'jpg') + ' 2x, /img_dist/' + finfo[0] + '-330_1x.' + (finfo[1] || 'jpg');
    }

    /**
     * Restaurant image URL.
     */

  }, {
    key: 'imageUrlForRestaurant',
    value: function imageUrlForRestaurant(restaurant) {
      var finfo = restaurant.photograph ? restaurant.photograph.split(/\./) : [restaurant.id, 'jpg'];
      return '/img/' + finfo[0] + '.' + (finfo[1] || 'jpg');
    }
  }, {
    key: 'imageSrcSetUrlForReviewPage',
    value: function imageSrcSetUrlForReviewPage(restaurant) {
      var finfo = restaurant.photograph ? restaurant.photograph.split(/\./) : [restaurant.id, 'jpg'];
      return '/img/' + finfo[0] + '.' + (finfo[1] || 'jpg') + ' 800w, /img_dist/' + finfo[0] + '-660_2x.' + (finfo[1] || 'jpg') + ' 660w, /img_dist/' + finfo[0] + '-330_1x.' + (finfo[1] || 'jpg') + ' 330w';
    }

    /**
     * Map marker for a restaurant.
     */

  }, {
    key: 'mapMarkerForRestaurant',
    value: function mapMarkerForRestaurant(restaurant, map) {
      var marker = new google.maps.Marker({
        position: restaurant.latlng,
        title: restaurant.name,
        url: DBHelper.urlForRestaurant(restaurant),
        map: map,
        animation: google.maps.Animation.DROP
      });
      return marker;
    }
  }, {
    key: 'DATABASE_URL',

    /**
     * Database URL.
     * Change this to restaurants.json file location on your server.
     */
    get: function get() {
      return 'http://localhost:1337/restaurants';
    }
  }, {
    key: 'DB_VERSION',
    get: function get() {
      return 1;
    }
  }, {
    key: 'DB_NAME',
    get: function get() {
      return 'restaurants';
    }
  }, {
    key: 'DB_STORE',
    get: function get() {
      return 'list';
    }
  }, {
    key: 'DB',
    get: function get() {
      var _this3 = this;

      return __WEBPACK_IMPORTED_MODULE_0_idb___default.a.open(this.DB_NAME, this.DB_VERSION, function (upgradeDb) {
        switch (upgradeDb.oldVersion) {
          case 0:
            upgradeDb.createObjectStore(_this3.DB_STORE, { keyPath: 'id' });
        }
      });
    }
  }]);

  return DBHelper;
}();

/* harmony default export */ __webpack_exports__["a"] = (DBHelper);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch */ "./node_modules/imports-loader/index.js?this=>global!./node_modules/exports-loader/index.js?global.fetch!./node_modules/whatwg-fetch/fetch.js")))

/***/ }),

/***/ "./js/intersection_observer.js":
/*!*************************************!*\
  !*** ./js/intersection_observer.js ***!
  \*************************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
var elements = void 0,
    prevRatio = 0.0;

var createObserver = function createObserver() {
  var observer;

  var options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  };

  observer = new IntersectionObserver(handleIntersect, options);
  elements.forEach(function (element) {
    return observer.observe(element);
  });
};

var handleIntersect = function handleIntersect(entries, observer) {
  entries.forEach(function (entry) {
    if (entry.intersectionRatio < 1) {
      return;
    }

    if (entry.target.hasAttribute('data-srcset')) {
      entry.target.setAttribute('srcset', entry.target.getAttribute('data-srcset'));
      entry.target.removeAttribute('data-srcset');
    }
    if (entry.target.hasAttribute('data-src')) {
      entry.target.setAttribute('src', entry.target.getAttribute('data-src'));
      entry.target.removeAttribute('data-src');
    }
  });
};

/* harmony default export */ __webpack_exports__["a"] = (function () {
  elements = document.querySelectorAll('source[data-srcset], img[data-src]');

  createObserver();
});

/***/ }),

/***/ "./js/main.js":
/*!********************!*\
  !*** ./js/main.js ***!
  \********************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dbhelper__ = __webpack_require__(/*! ./dbhelper */ "./js/dbhelper.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__intersection_observer__ = __webpack_require__(/*! ./intersection_observer */ "./js/intersection_observer.js");



var restaurants = void 0,
    neighborhoods = void 0,
    cuisines = void 0;

self.map;
self.markers = [];

/**
 * Register serviceWorker
 */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' });
}

/**
 * Fetch all neighborhoods and set their HTML.
 */
var fetchNeighborhoods = function fetchNeighborhoods() {
  __WEBPACK_IMPORTED_MODULE_0__dbhelper__["a" /* default */].fetchNeighborhoods(function (error, neighborhoods) {
    if (error) {
      // Got an error
      console.error(error);
    } else {
      self.neighborhoods = neighborhoods;
      fillNeighborhoodsHTML();
    }
  });
};

/**
 * Set neighborhoods HTML.
 */
var fillNeighborhoodsHTML = function fillNeighborhoodsHTML() {
  var neighborhoods = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.neighborhoods;

  var select = document.getElementById('neighborhoods-select');
  neighborhoods.forEach(function (neighborhood) {
    var option = document.createElement('option');
    option.innerHTML = neighborhood;
    option.value = neighborhood;
    select.append(option);
  });
};

/**
 * Fetch all cuisines and set their HTML.
 */
var fetchCuisines = function fetchCuisines() {
  __WEBPACK_IMPORTED_MODULE_0__dbhelper__["a" /* default */].fetchCuisines(function (error, cuisines) {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      self.cuisines = cuisines;
      fillCuisinesHTML();
    }
  });
};

/**
 * Set cuisines HTML.
 */
var fillCuisinesHTML = function fillCuisinesHTML() {
  var cuisines = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.cuisines;

  var select = document.getElementById('cuisines-select');

  cuisines.forEach(function (cuisine) {
    var option = document.createElement('option');
    option.innerHTML = cuisine;
    option.value = cuisine;
    select.append(option);
  });
};

/**
 * Update page and map for current restaurants.
 */
var updateRestaurants = function updateRestaurants() {
  var cSelect = document.getElementById('cuisines-select');
  var nSelect = document.getElementById('neighborhoods-select');

  var cIndex = cSelect.selectedIndex;
  var nIndex = nSelect.selectedIndex;

  var cuisine = cSelect[cIndex].value;
  var neighborhood = nSelect[nIndex].value;

  __WEBPACK_IMPORTED_MODULE_0__dbhelper__["a" /* default */].fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, function (error, restaurants) {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      resetRestaurants(restaurants);
      fillRestaurantsHTML();
      Object(__WEBPACK_IMPORTED_MODULE_1__intersection_observer__["a" /* default */])();
    }
  });
};

/**
 * Clear current restaurants, their HTML and remove their map markers.
 */
var resetRestaurants = function resetRestaurants(restaurants) {
  // Remove all restaurants
  self.restaurants = [];
  var ul = document.getElementById('restaurants-list');
  ul.innerHTML = '';

  // Remove all map markers
  self.markers.forEach(function (m) {
    return m.setMap(null);
  });
  self.markers = [];
  self.restaurants = restaurants;
};

/**
 * Create all restaurants HTML and add them to the webpage.
 */
var fillRestaurantsHTML = function fillRestaurantsHTML() {
  var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

  var ul = document.getElementById('restaurants-list');
  restaurants.forEach(function (restaurant) {
    ul.append(createRestaurantHTML(restaurant));
  });
  addMarkersToMap();
};

/**
 * Create restaurant HTML.
 */
var createRestaurantHTML = function createRestaurantHTML(restaurant) {
  var li = document.createElement('li');

  var picture = document.createElement('picture');

  var source = document.createElement('source');
  source.setAttribute('data-srcset', __WEBPACK_IMPORTED_MODULE_0__dbhelper__["a" /* default */].imageSrcSetUrlForRestaurant(restaurant));
  source.className = 'restaurant-img';
  picture.append(source);

  var image = document.createElement('img');
  image.className = 'restaurant-img';
  image.alt = restaurant.name + ' restaurant';
  image.setAttribute('data-src', __WEBPACK_IMPORTED_MODULE_0__dbhelper__["a" /* default */].imageUrlForRestaurant(restaurant));
  picture.append(image);

  var figure = document.createElement('figure');
  figure.append(picture);

  var figcaption = document.createElement('figcaption');
  figcaption.innerHTML = restaurant.name;
  figcaption.tabIndex = 0;
  figcaption.setAttribute('aria-label', restaurant.name + ' restaurant');
  figure.append(figcaption);

  li.append(figure);

  var divContainer = document.createElement('div');
  divContainer.tabIndex = 0;
  divContainer.setAttribute('aria-label', 'Address of ' + restaurant.name + ' restaurant');
  divContainer.className = 'restaurant-info-container';

  var neighborhood = document.createElement('p');
  neighborhood.innerHTML = restaurant.neighborhood;
  neighborhood.tabIndex = 0;
  divContainer.append(neighborhood);

  var address = document.createElement('p');
  address.innerHTML = restaurant.address;
  address.tabIndex = 0;
  divContainer.append(address);

  var more = document.createElement('a');
  more.innerHTML = 'View Details';
  more.href = __WEBPACK_IMPORTED_MODULE_0__dbhelper__["a" /* default */].urlForRestaurant(restaurant);
  more.title = 'View details about ' + restaurant.name;
  more.setAttribute('aria-label', 'View details about ' + restaurant.name);
  divContainer.append(more);

  li.append(divContainer);

  return li;
};

/**
 * Add markers for current restaurants to the map.
 */
var addMarkersToMap = function addMarkersToMap() {
  var restaurants = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : self.restaurants;

  restaurants.forEach(function (restaurant) {
    // Add marker to the map
    var marker = __WEBPACK_IMPORTED_MODULE_0__dbhelper__["a" /* default */].mapMarkerForRestaurant(restaurant, self.map);
    google.maps.event.addListener(marker, 'click', function () {
      window.location.href = marker.url;
    });
    self.markers.push(marker);
  });
};

/**
 * Fetch neighborhoods and cuisines as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', function (event) {
  fetchNeighborhoods();
  fetchCuisines();

  document.getElementById('neighborhoods-select').onchange = updateRestaurants;
  document.getElementById('cuisines-select').onchange = updateRestaurants;
});

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = function () {
  var loc = {
    lat: 40.722216,
    lng: -73.987501
  };
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: loc,
    scrollwheel: false
  });
};

document.addEventListener('DOMContentLoaded', function (event) {
  updateRestaurants();

  var mapLoader = document.createElement('script');
  mapLoader.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAPYV1tlwm9ftEe0p0cQWNeeXbptVadGXM&libraries=places&callback=initMap';

  var godefer = document.getElementsByTagName('head')[0];
  godefer.appendChild(mapLoader);
});

/***/ }),

/***/ "./node_modules/idb/lib/idb.js":
/*!*************************************!*\
  !*** ./node_modules/idb/lib/idb.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! exports used: default */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


(function() {
  function toArray(arr) {
    return Array.prototype.slice.call(arr);
  }

  function promisifyRequest(request) {
    return new Promise(function(resolve, reject) {
      request.onsuccess = function() {
        resolve(request.result);
      };

      request.onerror = function() {
        reject(request.error);
      };
    });
  }

  function promisifyRequestCall(obj, method, args) {
    var request;
    var p = new Promise(function(resolve, reject) {
      request = obj[method].apply(obj, args);
      promisifyRequest(request).then(resolve, reject);
    });

    p.request = request;
    return p;
  }

  function promisifyCursorRequestCall(obj, method, args) {
    var p = promisifyRequestCall(obj, method, args);
    return p.then(function(value) {
      if (!value) return;
      return new Cursor(value, p.request);
    });
  }

  function proxyProperties(ProxyClass, targetProp, properties) {
    properties.forEach(function(prop) {
      Object.defineProperty(ProxyClass.prototype, prop, {
        get: function() {
          return this[targetProp][prop];
        },
        set: function(val) {
          this[targetProp][prop] = val;
        }
      });
    });
  }

  function proxyRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function proxyMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return this[targetProp][prop].apply(this[targetProp], arguments);
      };
    });
  }

  function proxyCursorRequestMethods(ProxyClass, targetProp, Constructor, properties) {
    properties.forEach(function(prop) {
      if (!(prop in Constructor.prototype)) return;
      ProxyClass.prototype[prop] = function() {
        return promisifyCursorRequestCall(this[targetProp], prop, arguments);
      };
    });
  }

  function Index(index) {
    this._index = index;
  }

  proxyProperties(Index, '_index', [
    'name',
    'keyPath',
    'multiEntry',
    'unique'
  ]);

  proxyRequestMethods(Index, '_index', IDBIndex, [
    'get',
    'getKey',
    'getAll',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(Index, '_index', IDBIndex, [
    'openCursor',
    'openKeyCursor'
  ]);

  function Cursor(cursor, request) {
    this._cursor = cursor;
    this._request = request;
  }

  proxyProperties(Cursor, '_cursor', [
    'direction',
    'key',
    'primaryKey',
    'value'
  ]);

  proxyRequestMethods(Cursor, '_cursor', IDBCursor, [
    'update',
    'delete'
  ]);

  // proxy 'next' methods
  ['advance', 'continue', 'continuePrimaryKey'].forEach(function(methodName) {
    if (!(methodName in IDBCursor.prototype)) return;
    Cursor.prototype[methodName] = function() {
      var cursor = this;
      var args = arguments;
      return Promise.resolve().then(function() {
        cursor._cursor[methodName].apply(cursor._cursor, args);
        return promisifyRequest(cursor._request).then(function(value) {
          if (!value) return;
          return new Cursor(value, cursor._request);
        });
      });
    };
  });

  function ObjectStore(store) {
    this._store = store;
  }

  ObjectStore.prototype.createIndex = function() {
    return new Index(this._store.createIndex.apply(this._store, arguments));
  };

  ObjectStore.prototype.index = function() {
    return new Index(this._store.index.apply(this._store, arguments));
  };

  proxyProperties(ObjectStore, '_store', [
    'name',
    'keyPath',
    'indexNames',
    'autoIncrement'
  ]);

  proxyRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'put',
    'add',
    'delete',
    'clear',
    'get',
    'getAll',
    'getKey',
    'getAllKeys',
    'count'
  ]);

  proxyCursorRequestMethods(ObjectStore, '_store', IDBObjectStore, [
    'openCursor',
    'openKeyCursor'
  ]);

  proxyMethods(ObjectStore, '_store', IDBObjectStore, [
    'deleteIndex'
  ]);

  function Transaction(idbTransaction) {
    this._tx = idbTransaction;
    this.complete = new Promise(function(resolve, reject) {
      idbTransaction.oncomplete = function() {
        resolve();
      };
      idbTransaction.onerror = function() {
        reject(idbTransaction.error);
      };
      idbTransaction.onabort = function() {
        reject(idbTransaction.error);
      };
    });
  }

  Transaction.prototype.objectStore = function() {
    return new ObjectStore(this._tx.objectStore.apply(this._tx, arguments));
  };

  proxyProperties(Transaction, '_tx', [
    'objectStoreNames',
    'mode'
  ]);

  proxyMethods(Transaction, '_tx', IDBTransaction, [
    'abort'
  ]);

  function UpgradeDB(db, oldVersion, transaction) {
    this._db = db;
    this.oldVersion = oldVersion;
    this.transaction = new Transaction(transaction);
  }

  UpgradeDB.prototype.createObjectStore = function() {
    return new ObjectStore(this._db.createObjectStore.apply(this._db, arguments));
  };

  proxyProperties(UpgradeDB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(UpgradeDB, '_db', IDBDatabase, [
    'deleteObjectStore',
    'close'
  ]);

  function DB(db) {
    this._db = db;
  }

  DB.prototype.transaction = function() {
    return new Transaction(this._db.transaction.apply(this._db, arguments));
  };

  proxyProperties(DB, '_db', [
    'name',
    'version',
    'objectStoreNames'
  ]);

  proxyMethods(DB, '_db', IDBDatabase, [
    'close'
  ]);

  // Add cursor iterators
  // TODO: remove this once browsers do the right thing with promises
  ['openCursor', 'openKeyCursor'].forEach(function(funcName) {
    [ObjectStore, Index].forEach(function(Constructor) {
      // Don't create iterateKeyCursor if openKeyCursor doesn't exist.
      if (!(funcName in Constructor.prototype)) return;

      Constructor.prototype[funcName.replace('open', 'iterate')] = function() {
        var args = toArray(arguments);
        var callback = args[args.length - 1];
        var nativeObject = this._store || this._index;
        var request = nativeObject[funcName].apply(nativeObject, args.slice(0, -1));
        request.onsuccess = function() {
          callback(request.result);
        };
      };
    });
  });

  // polyfill getAll
  [Index, ObjectStore].forEach(function(Constructor) {
    if (Constructor.prototype.getAll) return;
    Constructor.prototype.getAll = function(query, count) {
      var instance = this;
      var items = [];

      return new Promise(function(resolve) {
        instance.iterateCursor(query, function(cursor) {
          if (!cursor) {
            resolve(items);
            return;
          }
          items.push(cursor.value);

          if (count !== undefined && items.length == count) {
            resolve(items);
            return;
          }
          cursor.continue();
        });
      });
    };
  });

  var exp = {
    open: function(name, version, upgradeCallback) {
      var p = promisifyRequestCall(indexedDB, 'open', [name, version]);
      var request = p.request;

      request.onupgradeneeded = function(event) {
        if (upgradeCallback) {
          upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
        }
      };

      return p.then(function(db) {
        return new DB(db);
      });
    },
    delete: function(name) {
      return promisifyRequestCall(indexedDB, 'deleteDatabase', [name]);
    }
  };

  if (true) {
    module.exports = exp;
    module.exports.default = module.exports;
  }
  else {
    self.idb = exp;
  }
}());


/***/ }),

/***/ "./node_modules/imports-loader/index.js?this=>global!./node_modules/exports-loader/index.js?global.fetch!./node_modules/whatwg-fetch/fetch.js":
/*!**********************************************************************************************************************************!*\
  !*** ./node_modules/imports-loader?this=>global!./node_modules/exports-loader?global.fetch!./node_modules/whatwg-fetch/fetch.js ***!
  \**********************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/*** IMPORTS FROM imports-loader ***/
(function() {

(function(self) {
  'use strict';

  if (self.fetch) {
    return
  }

  var support = {
    searchParams: 'URLSearchParams' in self,
    iterable: 'Symbol' in self && 'iterator' in Symbol,
    blob: 'FileReader' in self && 'Blob' in self && (function() {
      try {
        new Blob()
        return true
      } catch(e) {
        return false
      }
    })(),
    formData: 'FormData' in self,
    arrayBuffer: 'ArrayBuffer' in self
  }

  if (support.arrayBuffer) {
    var viewClasses = [
      '[object Int8Array]',
      '[object Uint8Array]',
      '[object Uint8ClampedArray]',
      '[object Int16Array]',
      '[object Uint16Array]',
      '[object Int32Array]',
      '[object Uint32Array]',
      '[object Float32Array]',
      '[object Float64Array]'
    ]

    var isDataView = function(obj) {
      return obj && DataView.prototype.isPrototypeOf(obj)
    }

    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
    }
  }

  function normalizeName(name) {
    if (typeof name !== 'string') {
      name = String(name)
    }
    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
      throw new TypeError('Invalid character in header field name')
    }
    return name.toLowerCase()
  }

  function normalizeValue(value) {
    if (typeof value !== 'string') {
      value = String(value)
    }
    return value
  }

  // Build a destructive iterator for the value list
  function iteratorFor(items) {
    var iterator = {
      next: function() {
        var value = items.shift()
        return {done: value === undefined, value: value}
      }
    }

    if (support.iterable) {
      iterator[Symbol.iterator] = function() {
        return iterator
      }
    }

    return iterator
  }

  function Headers(headers) {
    this.map = {}

    if (headers instanceof Headers) {
      headers.forEach(function(value, name) {
        this.append(name, value)
      }, this)
    } else if (Array.isArray(headers)) {
      headers.forEach(function(header) {
        this.append(header[0], header[1])
      }, this)
    } else if (headers) {
      Object.getOwnPropertyNames(headers).forEach(function(name) {
        this.append(name, headers[name])
      }, this)
    }
  }

  Headers.prototype.append = function(name, value) {
    name = normalizeName(name)
    value = normalizeValue(value)
    var oldValue = this.map[name]
    this.map[name] = oldValue ? oldValue+','+value : value
  }

  Headers.prototype['delete'] = function(name) {
    delete this.map[normalizeName(name)]
  }

  Headers.prototype.get = function(name) {
    name = normalizeName(name)
    return this.has(name) ? this.map[name] : null
  }

  Headers.prototype.has = function(name) {
    return this.map.hasOwnProperty(normalizeName(name))
  }

  Headers.prototype.set = function(name, value) {
    this.map[normalizeName(name)] = normalizeValue(value)
  }

  Headers.prototype.forEach = function(callback, thisArg) {
    for (var name in this.map) {
      if (this.map.hasOwnProperty(name)) {
        callback.call(thisArg, this.map[name], name, this)
      }
    }
  }

  Headers.prototype.keys = function() {
    var items = []
    this.forEach(function(value, name) { items.push(name) })
    return iteratorFor(items)
  }

  Headers.prototype.values = function() {
    var items = []
    this.forEach(function(value) { items.push(value) })
    return iteratorFor(items)
  }

  Headers.prototype.entries = function() {
    var items = []
    this.forEach(function(value, name) { items.push([name, value]) })
    return iteratorFor(items)
  }

  if (support.iterable) {
    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
  }

  function consumed(body) {
    if (body.bodyUsed) {
      return Promise.reject(new TypeError('Already read'))
    }
    body.bodyUsed = true
  }

  function fileReaderReady(reader) {
    return new Promise(function(resolve, reject) {
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.onerror = function() {
        reject(reader.error)
      }
    })
  }

  function readBlobAsArrayBuffer(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsArrayBuffer(blob)
    return promise
  }

  function readBlobAsText(blob) {
    var reader = new FileReader()
    var promise = fileReaderReady(reader)
    reader.readAsText(blob)
    return promise
  }

  function readArrayBufferAsText(buf) {
    var view = new Uint8Array(buf)
    var chars = new Array(view.length)

    for (var i = 0; i < view.length; i++) {
      chars[i] = String.fromCharCode(view[i])
    }
    return chars.join('')
  }

  function bufferClone(buf) {
    if (buf.slice) {
      return buf.slice(0)
    } else {
      var view = new Uint8Array(buf.byteLength)
      view.set(new Uint8Array(buf))
      return view.buffer
    }
  }

  function Body() {
    this.bodyUsed = false

    this._initBody = function(body) {
      this._bodyInit = body
      if (!body) {
        this._bodyText = ''
      } else if (typeof body === 'string') {
        this._bodyText = body
      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
        this._bodyBlob = body
      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
        this._bodyFormData = body
      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
        this._bodyText = body.toString()
      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
        this._bodyArrayBuffer = bufferClone(body.buffer)
        // IE 10-11 can't handle a DataView body.
        this._bodyInit = new Blob([this._bodyArrayBuffer])
      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
        this._bodyArrayBuffer = bufferClone(body)
      } else {
        throw new Error('unsupported BodyInit type')
      }

      if (!this.headers.get('content-type')) {
        if (typeof body === 'string') {
          this.headers.set('content-type', 'text/plain;charset=UTF-8')
        } else if (this._bodyBlob && this._bodyBlob.type) {
          this.headers.set('content-type', this._bodyBlob.type)
        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
        }
      }
    }

    if (support.blob) {
      this.blob = function() {
        var rejected = consumed(this)
        if (rejected) {
          return rejected
        }

        if (this._bodyBlob) {
          return Promise.resolve(this._bodyBlob)
        } else if (this._bodyArrayBuffer) {
          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
        } else if (this._bodyFormData) {
          throw new Error('could not read FormData body as blob')
        } else {
          return Promise.resolve(new Blob([this._bodyText]))
        }
      }

      this.arrayBuffer = function() {
        if (this._bodyArrayBuffer) {
          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
        } else {
          return this.blob().then(readBlobAsArrayBuffer)
        }
      }
    }

    this.text = function() {
      var rejected = consumed(this)
      if (rejected) {
        return rejected
      }

      if (this._bodyBlob) {
        return readBlobAsText(this._bodyBlob)
      } else if (this._bodyArrayBuffer) {
        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
      } else if (this._bodyFormData) {
        throw new Error('could not read FormData body as text')
      } else {
        return Promise.resolve(this._bodyText)
      }
    }

    if (support.formData) {
      this.formData = function() {
        return this.text().then(decode)
      }
    }

    this.json = function() {
      return this.text().then(JSON.parse)
    }

    return this
  }

  // HTTP methods whose capitalization should be normalized
  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

  function normalizeMethod(method) {
    var upcased = method.toUpperCase()
    return (methods.indexOf(upcased) > -1) ? upcased : method
  }

  function Request(input, options) {
    options = options || {}
    var body = options.body

    if (input instanceof Request) {
      if (input.bodyUsed) {
        throw new TypeError('Already read')
      }
      this.url = input.url
      this.credentials = input.credentials
      if (!options.headers) {
        this.headers = new Headers(input.headers)
      }
      this.method = input.method
      this.mode = input.mode
      if (!body && input._bodyInit != null) {
        body = input._bodyInit
        input.bodyUsed = true
      }
    } else {
      this.url = String(input)
    }

    this.credentials = options.credentials || this.credentials || 'omit'
    if (options.headers || !this.headers) {
      this.headers = new Headers(options.headers)
    }
    this.method = normalizeMethod(options.method || this.method || 'GET')
    this.mode = options.mode || this.mode || null
    this.referrer = null

    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
      throw new TypeError('Body not allowed for GET or HEAD requests')
    }
    this._initBody(body)
  }

  Request.prototype.clone = function() {
    return new Request(this, { body: this._bodyInit })
  }

  function decode(body) {
    var form = new FormData()
    body.trim().split('&').forEach(function(bytes) {
      if (bytes) {
        var split = bytes.split('=')
        var name = split.shift().replace(/\+/g, ' ')
        var value = split.join('=').replace(/\+/g, ' ')
        form.append(decodeURIComponent(name), decodeURIComponent(value))
      }
    })
    return form
  }

  function parseHeaders(rawHeaders) {
    var headers = new Headers()
    // Replace instances of \r\n and \n followed by at least one space or horizontal tab with a space
    // https://tools.ietf.org/html/rfc7230#section-3.2
    var preProcessedHeaders = rawHeaders.replace(/\r?\n[\t ]+/g, ' ')
    preProcessedHeaders.split(/\r?\n/).forEach(function(line) {
      var parts = line.split(':')
      var key = parts.shift().trim()
      if (key) {
        var value = parts.join(':').trim()
        headers.append(key, value)
      }
    })
    return headers
  }

  Body.call(Request.prototype)

  function Response(bodyInit, options) {
    if (!options) {
      options = {}
    }

    this.type = 'default'
    this.status = options.status === undefined ? 200 : options.status
    this.ok = this.status >= 200 && this.status < 300
    this.statusText = 'statusText' in options ? options.statusText : 'OK'
    this.headers = new Headers(options.headers)
    this.url = options.url || ''
    this._initBody(bodyInit)
  }

  Body.call(Response.prototype)

  Response.prototype.clone = function() {
    return new Response(this._bodyInit, {
      status: this.status,
      statusText: this.statusText,
      headers: new Headers(this.headers),
      url: this.url
    })
  }

  Response.error = function() {
    var response = new Response(null, {status: 0, statusText: ''})
    response.type = 'error'
    return response
  }

  var redirectStatuses = [301, 302, 303, 307, 308]

  Response.redirect = function(url, status) {
    if (redirectStatuses.indexOf(status) === -1) {
      throw new RangeError('Invalid status code')
    }

    return new Response(null, {status: status, headers: {location: url}})
  }

  self.Headers = Headers
  self.Request = Request
  self.Response = Response

  self.fetch = function(input, init) {
    return new Promise(function(resolve, reject) {
      var request = new Request(input, init)
      var xhr = new XMLHttpRequest()

      xhr.onload = function() {
        var options = {
          status: xhr.status,
          statusText: xhr.statusText,
          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
        }
        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
        var body = 'response' in xhr ? xhr.response : xhr.responseText
        resolve(new Response(body, options))
      }

      xhr.onerror = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.ontimeout = function() {
        reject(new TypeError('Network request failed'))
      }

      xhr.open(request.method, request.url, true)

      if (request.credentials === 'include') {
        xhr.withCredentials = true
      } else if (request.credentials === 'omit') {
        xhr.withCredentials = false
      }

      if ('responseType' in xhr && support.blob) {
        xhr.responseType = 'blob'
      }

      request.headers.forEach(function(value, name) {
        xhr.setRequestHeader(name, value)
      })

      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
    })
  }
  self.fetch.polyfill = true
})(typeof self !== 'undefined' ? self : this);


/*** EXPORTS FROM exports-loader ***/
module.exports = global.fetch;
}.call(global));
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgY2FiMTVlYWI1NDBlYTYwYWU1MDEiLCJ3ZWJwYWNrOi8vLy4vanMvZGJoZWxwZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvaW50ZXJzZWN0aW9uX29ic2VydmVyLmpzIiwid2VicGFjazovLy8uL2pzL21haW4uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2lkYi9saWIvaWRiLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyJdLCJuYW1lcyI6WyJEQkhlbHBlciIsInJlc3BvbnNlIiwib2siLCJFcnJvciIsInN0YXR1c1RleHQiLCJqc29uIiwiY2FsbGJhY2siLCJmZXRjaCIsIkRBVEFCQVNFX1VSTCIsInRoZW4iLCJfdmFsaWRhdGVSZXNwb25zZSIsIl9yZWFkUmVzcG9uc2VBc0pTT04iLCJEQiIsInR4IiwiZGIiLCJ0cmFuc2FjdGlvbiIsIkRCX1NUT1JFIiwiZGJTdG9yZSIsIm9iamVjdFN0b3JlIiwicmVzdWx0IiwiZm9yRWFjaCIsInB1dCIsInJlc3RhdXJhbnQiLCJjb21wbGV0ZSIsImNhdGNoIiwiZ2V0QWxsIiwicmVzdGF1cmFudHMiLCJlcnJvciIsImlkIiwiZ2V0IiwicGFyc2VJbnQiLCJjdWlzaW5lIiwiZmV0Y2hSZXN0YXVyYW50cyIsInJlc3VsdHMiLCJmaWx0ZXIiLCJyIiwiY3Vpc2luZV90eXBlIiwibmVpZ2hib3Job29kIiwibmVpZ2hib3Job29kcyIsIm1hcCIsInYiLCJpIiwidW5pcXVlTmVpZ2hib3Job29kcyIsImluZGV4T2YiLCJjdWlzaW5lcyIsInVuaXF1ZUN1aXNpbmVzIiwiZmluZm8iLCJwaG90b2dyYXBoIiwic3BsaXQiLCJtYXJrZXIiLCJnb29nbGUiLCJtYXBzIiwiTWFya2VyIiwicG9zaXRpb24iLCJsYXRsbmciLCJ0aXRsZSIsIm5hbWUiLCJ1cmwiLCJ1cmxGb3JSZXN0YXVyYW50IiwiYW5pbWF0aW9uIiwiQW5pbWF0aW9uIiwiRFJPUCIsImlkYiIsIm9wZW4iLCJEQl9OQU1FIiwiREJfVkVSU0lPTiIsInVwZ3JhZGVEYiIsIm9sZFZlcnNpb24iLCJjcmVhdGVPYmplY3RTdG9yZSIsImtleVBhdGgiLCJlbGVtZW50cyIsInByZXZSYXRpbyIsImNyZWF0ZU9ic2VydmVyIiwib2JzZXJ2ZXIiLCJvcHRpb25zIiwicm9vdCIsInJvb3RNYXJnaW4iLCJ0aHJlc2hvbGQiLCJJbnRlcnNlY3Rpb25PYnNlcnZlciIsImhhbmRsZUludGVyc2VjdCIsIm9ic2VydmUiLCJlbGVtZW50IiwiZW50cmllcyIsImVudHJ5IiwiaW50ZXJzZWN0aW9uUmF0aW8iLCJ0YXJnZXQiLCJoYXNBdHRyaWJ1dGUiLCJzZXRBdHRyaWJ1dGUiLCJnZXRBdHRyaWJ1dGUiLCJyZW1vdmVBdHRyaWJ1dGUiLCJkb2N1bWVudCIsInF1ZXJ5U2VsZWN0b3JBbGwiLCJzZWxmIiwibWFya2VycyIsIm5hdmlnYXRvciIsInNlcnZpY2VXb3JrZXIiLCJyZWdpc3RlciIsInNjb3BlIiwiZmV0Y2hOZWlnaGJvcmhvb2RzIiwiY29uc29sZSIsImZpbGxOZWlnaGJvcmhvb2RzSFRNTCIsInNlbGVjdCIsImdldEVsZW1lbnRCeUlkIiwib3B0aW9uIiwiY3JlYXRlRWxlbWVudCIsImlubmVySFRNTCIsInZhbHVlIiwiYXBwZW5kIiwiZmV0Y2hDdWlzaW5lcyIsImZpbGxDdWlzaW5lc0hUTUwiLCJ1cGRhdGVSZXN0YXVyYW50cyIsImNTZWxlY3QiLCJuU2VsZWN0IiwiY0luZGV4Iiwic2VsZWN0ZWRJbmRleCIsIm5JbmRleCIsImZldGNoUmVzdGF1cmFudEJ5Q3Vpc2luZUFuZE5laWdoYm9yaG9vZCIsInJlc2V0UmVzdGF1cmFudHMiLCJmaWxsUmVzdGF1cmFudHNIVE1MIiwiSW1hZ2VPYnNlcnZlciIsInVsIiwibSIsInNldE1hcCIsImNyZWF0ZVJlc3RhdXJhbnRIVE1MIiwiYWRkTWFya2Vyc1RvTWFwIiwibGkiLCJwaWN0dXJlIiwic291cmNlIiwiaW1hZ2VTcmNTZXRVcmxGb3JSZXN0YXVyYW50IiwiY2xhc3NOYW1lIiwiaW1hZ2UiLCJhbHQiLCJpbWFnZVVybEZvclJlc3RhdXJhbnQiLCJmaWd1cmUiLCJmaWdjYXB0aW9uIiwidGFiSW5kZXgiLCJkaXZDb250YWluZXIiLCJhZGRyZXNzIiwibW9yZSIsImhyZWYiLCJtYXBNYXJrZXJGb3JSZXN0YXVyYW50IiwiZXZlbnQiLCJhZGRMaXN0ZW5lciIsIndpbmRvdyIsImxvY2F0aW9uIiwicHVzaCIsImFkZEV2ZW50TGlzdGVuZXIiLCJvbmNoYW5nZSIsImluaXRNYXAiLCJsb2MiLCJsYXQiLCJsbmciLCJNYXAiLCJ6b29tIiwiY2VudGVyIiwic2Nyb2xsd2hlZWwiLCJtYXBMb2FkZXIiLCJzcmMiLCJnb2RlZmVyIiwiZ2V0RWxlbWVudHNCeVRhZ05hbWUiLCJhcHBlbmRDaGlsZCJdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7QUFHQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBMkIsMEJBQTBCLEVBQUU7QUFDdkQseUNBQWlDLGVBQWU7QUFDaEQ7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOERBQXNELCtEQUErRDs7QUFFckg7QUFDQTs7QUFFQTtBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQzdEQTs7QUFFQTs7OztJQUdxQkEsUTs7Ozs7OztzQ0E4Qk1DLFEsRUFBVTtBQUNqQyxVQUFJLENBQUNBLFNBQVNDLEVBQWQsRUFBa0I7QUFDaEIsY0FBTUMsTUFBTUYsU0FBU0csVUFBZixDQUFOO0FBQ0Q7QUFDRCxhQUFPSCxRQUFQO0FBQ0Q7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TDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsT0FBTztBQUNQO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7Ozs7Ozs7Ozs7OztBQ3pURDtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCO0FBQ2hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQLEtBQUs7QUFDTDtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsbUJBQW1CO0FBQzNEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGtDQUFrQyxvQkFBb0I7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esd0NBQXdDLDRCQUE0QjtBQUNwRTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxtQkFBbUIsaUJBQWlCO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RCxTQUFTO0FBQ1Q7QUFDQSxTQUFTO0FBQ1QsOEVBQThFO0FBQzlFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsOEJBQThCLHVCQUF1QjtBQUNyRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBLHVDQUF1QywwQkFBMEI7QUFDakU7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLCtCQUErQiwwQkFBMEIsZUFBZTtBQUN4RTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxPQUFPOztBQUVQO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQSxDQUFDOzs7QUFHRDtBQUNBO0FBQ0EsQ0FBQyxlOzs7Ozs7Ozs7Ozs7O0FDemREOztBQUVBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTtBQUNBO0FBQ0EsQ0FBQztBQUNEO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSw0Q0FBNEM7O0FBRTVDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvZGlzdC9cIjtcblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vanMvbWFpbi5qc1wiKTtcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB3ZWJwYWNrL2Jvb3RzdHJhcCBjYWIxNWVhYjU0MGVhNjBhZTUwMSIsImltcG9ydCBpZGIgZnJvbSAnaWRiJztcclxuXHJcbi8qKlxyXG4gKiBDb21tb24gZGF0YWJhc2UgaGVscGVyIGZ1bmN0aW9ucy5cclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERCSGVscGVyIHtcclxuICAvKipcclxuICAgKiBEYXRhYmFzZSBVUkwuXHJcbiAgICogQ2hhbmdlIHRoaXMgdG8gcmVzdGF1cmFudHMuanNvbiBmaWxlIGxvY2F0aW9uIG9uIHlvdXIgc2VydmVyLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBnZXQgREFUQUJBU0VfVVJMKCkge1xyXG4gICAgcmV0dXJuICdodHRwOi8vbG9jYWxob3N0OjEzMzcvcmVzdGF1cmFudHMnO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCBEQl9WRVJTSU9OKCkge1xyXG4gICAgcmV0dXJuIDE7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IERCX05BTUUoKSB7XHJcbiAgICByZXR1cm4gJ3Jlc3RhdXJhbnRzJztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXQgREJfU1RPUkUoKSB7XHJcbiAgICByZXR1cm4gJ2xpc3QnO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCBEQigpIHtcclxuICAgIHJldHVybiBpZGIub3Blbih0aGlzLkRCX05BTUUsIHRoaXMuREJfVkVSU0lPTiwgdXBncmFkZURiID0+IHtcclxuICAgICAgc3dpdGNoICh1cGdyYWRlRGIub2xkVmVyc2lvbikge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHVwZ3JhZGVEYi5jcmVhdGVPYmplY3RTdG9yZSh0aGlzLkRCX1NUT1JFLCB7IGtleVBhdGg6ICdpZCcgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIF92YWxpZGF0ZVJlc3BvbnNlKHJlc3BvbnNlKSB7XHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIHRocm93IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIF9yZWFkUmVzcG9uc2VBc0pTT04ocmVzcG9uc2UpIHtcclxuICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhbGwgcmVzdGF1cmFudHMuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudHMoY2FsbGJhY2spIHtcclxuICAgIGZldGNoKERCSGVscGVyLkRBVEFCQVNFX1VSTClcclxuICAgICAgLnRoZW4odGhpcy5fdmFsaWRhdGVSZXNwb25zZSlcclxuICAgICAgLnRoZW4odGhpcy5fcmVhZFJlc3BvbnNlQXNKU09OKVxyXG4gICAgICAudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgICAgIC8vIGFkZCBuZXcgZWxlbWVudHMgdG8gZGJcclxuICAgICAgICB0aGlzLkRCLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbih0aGlzLkRCX1NUT1JFLCAncmVhZHdyaXRlJyksXHJcbiAgICAgICAgICAgIGRiU3RvcmUgPSB0eC5vYmplY3RTdG9yZSh0aGlzLkRCX1NUT1JFKTtcclxuICAgICAgICAgIHJlc3VsdC5mb3JFYWNoKHJlc3RhdXJhbnQgPT4ge1xyXG4gICAgICAgICAgICBkYlN0b3JlLnB1dChyZXN0YXVyYW50KTtcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgcmV0dXJuIHR4LmNvbXBsZXRlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdCk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgLy8gb2ZmbGluZSBvciBzb21ldGhpbmcsIHJlYWQgZnJvbSBkYlxyXG4gICAgICAgIHRoaXMuREJcclxuICAgICAgICAgIC50aGVuKGRiID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbih0aGlzLkRCX1NUT1JFKSxcclxuICAgICAgICAgICAgICBkYlN0b3JlID0gdHgub2JqZWN0U3RvcmUodGhpcy5EQl9TVE9SRSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGJTdG9yZS5nZXRBbGwoKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXN0YXVyYW50cyA9PiBjYWxsYmFjayhudWxsLCByZXN0YXVyYW50cykpXHJcbiAgICAgICAgICAuY2F0Y2goZXJyb3IgPT4gY2FsbGJhY2soZXJyb3IsIG51bGwpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhIHJlc3RhdXJhbnQgYnkgaXRzIElELlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUlkKGlkLCBjYWxsYmFjaykge1xyXG4gICAgZmV0Y2goYCR7REJIZWxwZXIuREFUQUJBU0VfVVJMfS8ke2lkfWApXHJcbiAgICAgIC50aGVuKHRoaXMuX3ZhbGlkYXRlUmVzcG9uc2UpXHJcbiAgICAgIC50aGVuKHRoaXMuX3JlYWRSZXNwb25zZUFzSlNPTilcclxuICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICAvLyBhZGQgdGhpcyBlbGVtZW50IHRvIGRiIGlmIG5vdCBleGlzdHNcclxuICAgICAgICB0aGlzLkRCLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbih0aGlzLkRCX1NUT1JFLCAncmVhZHdyaXRlJyksXHJcbiAgICAgICAgICAgIGRiU3RvcmUgPSB0eC5vYmplY3RTdG9yZSh0aGlzLkRCX1NUT1JFKTtcclxuICAgICAgICAgIGRiU3RvcmUucHV0KHJlc3VsdCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICB0aGlzLkRCXHJcbiAgICAgICAgICAudGhlbihkYiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24odGhpcy5EQl9TVE9SRSksXHJcbiAgICAgICAgICAgICAgZGJTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKHRoaXMuREJfU1RPUkUpO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGRiU3RvcmUuZ2V0KHBhcnNlSW50KGlkKSk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLnRoZW4ocmVzdGF1cmFudCA9PiBjYWxsYmFjayhudWxsLCByZXN0YXVyYW50KSlcclxuICAgICAgICAgIC5jYXRjaCgoKSA9PiBjYWxsYmFjaygnUmVzdGF1cmFudCBkb2VzIG5vdCBleGlzdCcsIG51bGwpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lKGN1aXNpbmUsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHMgIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nXHJcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gY3Vpc2luZSB0eXBlXHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeU5laWdoYm9yaG9vZChuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBuZWlnaGJvcmhvb2RcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgYW5kIGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QoY3Vpc2luZSwgbmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xyXG4gICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXHJcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByZXN1bHRzID0gcmVzdGF1cmFudHM7XHJcbiAgICAgICAgaWYgKGN1aXNpbmUgIT0gJ2FsbCcpIHtcclxuICAgICAgICAgIC8vIGZpbHRlciBieSBjdWlzaW5lXHJcbiAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5laWdoYm9yaG9vZCAhPSAnYWxsJykge1xyXG4gICAgICAgICAgLy8gZmlsdGVyIGJ5IG5laWdoYm9yaG9vZFxyXG4gICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoTmVpZ2hib3Job29kcyhjYWxsYmFjaykge1xyXG4gICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXHJcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEdldCBhbGwgbmVpZ2hib3Job29kcyBmcm9tIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgIGNvbnN0IG5laWdoYm9yaG9vZHMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLm5laWdoYm9yaG9vZCk7XHJcbiAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXHJcbiAgICAgICAgY29uc3QgdW5pcXVlTmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHMuZmlsdGVyKCh2LCBpKSA9PiBuZWlnaGJvcmhvb2RzLmluZGV4T2YodikgPT0gaSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdW5pcXVlTmVpZ2hib3Job29kcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggYWxsIGN1aXNpbmVzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaEN1aXNpbmVzKGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgIGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpO1xyXG4gICAgICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gY3Vpc2luZXNcclxuICAgICAgICBjb25zdCB1bmlxdWVDdWlzaW5lcyA9IGN1aXNpbmVzLmZpbHRlcigodiwgaSkgPT4gY3Vpc2luZXMuaW5kZXhPZih2KSA9PSBpKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB1bmlxdWVDdWlzaW5lcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBwYWdlIFVSTC5cclxuICAgKi9cclxuICBzdGF0aWMgdXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICByZXR1cm4gYC4vcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBzcmNzZXQgaW1hZ2UgVVJMLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZVNyY1NldFVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgY29uc3QgZmluZm8gPSByZXN0YXVyYW50LnBob3RvZ3JhcGggPyByZXN0YXVyYW50LnBob3RvZ3JhcGguc3BsaXQoL1xcLi8pIDogW3Jlc3RhdXJhbnQuaWQsICdqcGcnXTtcclxuICAgIHJldHVybiBgL2ltZ19kaXN0LyR7ZmluZm9bMF19LTY2MF8yeC4ke2ZpbmZvWzFdIHx8ICdqcGcnfSAyeCwgL2ltZ19kaXN0LyR7ZmluZm9bMF19LTMzMF8xeC4ke2ZpbmZvWzFdIHx8ICdqcGcnfWA7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZXN0YXVyYW50IGltYWdlIFVSTC5cclxuICAgKi9cclxuICBzdGF0aWMgaW1hZ2VVcmxGb3JSZXN0YXVyYW50KHJlc3RhdXJhbnQpIHtcclxuICAgIGNvbnN0IGZpbmZvID0gcmVzdGF1cmFudC5waG90b2dyYXBoID8gcmVzdGF1cmFudC5waG90b2dyYXBoLnNwbGl0KC9cXC4vKSA6IFtyZXN0YXVyYW50LmlkLCAnanBnJ107XHJcbiAgICByZXR1cm4gYC9pbWcvJHtmaW5mb1swXX0uJHtmaW5mb1sxXSB8fCAnanBnJ31gO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGltYWdlU3JjU2V0VXJsRm9yUmV2aWV3UGFnZShyZXN0YXVyYW50KSB7XHJcbiAgICBjb25zdCBmaW5mbyA9IHJlc3RhdXJhbnQucGhvdG9ncmFwaCA/IHJlc3RhdXJhbnQucGhvdG9ncmFwaC5zcGxpdCgvXFwuLykgOiBbcmVzdGF1cmFudC5pZCwgJ2pwZyddO1xyXG4gICAgcmV0dXJuIGAvaW1nLyR7ZmluZm9bMF19LiR7ZmluZm9bMV0gfHwgJ2pwZyd9IDgwMHcsIC9pbWdfZGlzdC8ke2ZpbmZvWzBdfS02NjBfMnguJHtmaW5mb1sxXSB8fCAnanBnJ30gNjYwdywgL2ltZ19kaXN0LyR7ZmluZm9bMF19LTMzMF8xeC4ke2ZpbmZvWzFdIHx8ICdqcGcnfSAzMzB3YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcCBtYXJrZXIgZm9yIGEgcmVzdGF1cmFudC5cclxuICAgKi9cclxuICBzdGF0aWMgbWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBtYXApIHtcclxuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICBwb3NpdGlvbjogcmVzdGF1cmFudC5sYXRsbmcsXHJcbiAgICAgIHRpdGxlOiByZXN0YXVyYW50Lm5hbWUsXHJcbiAgICAgIHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSxcclxuICAgICAgbWFwOiBtYXAsXHJcbiAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG1hcmtlcjtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvZGJoZWxwZXIuanMiLCJsZXQgZWxlbWVudHMsXG4gIHByZXZSYXRpbyA9IDAuMDtcblxuY29uc3QgY3JlYXRlT2JzZXJ2ZXIgPSAoKSA9PiB7XG4gIHZhciBvYnNlcnZlcjtcblxuICB2YXIgb3B0aW9ucyA9IHtcbiAgICByb290OiBudWxsLFxuICAgIHJvb3RNYXJnaW46ICcwcHgnLFxuICAgIHRocmVzaG9sZDogMS4wXG4gIH07XG5cbiAgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoaGFuZGxlSW50ZXJzZWN0LCBvcHRpb25zKTtcbiAgZWxlbWVudHMuZm9yRWFjaChlbGVtZW50ID0+IG9ic2VydmVyLm9ic2VydmUoZWxlbWVudCkpO1xufTtcblxuY29uc3QgaGFuZGxlSW50ZXJzZWN0ID0gKGVudHJpZXMsIG9ic2VydmVyKSA9PiB7XG4gIGVudHJpZXMuZm9yRWFjaChmdW5jdGlvbihlbnRyeSkge1xuICAgIGlmIChlbnRyeS5pbnRlcnNlY3Rpb25SYXRpbyA8IDEpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoZW50cnkudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1zcmNzZXQnKSkge1xuICAgICAgZW50cnkudGFyZ2V0LnNldEF0dHJpYnV0ZSgnc3Jjc2V0JywgZW50cnkudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zcmNzZXQnKSk7XG4gICAgICBlbnRyeS50YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyY3NldCcpO1xuICAgIH1cbiAgICBpZiAoZW50cnkudGFyZ2V0Lmhhc0F0dHJpYnV0ZSgnZGF0YS1zcmMnKSkge1xuICAgICAgZW50cnkudGFyZ2V0LnNldEF0dHJpYnV0ZSgnc3JjJywgZW50cnkudGFyZ2V0LmdldEF0dHJpYnV0ZSgnZGF0YS1zcmMnKSk7XG4gICAgICBlbnRyeS50YXJnZXQucmVtb3ZlQXR0cmlidXRlKCdkYXRhLXNyYycpO1xuICAgIH1cbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbigpIHtcbiAgZWxlbWVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdzb3VyY2VbZGF0YS1zcmNzZXRdLCBpbWdbZGF0YS1zcmNdJyk7XG5cbiAgY3JlYXRlT2JzZXJ2ZXIoKTtcbn1cblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL2pzL2ludGVyc2VjdGlvbl9vYnNlcnZlci5qcyIsImltcG9ydCBEQkhlbHBlciBmcm9tICcuL2RiaGVscGVyJztcclxuaW1wb3J0IEltYWdlT2JzZXJ2ZXIgZnJvbSAnLi9pbnRlcnNlY3Rpb25fb2JzZXJ2ZXInO1xyXG5cclxubGV0IHJlc3RhdXJhbnRzLCBuZWlnaGJvcmhvb2RzLCBjdWlzaW5lcztcclxuXHJcbnNlbGYubWFwO1xyXG5zZWxmLm1hcmtlcnMgPSBbXTtcclxuXHJcbi8qKlxyXG4gKiBSZWdpc3RlciBzZXJ2aWNlV29ya2VyXHJcbiAqL1xyXG5pZiAoJ3NlcnZpY2VXb3JrZXInIGluIG5hdmlnYXRvcikge1xyXG4gIG5hdmlnYXRvci5zZXJ2aWNlV29ya2VyLnJlZ2lzdGVyKCcvc3cuanMnLCB7IHNjb3BlOiAnLycgfSk7XHJcbn1cclxuXHJcbi8qKlxyXG4gKiBGZXRjaCBhbGwgbmVpZ2hib3Job29kcyBhbmQgc2V0IHRoZWlyIEhUTUwuXHJcbiAqL1xyXG5jb25zdCBmZXRjaE5laWdoYm9yaG9vZHMgPSAoKSA9PiB7XHJcbiAgREJIZWxwZXIuZmV0Y2hOZWlnaGJvcmhvb2RzKChlcnJvciwgbmVpZ2hib3Job29kcykgPT4ge1xyXG4gICAgaWYgKGVycm9yKSB7XHJcbiAgICAgIC8vIEdvdCBhbiBlcnJvclxyXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHNlbGYubmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHM7XHJcbiAgICAgIGZpbGxOZWlnaGJvcmhvb2RzSFRNTCgpO1xyXG4gICAgfVxyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIFNldCBuZWlnaGJvcmhvb2RzIEhUTUwuXHJcbiAqL1xyXG5jb25zdCBmaWxsTmVpZ2hib3Job29kc0hUTUwgPSAobmVpZ2hib3Job29kcyA9IHNlbGYubmVpZ2hib3Job29kcykgPT4ge1xyXG4gIGNvbnN0IHNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xyXG4gIG5laWdoYm9yaG9vZHMuZm9yRWFjaChuZWlnaGJvcmhvb2QgPT4ge1xyXG4gICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICBvcHRpb24uaW5uZXJIVE1MID0gbmVpZ2hib3Job29kO1xyXG4gICAgb3B0aW9uLnZhbHVlID0gbmVpZ2hib3Job29kO1xyXG4gICAgc2VsZWN0LmFwcGVuZChvcHRpb24pO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZldGNoIGFsbCBjdWlzaW5lcyBhbmQgc2V0IHRoZWlyIEhUTUwuXHJcbiAqL1xyXG5jb25zdCBmZXRjaEN1aXNpbmVzID0gKCkgPT4ge1xyXG4gIERCSGVscGVyLmZldGNoQ3Vpc2luZXMoKGVycm9yLCBjdWlzaW5lcykgPT4ge1xyXG4gICAgaWYgKGVycm9yKSB7XHJcbiAgICAgIC8vIEdvdCBhbiBlcnJvciFcclxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzZWxmLmN1aXNpbmVzID0gY3Vpc2luZXM7XHJcbiAgICAgIGZpbGxDdWlzaW5lc0hUTUwoKTtcclxuICAgIH1cclxuICB9KTtcclxufTtcclxuXHJcbi8qKlxyXG4gKiBTZXQgY3Vpc2luZXMgSFRNTC5cclxuICovXHJcbmNvbnN0IGZpbGxDdWlzaW5lc0hUTUwgPSAoY3Vpc2luZXMgPSBzZWxmLmN1aXNpbmVzKSA9PiB7XHJcbiAgY29uc3Qgc2VsZWN0ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1aXNpbmVzLXNlbGVjdCcpO1xyXG5cclxuICBjdWlzaW5lcy5mb3JFYWNoKGN1aXNpbmUgPT4ge1xyXG4gICAgY29uc3Qgb3B0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XHJcbiAgICBvcHRpb24uaW5uZXJIVE1MID0gY3Vpc2luZTtcclxuICAgIG9wdGlvbi52YWx1ZSA9IGN1aXNpbmU7XHJcbiAgICBzZWxlY3QuYXBwZW5kKG9wdGlvbik7XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogVXBkYXRlIHBhZ2UgYW5kIG1hcCBmb3IgY3VycmVudCByZXN0YXVyYW50cy5cclxuICovXHJcbmNvbnN0IHVwZGF0ZVJlc3RhdXJhbnRzID0gKCkgPT4ge1xyXG4gIGNvbnN0IGNTZWxlY3QgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnY3Vpc2luZXMtc2VsZWN0Jyk7XHJcbiAgY29uc3QgblNlbGVjdCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpO1xyXG5cclxuICBjb25zdCBjSW5kZXggPSBjU2VsZWN0LnNlbGVjdGVkSW5kZXg7XHJcbiAgY29uc3QgbkluZGV4ID0gblNlbGVjdC5zZWxlY3RlZEluZGV4O1xyXG5cclxuICBjb25zdCBjdWlzaW5lID0gY1NlbGVjdFtjSW5kZXhdLnZhbHVlO1xyXG4gIGNvbnN0IG5laWdoYm9yaG9vZCA9IG5TZWxlY3RbbkluZGV4XS52YWx1ZTtcclxuXHJcbiAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lQW5kTmVpZ2hib3Job29kKGN1aXNpbmUsIG5laWdoYm9yaG9vZCwgKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgaWYgKGVycm9yKSB7XHJcbiAgICAgIC8vIEdvdCBhbiBlcnJvciFcclxuICAgICAgY29uc29sZS5lcnJvcihlcnJvcik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXNldFJlc3RhdXJhbnRzKHJlc3RhdXJhbnRzKTtcclxuICAgICAgZmlsbFJlc3RhdXJhbnRzSFRNTCgpO1xyXG4gICAgICBJbWFnZU9ic2VydmVyKCk7XHJcbiAgICB9XHJcbiAgfSk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ2xlYXIgY3VycmVudCByZXN0YXVyYW50cywgdGhlaXIgSFRNTCBhbmQgcmVtb3ZlIHRoZWlyIG1hcCBtYXJrZXJzLlxyXG4gKi9cclxuY29uc3QgcmVzZXRSZXN0YXVyYW50cyA9IHJlc3RhdXJhbnRzID0+IHtcclxuICAvLyBSZW1vdmUgYWxsIHJlc3RhdXJhbnRzXHJcbiAgc2VsZi5yZXN0YXVyYW50cyA9IFtdO1xyXG4gIGNvbnN0IHVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3Jlc3RhdXJhbnRzLWxpc3QnKTtcclxuICB1bC5pbm5lckhUTUwgPSAnJztcclxuXHJcbiAgLy8gUmVtb3ZlIGFsbCBtYXAgbWFya2Vyc1xyXG4gIHNlbGYubWFya2Vycy5mb3JFYWNoKG0gPT4gbS5zZXRNYXAobnVsbCkpO1xyXG4gIHNlbGYubWFya2VycyA9IFtdO1xyXG4gIHNlbGYucmVzdGF1cmFudHMgPSByZXN0YXVyYW50cztcclxufTtcclxuXHJcbi8qKlxyXG4gKiBDcmVhdGUgYWxsIHJlc3RhdXJhbnRzIEhUTUwgYW5kIGFkZCB0aGVtIHRvIHRoZSB3ZWJwYWdlLlxyXG4gKi9cclxuY29uc3QgZmlsbFJlc3RhdXJhbnRzSFRNTCA9IChyZXN0YXVyYW50cyA9IHNlbGYucmVzdGF1cmFudHMpID0+IHtcclxuICBjb25zdCB1bCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdyZXN0YXVyYW50cy1saXN0Jyk7XHJcbiAgcmVzdGF1cmFudHMuZm9yRWFjaChyZXN0YXVyYW50ID0+IHtcclxuICAgIHVsLmFwcGVuZChjcmVhdGVSZXN0YXVyYW50SFRNTChyZXN0YXVyYW50KSk7XHJcbiAgfSk7XHJcbiAgYWRkTWFya2Vyc1RvTWFwKCk7XHJcbn07XHJcblxyXG4vKipcclxuICogQ3JlYXRlIHJlc3RhdXJhbnQgSFRNTC5cclxuICovXHJcbmNvbnN0IGNyZWF0ZVJlc3RhdXJhbnRIVE1MID0gcmVzdGF1cmFudCA9PiB7XHJcbiAgY29uc3QgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xyXG5cclxuICBjb25zdCBwaWN0dXJlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncGljdHVyZScpO1xyXG5cclxuICBjb25zdCBzb3VyY2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzb3VyY2UnKTtcclxuICBzb3VyY2Uuc2V0QXR0cmlidXRlKCdkYXRhLXNyY3NldCcsIERCSGVscGVyLmltYWdlU3JjU2V0VXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSk7XHJcbiAgc291cmNlLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50LWltZyc7XHJcbiAgcGljdHVyZS5hcHBlbmQoc291cmNlKTtcclxuXHJcbiAgY29uc3QgaW1hZ2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcclxuICBpbWFnZS5jbGFzc05hbWUgPSAncmVzdGF1cmFudC1pbWcnO1xyXG4gIGltYWdlLmFsdCA9IGAke3Jlc3RhdXJhbnQubmFtZX0gcmVzdGF1cmFudGA7XHJcbiAgaW1hZ2Uuc2V0QXR0cmlidXRlKCdkYXRhLXNyYycsIERCSGVscGVyLmltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSk7XHJcbiAgcGljdHVyZS5hcHBlbmQoaW1hZ2UpO1xyXG5cclxuICBjb25zdCBmaWd1cmUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdmaWd1cmUnKTtcclxuICBmaWd1cmUuYXBwZW5kKHBpY3R1cmUpO1xyXG5cclxuICBjb25zdCBmaWdjYXB0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZmlnY2FwdGlvbicpO1xyXG4gIGZpZ2NhcHRpb24uaW5uZXJIVE1MID0gcmVzdGF1cmFudC5uYW1lO1xyXG4gIGZpZ2NhcHRpb24udGFiSW5kZXggPSAwO1xyXG4gIGZpZ2NhcHRpb24uc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYCR7cmVzdGF1cmFudC5uYW1lfSByZXN0YXVyYW50YCk7XHJcbiAgZmlndXJlLmFwcGVuZChmaWdjYXB0aW9uKTtcclxuXHJcbiAgbGkuYXBwZW5kKGZpZ3VyZSk7XHJcblxyXG4gIGNvbnN0IGRpdkNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gIGRpdkNvbnRhaW5lci50YWJJbmRleCA9IDA7XHJcbiAgZGl2Q29udGFpbmVyLnNldEF0dHJpYnV0ZSgnYXJpYS1sYWJlbCcsIGBBZGRyZXNzIG9mICR7cmVzdGF1cmFudC5uYW1lfSByZXN0YXVyYW50YCk7XHJcbiAgZGl2Q29udGFpbmVyLmNsYXNzTmFtZSA9ICdyZXN0YXVyYW50LWluZm8tY29udGFpbmVyJztcclxuXHJcbiAgY29uc3QgbmVpZ2hib3Job29kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xyXG4gIG5laWdoYm9yaG9vZC5pbm5lckhUTUwgPSByZXN0YXVyYW50Lm5laWdoYm9yaG9vZDtcclxuICBuZWlnaGJvcmhvb2QudGFiSW5kZXggPSAwO1xyXG4gIGRpdkNvbnRhaW5lci5hcHBlbmQobmVpZ2hib3Job29kKTtcclxuXHJcbiAgY29uc3QgYWRkcmVzcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcclxuICBhZGRyZXNzLmlubmVySFRNTCA9IHJlc3RhdXJhbnQuYWRkcmVzcztcclxuICBhZGRyZXNzLnRhYkluZGV4ID0gMDtcclxuICBkaXZDb250YWluZXIuYXBwZW5kKGFkZHJlc3MpO1xyXG5cclxuICBjb25zdCBtb3JlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xyXG4gIG1vcmUuaW5uZXJIVE1MID0gJ1ZpZXcgRGV0YWlscyc7XHJcbiAgbW9yZS5ocmVmID0gREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KTtcclxuICBtb3JlLnRpdGxlID0gYFZpZXcgZGV0YWlscyBhYm91dCAke3Jlc3RhdXJhbnQubmFtZX1gO1xyXG4gIG1vcmUuc2V0QXR0cmlidXRlKCdhcmlhLWxhYmVsJywgYFZpZXcgZGV0YWlscyBhYm91dCAke3Jlc3RhdXJhbnQubmFtZX1gKTtcclxuICBkaXZDb250YWluZXIuYXBwZW5kKG1vcmUpO1xyXG5cclxuICBsaS5hcHBlbmQoZGl2Q29udGFpbmVyKTtcclxuXHJcbiAgcmV0dXJuIGxpO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEFkZCBtYXJrZXJzIGZvciBjdXJyZW50IHJlc3RhdXJhbnRzIHRvIHRoZSBtYXAuXHJcbiAqL1xyXG5jb25zdCBhZGRNYXJrZXJzVG9NYXAgPSAocmVzdGF1cmFudHMgPSBzZWxmLnJlc3RhdXJhbnRzKSA9PiB7XHJcbiAgcmVzdGF1cmFudHMuZm9yRWFjaChyZXN0YXVyYW50ID0+IHtcclxuICAgIC8vIEFkZCBtYXJrZXIgdG8gdGhlIG1hcFxyXG4gICAgY29uc3QgbWFya2VyID0gREJIZWxwZXIubWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBzZWxmLm1hcCk7XHJcbiAgICBnb29nbGUubWFwcy5ldmVudC5hZGRMaXN0ZW5lcihtYXJrZXIsICdjbGljaycsICgpID0+IHtcclxuICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBtYXJrZXIudXJsO1xyXG4gICAgfSk7XHJcbiAgICBzZWxmLm1hcmtlcnMucHVzaChtYXJrZXIpO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuLyoqXHJcbiAqIEZldGNoIG5laWdoYm9yaG9vZHMgYW5kIGN1aXNpbmVzIGFzIHNvb24gYXMgdGhlIHBhZ2UgaXMgbG9hZGVkLlxyXG4gKi9cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGV2ZW50ID0+IHtcclxuICBmZXRjaE5laWdoYm9yaG9vZHMoKTtcclxuICBmZXRjaEN1aXNpbmVzKCk7XHJcblxyXG4gIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCduZWlnaGJvcmhvb2RzLXNlbGVjdCcpLm9uY2hhbmdlID0gdXBkYXRlUmVzdGF1cmFudHM7XHJcbiAgZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2N1aXNpbmVzLXNlbGVjdCcpLm9uY2hhbmdlID0gdXBkYXRlUmVzdGF1cmFudHM7XHJcbn0pO1xyXG5cclxuLyoqXHJcbiAqIEluaXRpYWxpemUgR29vZ2xlIG1hcCwgY2FsbGVkIGZyb20gSFRNTC5cclxuICovXHJcbndpbmRvdy5pbml0TWFwID0gKCkgPT4ge1xyXG4gIGxldCBsb2MgPSB7XHJcbiAgICBsYXQ6IDQwLjcyMjIxNixcclxuICAgIGxuZzogLTczLjk4NzUwMVxyXG4gIH07XHJcbiAgc2VsZi5tYXAgPSBuZXcgZ29vZ2xlLm1hcHMuTWFwKGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtYXAnKSwge1xyXG4gICAgem9vbTogMTIsXHJcbiAgICBjZW50ZXI6IGxvYyxcclxuICAgIHNjcm9sbHdoZWVsOiBmYWxzZVxyXG4gIH0pO1xyXG59O1xyXG5cclxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsIGZ1bmN0aW9uKGV2ZW50KSB7XHJcbiAgdXBkYXRlUmVzdGF1cmFudHMoKTtcclxuXHJcbiAgY29uc3QgbWFwTG9hZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2NyaXB0Jyk7XHJcbiAgbWFwTG9hZGVyLnNyYyA9ICdodHRwczovL21hcHMuZ29vZ2xlYXBpcy5jb20vbWFwcy9hcGkvanM/a2V5PUFJemFTeUFQWVYxdGx3bTlmdEVlMHAwY1FXTmVlWGJwdFZhZEdYTSZsaWJyYXJpZXM9cGxhY2VzJmNhbGxiYWNrPWluaXRNYXAnO1xyXG5cclxuICB2YXIgZ29kZWZlciA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF07XHJcbiAgZ29kZWZlci5hcHBlbmRDaGlsZChtYXBMb2FkZXIpO1xyXG59KTtcclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvbWFpbi5qcyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiB0b0FycmF5KGFycikge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKSB7XG4gICAgdmFyIHJlcXVlc3Q7XG4gICAgdmFyIHAgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlcXVlc3QgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSk7XG5cbiAgICBwLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvbWlzaWZ5Q3Vyc29yUmVxdWVzdENhbGwob2JqLCBtZXRob2QsIGFyZ3MpIHtcbiAgICB2YXIgcCA9IHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKTtcbiAgICByZXR1cm4gcC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIXZhbHVlKSByZXR1cm47XG4gICAgICByZXR1cm4gbmV3IEN1cnNvcih2YWx1ZSwgcC5yZXF1ZXN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3h5UHJvcGVydGllcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBwcm9wZXJ0aWVzKSB7XG4gICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm94eUNsYXNzLnByb3RvdHlwZSwgcHJvcCwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgIHRoaXNbdGFyZ2V0UHJvcF1bcHJvcF0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveHlSZXF1ZXN0TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3h5TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdLmFwcGx5KHRoaXNbdGFyZ2V0UHJvcF0sIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveHlDdXJzb3JSZXF1ZXN0TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlDdXJzb3JSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEluZGV4KGluZGV4KSB7XG4gICAgdGhpcy5faW5kZXggPSBpbmRleDtcbiAgfVxuXG4gIHByb3h5UHJvcGVydGllcyhJbmRleCwgJ19pbmRleCcsIFtcbiAgICAnbmFtZScsXG4gICAgJ2tleVBhdGgnLFxuICAgICdtdWx0aUVudHJ5JyxcbiAgICAndW5pcXVlJ1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcbiAgICAnZ2V0JyxcbiAgICAnZ2V0S2V5JyxcbiAgICAnZ2V0QWxsJyxcbiAgICAnZ2V0QWxsS2V5cycsXG4gICAgJ2NvdW50J1xuICBdKTtcblxuICBwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcbiAgICAnb3BlbkN1cnNvcicsXG4gICAgJ29wZW5LZXlDdXJzb3InXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIEN1cnNvcihjdXJzb3IsIHJlcXVlc3QpIHtcbiAgICB0aGlzLl9jdXJzb3IgPSBjdXJzb3I7XG4gICAgdGhpcy5fcmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cblxuICBwcm94eVByb3BlcnRpZXMoQ3Vyc29yLCAnX2N1cnNvcicsIFtcbiAgICAnZGlyZWN0aW9uJyxcbiAgICAna2V5JyxcbiAgICAncHJpbWFyeUtleScsXG4gICAgJ3ZhbHVlJ1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKEN1cnNvciwgJ19jdXJzb3InLCBJREJDdXJzb3IsIFtcbiAgICAndXBkYXRlJyxcbiAgICAnZGVsZXRlJ1xuICBdKTtcblxuICAvLyBwcm94eSAnbmV4dCcgbWV0aG9kc1xuICBbJ2FkdmFuY2UnLCAnY29udGludWUnLCAnY29udGludWVQcmltYXJ5S2V5J10uZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgaWYgKCEobWV0aG9kTmFtZSBpbiBJREJDdXJzb3IucHJvdG90eXBlKSkgcmV0dXJuO1xuICAgIEN1cnNvci5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjdXJzb3IgPSB0aGlzO1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgY3Vyc29yLl9jdXJzb3JbbWV0aG9kTmFtZV0uYXBwbHkoY3Vyc29yLl9jdXJzb3IsIGFyZ3MpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChjdXJzb3IuX3JlcXVlc3QpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XG4gICAgICAgICAgcmV0dXJuIG5ldyBDdXJzb3IodmFsdWUsIGN1cnNvci5fcmVxdWVzdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gT2JqZWN0U3RvcmUoc3RvcmUpIHtcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlO1xuICB9XG5cbiAgT2JqZWN0U3RvcmUucHJvdG90eXBlLmNyZWF0ZUluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbmRleCh0aGlzLl9zdG9yZS5jcmVhdGVJbmRleC5hcHBseSh0aGlzLl9zdG9yZSwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgT2JqZWN0U3RvcmUucHJvdG90eXBlLmluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbmRleCh0aGlzLl9zdG9yZS5pbmRleC5hcHBseSh0aGlzLl9zdG9yZSwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgcHJveHlQcm9wZXJ0aWVzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgW1xuICAgICduYW1lJyxcbiAgICAna2V5UGF0aCcsXG4gICAgJ2luZGV4TmFtZXMnLFxuICAgICdhdXRvSW5jcmVtZW50J1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcbiAgICAncHV0JyxcbiAgICAnYWRkJyxcbiAgICAnZGVsZXRlJyxcbiAgICAnY2xlYXInLFxuICAgICdnZXQnLFxuICAgICdnZXRBbGwnLFxuICAgICdnZXRLZXknLFxuICAgICdnZXRBbGxLZXlzJyxcbiAgICAnY291bnQnXG4gIF0pO1xuXG4gIHByb3h5Q3Vyc29yUmVxdWVzdE1ldGhvZHMoT2JqZWN0U3RvcmUsICdfc3RvcmUnLCBJREJPYmplY3RTdG9yZSwgW1xuICAgICdvcGVuQ3Vyc29yJyxcbiAgICAnb3BlbktleUN1cnNvcidcbiAgXSk7XG5cbiAgcHJveHlNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcbiAgICAnZGVsZXRlSW5kZXgnXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIFRyYW5zYWN0aW9uKGlkYlRyYW5zYWN0aW9uKSB7XG4gICAgdGhpcy5fdHggPSBpZGJUcmFuc2FjdGlvbjtcbiAgICB0aGlzLmNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH07XG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChpZGJUcmFuc2FjdGlvbi5lcnJvcik7XG4gICAgICB9O1xuICAgICAgaWRiVHJhbnNhY3Rpb24ub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QoaWRiVHJhbnNhY3Rpb24uZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIFRyYW5zYWN0aW9uLnByb3RvdHlwZS5vYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fdHgub2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fdHgsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhUcmFuc2FjdGlvbiwgJ190eCcsIFtcbiAgICAnb2JqZWN0U3RvcmVOYW1lcycsXG4gICAgJ21vZGUnXG4gIF0pO1xuXG4gIHByb3h5TWV0aG9kcyhUcmFuc2FjdGlvbiwgJ190eCcsIElEQlRyYW5zYWN0aW9uLCBbXG4gICAgJ2Fib3J0J1xuICBdKTtcblxuICBmdW5jdGlvbiBVcGdyYWRlREIoZGIsIG9sZFZlcnNpb24sIHRyYW5zYWN0aW9uKSB7XG4gICAgdGhpcy5fZGIgPSBkYjtcbiAgICB0aGlzLm9sZFZlcnNpb24gPSBvbGRWZXJzaW9uO1xuICAgIHRoaXMudHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24odHJhbnNhY3Rpb24pO1xuICB9XG5cbiAgVXBncmFkZURCLnByb3RvdHlwZS5jcmVhdGVPYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fZGIuY3JlYXRlT2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhVcGdyYWRlREIsICdfZGInLCBbXG4gICAgJ25hbWUnLFxuICAgICd2ZXJzaW9uJyxcbiAgICAnb2JqZWN0U3RvcmVOYW1lcydcbiAgXSk7XG5cbiAgcHJveHlNZXRob2RzKFVwZ3JhZGVEQiwgJ19kYicsIElEQkRhdGFiYXNlLCBbXG4gICAgJ2RlbGV0ZU9iamVjdFN0b3JlJyxcbiAgICAnY2xvc2UnXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIERCKGRiKSB7XG4gICAgdGhpcy5fZGIgPSBkYjtcbiAgfVxuXG4gIERCLnByb3RvdHlwZS50cmFuc2FjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgVHJhbnNhY3Rpb24odGhpcy5fZGIudHJhbnNhY3Rpb24uYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhEQiwgJ19kYicsIFtcbiAgICAnbmFtZScsXG4gICAgJ3ZlcnNpb24nLFxuICAgICdvYmplY3RTdG9yZU5hbWVzJ1xuICBdKTtcblxuICBwcm94eU1ldGhvZHMoREIsICdfZGInLCBJREJEYXRhYmFzZSwgW1xuICAgICdjbG9zZSdcbiAgXSk7XG5cbiAgLy8gQWRkIGN1cnNvciBpdGVyYXRvcnNcbiAgLy8gVE9ETzogcmVtb3ZlIHRoaXMgb25jZSBicm93c2VycyBkbyB0aGUgcmlnaHQgdGhpbmcgd2l0aCBwcm9taXNlc1xuICBbJ29wZW5DdXJzb3InLCAnb3BlbktleUN1cnNvciddLmZvckVhY2goZnVuY3Rpb24oZnVuY05hbWUpIHtcbiAgICBbT2JqZWN0U3RvcmUsIEluZGV4XS5mb3JFYWNoKGZ1bmN0aW9uKENvbnN0cnVjdG9yKSB7XG4gICAgICAvLyBEb24ndCBjcmVhdGUgaXRlcmF0ZUtleUN1cnNvciBpZiBvcGVuS2V5Q3Vyc29yIGRvZXNuJ3QgZXhpc3QuXG4gICAgICBpZiAoIShmdW5jTmFtZSBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSByZXR1cm47XG5cbiAgICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZVtmdW5jTmFtZS5yZXBsYWNlKCdvcGVuJywgJ2l0ZXJhdGUnKV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcbiAgICAgICAgdmFyIG5hdGl2ZU9iamVjdCA9IHRoaXMuX3N0b3JlIHx8IHRoaXMuX2luZGV4O1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5hdGl2ZU9iamVjdFtmdW5jTmFtZV0uYXBwbHkobmF0aXZlT2JqZWN0LCBhcmdzLnNsaWNlKDAsIC0xKSk7XG4gICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY2FsbGJhY2socmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gcG9seWZpbGwgZ2V0QWxsXG4gIFtJbmRleCwgT2JqZWN0U3RvcmVdLmZvckVhY2goZnVuY3Rpb24oQ29uc3RydWN0b3IpIHtcbiAgICBpZiAoQ29uc3RydWN0b3IucHJvdG90eXBlLmdldEFsbCkgcmV0dXJuO1xuICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbihxdWVyeSwgY291bnQpIHtcbiAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXM7XG4gICAgICB2YXIgaXRlbXMgPSBbXTtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgaW5zdGFuY2UuaXRlcmF0ZUN1cnNvcihxdWVyeSwgZnVuY3Rpb24oY3Vyc29yKSB7XG4gICAgICAgICAgaWYgKCFjdXJzb3IpIHtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpdGVtcy5wdXNoKGN1cnNvci52YWx1ZSk7XG5cbiAgICAgICAgICBpZiAoY291bnQgIT09IHVuZGVmaW5lZCAmJiBpdGVtcy5sZW5ndGggPT0gY291bnQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICB2YXIgZXhwID0ge1xuICAgIG9wZW46IGZ1bmN0aW9uKG5hbWUsIHZlcnNpb24sIHVwZ3JhZGVDYWxsYmFjaykge1xuICAgICAgdmFyIHAgPSBwcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsICdvcGVuJywgW25hbWUsIHZlcnNpb25dKTtcbiAgICAgIHZhciByZXF1ZXN0ID0gcC5yZXF1ZXN0O1xuXG4gICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmICh1cGdyYWRlQ2FsbGJhY2spIHtcbiAgICAgICAgICB1cGdyYWRlQ2FsbGJhY2sobmV3IFVwZ3JhZGVEQihyZXF1ZXN0LnJlc3VsdCwgZXZlbnQub2xkVmVyc2lvbiwgcmVxdWVzdC50cmFuc2FjdGlvbikpO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICByZXR1cm4gcC50aGVuKGZ1bmN0aW9uKGRiKSB7XG4gICAgICAgIHJldHVybiBuZXcgREIoZGIpO1xuICAgICAgfSk7XG4gICAgfSxcbiAgICBkZWxldGU6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsICdkZWxldGVEYXRhYmFzZScsIFtuYW1lXSk7XG4gICAgfVxuICB9O1xuXG4gIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gZXhwO1xuICAgIG1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBtb2R1bGUuZXhwb3J0cztcbiAgfVxuICBlbHNlIHtcbiAgICBzZWxmLmlkYiA9IGV4cDtcbiAgfVxufSgpKTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vbm9kZV9tb2R1bGVzL2lkYi9saWIvaWRiLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy9pZGIvbGliL2lkYi5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAgMSIsIi8qKiogSU1QT1JUUyBGUk9NIGltcG9ydHMtbG9hZGVyICoqKi9cbihmdW5jdGlvbigpIHtcblxuKGZ1bmN0aW9uKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmIChzZWxmLmZldGNoKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgc3VwcG9ydCA9IHtcbiAgICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gICAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gICAgYmxvYjogJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiYgJ0Jsb2InIGluIHNlbGYgJiYgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gICAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG4gIH1cblxuICBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICAgIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICAgIF1cblxuICAgIHZhciBpc0RhdGFWaWV3ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbiAgICB9XG5cbiAgICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPSBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gICAgfVxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLlxcXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICAgIH1cbiAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICAvLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuICBmdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICAgIHZhciBpdGVyYXRvciA9IHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpdGVyYXRvclxuICB9XG5cbiAgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5tYXAgPSB7fVxuXG4gICAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgICB9LCB0aGlzKVxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUrJywnK3ZhbHVlIDogdmFsdWVcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2gobmFtZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkgeyBpdGVtcy5wdXNoKHZhbHVlKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xuICB9XG5cbiAgZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICAgIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gICAgfVxuICAgIHJldHVybiBjaGFycy5qb2luKCcnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gICAgaWYgKGJ1Zi5zbGljZSkge1xuICAgICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEJvZHkoKSB7XG4gICAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgICAgaWYgKCFib2R5KSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxuICB2YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgcmV0dXJuIChtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSkgPyB1cGNhc2VkIDogbWV0aG9kXG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgICB9XG5cbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdvbWl0J1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gICAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICAgIH1cbiAgICB0aGlzLl9pbml0Qm9keShib2R5KVxuICB9XG5cbiAgUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywgeyBib2R5OiB0aGlzLl9ib2R5SW5pdCB9KVxuICB9XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgYm9keS50cmltKCkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAgIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICAgIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gICAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gICAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgICB1cmw6IHRoaXMudXJsXG4gICAgfSlcbiAgfVxuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICAgIHJldHVybiByZXNwb25zZVxuICB9XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cbiAgUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbiAgfVxuXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2VcblxuICBzZWxmLmZldGNoID0gZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgICB9KVxuICB9XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7XG5cblxuLyoqKiBFWFBPUlRTIEZST00gZXhwb3J0cy1sb2FkZXIgKioqL1xubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwuZmV0Y2g7XG59LmNhbGwoZ2xvYmFsKSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaW1wb3J0cy1sb2FkZXI/dGhpcz0+Z2xvYmFsIS4vbm9kZV9tb2R1bGVzL2V4cG9ydHMtbG9hZGVyP2dsb2JhbC5mZXRjaCEuL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyL2luZGV4LmpzP3RoaXM9Pmdsb2JhbCEuL25vZGVfbW9kdWxlcy9leHBvcnRzLWxvYWRlci9pbmRleC5qcz9nbG9iYWwuZmV0Y2ghLi9ub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIiwidmFyIGc7XHJcblxyXG4vLyBUaGlzIHdvcmtzIGluIG5vbi1zdHJpY3QgbW9kZVxyXG5nID0gKGZ1bmN0aW9uKCkge1xyXG5cdHJldHVybiB0aGlzO1xyXG59KSgpO1xyXG5cclxudHJ5IHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIGV2YWwgaXMgYWxsb3dlZCAoc2VlIENTUClcclxuXHRnID0gZyB8fCBGdW5jdGlvbihcInJldHVybiB0aGlzXCIpKCkgfHwgKDEsZXZhbCkoXCJ0aGlzXCIpO1xyXG59IGNhdGNoKGUpIHtcclxuXHQvLyBUaGlzIHdvcmtzIGlmIHRoZSB3aW5kb3cgcmVmZXJlbmNlIGlzIGF2YWlsYWJsZVxyXG5cdGlmKHR5cGVvZiB3aW5kb3cgPT09IFwib2JqZWN0XCIpXHJcblx0XHRnID0gd2luZG93O1xyXG59XHJcblxyXG4vLyBnIGNhbiBzdGlsbCBiZSB1bmRlZmluZWQsIGJ1dCBub3RoaW5nIHRvIGRvIGFib3V0IGl0Li4uXHJcbi8vIFdlIHJldHVybiB1bmRlZmluZWQsIGluc3RlYWQgb2Ygbm90aGluZyBoZXJlLCBzbyBpdCdzXHJcbi8vIGVhc2llciB0byBoYW5kbGUgdGhpcyBjYXNlLiBpZighZ2xvYmFsKSB7IC4uLn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZztcclxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gKHdlYnBhY2spL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgaWQgPSAuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2J1aWxkaW4vZ2xvYmFsLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCAxIl0sInNvdXJjZVJvb3QiOiIifQ==