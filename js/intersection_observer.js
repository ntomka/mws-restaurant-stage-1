let elements;

const createObserver = () => {
  var observer;

  var options = {
    root: null,
    rootMargin: '0px',
    threshold: 1.0
  };

  observer = new IntersectionObserver(handleIntersect, options);
  elements.forEach(element => observer.observe(element));
};

const handleIntersect = (entries, observer) => {
  entries.forEach(function(entry) {
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

export default function() {
  elements = document.querySelectorAll('source[data-srcset], img[data-src]');

  createObserver();
}
