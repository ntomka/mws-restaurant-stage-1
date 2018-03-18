class DBLoader {
  static _logError(error) {
    console.log('Looks like there was a problem: \n', error);
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

  static fetch(callBack) {
    fetch('/data/restaurants.json')
      .then(this._validateResponse)
      .then(this._readResponseAsJSON)
      .then(result => {
        callBack(result.restaurants);
      })
      .catch(this._logError);
  }
}

const appCaches = {
  static: 'restaurant-static-v2',
  images: 'restaurant-images-v2'
};

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(appCaches.static).then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/restaurant.html',
        '/css/styles.css',
        '/data/restaurants.json',
        '/js/dbhelper.js',
        '/js/main.js',
        '/js/restaurant_info.js'
      ]);
    })
  );

  // cache image assets dynamically
  event.waitUntil(
    caches.open(appCaches.images).then(function(cache) {
      DBLoader.fetch(restaurants => {
        for (const key in restaurants) {
          if (restaurants.hasOwnProperty(key)) {
            const restaurant = restaurants[key],
              finfo = restaurant.photograph.split(/\./);
            cache.add(`/img/${restaurant.photograph}`);
            cache.add(`/img_dist/${finfo[0]}-660_2x.${finfo[1]}`);
            cache.add(`/img_dist/${finfo[0]}-330_1x.${finfo[1]}`);
          }
        }
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith('restaurant-') && !(appCaches.static !== cacheName || appCaches.images !== cacheName)
            );
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener('fetch', function(event) {
  let requestUrl = new URL(event.request.url);

  if (requestUrl.origin === location.origin) {
    if (requestUrl.pathname === '/') {
      event.respondWith(caches.match('/index.html'));
      return;
    }
    if (requestUrl.pathname.startsWith('/img/') || requestUrl.pathname.startsWith('/img_dist/')) {
      event.respondWith(serveImg(event.request));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

function serveImg(request) {
  return caches.open(appCaches.images).then(function(cache) {
    return cache.match(request.url).then(function(response) {
      if (response) return response;

      return fetch(request).then(function(networkResponse) {
        cache.put(request.url, networkResponse.clone());
        return networkResponse;
      });
    });
  });
}
