import idb from 'idb';

/**
 * Common database helper functions.
 */
export default class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const protocol= 'http',
          host = 'localhost',
          port = '1337';

    return `${protocol}://${host}:${port}`;
  }

  static get DB_VERSION() {
    return 3;
  }

  static get DB_NAME() {
    return 'restaurants';
  }

  static get DB_STORE() {
    return 'list';
  }

  static get DB_REVIEWS_STORE() {
    return 'reviews';
  }

  static get DB_OFFLINE_FORMS_STORE() {
    return 'offline-forms';
  }

  static get DB() {
    return idb.open(this.DB_NAME, this.DB_VERSION, upgradeDb => {
      switch (upgradeDb.oldVersion) {
        case 0:
          upgradeDb.createObjectStore(this.DB_STORE, { keyPath: 'id' });
        case 1:
          upgradeDb.createObjectStore(this.DB_REVIEWS_STORE, { keyPath: 'id' });
        case 2:
          upgradeDb.createObjectStore(this.DB_OFFLINE_FORMS_STORE, { keyPath: 'formid' });
      }
    });
  }

  static _validateResponse(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response;
  }

  static _readResponseAsJSON(response) {
    return response.json();
  }

  static storeOfflineForm(formData) {
    this.DB.then(db => {
      const tx = db.transaction(this.DB_OFFLINE_FORMS_STORE, 'readwrite');
      const dbStore = tx.objectStore(this.DB_OFFLINE_FORMS_STORE);

      dbStore.put(formData);

      return tx.complete;
    });
  }

  static getOfflineForms() {
    return new Promise((resolve, reject) => {
      this.DB
        .then(db => {
          const tx = db.transaction(this.DB_OFFLINE_FORMS_STORE);
          const dbStore = tx.objectStore(this.DB_OFFLINE_FORMS_STORE);

          return dbStore.getAll();
        })
        .then(formDatas => resolve(formDatas))
        .catch(error => reject(error));
    });
  }

  static removeOfflineForm(formid) {
    this.DB
      .then(db => {
        const tx = db.transaction(this.DB_OFFLINE_FORMS_STORE, 'readwrite');
        const dbStore = tx.objectStore(this.DB_OFFLINE_FORMS_STORE);

        dbStore.delete(formid);
      });
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    fetch(`${DBHelper.DATABASE_URL}/restaurants`)
      .then(this._validateResponse)
      .then(this._readResponseAsJSON)
      .then(result => {
        // add new elements to db
        this.DB.then(db => {
          const tx = db.transaction(this.DB_STORE, 'readwrite'),
            dbStore = tx.objectStore(this.DB_STORE);
          result.forEach(restaurant => {
            dbStore.put(restaurant);
          });
          return tx.complete;
        });
        callback(null, result);
      })
      .catch(error => {
        // offline or something, read from db
        this.DB
          .then(db => {
            const tx = db.transaction(this.DB_STORE),
              dbStore = tx.objectStore(this.DB_STORE);

            return dbStore.getAll();
          })
          .then(restaurants => callback(null, restaurants))
          .catch(error => callback(error, null));
      });
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    fetch(`${DBHelper.DATABASE_URL}/restaurants/${id}`)
      .then(this._validateResponse)
      .then(this._readResponseAsJSON)
      .then(result => {
        // add this element to db if not exists
        this.DB.then(db => {
          const tx = db.transaction(this.DB_STORE, 'readwrite'),
            dbStore = tx.objectStore(this.DB_STORE);
          dbStore.put(result);
        });
        callback(null, result);
      })
      .catch(error => {
        this.DB
          .then(db => {
            const tx = db.transaction(this.DB_STORE),
              dbStore = tx.objectStore(this.DB_STORE);

            return dbStore.get(parseInt(id));
          })
          .then(restaurant => callback(null, restaurant))
          .catch(() => callback('Restaurant does not exist', null));
      });
  }

  static favoriteRestaurant(id, isFavorite) {
    return new Promise((resolve, reject) => {
      fetch(`${DBHelper.DATABASE_URL}/restaurants/${id}?is_favorite=${isFavorite}`, { method: 'PUT' })
        .then(this._validateResponse)
        .then(this._readResponseAsJSON)
        .then(result => {
          this.DB.then(db => {
            const tx = db.transaction(this.DB_STORE, 'readwrite'),
              dbStore = tx.objectStore(this.DB_STORE);
            dbStore.put(result);
          });
          resolve(result);
        })
        .catch(error => {
          console.error(error);
          this.DB
            .then(db => {
              const tx = db.transaction(this.DB_STORE),
                dbStore = tx.objectStore(this.DB_STORE);

              return dbStore.get(parseInt(id));
            })
            .then(restaurant => resolve(restaurant))
            .catch(error => reject(error));
        });
    });
  }

  static fetchRestaurantReviews(id, callback) {
    fetch(`${DBHelper.DATABASE_URL}/reviews?restaurant_id=${id}`)
      .then(this._validateResponse)
      .then(this._readResponseAsJSON)
      .then(result => {
        this.DB.then(db => {
          const tx = db.transaction(this.DB_REVIEWS_STORE, 'readwrite'),
                dbStore = tx.objectStore(this.DB_REVIEWS_STORE);
          dbStore.put({ id: parseInt(id), reviews: result });
        });
        callback(null, result);
      })
      .catch(error => {
        this.DB
          .then(db => {
            const tx = db.transaction(this.DB_REVIEWS_STORE),
                  dbStore = tx.objectStore(this.DB_REVIEWS_STORE);

            return dbStore.get(parseInt(id));
          })
          .then(result => callback(null, result.reviews))
          .catch(() => callback('No reviews yet!', null));
      });
  }

  static postRestaurantReview(review) {
    return new Promise((resolve, reject) => {
      fetch(`${DBHelper.DATABASE_URL}/reviews`, {
        method: 'POST',
        body: review
      })
      .then(this._validateResponse)
      .then(this._readResponseAsJSON)
      .then(result => {
        resolve(result);
      })
      .catch(error => {
        reject(error);
      });
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(cuisine, neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != 'all') {
          // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != 'all') {
          // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map((v, i) => restaurants[i].neighborhood);
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter((v, i) => neighborhoods.indexOf(v) == i);
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter((v, i) => cuisines.indexOf(v) == i);
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant srcset image URL.
   */
  static imageSrcSetUrlForRestaurant(restaurant) {
    const finfo = restaurant.photograph ? restaurant.photograph.split(/\./) : [restaurant.id, 'jpg'];
    return `/img_dist/${finfo[0]}-660_2x.webp 2x, /img_dist/${finfo[0]}-330_1x.webp,
      /img_dist/${finfo[0]}-660_2x.${finfo[1] || 'jpg'} 2x, /img_dist/${finfo[0]}-330_1x.${finfo[1] || 'jpg'}`;
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    const finfo = restaurant.photograph ? restaurant.photograph.split(/\./) : [restaurant.id, 'jpg'];
    return `/img/${finfo[0]}.${finfo[1] || 'jpg'}`;
  }

  static imageSrcSetUrlForReviewPage(restaurant) {
    const finfo = restaurant.photograph ? restaurant.photograph.split(/\./) : [restaurant.id, 'jpg'];
    return `/img_dist/${finfo[0]}.webp 800w, /img_dist/${finfo[0]}-660_2x.webp 660w, /img_dist/${finfo[0]}-330_1x.webp 330w,
      /img/${finfo[0]}.${finfo[1] || 'jpg'} 800w, /img_dist/${finfo[0]}-660_2x.${finfo[1] || 'jpg'} 660w, /img_dist/${finfo[0]}-330_1x.${finfo[1] || 'jpg'} 330w`;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }
}
