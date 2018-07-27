import DBHelper from './dbhelper';

const appCaches = {
  static: 'restaurant-static-v4',
  images: 'restaurant-images-v2'
};

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(appCaches.static).then(function(cache) {
      return cache.addAll([
        '/index.html',
        '/restaurant.html',
        '/dist/styles.css',
        '/dist/main.js',
        '/dist/restaurant_info.js'
      ]);
    })
  );

  // cache image assets and restaurants dynamically
  event.waitUntil(
    caches.open(appCaches.images).then(function(cache) {
      DBHelper.fetchRestaurants((error, restaurants) => {
        cache.add(DBHelper.DATABASE_URL);
        for (const key in restaurants) {
          if (restaurants.hasOwnProperty(key)) {
            const restaurant = restaurants[key],
              finfo = restaurant.photograph ? restaurant.photograph.split(/\./) : [restaurant.id, 'jpg'];
            cache.add(`/img/${finfo[0]}.${finfo[1] || 'jpg'}`);
            cache.add(`/img_dist/${finfo[0]}-660_2x.${finfo[1] || 'jpg'}`);
            cache.add(`/img_dist/${finfo[0]}-330_1x.${finfo[1] || 'jpg'}`);
            cache.add(`/img_dist/${finfo[0]}.webp`);
            cache.add(`/img_dist/${finfo[0]}-660_2x.webp`);
            cache.add(`/img_dist/${finfo[0]}-330_1x.webp`);
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
  // Let the browser do its default thing
  // for non-GET requests.
  if (event.request.method != 'GET') {
    return;
  }

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
    if (requestUrl.pathname.startsWith('/restaurant.html')) {
      event.respondWith(caches.match('/restaurant.html'));
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
