/**
 * Common database helper functions.
 */
export default class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    return 'http://localhost:1337/restaurants';
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

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    fetch(DBHelper.DATABASE_URL)
      .then(this._validateResponse)
      .then(this._readResponseAsJSON)
      .then(result => callback(null, result))
      .catch(error => callback(error, null));
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    fetch(`${DBHelper.DATABASE_URL}/${id}`)
      .then(this._validateResponse)
      .then(this._readResponseAsJSON)
      .then(result => callback(null, result))
      .catch(error => callback('Restaurant does not exist', null));
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
    return `/img_dist/${finfo[0]}-660_2x.${finfo[1] || 'jpg'} 2x, /img_dist/${finfo[0]}-330_1x.${finfo[1] || 'jpg'}`;
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
    return `/img/${finfo[0]}.${finfo[1] || 'jpg'} 800w, /img_dist/${finfo[0]}-660_2x.${finfo[1] || 'jpg'} 660w, /img_dist/${finfo[0]}-330_1x.${finfo[1] || 'jpg'} 330w`;
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
