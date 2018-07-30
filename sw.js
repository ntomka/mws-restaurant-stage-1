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
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./js/sw.js");
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
  }, {
    key: 'storeOfflineForm',
    value: function storeOfflineForm(formData) {
      var _this = this;

      this.DB.then(function (db) {
        var tx = db.transaction(_this.DB_OFFLINE_FORMS_STORE, 'readwrite');
        var dbStore = tx.objectStore(_this.DB_OFFLINE_FORMS_STORE);

        dbStore.put(formData);

        return tx.complete;
      });
    }
  }, {
    key: 'getOfflineForms',
    value: function getOfflineForms() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _this2.DB.then(function (db) {
          var tx = db.transaction(_this2.DB_OFFLINE_FORMS_STORE);
          var dbStore = tx.objectStore(_this2.DB_OFFLINE_FORMS_STORE);

          return dbStore.getAll();
        }).then(function (formDatas) {
          return resolve(formDatas);
        }).catch(function (error) {
          return reject(error);
        });
      });
    }
  }, {
    key: 'removeOfflineForm',
    value: function removeOfflineForm(formid) {
      var _this3 = this;

      this.DB.then(function (db) {
        var tx = db.transaction(_this3.DB_OFFLINE_FORMS_STORE, 'readwrite');
        var dbStore = tx.objectStore(_this3.DB_OFFLINE_FORMS_STORE);

        dbStore.delete(formid);
      });
    }

    /**
     * Fetch all restaurants.
     */

  }, {
    key: 'fetchRestaurants',
    value: function fetchRestaurants(callback) {
      var _this4 = this;

      fetch(DBHelper.DATABASE_URL + '/restaurants').then(this._validateResponse).then(this._readResponseAsJSON).then(function (result) {
        // add new elements to db
        _this4.DB.then(function (db) {
          var tx = db.transaction(_this4.DB_STORE, 'readwrite'),
              dbStore = tx.objectStore(_this4.DB_STORE);
          result.forEach(function (restaurant) {
            dbStore.put(restaurant);
          });
          return tx.complete;
        });
        callback(null, result);
      }).catch(function (error) {
        // offline or something, read from db
        _this4.DB.then(function (db) {
          var tx = db.transaction(_this4.DB_STORE),
              dbStore = tx.objectStore(_this4.DB_STORE);

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
      var _this5 = this;

      fetch(DBHelper.DATABASE_URL + '/restaurants/' + id).then(this._validateResponse).then(this._readResponseAsJSON).then(function (result) {
        // add this element to db if not exists
        _this5.DB.then(function (db) {
          var tx = db.transaction(_this5.DB_STORE, 'readwrite'),
              dbStore = tx.objectStore(_this5.DB_STORE);
          dbStore.put(result);
        });
        callback(null, result);
      }).catch(function (error) {
        _this5.DB.then(function (db) {
          var tx = db.transaction(_this5.DB_STORE),
              dbStore = tx.objectStore(_this5.DB_STORE);

          return dbStore.get(parseInt(id));
        }).then(function (restaurant) {
          return callback(null, restaurant);
        }).catch(function () {
          return callback('Restaurant does not exist', null);
        });
      });
    }
  }, {
    key: 'favoriteRestaurant',
    value: function favoriteRestaurant(id, isFavorite) {
      var _this6 = this;

      return new Promise(function (resolve, reject) {
        fetch(DBHelper.DATABASE_URL + '/restaurants/' + id + '?is_favorite=' + isFavorite, { method: 'PUT' }).then(_this6._validateResponse).then(_this6._readResponseAsJSON).then(function (result) {
          _this6.DB.then(function (db) {
            var tx = db.transaction(_this6.DB_STORE, 'readwrite'),
                dbStore = tx.objectStore(_this6.DB_STORE);
            dbStore.put(result);
          });
          resolve(result);
        }).catch(function (error) {
          console.error(error);
          _this6.DB.then(function (db) {
            var tx = db.transaction(_this6.DB_STORE),
                dbStore = tx.objectStore(_this6.DB_STORE);

            return dbStore.get(parseInt(id));
          }).then(function (restaurant) {
            return resolve(restaurant);
          }).catch(function (error) {
            return reject(error);
          });
        });
      });
    }
  }, {
    key: 'fetchRestaurantReviews',
    value: function fetchRestaurantReviews(id, callback) {
      var _this7 = this;

      fetch(DBHelper.DATABASE_URL + '/reviews?restaurant_id=' + id).then(this._validateResponse).then(this._readResponseAsJSON).then(function (result) {
        _this7.DB.then(function (db) {
          var tx = db.transaction(_this7.DB_REVIEWS_STORE, 'readwrite'),
              dbStore = tx.objectStore(_this7.DB_REVIEWS_STORE);
          dbStore.put({ id: parseInt(id), reviews: result });
        });
        callback(null, result);
      }).catch(function (error) {
        _this7.DB.then(function (db) {
          var tx = db.transaction(_this7.DB_REVIEWS_STORE),
              dbStore = tx.objectStore(_this7.DB_REVIEWS_STORE);

          return dbStore.get(parseInt(id));
        }).then(function (result) {
          return callback(null, result.reviews);
        }).catch(function () {
          return callback('No reviews yet!', null);
        });
      });
    }
  }, {
    key: 'postRestaurantReview',
    value: function postRestaurantReview(review) {
      var _this8 = this;

      return new Promise(function (resolve, reject) {
        fetch(DBHelper.DATABASE_URL + '/reviews', {
          method: 'POST',
          body: review
        }).then(_this8._validateResponse).then(_this8._readResponseAsJSON).then(function (result) {
          resolve(result);
        }).catch(function (error) {
          reject(error);
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
      return '/img_dist/' + finfo[0] + '-660_2x.webp 2x, /img_dist/' + finfo[0] + '-330_1x.webp,\n      /img_dist/' + finfo[0] + '-660_2x.' + (finfo[1] || 'jpg') + ' 2x, /img_dist/' + finfo[0] + '-330_1x.' + (finfo[1] || 'jpg');
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
      return '/img_dist/' + finfo[0] + '.webp 800w, /img_dist/' + finfo[0] + '-660_2x.webp 660w, /img_dist/' + finfo[0] + '-330_1x.webp 330w,\n      /img/' + finfo[0] + '.' + (finfo[1] || 'jpg') + ' 800w, /img_dist/' + finfo[0] + '-660_2x.' + (finfo[1] || 'jpg') + ' 660w, /img_dist/' + finfo[0] + '-330_1x.' + (finfo[1] || 'jpg') + ' 330w';
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
      var protocol = 'http',
          host = 'localhost',
          port = '1337';

      return protocol + '://' + host + ':' + port;
    }
  }, {
    key: 'DB_VERSION',
    get: function get() {
      return 3;
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
    key: 'DB_REVIEWS_STORE',
    get: function get() {
      return 'reviews';
    }
  }, {
    key: 'DB_OFFLINE_FORMS_STORE',
    get: function get() {
      return 'offline-forms';
    }
  }, {
    key: 'DB',
    get: function get() {
      var _this9 = this;

      return __WEBPACK_IMPORTED_MODULE_0_idb___default.a.open(this.DB_NAME, this.DB_VERSION, function (upgradeDb) {
        switch (upgradeDb.oldVersion) {
          case 0:
            upgradeDb.createObjectStore(_this9.DB_STORE, { keyPath: 'id' });
          case 1:
            upgradeDb.createObjectStore(_this9.DB_REVIEWS_STORE, { keyPath: 'id' });
          case 2:
            upgradeDb.createObjectStore(_this9.DB_OFFLINE_FORMS_STORE, { keyPath: 'formid' });
        }
      });
    }
  }]);

  return DBHelper;
}();

/* harmony default export */ __webpack_exports__["a"] = (DBHelper);
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch */ "./node_modules/imports-loader/index.js?this=>global!./node_modules/exports-loader/index.js?global.fetch!./node_modules/whatwg-fetch/fetch.js")))

/***/ }),

/***/ "./js/sw.js":
/*!******************!*\
  !*** ./js/sw.js ***!
  \******************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(fetch) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dbhelper__ = __webpack_require__(/*! ./dbhelper */ "./js/dbhelper.js");


var appCaches = {
  static: 'restaurant-static-v4',
  images: 'restaurant-images-v2'
};

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(appCaches.static).then(function (cache) {
    return cache.addAll(['/index.html', '/restaurant.html', '/dist/styles.css', '/dist/main.js', '/dist/restaurant_info.js']);
  }));

  // cache image assets and restaurants dynamically
  event.waitUntil(caches.open(appCaches.images).then(function (cache) {
    __WEBPACK_IMPORTED_MODULE_0__dbhelper__["a" /* default */].fetchRestaurants(function (error, restaurants) {
      cache.add(__WEBPACK_IMPORTED_MODULE_0__dbhelper__["a" /* default */].DATABASE_URL);
      for (var key in restaurants) {
        if (restaurants.hasOwnProperty(key)) {
          var restaurant = restaurants[key],
              finfo = restaurant.photograph ? restaurant.photograph.split(/\./) : [restaurant.id, 'jpg'];
          cache.add('/img/' + finfo[0] + '.' + (finfo[1] || 'jpg'));
          cache.add('/img_dist/' + finfo[0] + '-660_2x.' + (finfo[1] || 'jpg'));
          cache.add('/img_dist/' + finfo[0] + '-330_1x.' + (finfo[1] || 'jpg'));
          cache.add('/img_dist/' + finfo[0] + '.webp');
          cache.add('/img_dist/' + finfo[0] + '-660_2x.webp');
          cache.add('/img_dist/' + finfo[0] + '-330_1x.webp');
        }
      }
    });
  }));
});

self.addEventListener('activate', function (event) {
  event.waitUntil(caches.keys().then(function (cacheNames) {
    return Promise.all(cacheNames.filter(function (cacheName) {
      return cacheName.startsWith('restaurant-') && !(appCaches.static !== cacheName || appCaches.images !== cacheName);
    }).map(function (cacheName) {
      return caches.delete(cacheName);
    }));
  }));
});

self.addEventListener('fetch', function (event) {
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method != 'GET') {
    return;
  }

  var requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/index.html'));
      return;
    }
    if (requestUrl.pathname.startsWith('/img/') || requestUrl.pathname.startsWith('/img_dist/')) {
      event.respondWith(serveImg(event.request));
      return;
    }
    if (requestUrl.pathname.startsWith('/restaurant.html')) {
      event.respondWith(caches.match('/restaurant.html'));
      return;
    }
  }

  event.respondWith(caches.match(event.request).then(function (response) {
    return response || fetch(event.request);
  }));
});

function serveImg(request) {
  return caches.open(appCaches.images).then(function (cache) {
    return cache.match(request.url).then(function (response) {
      if (response) return response;

      return fetch(request).then(function (networkResponse) {
        cache.put(request.url, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! imports-loader?this=>global!exports-loader?global.fetch!whatwg-fetch */ "./node_modules/imports-loader/index.js?this=>global!./node_modules/exports-loader/index.js?global.fetch!./node_modules/whatwg-fetch/fetch.js")))

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

      if (request) {
        request.onupgradeneeded = function(event) {
          if (upgradeCallback) {
            upgradeCallback(new UpgradeDB(request.result, event.oldVersion, request.transaction));
          }
        };
      }

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgZGZjM2FmMjQwOTY1YTRjODU5YmYiLCJ3ZWJwYWNrOi8vLy4vanMvZGJoZWxwZXIuanMiLCJ3ZWJwYWNrOi8vLy4vanMvc3cuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2lkYi9saWIvaWRiLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanMiLCJ3ZWJwYWNrOi8vLyh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qcyJdLCJuYW1lcyI6WyJEQkhlbHBlciIsInJlc3BvbnNlIiwib2siLCJFcnJvciIsInN0YXR1c1RleHQiLCJqc29uIiwiZm9ybURhdGEiLCJEQiIsInRoZW4iLCJ0eCIsImRiIiwidHJhbnNhY3Rpb24iLCJEQl9PRkZMSU5FX0ZPUk1TX1NUT1JFIiwiZGJTdG9yZSIsIm9iamVjdFN0b3JlIiwicHV0IiwiY29tcGxldGUiLCJQcm9taXNlIiwicmVzb2x2ZSIsInJlamVjdCIsImdldEFsbCIsImZvcm1EYXRhcyIsImNhdGNoIiwiZXJyb3IiLCJmb3JtaWQiLCJkZWxldGUiLCJjYWxsYmFjayIsImZldGNoIiwiREFUQUJBU0VfVVJMIiwiX3ZhbGlkYXRlUmVzcG9uc2UiLCJfcmVhZFJlc3BvbnNlQXNKU09OIiwiREJfU1RPUkUiLCJyZXN1bHQiLCJmb3JFYWNoIiwicmVzdGF1cmFudCIsInJlc3RhdXJhbnRzIiwiaWQiLCJnZXQiLCJwYXJzZUludCIsImlzRmF2b3JpdGUiLCJtZXRob2QiLCJjb25zb2xlIiwiREJfUkVWSUVXU19TVE9SRSIsInJldmlld3MiLCJyZXZpZXciLCJib2R5IiwiY3Vpc2luZSIsImZldGNoUmVzdGF1cmFudHMiLCJyZXN1bHRzIiwiZmlsdGVyIiwiciIsImN1aXNpbmVfdHlwZSIsIm5laWdoYm9yaG9vZCIsIm5laWdoYm9yaG9vZHMiLCJtYXAiLCJ2IiwiaSIsInVuaXF1ZU5laWdoYm9yaG9vZHMiLCJpbmRleE9mIiwiY3Vpc2luZXMiLCJ1bmlxdWVDdWlzaW5lcyIsImZpbmZvIiwicGhvdG9ncmFwaCIsInNwbGl0IiwibWFya2VyIiwiZ29vZ2xlIiwibWFwcyIsIk1hcmtlciIsInBvc2l0aW9uIiwibGF0bG5nIiwidGl0bGUiLCJuYW1lIiwidXJsIiwidXJsRm9yUmVzdGF1cmFudCIsImFuaW1hdGlvbiIsIkFuaW1hdGlvbiIsIkRST1AiLCJwcm90b2NvbCIsImhvc3QiLCJwb3J0IiwiaWRiIiwib3BlbiIsIkRCX05BTUUiLCJEQl9WRVJTSU9OIiwidXBncmFkZURiIiwib2xkVmVyc2lvbiIsImNyZWF0ZU9iamVjdFN0b3JlIiwia2V5UGF0aCIsImFwcENhY2hlcyIsInN0YXRpYyIsImltYWdlcyIsInNlbGYiLCJhZGRFdmVudExpc3RlbmVyIiwiZXZlbnQiLCJ3YWl0VW50aWwiLCJjYWNoZXMiLCJjYWNoZSIsImFkZEFsbCIsImFkZCIsImtleSIsImhhc093blByb3BlcnR5Iiwia2V5cyIsImNhY2hlTmFtZXMiLCJhbGwiLCJjYWNoZU5hbWUiLCJzdGFydHNXaXRoIiwicmVxdWVzdCIsInJlcXVlc3RVcmwiLCJVUkwiLCJvcmlnaW4iLCJsb2NhdGlvbiIsInBhdGhuYW1lIiwicmVzcG9uZFdpdGgiLCJtYXRjaCIsInNlcnZlSW1nIiwibmV0d29ya1Jlc3BvbnNlIiwiY2xvbmUiXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxPQUFPO0FBQ1A7QUFDQSxHQUFHOztBQUVIO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTCxHQUFHOztBQUVIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNULE9BQU87QUFDUDtBQUNBLEdBQUc7O0FBRUg7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87QUFDUCxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOzs7Ozs7Ozs7Ozs7O0FDM1REO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0I7QUFDaEI7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHdDQUF3QyxtQkFBbUI7QUFDM0Q7QUFDQTs7QUFFQTtBQUNBO0FBQ0Esa0NBQWtDLG9CQUFvQjtBQUN0RDtBQUNBOztBQUVBO0FBQ0E7QUFDQSx3Q0FBd0MsNEJBQTRCO0FBQ3BFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBLG1CQUFtQixpQkFBaUI7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBLE9BQU87QUFDUDtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZELFNBQVM7QUFDVDtBQUNBLFNBQVM7QUFDVCw4RUFBOEU7QUFDOUU7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0EsT0FBTztBQUNQO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw4QkFBOEIsdUJBQXVCO0FBQ3JEOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0EsdUNBQXVDLDBCQUEwQjtBQUNqRTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUEsK0JBQStCLDBCQUEwQixlQUFlO0FBQ3hFOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLE9BQU87O0FBRVA7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7OztBQUdEO0FBQ0E7QUFDQSxDQUFDLGU7Ozs7Ozs7Ozs7Ozs7QUN6ZEQ7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsQ0FBQzs7QUFFRDtBQUNBO0FBQ0E7QUFDQSxDQUFDO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0Qzs7QUFFNUMiLCJmaWxlIjoic3cuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHtcbiBcdFx0XHRcdGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gXHRcdFx0XHRlbnVtZXJhYmxlOiB0cnVlLFxuIFx0XHRcdFx0Z2V0OiBnZXR0ZXJcbiBcdFx0XHR9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL2pzL3N3LmpzXCIpO1xuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIHdlYnBhY2svYm9vdHN0cmFwIGRmYzNhZjI0MDk2NWE0Yzg1OWJmIiwiaW1wb3J0IGlkYiBmcm9tICdpZGInO1xyXG5cclxuLyoqXHJcbiAqIENvbW1vbiBkYXRhYmFzZSBoZWxwZXIgZnVuY3Rpb25zLlxyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgREJIZWxwZXIge1xyXG4gIC8qKlxyXG4gICAqIERhdGFiYXNlIFVSTC5cclxuICAgKiBDaGFuZ2UgdGhpcyB0byByZXN0YXVyYW50cy5qc29uIGZpbGUgbG9jYXRpb24gb24geW91ciBzZXJ2ZXIuXHJcbiAgICovXHJcbiAgc3RhdGljIGdldCBEQVRBQkFTRV9VUkwoKSB7XHJcbiAgICBjb25zdCBwcm90b2NvbD0gJ2h0dHAnLFxyXG4gICAgICAgICAgaG9zdCA9ICdsb2NhbGhvc3QnLFxyXG4gICAgICAgICAgcG9ydCA9ICcxMzM3JztcclxuXHJcbiAgICByZXR1cm4gYCR7cHJvdG9jb2x9Oi8vJHtob3N0fToke3BvcnR9YDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXQgREJfVkVSU0lPTigpIHtcclxuICAgIHJldHVybiAzO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCBEQl9OQU1FKCkge1xyXG4gICAgcmV0dXJuICdyZXN0YXVyYW50cyc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IERCX1NUT1JFKCkge1xyXG4gICAgcmV0dXJuICdsaXN0JztcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXQgREJfUkVWSUVXU19TVE9SRSgpIHtcclxuICAgIHJldHVybiAncmV2aWV3cyc7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgZ2V0IERCX09GRkxJTkVfRk9STVNfU1RPUkUoKSB7XHJcbiAgICByZXR1cm4gJ29mZmxpbmUtZm9ybXMnO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldCBEQigpIHtcclxuICAgIHJldHVybiBpZGIub3Blbih0aGlzLkRCX05BTUUsIHRoaXMuREJfVkVSU0lPTiwgdXBncmFkZURiID0+IHtcclxuICAgICAgc3dpdGNoICh1cGdyYWRlRGIub2xkVmVyc2lvbikge1xyXG4gICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgIHVwZ3JhZGVEYi5jcmVhdGVPYmplY3RTdG9yZSh0aGlzLkRCX1NUT1JFLCB7IGtleVBhdGg6ICdpZCcgfSk7XHJcbiAgICAgICAgY2FzZSAxOlxyXG4gICAgICAgICAgdXBncmFkZURiLmNyZWF0ZU9iamVjdFN0b3JlKHRoaXMuREJfUkVWSUVXU19TVE9SRSwgeyBrZXlQYXRoOiAnaWQnIH0pO1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgIHVwZ3JhZGVEYi5jcmVhdGVPYmplY3RTdG9yZSh0aGlzLkRCX09GRkxJTkVfRk9STVNfU1RPUkUsIHsga2V5UGF0aDogJ2Zvcm1pZCcgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIF92YWxpZGF0ZVJlc3BvbnNlKHJlc3BvbnNlKSB7XHJcbiAgICBpZiAoIXJlc3BvbnNlLm9rKSB7XHJcbiAgICAgIHRocm93IEVycm9yKHJlc3BvbnNlLnN0YXR1c1RleHQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIF9yZWFkUmVzcG9uc2VBc0pTT04ocmVzcG9uc2UpIHtcclxuICAgIHJldHVybiByZXNwb25zZS5qc29uKCk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc3RvcmVPZmZsaW5lRm9ybShmb3JtRGF0YSkge1xyXG4gICAgdGhpcy5EQi50aGVuKGRiID0+IHtcclxuICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbih0aGlzLkRCX09GRkxJTkVfRk9STVNfU1RPUkUsICdyZWFkd3JpdGUnKTtcclxuICAgICAgY29uc3QgZGJTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKHRoaXMuREJfT0ZGTElORV9GT1JNU19TVE9SRSk7XHJcblxyXG4gICAgICBkYlN0b3JlLnB1dChmb3JtRGF0YSk7XHJcblxyXG4gICAgICByZXR1cm4gdHguY29tcGxldGU7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRPZmZsaW5lRm9ybXMoKSB7XHJcbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG4gICAgICB0aGlzLkRCXHJcbiAgICAgICAgLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbih0aGlzLkRCX09GRkxJTkVfRk9STVNfU1RPUkUpO1xyXG4gICAgICAgICAgY29uc3QgZGJTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKHRoaXMuREJfT0ZGTElORV9GT1JNU19TVE9SRSk7XHJcblxyXG4gICAgICAgICAgcmV0dXJuIGRiU3RvcmUuZ2V0QWxsKCk7XHJcbiAgICAgICAgfSlcclxuICAgICAgICAudGhlbihmb3JtRGF0YXMgPT4gcmVzb2x2ZShmb3JtRGF0YXMpKVxyXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiByZWplY3QoZXJyb3IpKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHJlbW92ZU9mZmxpbmVGb3JtKGZvcm1pZCkge1xyXG4gICAgdGhpcy5EQlxyXG4gICAgICAudGhlbihkYiA9PiB7XHJcbiAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbih0aGlzLkRCX09GRkxJTkVfRk9STVNfU1RPUkUsICdyZWFkd3JpdGUnKTtcclxuICAgICAgICBjb25zdCBkYlN0b3JlID0gdHgub2JqZWN0U3RvcmUodGhpcy5EQl9PRkZMSU5FX0ZPUk1TX1NUT1JFKTtcclxuXHJcbiAgICAgICAgZGJTdG9yZS5kZWxldGUoZm9ybWlkKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCBhbGwgcmVzdGF1cmFudHMuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudHMoY2FsbGJhY2spIHtcclxuICAgIGZldGNoKGAke0RCSGVscGVyLkRBVEFCQVNFX1VSTH0vcmVzdGF1cmFudHNgKVxyXG4gICAgICAudGhlbih0aGlzLl92YWxpZGF0ZVJlc3BvbnNlKVxyXG4gICAgICAudGhlbih0aGlzLl9yZWFkUmVzcG9uc2VBc0pTT04pXHJcbiAgICAgIC50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgLy8gYWRkIG5ldyBlbGVtZW50cyB0byBkYlxyXG4gICAgICAgIHRoaXMuREIudGhlbihkYiA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKHRoaXMuREJfU1RPUkUsICdyZWFkd3JpdGUnKSxcclxuICAgICAgICAgICAgZGJTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKHRoaXMuREJfU1RPUkUpO1xyXG4gICAgICAgICAgcmVzdWx0LmZvckVhY2gocmVzdGF1cmFudCA9PiB7XHJcbiAgICAgICAgICAgIGRiU3RvcmUucHV0KHJlc3RhdXJhbnQpO1xyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgICByZXR1cm4gdHguY29tcGxldGU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICAvLyBvZmZsaW5lIG9yIHNvbWV0aGluZywgcmVhZCBmcm9tIGRiXHJcbiAgICAgICAgdGhpcy5EQlxyXG4gICAgICAgICAgLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKHRoaXMuREJfU1RPUkUpLFxyXG4gICAgICAgICAgICAgIGRiU3RvcmUgPSB0eC5vYmplY3RTdG9yZSh0aGlzLkRCX1NUT1JFKTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBkYlN0b3JlLmdldEFsbCgpO1xyXG4gICAgICAgICAgfSlcclxuICAgICAgICAgIC50aGVuKHJlc3RhdXJhbnRzID0+IGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnRzKSlcclxuICAgICAgICAgIC5jYXRjaChlcnJvciA9PiBjYWxsYmFjayhlcnJvciwgbnVsbCkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIGEgcmVzdGF1cmFudCBieSBpdHMgSUQuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudEJ5SWQoaWQsIGNhbGxiYWNrKSB7XHJcbiAgICBmZXRjaChgJHtEQkhlbHBlci5EQVRBQkFTRV9VUkx9L3Jlc3RhdXJhbnRzLyR7aWR9YClcclxuICAgICAgLnRoZW4odGhpcy5fdmFsaWRhdGVSZXNwb25zZSlcclxuICAgICAgLnRoZW4odGhpcy5fcmVhZFJlc3BvbnNlQXNKU09OKVxyXG4gICAgICAudGhlbihyZXN1bHQgPT4ge1xyXG4gICAgICAgIC8vIGFkZCB0aGlzIGVsZW1lbnQgdG8gZGIgaWYgbm90IGV4aXN0c1xyXG4gICAgICAgIHRoaXMuREIudGhlbihkYiA9PiB7XHJcbiAgICAgICAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKHRoaXMuREJfU1RPUkUsICdyZWFkd3JpdGUnKSxcclxuICAgICAgICAgICAgZGJTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKHRoaXMuREJfU1RPUkUpO1xyXG4gICAgICAgICAgZGJTdG9yZS5wdXQocmVzdWx0KTtcclxuICAgICAgICB9KTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHQpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIHRoaXMuREJcclxuICAgICAgICAgIC50aGVuKGRiID0+IHtcclxuICAgICAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbih0aGlzLkRCX1NUT1JFKSxcclxuICAgICAgICAgICAgICBkYlN0b3JlID0gdHgub2JqZWN0U3RvcmUodGhpcy5EQl9TVE9SRSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGJTdG9yZS5nZXQocGFyc2VJbnQoaWQpKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXN0YXVyYW50ID0+IGNhbGxiYWNrKG51bGwsIHJlc3RhdXJhbnQpKVxyXG4gICAgICAgICAgLmNhdGNoKCgpID0+IGNhbGxiYWNrKCdSZXN0YXVyYW50IGRvZXMgbm90IGV4aXN0JywgbnVsbCkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBmYXZvcml0ZVJlc3RhdXJhbnQoaWQsIGlzRmF2b3JpdGUpIHtcclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIGZldGNoKGAke0RCSGVscGVyLkRBVEFCQVNFX1VSTH0vcmVzdGF1cmFudHMvJHtpZH0/aXNfZmF2b3JpdGU9JHtpc0Zhdm9yaXRlfWAsIHsgbWV0aG9kOiAnUFVUJyB9KVxyXG4gICAgICAgIC50aGVuKHRoaXMuX3ZhbGlkYXRlUmVzcG9uc2UpXHJcbiAgICAgICAgLnRoZW4odGhpcy5fcmVhZFJlc3BvbnNlQXNKU09OKVxyXG4gICAgICAgIC50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgICB0aGlzLkRCLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCB0eCA9IGRiLnRyYW5zYWN0aW9uKHRoaXMuREJfU1RPUkUsICdyZWFkd3JpdGUnKSxcclxuICAgICAgICAgICAgICBkYlN0b3JlID0gdHgub2JqZWN0U3RvcmUodGhpcy5EQl9TVE9SRSk7XHJcbiAgICAgICAgICAgIGRiU3RvcmUucHV0KHJlc3VsdCk7XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICAgIHJlc29sdmUocmVzdWx0KTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5jYXRjaChlcnJvciA9PiB7XHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGVycm9yKTtcclxuICAgICAgICAgIHRoaXMuREJcclxuICAgICAgICAgICAgLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24odGhpcy5EQl9TVE9SRSksXHJcbiAgICAgICAgICAgICAgICBkYlN0b3JlID0gdHgub2JqZWN0U3RvcmUodGhpcy5EQl9TVE9SRSk7XHJcblxyXG4gICAgICAgICAgICAgIHJldHVybiBkYlN0b3JlLmdldChwYXJzZUludChpZCkpO1xyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXN0YXVyYW50ID0+IHJlc29sdmUocmVzdGF1cmFudCkpXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnJvciA9PiByZWplY3QoZXJyb3IpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGZldGNoUmVzdGF1cmFudFJldmlld3MoaWQsIGNhbGxiYWNrKSB7XHJcbiAgICBmZXRjaChgJHtEQkhlbHBlci5EQVRBQkFTRV9VUkx9L3Jldmlld3M/cmVzdGF1cmFudF9pZD0ke2lkfWApXHJcbiAgICAgIC50aGVuKHRoaXMuX3ZhbGlkYXRlUmVzcG9uc2UpXHJcbiAgICAgIC50aGVuKHRoaXMuX3JlYWRSZXNwb25zZUFzSlNPTilcclxuICAgICAgLnRoZW4ocmVzdWx0ID0+IHtcclxuICAgICAgICB0aGlzLkRCLnRoZW4oZGIgPT4ge1xyXG4gICAgICAgICAgY29uc3QgdHggPSBkYi50cmFuc2FjdGlvbih0aGlzLkRCX1JFVklFV1NfU1RPUkUsICdyZWFkd3JpdGUnKSxcclxuICAgICAgICAgICAgICAgIGRiU3RvcmUgPSB0eC5vYmplY3RTdG9yZSh0aGlzLkRCX1JFVklFV1NfU1RPUkUpO1xyXG4gICAgICAgICAgZGJTdG9yZS5wdXQoeyBpZDogcGFyc2VJbnQoaWQpLCByZXZpZXdzOiByZXN1bHQgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0KTtcclxuICAgICAgfSlcclxuICAgICAgLmNhdGNoKGVycm9yID0+IHtcclxuICAgICAgICB0aGlzLkRCXHJcbiAgICAgICAgICAudGhlbihkYiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHR4ID0gZGIudHJhbnNhY3Rpb24odGhpcy5EQl9SRVZJRVdTX1NUT1JFKSxcclxuICAgICAgICAgICAgICAgICAgZGJTdG9yZSA9IHR4Lm9iamVjdFN0b3JlKHRoaXMuREJfUkVWSUVXU19TVE9SRSk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gZGJTdG9yZS5nZXQocGFyc2VJbnQoaWQpKTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAudGhlbihyZXN1bHQgPT4gY2FsbGJhY2sobnVsbCwgcmVzdWx0LnJldmlld3MpKVxyXG4gICAgICAgICAgLmNhdGNoKCgpID0+IGNhbGxiYWNrKCdObyByZXZpZXdzIHlldCEnLCBudWxsKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHBvc3RSZXN0YXVyYW50UmV2aWV3KHJldmlldykge1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgZmV0Y2goYCR7REJIZWxwZXIuREFUQUJBU0VfVVJMfS9yZXZpZXdzYCwge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGJvZHk6IHJldmlld1xyXG4gICAgICB9KVxyXG4gICAgICAudGhlbih0aGlzLl92YWxpZGF0ZVJlc3BvbnNlKVxyXG4gICAgICAudGhlbih0aGlzLl9yZWFkUmVzcG9uc2VBc0pTT04pXHJcbiAgICAgIC50aGVuKHJlc3VsdCA9PiB7XHJcbiAgICAgICAgcmVzb2x2ZShyZXN1bHQpO1xyXG4gICAgICB9KVxyXG4gICAgICAuY2F0Y2goZXJyb3IgPT4ge1xyXG4gICAgICAgIHJlamVjdChlcnJvcik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgdHlwZSB3aXRoIHByb3BlciBlcnJvciBoYW5kbGluZy5cclxuICAgKi9cclxuICBzdGF0aWMgZmV0Y2hSZXN0YXVyYW50QnlDdWlzaW5lKGN1aXNpbmUsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHMgIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nXHJcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEZpbHRlciByZXN0YXVyYW50cyB0byBoYXZlIG9ubHkgZ2l2ZW4gY3Vpc2luZSB0eXBlXHJcbiAgICAgICAgY29uc3QgcmVzdWx0cyA9IHJlc3RhdXJhbnRzLmZpbHRlcihyID0+IHIuY3Vpc2luZV90eXBlID09IGN1aXNpbmUpO1xyXG4gICAgICAgIGNhbGxiYWNrKG51bGwsIHJlc3VsdHMpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZldGNoIHJlc3RhdXJhbnRzIGJ5IGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeU5laWdoYm9yaG9vZChuZWlnaGJvcmhvb2QsIGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gRmlsdGVyIHJlc3RhdXJhbnRzIHRvIGhhdmUgb25seSBnaXZlbiBuZWlnaGJvcmhvb2RcclxuICAgICAgICBjb25zdCByZXN1bHRzID0gcmVzdGF1cmFudHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCByZXN1bHRzKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGZXRjaCByZXN0YXVyYW50cyBieSBhIGN1aXNpbmUgYW5kIGEgbmVpZ2hib3Job29kIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaFJlc3RhdXJhbnRCeUN1aXNpbmVBbmROZWlnaGJvcmhvb2QoY3Vpc2luZSwgbmVpZ2hib3Job29kLCBjYWxsYmFjaykge1xyXG4gICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXHJcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGxldCByZXN1bHRzID0gcmVzdGF1cmFudHM7XHJcbiAgICAgICAgaWYgKGN1aXNpbmUgIT0gJ2FsbCcpIHtcclxuICAgICAgICAgIC8vIGZpbHRlciBieSBjdWlzaW5lXHJcbiAgICAgICAgICByZXN1bHRzID0gcmVzdWx0cy5maWx0ZXIociA9PiByLmN1aXNpbmVfdHlwZSA9PSBjdWlzaW5lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKG5laWdoYm9yaG9vZCAhPSAnYWxsJykge1xyXG4gICAgICAgICAgLy8gZmlsdGVyIGJ5IG5laWdoYm9yaG9vZFxyXG4gICAgICAgICAgcmVzdWx0cyA9IHJlc3VsdHMuZmlsdGVyKHIgPT4gci5uZWlnaGJvcmhvb2QgPT0gbmVpZ2hib3Job29kKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgcmVzdWx0cyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggYWxsIG5laWdoYm9yaG9vZHMgd2l0aCBwcm9wZXIgZXJyb3IgaGFuZGxpbmcuXHJcbiAgICovXHJcbiAgc3RhdGljIGZldGNoTmVpZ2hib3Job29kcyhjYWxsYmFjaykge1xyXG4gICAgLy8gRmV0Y2ggYWxsIHJlc3RhdXJhbnRzXHJcbiAgICBEQkhlbHBlci5mZXRjaFJlc3RhdXJhbnRzKChlcnJvciwgcmVzdGF1cmFudHMpID0+IHtcclxuICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgY2FsbGJhY2soZXJyb3IsIG51bGwpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEdldCBhbGwgbmVpZ2hib3Job29kcyBmcm9tIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgIGNvbnN0IG5laWdoYm9yaG9vZHMgPSByZXN0YXVyYW50cy5tYXAoKHYsIGkpID0+IHJlc3RhdXJhbnRzW2ldLm5laWdoYm9yaG9vZCk7XHJcbiAgICAgICAgLy8gUmVtb3ZlIGR1cGxpY2F0ZXMgZnJvbSBuZWlnaGJvcmhvb2RzXHJcbiAgICAgICAgY29uc3QgdW5pcXVlTmVpZ2hib3Job29kcyA9IG5laWdoYm9yaG9vZHMuZmlsdGVyKCh2LCBpKSA9PiBuZWlnaGJvcmhvb2RzLmluZGV4T2YodikgPT0gaSk7XHJcbiAgICAgICAgY2FsbGJhY2sobnVsbCwgdW5pcXVlTmVpZ2hib3Job29kcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmV0Y2ggYWxsIGN1aXNpbmVzIHdpdGggcHJvcGVyIGVycm9yIGhhbmRsaW5nLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBmZXRjaEN1aXNpbmVzKGNhbGxiYWNrKSB7XHJcbiAgICAvLyBGZXRjaCBhbGwgcmVzdGF1cmFudHNcclxuICAgIERCSGVscGVyLmZldGNoUmVzdGF1cmFudHMoKGVycm9yLCByZXN0YXVyYW50cykgPT4ge1xyXG4gICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICBjYWxsYmFjayhlcnJvciwgbnVsbCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gR2V0IGFsbCBjdWlzaW5lcyBmcm9tIGFsbCByZXN0YXVyYW50c1xyXG4gICAgICAgIGNvbnN0IGN1aXNpbmVzID0gcmVzdGF1cmFudHMubWFwKCh2LCBpKSA9PiByZXN0YXVyYW50c1tpXS5jdWlzaW5lX3R5cGUpO1xyXG4gICAgICAgIC8vIFJlbW92ZSBkdXBsaWNhdGVzIGZyb20gY3Vpc2luZXNcclxuICAgICAgICBjb25zdCB1bmlxdWVDdWlzaW5lcyA9IGN1aXNpbmVzLmZpbHRlcigodiwgaSkgPT4gY3Vpc2luZXMuaW5kZXhPZih2KSA9PSBpKTtcclxuICAgICAgICBjYWxsYmFjayhudWxsLCB1bmlxdWVDdWlzaW5lcyk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBwYWdlIFVSTC5cclxuICAgKi9cclxuICBzdGF0aWMgdXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICByZXR1cm4gYC4vcmVzdGF1cmFudC5odG1sP2lkPSR7cmVzdGF1cmFudC5pZH1gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBzcmNzZXQgaW1hZ2UgVVJMLlxyXG4gICAqL1xyXG4gIHN0YXRpYyBpbWFnZVNyY1NldFVybEZvclJlc3RhdXJhbnQocmVzdGF1cmFudCkge1xyXG4gICAgY29uc3QgZmluZm8gPSByZXN0YXVyYW50LnBob3RvZ3JhcGggPyByZXN0YXVyYW50LnBob3RvZ3JhcGguc3BsaXQoL1xcLi8pIDogW3Jlc3RhdXJhbnQuaWQsICdqcGcnXTtcclxuICAgIHJldHVybiBgL2ltZ19kaXN0LyR7ZmluZm9bMF19LTY2MF8yeC53ZWJwIDJ4LCAvaW1nX2Rpc3QvJHtmaW5mb1swXX0tMzMwXzF4LndlYnAsXHJcbiAgICAgIC9pbWdfZGlzdC8ke2ZpbmZvWzBdfS02NjBfMnguJHtmaW5mb1sxXSB8fCAnanBnJ30gMngsIC9pbWdfZGlzdC8ke2ZpbmZvWzBdfS0zMzBfMXguJHtmaW5mb1sxXSB8fCAnanBnJ31gO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVzdGF1cmFudCBpbWFnZSBVUkwuXHJcbiAgICovXHJcbiAgc3RhdGljIGltYWdlVXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSB7XHJcbiAgICBjb25zdCBmaW5mbyA9IHJlc3RhdXJhbnQucGhvdG9ncmFwaCA/IHJlc3RhdXJhbnQucGhvdG9ncmFwaC5zcGxpdCgvXFwuLykgOiBbcmVzdGF1cmFudC5pZCwgJ2pwZyddO1xyXG4gICAgcmV0dXJuIGAvaW1nLyR7ZmluZm9bMF19LiR7ZmluZm9bMV0gfHwgJ2pwZyd9YDtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBpbWFnZVNyY1NldFVybEZvclJldmlld1BhZ2UocmVzdGF1cmFudCkge1xyXG4gICAgY29uc3QgZmluZm8gPSByZXN0YXVyYW50LnBob3RvZ3JhcGggPyByZXN0YXVyYW50LnBob3RvZ3JhcGguc3BsaXQoL1xcLi8pIDogW3Jlc3RhdXJhbnQuaWQsICdqcGcnXTtcclxuICAgIHJldHVybiBgL2ltZ19kaXN0LyR7ZmluZm9bMF19LndlYnAgODAwdywgL2ltZ19kaXN0LyR7ZmluZm9bMF19LTY2MF8yeC53ZWJwIDY2MHcsIC9pbWdfZGlzdC8ke2ZpbmZvWzBdfS0zMzBfMXgud2VicCAzMzB3LFxyXG4gICAgICAvaW1nLyR7ZmluZm9bMF19LiR7ZmluZm9bMV0gfHwgJ2pwZyd9IDgwMHcsIC9pbWdfZGlzdC8ke2ZpbmZvWzBdfS02NjBfMnguJHtmaW5mb1sxXSB8fCAnanBnJ30gNjYwdywgL2ltZ19kaXN0LyR7ZmluZm9bMF19LTMzMF8xeC4ke2ZpbmZvWzFdIHx8ICdqcGcnfSAzMzB3YDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIE1hcCBtYXJrZXIgZm9yIGEgcmVzdGF1cmFudC5cclxuICAgKi9cclxuICBzdGF0aWMgbWFwTWFya2VyRm9yUmVzdGF1cmFudChyZXN0YXVyYW50LCBtYXApIHtcclxuICAgIGNvbnN0IG1hcmtlciA9IG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xyXG4gICAgICBwb3NpdGlvbjogcmVzdGF1cmFudC5sYXRsbmcsXHJcbiAgICAgIHRpdGxlOiByZXN0YXVyYW50Lm5hbWUsXHJcbiAgICAgIHVybDogREJIZWxwZXIudXJsRm9yUmVzdGF1cmFudChyZXN0YXVyYW50KSxcclxuICAgICAgbWFwOiBtYXAsXHJcbiAgICAgIGFuaW1hdGlvbjogZ29vZ2xlLm1hcHMuQW5pbWF0aW9uLkRST1BcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIG1hcmtlcjtcclxuICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vanMvZGJoZWxwZXIuanMiLCJpbXBvcnQgREJIZWxwZXIgZnJvbSAnLi9kYmhlbHBlcic7XG5cbmNvbnN0IGFwcENhY2hlcyA9IHtcbiAgc3RhdGljOiAncmVzdGF1cmFudC1zdGF0aWMtdjQnLFxuICBpbWFnZXM6ICdyZXN0YXVyYW50LWltYWdlcy12Midcbn07XG5cbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcignaW5zdGFsbCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIGV2ZW50LndhaXRVbnRpbChcbiAgICBjYWNoZXMub3BlbihhcHBDYWNoZXMuc3RhdGljKS50aGVuKGZ1bmN0aW9uKGNhY2hlKSB7XG4gICAgICByZXR1cm4gY2FjaGUuYWRkQWxsKFtcbiAgICAgICAgJy9pbmRleC5odG1sJyxcbiAgICAgICAgJy9yZXN0YXVyYW50Lmh0bWwnLFxuICAgICAgICAnL2Rpc3Qvc3R5bGVzLmNzcycsXG4gICAgICAgICcvZGlzdC9tYWluLmpzJyxcbiAgICAgICAgJy9kaXN0L3Jlc3RhdXJhbnRfaW5mby5qcydcbiAgICAgIF0pO1xuICAgIH0pXG4gICk7XG5cbiAgLy8gY2FjaGUgaW1hZ2UgYXNzZXRzIGFuZCByZXN0YXVyYW50cyBkeW5hbWljYWxseVxuICBldmVudC53YWl0VW50aWwoXG4gICAgY2FjaGVzLm9wZW4oYXBwQ2FjaGVzLmltYWdlcykudGhlbihmdW5jdGlvbihjYWNoZSkge1xuICAgICAgREJIZWxwZXIuZmV0Y2hSZXN0YXVyYW50cygoZXJyb3IsIHJlc3RhdXJhbnRzKSA9PiB7XG4gICAgICAgIGNhY2hlLmFkZChEQkhlbHBlci5EQVRBQkFTRV9VUkwpO1xuICAgICAgICBmb3IgKGNvbnN0IGtleSBpbiByZXN0YXVyYW50cykge1xuICAgICAgICAgIGlmIChyZXN0YXVyYW50cy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICBjb25zdCByZXN0YXVyYW50ID0gcmVzdGF1cmFudHNba2V5XSxcbiAgICAgICAgICAgICAgZmluZm8gPSByZXN0YXVyYW50LnBob3RvZ3JhcGggPyByZXN0YXVyYW50LnBob3RvZ3JhcGguc3BsaXQoL1xcLi8pIDogW3Jlc3RhdXJhbnQuaWQsICdqcGcnXTtcbiAgICAgICAgICAgIGNhY2hlLmFkZChgL2ltZy8ke2ZpbmZvWzBdfS4ke2ZpbmZvWzFdIHx8ICdqcGcnfWApO1xuICAgICAgICAgICAgY2FjaGUuYWRkKGAvaW1nX2Rpc3QvJHtmaW5mb1swXX0tNjYwXzJ4LiR7ZmluZm9bMV0gfHwgJ2pwZyd9YCk7XG4gICAgICAgICAgICBjYWNoZS5hZGQoYC9pbWdfZGlzdC8ke2ZpbmZvWzBdfS0zMzBfMXguJHtmaW5mb1sxXSB8fCAnanBnJ31gKTtcbiAgICAgICAgICAgIGNhY2hlLmFkZChgL2ltZ19kaXN0LyR7ZmluZm9bMF19LndlYnBgKTtcbiAgICAgICAgICAgIGNhY2hlLmFkZChgL2ltZ19kaXN0LyR7ZmluZm9bMF19LTY2MF8yeC53ZWJwYCk7XG4gICAgICAgICAgICBjYWNoZS5hZGQoYC9pbWdfZGlzdC8ke2ZpbmZvWzBdfS0zMzBfMXgud2VicGApO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSlcbiAgKTtcbn0pO1xuXG5zZWxmLmFkZEV2ZW50TGlzdGVuZXIoJ2FjdGl2YXRlJywgZnVuY3Rpb24oZXZlbnQpIHtcbiAgZXZlbnQud2FpdFVudGlsKFxuICAgIGNhY2hlcy5rZXlzKCkudGhlbihmdW5jdGlvbihjYWNoZU5hbWVzKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5hbGwoXG4gICAgICAgIGNhY2hlTmFtZXNcbiAgICAgICAgICAuZmlsdGVyKGZ1bmN0aW9uKGNhY2hlTmFtZSkge1xuICAgICAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgICAgY2FjaGVOYW1lLnN0YXJ0c1dpdGgoJ3Jlc3RhdXJhbnQtJykgJiYgIShhcHBDYWNoZXMuc3RhdGljICE9PSBjYWNoZU5hbWUgfHwgYXBwQ2FjaGVzLmltYWdlcyAhPT0gY2FjaGVOYW1lKVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICB9KVxuICAgICAgICAgIC5tYXAoZnVuY3Rpb24oY2FjaGVOYW1lKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVzLmRlbGV0ZShjYWNoZU5hbWUpO1xuICAgICAgICAgIH0pXG4gICAgICApO1xuICAgIH0pXG4gICk7XG59KTtcblxuc2VsZi5hZGRFdmVudExpc3RlbmVyKCdmZXRjaCcsIGZ1bmN0aW9uKGV2ZW50KSB7XG4gIC8vIExldCB0aGUgYnJvd3NlciBkbyBpdHMgZGVmYXVsdCB0aGluZ1xuICAvLyBmb3Igbm9uLUdFVCByZXF1ZXN0cy5cbiAgaWYgKGV2ZW50LnJlcXVlc3QubWV0aG9kICE9ICdHRVQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgbGV0IHJlcXVlc3RVcmwgPSBuZXcgVVJMKGV2ZW50LnJlcXVlc3QudXJsKTtcblxuICBpZiAocmVxdWVzdFVybC5vcmlnaW4gPT09IGxvY2F0aW9uLm9yaWdpbikge1xuICAgIGlmIChyZXF1ZXN0VXJsLnBhdGhuYW1lID09PSAnLycpIHtcbiAgICAgIGV2ZW50LnJlc3BvbmRXaXRoKGNhY2hlcy5tYXRjaCgnL2luZGV4Lmh0bWwnKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChyZXF1ZXN0VXJsLnBhdGhuYW1lLnN0YXJ0c1dpdGgoJy9pbWcvJykgfHwgcmVxdWVzdFVybC5wYXRobmFtZS5zdGFydHNXaXRoKCcvaW1nX2Rpc3QvJykpIHtcbiAgICAgIGV2ZW50LnJlc3BvbmRXaXRoKHNlcnZlSW1nKGV2ZW50LnJlcXVlc3QpKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKHJlcXVlc3RVcmwucGF0aG5hbWUuc3RhcnRzV2l0aCgnL3Jlc3RhdXJhbnQuaHRtbCcpKSB7XG4gICAgICBldmVudC5yZXNwb25kV2l0aChjYWNoZXMubWF0Y2goJy9yZXN0YXVyYW50Lmh0bWwnKSk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICB9XG5cbiAgZXZlbnQucmVzcG9uZFdpdGgoXG4gICAgY2FjaGVzLm1hdGNoKGV2ZW50LnJlcXVlc3QpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIHJldHVybiByZXNwb25zZSB8fCBmZXRjaChldmVudC5yZXF1ZXN0KTtcbiAgICB9KVxuICApO1xufSk7XG5cbmZ1bmN0aW9uIHNlcnZlSW1nKHJlcXVlc3QpIHtcbiAgcmV0dXJuIGNhY2hlcy5vcGVuKGFwcENhY2hlcy5pbWFnZXMpLnRoZW4oZnVuY3Rpb24oY2FjaGUpIHtcbiAgICByZXR1cm4gY2FjaGUubWF0Y2gocmVxdWVzdC51cmwpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgIGlmIChyZXNwb25zZSkgcmV0dXJuIHJlc3BvbnNlO1xuXG4gICAgICByZXR1cm4gZmV0Y2gocmVxdWVzdCkudGhlbihmdW5jdGlvbihuZXR3b3JrUmVzcG9uc2UpIHtcbiAgICAgICAgY2FjaGUucHV0KHJlcXVlc3QudXJsLCBuZXR3b3JrUmVzcG9uc2UuY2xvbmUoKSk7XG4gICAgICAgIHJldHVybiBuZXR3b3JrUmVzcG9uc2U7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG59XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9qcy9zdy5qcyIsIid1c2Ugc3RyaWN0JztcblxuKGZ1bmN0aW9uKCkge1xuICBmdW5jdGlvbiB0b0FycmF5KGFycikge1xuICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcnIpO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVxdWVzdC5vbnN1Y2Nlc3MgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVzb2x2ZShyZXF1ZXN0LnJlc3VsdCk7XG4gICAgICB9O1xuXG4gICAgICByZXF1ZXN0Lm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KHJlcXVlc3QuZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKSB7XG4gICAgdmFyIHJlcXVlc3Q7XG4gICAgdmFyIHAgPSBuZXcgUHJvbWlzZShmdW5jdGlvbihyZXNvbHZlLCByZWplY3QpIHtcbiAgICAgIHJlcXVlc3QgPSBvYmpbbWV0aG9kXS5hcHBseShvYmosIGFyZ3MpO1xuICAgICAgcHJvbWlzaWZ5UmVxdWVzdChyZXF1ZXN0KS50aGVuKHJlc29sdmUsIHJlamVjdCk7XG4gICAgfSk7XG5cbiAgICBwLnJlcXVlc3QgPSByZXF1ZXN0O1xuICAgIHJldHVybiBwO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJvbWlzaWZ5Q3Vyc29yUmVxdWVzdENhbGwob2JqLCBtZXRob2QsIGFyZ3MpIHtcbiAgICB2YXIgcCA9IHByb21pc2lmeVJlcXVlc3RDYWxsKG9iaiwgbWV0aG9kLCBhcmdzKTtcbiAgICByZXR1cm4gcC50aGVuKGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgICBpZiAoIXZhbHVlKSByZXR1cm47XG4gICAgICByZXR1cm4gbmV3IEN1cnNvcih2YWx1ZSwgcC5yZXF1ZXN0KTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3h5UHJvcGVydGllcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBwcm9wZXJ0aWVzKSB7XG4gICAgcHJvcGVydGllcy5mb3JFYWNoKGZ1bmN0aW9uKHByb3ApIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShQcm94eUNsYXNzLnByb3RvdHlwZSwgcHJvcCwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uKHZhbCkge1xuICAgICAgICAgIHRoaXNbdGFyZ2V0UHJvcF1bcHJvcF0gPSB2YWw7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveHlSZXF1ZXN0TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHByb3h5TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzW3RhcmdldFByb3BdW3Byb3BdLmFwcGx5KHRoaXNbdGFyZ2V0UHJvcF0sIGFyZ3VtZW50cyk7XG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcHJveHlDdXJzb3JSZXF1ZXN0TWV0aG9kcyhQcm94eUNsYXNzLCB0YXJnZXRQcm9wLCBDb25zdHJ1Y3RvciwgcHJvcGVydGllcykge1xuICAgIHByb3BlcnRpZXMuZm9yRWFjaChmdW5jdGlvbihwcm9wKSB7XG4gICAgICBpZiAoIShwcm9wIGluIENvbnN0cnVjdG9yLnByb3RvdHlwZSkpIHJldHVybjtcbiAgICAgIFByb3h5Q2xhc3MucHJvdG90eXBlW3Byb3BdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBwcm9taXNpZnlDdXJzb3JSZXF1ZXN0Q2FsbCh0aGlzW3RhcmdldFByb3BdLCBwcm9wLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGZ1bmN0aW9uIEluZGV4KGluZGV4KSB7XG4gICAgdGhpcy5faW5kZXggPSBpbmRleDtcbiAgfVxuXG4gIHByb3h5UHJvcGVydGllcyhJbmRleCwgJ19pbmRleCcsIFtcbiAgICAnbmFtZScsXG4gICAgJ2tleVBhdGgnLFxuICAgICdtdWx0aUVudHJ5JyxcbiAgICAndW5pcXVlJ1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcbiAgICAnZ2V0JyxcbiAgICAnZ2V0S2V5JyxcbiAgICAnZ2V0QWxsJyxcbiAgICAnZ2V0QWxsS2V5cycsXG4gICAgJ2NvdW50J1xuICBdKTtcblxuICBwcm94eUN1cnNvclJlcXVlc3RNZXRob2RzKEluZGV4LCAnX2luZGV4JywgSURCSW5kZXgsIFtcbiAgICAnb3BlbkN1cnNvcicsXG4gICAgJ29wZW5LZXlDdXJzb3InXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIEN1cnNvcihjdXJzb3IsIHJlcXVlc3QpIHtcbiAgICB0aGlzLl9jdXJzb3IgPSBjdXJzb3I7XG4gICAgdGhpcy5fcmVxdWVzdCA9IHJlcXVlc3Q7XG4gIH1cblxuICBwcm94eVByb3BlcnRpZXMoQ3Vyc29yLCAnX2N1cnNvcicsIFtcbiAgICAnZGlyZWN0aW9uJyxcbiAgICAna2V5JyxcbiAgICAncHJpbWFyeUtleScsXG4gICAgJ3ZhbHVlJ1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKEN1cnNvciwgJ19jdXJzb3InLCBJREJDdXJzb3IsIFtcbiAgICAndXBkYXRlJyxcbiAgICAnZGVsZXRlJ1xuICBdKTtcblxuICAvLyBwcm94eSAnbmV4dCcgbWV0aG9kc1xuICBbJ2FkdmFuY2UnLCAnY29udGludWUnLCAnY29udGludWVQcmltYXJ5S2V5J10uZm9yRWFjaChmdW5jdGlvbihtZXRob2ROYW1lKSB7XG4gICAgaWYgKCEobWV0aG9kTmFtZSBpbiBJREJDdXJzb3IucHJvdG90eXBlKSkgcmV0dXJuO1xuICAgIEN1cnNvci5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBmdW5jdGlvbigpIHtcbiAgICAgIHZhciBjdXJzb3IgPSB0aGlzO1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCkudGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgY3Vyc29yLl9jdXJzb3JbbWV0aG9kTmFtZV0uYXBwbHkoY3Vyc29yLl9jdXJzb3IsIGFyZ3MpO1xuICAgICAgICByZXR1cm4gcHJvbWlzaWZ5UmVxdWVzdChjdXJzb3IuX3JlcXVlc3QpLnRoZW4oZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XG4gICAgICAgICAgcmV0dXJuIG5ldyBDdXJzb3IodmFsdWUsIGN1cnNvci5fcmVxdWVzdCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfTtcbiAgfSk7XG5cbiAgZnVuY3Rpb24gT2JqZWN0U3RvcmUoc3RvcmUpIHtcbiAgICB0aGlzLl9zdG9yZSA9IHN0b3JlO1xuICB9XG5cbiAgT2JqZWN0U3RvcmUucHJvdG90eXBlLmNyZWF0ZUluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbmRleCh0aGlzLl9zdG9yZS5jcmVhdGVJbmRleC5hcHBseSh0aGlzLl9zdG9yZSwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgT2JqZWN0U3RvcmUucHJvdG90eXBlLmluZGV4ID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJbmRleCh0aGlzLl9zdG9yZS5pbmRleC5hcHBseSh0aGlzLl9zdG9yZSwgYXJndW1lbnRzKSk7XG4gIH07XG5cbiAgcHJveHlQcm9wZXJ0aWVzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgW1xuICAgICduYW1lJyxcbiAgICAna2V5UGF0aCcsXG4gICAgJ2luZGV4TmFtZXMnLFxuICAgICdhdXRvSW5jcmVtZW50J1xuICBdKTtcblxuICBwcm94eVJlcXVlc3RNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcbiAgICAncHV0JyxcbiAgICAnYWRkJyxcbiAgICAnZGVsZXRlJyxcbiAgICAnY2xlYXInLFxuICAgICdnZXQnLFxuICAgICdnZXRBbGwnLFxuICAgICdnZXRLZXknLFxuICAgICdnZXRBbGxLZXlzJyxcbiAgICAnY291bnQnXG4gIF0pO1xuXG4gIHByb3h5Q3Vyc29yUmVxdWVzdE1ldGhvZHMoT2JqZWN0U3RvcmUsICdfc3RvcmUnLCBJREJPYmplY3RTdG9yZSwgW1xuICAgICdvcGVuQ3Vyc29yJyxcbiAgICAnb3BlbktleUN1cnNvcidcbiAgXSk7XG5cbiAgcHJveHlNZXRob2RzKE9iamVjdFN0b3JlLCAnX3N0b3JlJywgSURCT2JqZWN0U3RvcmUsIFtcbiAgICAnZGVsZXRlSW5kZXgnXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIFRyYW5zYWN0aW9uKGlkYlRyYW5zYWN0aW9uKSB7XG4gICAgdGhpcy5fdHggPSBpZGJUcmFuc2FjdGlvbjtcbiAgICB0aGlzLmNvbXBsZXRlID0gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmNvbXBsZXRlID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH07XG4gICAgICBpZGJUcmFuc2FjdGlvbi5vbmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJlamVjdChpZGJUcmFuc2FjdGlvbi5lcnJvcik7XG4gICAgICB9O1xuICAgICAgaWRiVHJhbnNhY3Rpb24ub25hYm9ydCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QoaWRiVHJhbnNhY3Rpb24uZXJyb3IpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIFRyYW5zYWN0aW9uLnByb3RvdHlwZS5vYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fdHgub2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fdHgsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhUcmFuc2FjdGlvbiwgJ190eCcsIFtcbiAgICAnb2JqZWN0U3RvcmVOYW1lcycsXG4gICAgJ21vZGUnXG4gIF0pO1xuXG4gIHByb3h5TWV0aG9kcyhUcmFuc2FjdGlvbiwgJ190eCcsIElEQlRyYW5zYWN0aW9uLCBbXG4gICAgJ2Fib3J0J1xuICBdKTtcblxuICBmdW5jdGlvbiBVcGdyYWRlREIoZGIsIG9sZFZlcnNpb24sIHRyYW5zYWN0aW9uKSB7XG4gICAgdGhpcy5fZGIgPSBkYjtcbiAgICB0aGlzLm9sZFZlcnNpb24gPSBvbGRWZXJzaW9uO1xuICAgIHRoaXMudHJhbnNhY3Rpb24gPSBuZXcgVHJhbnNhY3Rpb24odHJhbnNhY3Rpb24pO1xuICB9XG5cbiAgVXBncmFkZURCLnByb3RvdHlwZS5jcmVhdGVPYmplY3RTdG9yZSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgT2JqZWN0U3RvcmUodGhpcy5fZGIuY3JlYXRlT2JqZWN0U3RvcmUuYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhVcGdyYWRlREIsICdfZGInLCBbXG4gICAgJ25hbWUnLFxuICAgICd2ZXJzaW9uJyxcbiAgICAnb2JqZWN0U3RvcmVOYW1lcydcbiAgXSk7XG5cbiAgcHJveHlNZXRob2RzKFVwZ3JhZGVEQiwgJ19kYicsIElEQkRhdGFiYXNlLCBbXG4gICAgJ2RlbGV0ZU9iamVjdFN0b3JlJyxcbiAgICAnY2xvc2UnXG4gIF0pO1xuXG4gIGZ1bmN0aW9uIERCKGRiKSB7XG4gICAgdGhpcy5fZGIgPSBkYjtcbiAgfVxuXG4gIERCLnByb3RvdHlwZS50cmFuc2FjdGlvbiA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgVHJhbnNhY3Rpb24odGhpcy5fZGIudHJhbnNhY3Rpb24uYXBwbHkodGhpcy5fZGIsIGFyZ3VtZW50cykpO1xuICB9O1xuXG4gIHByb3h5UHJvcGVydGllcyhEQiwgJ19kYicsIFtcbiAgICAnbmFtZScsXG4gICAgJ3ZlcnNpb24nLFxuICAgICdvYmplY3RTdG9yZU5hbWVzJ1xuICBdKTtcblxuICBwcm94eU1ldGhvZHMoREIsICdfZGInLCBJREJEYXRhYmFzZSwgW1xuICAgICdjbG9zZSdcbiAgXSk7XG5cbiAgLy8gQWRkIGN1cnNvciBpdGVyYXRvcnNcbiAgLy8gVE9ETzogcmVtb3ZlIHRoaXMgb25jZSBicm93c2VycyBkbyB0aGUgcmlnaHQgdGhpbmcgd2l0aCBwcm9taXNlc1xuICBbJ29wZW5DdXJzb3InLCAnb3BlbktleUN1cnNvciddLmZvckVhY2goZnVuY3Rpb24oZnVuY05hbWUpIHtcbiAgICBbT2JqZWN0U3RvcmUsIEluZGV4XS5mb3JFYWNoKGZ1bmN0aW9uKENvbnN0cnVjdG9yKSB7XG4gICAgICAvLyBEb24ndCBjcmVhdGUgaXRlcmF0ZUtleUN1cnNvciBpZiBvcGVuS2V5Q3Vyc29yIGRvZXNuJ3QgZXhpc3QuXG4gICAgICBpZiAoIShmdW5jTmFtZSBpbiBDb25zdHJ1Y3Rvci5wcm90b3R5cGUpKSByZXR1cm47XG5cbiAgICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZVtmdW5jTmFtZS5yZXBsYWNlKCdvcGVuJywgJ2l0ZXJhdGUnKV0gPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSB0b0FycmF5KGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciBjYWxsYmFjayA9IGFyZ3NbYXJncy5sZW5ndGggLSAxXTtcbiAgICAgICAgdmFyIG5hdGl2ZU9iamVjdCA9IHRoaXMuX3N0b3JlIHx8IHRoaXMuX2luZGV4O1xuICAgICAgICB2YXIgcmVxdWVzdCA9IG5hdGl2ZU9iamVjdFtmdW5jTmFtZV0uYXBwbHkobmF0aXZlT2JqZWN0LCBhcmdzLnNsaWNlKDAsIC0xKSk7XG4gICAgICAgIHJlcXVlc3Qub25zdWNjZXNzID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICAgY2FsbGJhY2socmVxdWVzdC5yZXN1bHQpO1xuICAgICAgICB9O1xuICAgICAgfTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgLy8gcG9seWZpbGwgZ2V0QWxsXG4gIFtJbmRleCwgT2JqZWN0U3RvcmVdLmZvckVhY2goZnVuY3Rpb24oQ29uc3RydWN0b3IpIHtcbiAgICBpZiAoQ29uc3RydWN0b3IucHJvdG90eXBlLmdldEFsbCkgcmV0dXJuO1xuICAgIENvbnN0cnVjdG9yLnByb3RvdHlwZS5nZXRBbGwgPSBmdW5jdGlvbihxdWVyeSwgY291bnQpIHtcbiAgICAgIHZhciBpbnN0YW5jZSA9IHRoaXM7XG4gICAgICB2YXIgaXRlbXMgPSBbXTtcblxuICAgICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUpIHtcbiAgICAgICAgaW5zdGFuY2UuaXRlcmF0ZUN1cnNvcihxdWVyeSwgZnVuY3Rpb24oY3Vyc29yKSB7XG4gICAgICAgICAgaWYgKCFjdXJzb3IpIHtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpdGVtcy5wdXNoKGN1cnNvci52YWx1ZSk7XG5cbiAgICAgICAgICBpZiAoY291bnQgIT09IHVuZGVmaW5lZCAmJiBpdGVtcy5sZW5ndGggPT0gY291bnQpIHtcbiAgICAgICAgICAgIHJlc29sdmUoaXRlbXMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdXJzb3IuY29udGludWUoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICB9O1xuICB9KTtcblxuICB2YXIgZXhwID0ge1xuICAgIG9wZW46IGZ1bmN0aW9uKG5hbWUsIHZlcnNpb24sIHVwZ3JhZGVDYWxsYmFjaykge1xuICAgICAgdmFyIHAgPSBwcm9taXNpZnlSZXF1ZXN0Q2FsbChpbmRleGVkREIsICdvcGVuJywgW25hbWUsIHZlcnNpb25dKTtcbiAgICAgIHZhciByZXF1ZXN0ID0gcC5yZXF1ZXN0O1xuXG4gICAgICBpZiAocmVxdWVzdCkge1xuICAgICAgICByZXF1ZXN0Lm9udXBncmFkZW5lZWRlZCA9IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgICAgaWYgKHVwZ3JhZGVDYWxsYmFjaykge1xuICAgICAgICAgICAgdXBncmFkZUNhbGxiYWNrKG5ldyBVcGdyYWRlREIocmVxdWVzdC5yZXN1bHQsIGV2ZW50Lm9sZFZlcnNpb24sIHJlcXVlc3QudHJhbnNhY3Rpb24pKTtcbiAgICAgICAgICB9XG4gICAgICAgIH07XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBwLnRoZW4oZnVuY3Rpb24oZGIpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBEQihkYik7XG4gICAgICB9KTtcbiAgICB9LFxuICAgIGRlbGV0ZTogZnVuY3Rpb24obmFtZSkge1xuICAgICAgcmV0dXJuIHByb21pc2lmeVJlcXVlc3RDYWxsKGluZGV4ZWREQiwgJ2RlbGV0ZURhdGFiYXNlJywgW25hbWVdKTtcbiAgICB9XG4gIH07XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgbW9kdWxlLmV4cG9ydHMgPSBleHA7XG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IG1vZHVsZS5leHBvcnRzO1xuICB9XG4gIGVsc2Uge1xuICAgIHNlbGYuaWRiID0gZXhwO1xuICB9XG59KCkpO1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaWRiL2xpYi9pZGIuanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2lkYi9saWIvaWRiLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qKiogSU1QT1JUUyBGUk9NIGltcG9ydHMtbG9hZGVyICoqKi9cbihmdW5jdGlvbigpIHtcblxuKGZ1bmN0aW9uKHNlbGYpIHtcbiAgJ3VzZSBzdHJpY3QnO1xuXG4gIGlmIChzZWxmLmZldGNoKSB7XG4gICAgcmV0dXJuXG4gIH1cblxuICB2YXIgc3VwcG9ydCA9IHtcbiAgICBzZWFyY2hQYXJhbXM6ICdVUkxTZWFyY2hQYXJhbXMnIGluIHNlbGYsXG4gICAgaXRlcmFibGU6ICdTeW1ib2wnIGluIHNlbGYgJiYgJ2l0ZXJhdG9yJyBpbiBTeW1ib2wsXG4gICAgYmxvYjogJ0ZpbGVSZWFkZXInIGluIHNlbGYgJiYgJ0Jsb2InIGluIHNlbGYgJiYgKGZ1bmN0aW9uKCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgbmV3IEJsb2IoKVxuICAgICAgICByZXR1cm4gdHJ1ZVxuICAgICAgfSBjYXRjaChlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZVxuICAgICAgfVxuICAgIH0pKCksXG4gICAgZm9ybURhdGE6ICdGb3JtRGF0YScgaW4gc2VsZixcbiAgICBhcnJheUJ1ZmZlcjogJ0FycmF5QnVmZmVyJyBpbiBzZWxmXG4gIH1cblxuICBpZiAoc3VwcG9ydC5hcnJheUJ1ZmZlcikge1xuICAgIHZhciB2aWV3Q2xhc3NlcyA9IFtcbiAgICAgICdbb2JqZWN0IEludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgVWludDhDbGFtcGVkQXJyYXldJyxcbiAgICAgICdbb2JqZWN0IEludDE2QXJyYXldJyxcbiAgICAgICdbb2JqZWN0IFVpbnQxNkFycmF5XScsXG4gICAgICAnW29iamVjdCBJbnQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBVaW50MzJBcnJheV0nLFxuICAgICAgJ1tvYmplY3QgRmxvYXQzMkFycmF5XScsXG4gICAgICAnW29iamVjdCBGbG9hdDY0QXJyYXldJ1xuICAgIF1cblxuICAgIHZhciBpc0RhdGFWaWV3ID0gZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIERhdGFWaWV3LnByb3RvdHlwZS5pc1Byb3RvdHlwZU9mKG9iailcbiAgICB9XG5cbiAgICB2YXIgaXNBcnJheUJ1ZmZlclZpZXcgPSBBcnJheUJ1ZmZlci5pc1ZpZXcgfHwgZnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gb2JqICYmIHZpZXdDbGFzc2VzLmluZGV4T2YoT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikpID4gLTFcbiAgICB9XG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVOYW1lKG5hbWUpIHtcbiAgICBpZiAodHlwZW9mIG5hbWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICBuYW1lID0gU3RyaW5nKG5hbWUpXG4gICAgfVxuICAgIGlmICgvW15hLXowLTlcXC0jJCUmJyorLlxcXl9gfH5dL2kudGVzdChuYW1lKSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignSW52YWxpZCBjaGFyYWN0ZXIgaW4gaGVhZGVyIGZpZWxkIG5hbWUnKVxuICAgIH1cbiAgICByZXR1cm4gbmFtZS50b0xvd2VyQ2FzZSgpXG4gIH1cblxuICBmdW5jdGlvbiBub3JtYWxpemVWYWx1ZSh2YWx1ZSkge1xuICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKSB7XG4gICAgICB2YWx1ZSA9IFN0cmluZyh2YWx1ZSlcbiAgICB9XG4gICAgcmV0dXJuIHZhbHVlXG4gIH1cblxuICAvLyBCdWlsZCBhIGRlc3RydWN0aXZlIGl0ZXJhdG9yIGZvciB0aGUgdmFsdWUgbGlzdFxuICBmdW5jdGlvbiBpdGVyYXRvckZvcihpdGVtcykge1xuICAgIHZhciBpdGVyYXRvciA9IHtcbiAgICAgIG5leHQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBpdGVtcy5zaGlmdCgpXG4gICAgICAgIHJldHVybiB7ZG9uZTogdmFsdWUgPT09IHVuZGVmaW5lZCwgdmFsdWU6IHZhbHVlfVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0Lml0ZXJhYmxlKSB7XG4gICAgICBpdGVyYXRvcltTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiBpdGVyYXRvclxuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBpdGVyYXRvclxuICB9XG5cbiAgZnVuY3Rpb24gSGVhZGVycyhoZWFkZXJzKSB7XG4gICAgdGhpcy5tYXAgPSB7fVxuXG4gICAgaWYgKGhlYWRlcnMgaW5zdGFuY2VvZiBIZWFkZXJzKSB7XG4gICAgICBoZWFkZXJzLmZvckVhY2goZnVuY3Rpb24odmFsdWUsIG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgdmFsdWUpXG4gICAgICB9LCB0aGlzKVxuICAgIH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShoZWFkZXJzKSkge1xuICAgICAgaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKGhlYWRlcikge1xuICAgICAgICB0aGlzLmFwcGVuZChoZWFkZXJbMF0sIGhlYWRlclsxXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfSBlbHNlIGlmIChoZWFkZXJzKSB7XG4gICAgICBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhoZWFkZXJzKS5mb3JFYWNoKGZ1bmN0aW9uKG5hbWUpIHtcbiAgICAgICAgdGhpcy5hcHBlbmQobmFtZSwgaGVhZGVyc1tuYW1lXSlcbiAgICAgIH0sIHRoaXMpXG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuYXBwZW5kID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHZhbHVlID0gbm9ybWFsaXplVmFsdWUodmFsdWUpXG4gICAgdmFyIG9sZFZhbHVlID0gdGhpcy5tYXBbbmFtZV1cbiAgICB0aGlzLm1hcFtuYW1lXSA9IG9sZFZhbHVlID8gb2xkVmFsdWUrJywnK3ZhbHVlIDogdmFsdWVcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlWydkZWxldGUnXSA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5tYXBbbm9ybWFsaXplTmFtZShuYW1lKV1cbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBuYW1lID0gbm9ybWFsaXplTmFtZShuYW1lKVxuICAgIHJldHVybiB0aGlzLmhhcyhuYW1lKSA/IHRoaXMubWFwW25hbWVdIDogbnVsbFxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuaGFzID0gZnVuY3Rpb24obmFtZSkge1xuICAgIHJldHVybiB0aGlzLm1hcC5oYXNPd25Qcm9wZXJ0eShub3JtYWxpemVOYW1lKG5hbWUpKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24obmFtZSwgdmFsdWUpIHtcbiAgICB0aGlzLm1hcFtub3JtYWxpemVOYW1lKG5hbWUpXSA9IG5vcm1hbGl6ZVZhbHVlKHZhbHVlKVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUuZm9yRWFjaCA9IGZ1bmN0aW9uKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG4gICAgZm9yICh2YXIgbmFtZSBpbiB0aGlzLm1hcCkge1xuICAgICAgaWYgKHRoaXMubWFwLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICAgIGNhbGxiYWNrLmNhbGwodGhpc0FyZywgdGhpcy5tYXBbbmFtZV0sIG5hbWUsIHRoaXMpXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgSGVhZGVycy5wcm90b3R5cGUua2V5cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBpdGVtcyA9IFtdXG4gICAgdGhpcy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7IGl0ZW1zLnB1c2gobmFtZSkgfSlcbiAgICByZXR1cm4gaXRlcmF0b3JGb3IoaXRlbXMpXG4gIH1cblxuICBIZWFkZXJzLnByb3RvdHlwZS52YWx1ZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSkgeyBpdGVtcy5wdXNoKHZhbHVlKSB9KVxuICAgIHJldHVybiBpdGVyYXRvckZvcihpdGVtcylcbiAgfVxuXG4gIEhlYWRlcnMucHJvdG90eXBlLmVudHJpZXMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaXRlbXMgPSBbXVxuICAgIHRoaXMuZm9yRWFjaChmdW5jdGlvbih2YWx1ZSwgbmFtZSkgeyBpdGVtcy5wdXNoKFtuYW1lLCB2YWx1ZV0pIH0pXG4gICAgcmV0dXJuIGl0ZXJhdG9yRm9yKGl0ZW1zKVxuICB9XG5cbiAgaWYgKHN1cHBvcnQuaXRlcmFibGUpIHtcbiAgICBIZWFkZXJzLnByb3RvdHlwZVtTeW1ib2wuaXRlcmF0b3JdID0gSGVhZGVycy5wcm90b3R5cGUuZW50cmllc1xuICB9XG5cbiAgZnVuY3Rpb24gY29uc3VtZWQoYm9keSkge1xuICAgIGlmIChib2R5LmJvZHlVc2VkKSB7XG4gICAgICByZXR1cm4gUHJvbWlzZS5yZWplY3QobmV3IFR5cGVFcnJvcignQWxyZWFkeSByZWFkJykpXG4gICAgfVxuICAgIGJvZHkuYm9keVVzZWQgPSB0cnVlXG4gIH1cblxuICBmdW5jdGlvbiBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uKHJlc29sdmUsIHJlamVjdCkge1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXNvbHZlKHJlYWRlci5yZXN1bHQpXG4gICAgICB9XG4gICAgICByZWFkZXIub25lcnJvciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QocmVhZGVyLmVycm9yKVxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzQXJyYXlCdWZmZXIoYmxvYikge1xuICAgIHZhciByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpXG4gICAgdmFyIHByb21pc2UgPSBmaWxlUmVhZGVyUmVhZHkocmVhZGVyKVxuICAgIHJlYWRlci5yZWFkQXNBcnJheUJ1ZmZlcihibG9iKVxuICAgIHJldHVybiBwcm9taXNlXG4gIH1cblxuICBmdW5jdGlvbiByZWFkQmxvYkFzVGV4dChibG9iKSB7XG4gICAgdmFyIHJlYWRlciA9IG5ldyBGaWxlUmVhZGVyKClcbiAgICB2YXIgcHJvbWlzZSA9IGZpbGVSZWFkZXJSZWFkeShyZWFkZXIpXG4gICAgcmVhZGVyLnJlYWRBc1RleHQoYmxvYilcbiAgICByZXR1cm4gcHJvbWlzZVxuICB9XG5cbiAgZnVuY3Rpb24gcmVhZEFycmF5QnVmZmVyQXNUZXh0KGJ1Zikge1xuICAgIHZhciB2aWV3ID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIHZhciBjaGFycyA9IG5ldyBBcnJheSh2aWV3Lmxlbmd0aClcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlldy5sZW5ndGg7IGkrKykge1xuICAgICAgY2hhcnNbaV0gPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHZpZXdbaV0pXG4gICAgfVxuICAgIHJldHVybiBjaGFycy5qb2luKCcnKVxuICB9XG5cbiAgZnVuY3Rpb24gYnVmZmVyQ2xvbmUoYnVmKSB7XG4gICAgaWYgKGJ1Zi5zbGljZSkge1xuICAgICAgcmV0dXJuIGJ1Zi5zbGljZSgwKVxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdmlldyA9IG5ldyBVaW50OEFycmF5KGJ1Zi5ieXRlTGVuZ3RoKVxuICAgICAgdmlldy5zZXQobmV3IFVpbnQ4QXJyYXkoYnVmKSlcbiAgICAgIHJldHVybiB2aWV3LmJ1ZmZlclxuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIEJvZHkoKSB7XG4gICAgdGhpcy5ib2R5VXNlZCA9IGZhbHNlXG5cbiAgICB0aGlzLl9pbml0Qm9keSA9IGZ1bmN0aW9uKGJvZHkpIHtcbiAgICAgIHRoaXMuX2JvZHlJbml0ID0gYm9keVxuICAgICAgaWYgKCFib2R5KSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gJydcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGJvZHkgPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIHRoaXMuX2JvZHlUZXh0ID0gYm9keVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmJsb2IgJiYgQmxvYi5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5QmxvYiA9IGJvZHlcbiAgICAgIH0gZWxzZSBpZiAoc3VwcG9ydC5mb3JtRGF0YSAmJiBGb3JtRGF0YS5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5Rm9ybURhdGEgPSBib2R5XG4gICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICB0aGlzLl9ib2R5VGV4dCA9IGJvZHkudG9TdHJpbmcoKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIHN1cHBvcnQuYmxvYiAmJiBpc0RhdGFWaWV3KGJvZHkpKSB7XG4gICAgICAgIHRoaXMuX2JvZHlBcnJheUJ1ZmZlciA9IGJ1ZmZlckNsb25lKGJvZHkuYnVmZmVyKVxuICAgICAgICAvLyBJRSAxMC0xMSBjYW4ndCBoYW5kbGUgYSBEYXRhVmlldyBib2R5LlxuICAgICAgICB0aGlzLl9ib2R5SW5pdCA9IG5ldyBCbG9iKFt0aGlzLl9ib2R5QXJyYXlCdWZmZXJdKVxuICAgICAgfSBlbHNlIGlmIChzdXBwb3J0LmFycmF5QnVmZmVyICYmIChBcnJheUJ1ZmZlci5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSB8fCBpc0FycmF5QnVmZmVyVmlldyhib2R5KSkpIHtcbiAgICAgICAgdGhpcy5fYm9keUFycmF5QnVmZmVyID0gYnVmZmVyQ2xvbmUoYm9keSlcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcigndW5zdXBwb3J0ZWQgQm9keUluaXQgdHlwZScpXG4gICAgICB9XG5cbiAgICAgIGlmICghdGhpcy5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBib2R5ID09PSAnc3RyaW5nJykge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICd0ZXh0L3BsYWluO2NoYXJzZXQ9VVRGLTgnKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlCbG9iICYmIHRoaXMuX2JvZHlCbG9iLnR5cGUpIHtcbiAgICAgICAgICB0aGlzLmhlYWRlcnMuc2V0KCdjb250ZW50LXR5cGUnLCB0aGlzLl9ib2R5QmxvYi50eXBlKVxuICAgICAgICB9IGVsc2UgaWYgKHN1cHBvcnQuc2VhcmNoUGFyYW1zICYmIFVSTFNlYXJjaFBhcmFtcy5wcm90b3R5cGUuaXNQcm90b3R5cGVPZihib2R5KSkge1xuICAgICAgICAgIHRoaXMuaGVhZGVycy5zZXQoJ2NvbnRlbnQtdHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQ7Y2hhcnNldD1VVEYtOCcpXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoc3VwcG9ydC5ibG9iKSB7XG4gICAgICB0aGlzLmJsb2IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgICAgaWYgKHJlamVjdGVkKSB7XG4gICAgICAgICAgcmV0dXJuIHJlamVjdGVkXG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fYm9keUJsb2IpIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlCbG9iKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobmV3IEJsb2IoW3RoaXMuX2JvZHlBcnJheUJ1ZmZlcl0pKVxuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignY291bGQgbm90IHJlYWQgRm9ybURhdGEgYm9keSBhcyBibG9iJylcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKG5ldyBCbG9iKFt0aGlzLl9ib2R5VGV4dF0pKVxuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMuYXJyYXlCdWZmZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikge1xuICAgICAgICAgIHJldHVybiBjb25zdW1lZCh0aGlzKSB8fCBQcm9taXNlLnJlc29sdmUodGhpcy5fYm9keUFycmF5QnVmZmVyKVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiB0aGlzLmJsb2IoKS50aGVuKHJlYWRCbG9iQXNBcnJheUJ1ZmZlcilcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cblxuICAgIHRoaXMudGV4dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgdmFyIHJlamVjdGVkID0gY29uc3VtZWQodGhpcylcbiAgICAgIGlmIChyZWplY3RlZCkge1xuICAgICAgICByZXR1cm4gcmVqZWN0ZWRcbiAgICAgIH1cblxuICAgICAgaWYgKHRoaXMuX2JvZHlCbG9iKSB7XG4gICAgICAgIHJldHVybiByZWFkQmxvYkFzVGV4dCh0aGlzLl9ib2R5QmxvYilcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5fYm9keUFycmF5QnVmZmVyKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUocmVhZEFycmF5QnVmZmVyQXNUZXh0KHRoaXMuX2JvZHlBcnJheUJ1ZmZlcikpXG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX2JvZHlGb3JtRGF0YSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NvdWxkIG5vdCByZWFkIEZvcm1EYXRhIGJvZHkgYXMgdGV4dCcpXG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKHRoaXMuX2JvZHlUZXh0KVxuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChzdXBwb3J0LmZvcm1EYXRhKSB7XG4gICAgICB0aGlzLmZvcm1EYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKGRlY29kZSlcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLmpzb24gPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB0aGlzLnRleHQoKS50aGVuKEpTT04ucGFyc2UpXG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXNcbiAgfVxuXG4gIC8vIEhUVFAgbWV0aG9kcyB3aG9zZSBjYXBpdGFsaXphdGlvbiBzaG91bGQgYmUgbm9ybWFsaXplZFxuICB2YXIgbWV0aG9kcyA9IFsnREVMRVRFJywgJ0dFVCcsICdIRUFEJywgJ09QVElPTlMnLCAnUE9TVCcsICdQVVQnXVxuXG4gIGZ1bmN0aW9uIG5vcm1hbGl6ZU1ldGhvZChtZXRob2QpIHtcbiAgICB2YXIgdXBjYXNlZCA9IG1ldGhvZC50b1VwcGVyQ2FzZSgpXG4gICAgcmV0dXJuIChtZXRob2RzLmluZGV4T2YodXBjYXNlZCkgPiAtMSkgPyB1cGNhc2VkIDogbWV0aG9kXG4gIH1cblxuICBmdW5jdGlvbiBSZXF1ZXN0KGlucHV0LCBvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge31cbiAgICB2YXIgYm9keSA9IG9wdGlvbnMuYm9keVxuXG4gICAgaWYgKGlucHV0IGluc3RhbmNlb2YgUmVxdWVzdCkge1xuICAgICAgaWYgKGlucHV0LmJvZHlVc2VkKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0FscmVhZHkgcmVhZCcpXG4gICAgICB9XG4gICAgICB0aGlzLnVybCA9IGlucHV0LnVybFxuICAgICAgdGhpcy5jcmVkZW50aWFscyA9IGlucHV0LmNyZWRlbnRpYWxzXG4gICAgICBpZiAoIW9wdGlvbnMuaGVhZGVycykge1xuICAgICAgICB0aGlzLmhlYWRlcnMgPSBuZXcgSGVhZGVycyhpbnB1dC5oZWFkZXJzKVxuICAgICAgfVxuICAgICAgdGhpcy5tZXRob2QgPSBpbnB1dC5tZXRob2RcbiAgICAgIHRoaXMubW9kZSA9IGlucHV0Lm1vZGVcbiAgICAgIGlmICghYm9keSAmJiBpbnB1dC5fYm9keUluaXQgIT0gbnVsbCkge1xuICAgICAgICBib2R5ID0gaW5wdXQuX2JvZHlJbml0XG4gICAgICAgIGlucHV0LmJvZHlVc2VkID0gdHJ1ZVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnVybCA9IFN0cmluZyhpbnB1dClcbiAgICB9XG5cbiAgICB0aGlzLmNyZWRlbnRpYWxzID0gb3B0aW9ucy5jcmVkZW50aWFscyB8fCB0aGlzLmNyZWRlbnRpYWxzIHx8ICdvbWl0J1xuICAgIGlmIChvcHRpb25zLmhlYWRlcnMgfHwgIXRoaXMuaGVhZGVycykge1xuICAgICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIH1cbiAgICB0aGlzLm1ldGhvZCA9IG5vcm1hbGl6ZU1ldGhvZChvcHRpb25zLm1ldGhvZCB8fCB0aGlzLm1ldGhvZCB8fCAnR0VUJylcbiAgICB0aGlzLm1vZGUgPSBvcHRpb25zLm1vZGUgfHwgdGhpcy5tb2RlIHx8IG51bGxcbiAgICB0aGlzLnJlZmVycmVyID0gbnVsbFxuXG4gICAgaWYgKCh0aGlzLm1ldGhvZCA9PT0gJ0dFVCcgfHwgdGhpcy5tZXRob2QgPT09ICdIRUFEJykgJiYgYm9keSkge1xuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignQm9keSBub3QgYWxsb3dlZCBmb3IgR0VUIG9yIEhFQUQgcmVxdWVzdHMnKVxuICAgIH1cbiAgICB0aGlzLl9pbml0Qm9keShib2R5KVxuICB9XG5cbiAgUmVxdWVzdC5wcm90b3R5cGUuY2xvbmUgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IFJlcXVlc3QodGhpcywgeyBib2R5OiB0aGlzLl9ib2R5SW5pdCB9KVxuICB9XG5cbiAgZnVuY3Rpb24gZGVjb2RlKGJvZHkpIHtcbiAgICB2YXIgZm9ybSA9IG5ldyBGb3JtRGF0YSgpXG4gICAgYm9keS50cmltKCkuc3BsaXQoJyYnKS5mb3JFYWNoKGZ1bmN0aW9uKGJ5dGVzKSB7XG4gICAgICBpZiAoYnl0ZXMpIHtcbiAgICAgICAgdmFyIHNwbGl0ID0gYnl0ZXMuc3BsaXQoJz0nKVxuICAgICAgICB2YXIgbmFtZSA9IHNwbGl0LnNoaWZ0KCkucmVwbGFjZSgvXFwrL2csICcgJylcbiAgICAgICAgdmFyIHZhbHVlID0gc3BsaXQuam9pbignPScpLnJlcGxhY2UoL1xcKy9nLCAnICcpXG4gICAgICAgIGZvcm0uYXBwZW5kKGRlY29kZVVSSUNvbXBvbmVudChuYW1lKSwgZGVjb2RlVVJJQ29tcG9uZW50KHZhbHVlKSlcbiAgICAgIH1cbiAgICB9KVxuICAgIHJldHVybiBmb3JtXG4gIH1cblxuICBmdW5jdGlvbiBwYXJzZUhlYWRlcnMocmF3SGVhZGVycykge1xuICAgIHZhciBoZWFkZXJzID0gbmV3IEhlYWRlcnMoKVxuICAgIC8vIFJlcGxhY2UgaW5zdGFuY2VzIG9mIFxcclxcbiBhbmQgXFxuIGZvbGxvd2VkIGJ5IGF0IGxlYXN0IG9uZSBzcGFjZSBvciBob3Jpem9udGFsIHRhYiB3aXRoIGEgc3BhY2VcbiAgICAvLyBodHRwczovL3Rvb2xzLmlldGYub3JnL2h0bWwvcmZjNzIzMCNzZWN0aW9uLTMuMlxuICAgIHZhciBwcmVQcm9jZXNzZWRIZWFkZXJzID0gcmF3SGVhZGVycy5yZXBsYWNlKC9cXHI/XFxuW1xcdCBdKy9nLCAnICcpXG4gICAgcHJlUHJvY2Vzc2VkSGVhZGVycy5zcGxpdCgvXFxyP1xcbi8pLmZvckVhY2goZnVuY3Rpb24obGluZSkge1xuICAgICAgdmFyIHBhcnRzID0gbGluZS5zcGxpdCgnOicpXG4gICAgICB2YXIga2V5ID0gcGFydHMuc2hpZnQoKS50cmltKClcbiAgICAgIGlmIChrZXkpIHtcbiAgICAgICAgdmFyIHZhbHVlID0gcGFydHMuam9pbignOicpLnRyaW0oKVxuICAgICAgICBoZWFkZXJzLmFwcGVuZChrZXksIHZhbHVlKVxuICAgICAgfVxuICAgIH0pXG4gICAgcmV0dXJuIGhlYWRlcnNcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXF1ZXN0LnByb3RvdHlwZSlcblxuICBmdW5jdGlvbiBSZXNwb25zZShib2R5SW5pdCwgb3B0aW9ucykge1xuICAgIGlmICghb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IHt9XG4gICAgfVxuXG4gICAgdGhpcy50eXBlID0gJ2RlZmF1bHQnXG4gICAgdGhpcy5zdGF0dXMgPSBvcHRpb25zLnN0YXR1cyA9PT0gdW5kZWZpbmVkID8gMjAwIDogb3B0aW9ucy5zdGF0dXNcbiAgICB0aGlzLm9rID0gdGhpcy5zdGF0dXMgPj0gMjAwICYmIHRoaXMuc3RhdHVzIDwgMzAwXG4gICAgdGhpcy5zdGF0dXNUZXh0ID0gJ3N0YXR1c1RleHQnIGluIG9wdGlvbnMgPyBvcHRpb25zLnN0YXR1c1RleHQgOiAnT0snXG4gICAgdGhpcy5oZWFkZXJzID0gbmV3IEhlYWRlcnMob3B0aW9ucy5oZWFkZXJzKVxuICAgIHRoaXMudXJsID0gb3B0aW9ucy51cmwgfHwgJydcbiAgICB0aGlzLl9pbml0Qm9keShib2R5SW5pdClcbiAgfVxuXG4gIEJvZHkuY2FsbChSZXNwb25zZS5wcm90b3R5cGUpXG5cbiAgUmVzcG9uc2UucHJvdG90eXBlLmNsb25lID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBSZXNwb25zZSh0aGlzLl9ib2R5SW5pdCwge1xuICAgICAgc3RhdHVzOiB0aGlzLnN0YXR1cyxcbiAgICAgIHN0YXR1c1RleHQ6IHRoaXMuc3RhdHVzVGV4dCxcbiAgICAgIGhlYWRlcnM6IG5ldyBIZWFkZXJzKHRoaXMuaGVhZGVycyksXG4gICAgICB1cmw6IHRoaXMudXJsXG4gICAgfSlcbiAgfVxuXG4gIFJlc3BvbnNlLmVycm9yID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IDAsIHN0YXR1c1RleHQ6ICcnfSlcbiAgICByZXNwb25zZS50eXBlID0gJ2Vycm9yJ1xuICAgIHJldHVybiByZXNwb25zZVxuICB9XG5cbiAgdmFyIHJlZGlyZWN0U3RhdHVzZXMgPSBbMzAxLCAzMDIsIDMwMywgMzA3LCAzMDhdXG5cbiAgUmVzcG9uc2UucmVkaXJlY3QgPSBmdW5jdGlvbih1cmwsIHN0YXR1cykge1xuICAgIGlmIChyZWRpcmVjdFN0YXR1c2VzLmluZGV4T2Yoc3RhdHVzKSA9PT0gLTEpIHtcbiAgICAgIHRocm93IG5ldyBSYW5nZUVycm9yKCdJbnZhbGlkIHN0YXR1cyBjb2RlJylcbiAgICB9XG5cbiAgICByZXR1cm4gbmV3IFJlc3BvbnNlKG51bGwsIHtzdGF0dXM6IHN0YXR1cywgaGVhZGVyczoge2xvY2F0aW9uOiB1cmx9fSlcbiAgfVxuXG4gIHNlbGYuSGVhZGVycyA9IEhlYWRlcnNcbiAgc2VsZi5SZXF1ZXN0ID0gUmVxdWVzdFxuICBzZWxmLlJlc3BvbnNlID0gUmVzcG9uc2VcblxuICBzZWxmLmZldGNoID0gZnVuY3Rpb24oaW5wdXQsIGluaXQpIHtcbiAgICByZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24ocmVzb2x2ZSwgcmVqZWN0KSB7XG4gICAgICB2YXIgcmVxdWVzdCA9IG5ldyBSZXF1ZXN0KGlucHV0LCBpbml0KVxuICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpXG5cbiAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgc3RhdHVzOiB4aHIuc3RhdHVzLFxuICAgICAgICAgIHN0YXR1c1RleHQ6IHhoci5zdGF0dXNUZXh0LFxuICAgICAgICAgIGhlYWRlcnM6IHBhcnNlSGVhZGVycyh4aHIuZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCkgfHwgJycpXG4gICAgICAgIH1cbiAgICAgICAgb3B0aW9ucy51cmwgPSAncmVzcG9uc2VVUkwnIGluIHhociA/IHhoci5yZXNwb25zZVVSTCA6IG9wdGlvbnMuaGVhZGVycy5nZXQoJ1gtUmVxdWVzdC1VUkwnKVxuICAgICAgICB2YXIgYm9keSA9ICdyZXNwb25zZScgaW4geGhyID8geGhyLnJlc3BvbnNlIDogeGhyLnJlc3BvbnNlVGV4dFxuICAgICAgICByZXNvbHZlKG5ldyBSZXNwb25zZShib2R5LCBvcHRpb25zKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9uZXJyb3IgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgcmVqZWN0KG5ldyBUeXBlRXJyb3IoJ05ldHdvcmsgcmVxdWVzdCBmYWlsZWQnKSlcbiAgICAgIH1cblxuICAgICAgeGhyLm9udGltZW91dCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICByZWplY3QobmV3IFR5cGVFcnJvcignTmV0d29yayByZXF1ZXN0IGZhaWxlZCcpKVxuICAgICAgfVxuXG4gICAgICB4aHIub3BlbihyZXF1ZXN0Lm1ldGhvZCwgcmVxdWVzdC51cmwsIHRydWUpXG5cbiAgICAgIGlmIChyZXF1ZXN0LmNyZWRlbnRpYWxzID09PSAnaW5jbHVkZScpIHtcbiAgICAgICAgeGhyLndpdGhDcmVkZW50aWFscyA9IHRydWVcbiAgICAgIH0gZWxzZSBpZiAocmVxdWVzdC5jcmVkZW50aWFscyA9PT0gJ29taXQnKSB7XG4gICAgICAgIHhoci53aXRoQ3JlZGVudGlhbHMgPSBmYWxzZVxuICAgICAgfVxuXG4gICAgICBpZiAoJ3Jlc3BvbnNlVHlwZScgaW4geGhyICYmIHN1cHBvcnQuYmxvYikge1xuICAgICAgICB4aHIucmVzcG9uc2VUeXBlID0gJ2Jsb2InXG4gICAgICB9XG5cbiAgICAgIHJlcXVlc3QuaGVhZGVycy5mb3JFYWNoKGZ1bmN0aW9uKHZhbHVlLCBuYW1lKSB7XG4gICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKG5hbWUsIHZhbHVlKVxuICAgICAgfSlcblxuICAgICAgeGhyLnNlbmQodHlwZW9mIHJlcXVlc3QuX2JvZHlJbml0ID09PSAndW5kZWZpbmVkJyA/IG51bGwgOiByZXF1ZXN0Ll9ib2R5SW5pdClcbiAgICB9KVxuICB9XG4gIHNlbGYuZmV0Y2gucG9seWZpbGwgPSB0cnVlXG59KSh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgPyBzZWxmIDogdGhpcyk7XG5cblxuLyoqKiBFWFBPUlRTIEZST00gZXhwb3J0cy1sb2FkZXIgKioqL1xubW9kdWxlLmV4cG9ydHMgPSBnbG9iYWwuZmV0Y2g7XG59LmNhbGwoZ2xvYmFsKSk7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9ub2RlX21vZHVsZXMvaW1wb3J0cy1sb2FkZXI/dGhpcz0+Z2xvYmFsIS4vbm9kZV9tb2R1bGVzL2V4cG9ydHMtbG9hZGVyP2dsb2JhbC5mZXRjaCEuL25vZGVfbW9kdWxlcy93aGF0d2ctZmV0Y2gvZmV0Y2guanNcbi8vIG1vZHVsZSBpZCA9IC4vbm9kZV9tb2R1bGVzL2ltcG9ydHMtbG9hZGVyL2luZGV4LmpzP3RoaXM9Pmdsb2JhbCEuL25vZGVfbW9kdWxlcy9leHBvcnRzLWxvYWRlci9pbmRleC5qcz9nbG9iYWwuZmV0Y2ghLi9ub2RlX21vZHVsZXMvd2hhdHdnLWZldGNoL2ZldGNoLmpzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsInZhciBnO1xyXG5cclxuLy8gVGhpcyB3b3JrcyBpbiBub24tc3RyaWN0IG1vZGVcclxuZyA9IChmdW5jdGlvbigpIHtcclxuXHRyZXR1cm4gdGhpcztcclxufSkoKTtcclxuXHJcbnRyeSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiBldmFsIGlzIGFsbG93ZWQgKHNlZSBDU1ApXHJcblx0ZyA9IGcgfHwgRnVuY3Rpb24oXCJyZXR1cm4gdGhpc1wiKSgpIHx8ICgxLGV2YWwpKFwidGhpc1wiKTtcclxufSBjYXRjaChlKSB7XHJcblx0Ly8gVGhpcyB3b3JrcyBpZiB0aGUgd2luZG93IHJlZmVyZW5jZSBpcyBhdmFpbGFibGVcclxuXHRpZih0eXBlb2Ygd2luZG93ID09PSBcIm9iamVjdFwiKVxyXG5cdFx0ZyA9IHdpbmRvdztcclxufVxyXG5cclxuLy8gZyBjYW4gc3RpbGwgYmUgdW5kZWZpbmVkLCBidXQgbm90aGluZyB0byBkbyBhYm91dCBpdC4uLlxyXG4vLyBXZSByZXR1cm4gdW5kZWZpbmVkLCBpbnN0ZWFkIG9mIG5vdGhpbmcgaGVyZSwgc28gaXQnc1xyXG4vLyBlYXNpZXIgdG8gaGFuZGxlIHRoaXMgY2FzZS4gaWYoIWdsb2JhbCkgeyAuLi59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGc7XHJcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vICh3ZWJwYWNrKS9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGlkID0gLi9ub2RlX21vZHVsZXMvd2VicGFjay9idWlsZGluL2dsb2JhbC5qc1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9