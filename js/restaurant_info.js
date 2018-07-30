import DBHelper from './dbhelper';
import offlineForms from './OfflineForms';

self.map;

/**
 * Register serviceWorker
 */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js', { scope: '/' });
}

const loadMap = () => {
  if (typeof google !== 'undefined') {
    return;
  }

  const mapLoader = document.createElement('script');
  mapLoader.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyAPYV1tlwm9ftEe0p0cQWNeeXbptVadGXM&libraries=places&callback=initMap';

  const godefer = document.getElementsByTagName('head')[0];
  godefer.appendChild(mapLoader);

  document.getElementById('load-map-button').remove();
};

/**
 * Initialize Google map, called from HTML.
 */
window.initMap = () => {
  self.map = new google.maps.Map(document.getElementById('map'), {
    zoom: 16,
    center: self.restaurant.latlng,
    scrollwheel: false
  });
  DBHelper.mapMarkerForRestaurant(self.restaurant, self.map);
  document
    .getElementById('map-container')
    .setAttribute('aria-label', `Map with ${self.restaurant.name} restaurant location`);
};

document.addEventListener('DOMContentLoaded', function(event) {
  document.getElementById('load-map-button').onclick = loadMap;

  fetchRestaurantFromURL((error, restaurant) => {
    if (error) {
      // Got an error!
      console.error(error);
    } else {
      fillBreadcrumb();
    }
  });
});

/**
 * Get current restaurant from page URL.
 */
const fetchRestaurantFromURL = callback => {
  if (self.restaurant) {
    // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) {
    // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
    DBHelper.fetchRestaurantReviews(id, (error, reviews) => {
      if (!reviews) {
        console.error(error);
        return;
      }
      // fill reviews
      fillReviewsHTML(reviews);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
const fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;
  name.setAttribute('aria-label', `${restaurant.name} restaurant`);

  const address = document.getElementById('restaurant-address');
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.src = DBHelper.imageUrlForRestaurant(restaurant);
  image.srcset = DBHelper.imageSrcSetUrlForReviewPage(restaurant);
  image.alt = `${restaurant.name} restaurant`;

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
const fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  hours.setAttribute('aria-label', `Operating hours of ${self.restaurant.name} restaurant`);
  for (const key in operatingHours) {
    if (operatingHours.hasOwnProperty(key)) {
      const row = document.createElement('tr');

      const day = document.createElement('td');
      day.innerHTML = key;
      row.appendChild(day);

      const time = document.createElement('td');
      time.innerHTML = operatingHours[key];
      row.appendChild(time);

      hours.appendChild(row);
    }
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
const fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const reviewFormContainer = document.getElementById('review-form-container');
  const addReviewButton = document.getElementById('add-review-button');
  const reviewFormSaveButton = document.getElementById('review-form-save-button');
  const reviewForm = document.getElementById('review-form');

  addReviewButton.addEventListener('click', () => {
    reviewFormContainer.classList.toggle('hidden');
  });

  reviewFormSaveButton.addEventListener('click', (e) => {
    e.preventDefault();

    const formData = new FormData(reviewForm);

    formData.set('restaurant_id', self.restaurant.id);

    reviewForm.classList.add('progress');

    offlineForms
      .submit('postRestaurantReview', formData)
      .then(resultReview => {
        reviewFormContainer.classList.toggle('hidden');

        reviewForm.name.value = '';
        reviewForm.rating.value = 5;
        reviewForm.comments.value = '';

        ul.appendChild(createReviewHTML(resultReview));

        document.getElementById(`review-${resultReview.id}`).scrollIntoView();

        reviewForm.classList.remove('progress');
      })
      .catch(() => {
        reviewForm.name.value = '';
        reviewForm.rating.value = 5;
        reviewForm.comments.value = '';

        reviewForm.classList.remove('progress');
      });

    return false;
  });

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
};

/**
 * Create review HTML and add it to the webpage.
 */
const createReviewHTML = review => {
  const li = document.createElement('li');

  li.id = `review-${review.id}`;

  const title = document.createElement('div');
  title.className = 'review-title';

  const name = document.createElement('div');
  name.innerHTML = review.name;
  name.className = 'review-user-name';
  title.appendChild(name);

  const date = document.createElement('div');
  date.innerHTML = new Date(review.createdAt).toLocaleDateString(navigator.language || 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  date.className = 'review-date';
  title.appendChild(date);

  li.appendChild(title);

  const rating = document.createElement('div');
  rating.innerHTML = `Rating: ${review.rating}`;
  rating.className = 'review-rating';
  li.appendChild(rating);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
const fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  const a = document.createElement('a');
  a.href = DBHelper.urlForRestaurant(restaurant);
  a.title = restaurant.name;
  a.innerHTML = restaurant.name;
  a.setAttribute('aria-current', 'page');
  li.appendChild(a);
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
const getParameterByName = (name, url) => {
  if (!url) {
    url = window.location.href;
  }

  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);

  if (!results) {
    return null;
  }

  if (!results[2]) {
    return '';
  }

  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};
