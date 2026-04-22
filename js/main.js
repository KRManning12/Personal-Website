/* ============================================================
   Kenny Manning — Personal Brand Site
   main.js — hero accordion behavior
   ============================================================ */

(function () {
  var panels = document.querySelectorAll('.accordion-panel');

  if (!panels.length) return;

  function setActive(panel) {
    panels.forEach(function (item) {
      item.classList.toggle('is-active', item === panel);
    });
  }

  panels.forEach(function (panel, index) {
    panel.addEventListener('mouseenter', function () {
      if (window.innerWidth > 980) {
        setActive(panel);
      }
    });

    panel.addEventListener('focus', function () {
      setActive(panel);
    });

    panel.addEventListener('click', function (event) {
      var interactiveChild = event.target.closest('a');
      if (interactiveChild) return;
      setActive(panel);
    });

    panel.addEventListener('keydown', function (event) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        setActive(panel);
      }

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault();
        var nextIndex = (index + 1) % panels.length;
        panels[nextIndex].focus();
        setActive(panels[nextIndex]);
      }

      if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault();
        var prevIndex = (index - 1 + panels.length) % panels.length;
        panels[prevIndex].focus();
        setActive(panels[prevIndex]);
      }
    });
  });
})();

(function () {
  var timeline = document.querySelector('[data-timeline]');

  if (!timeline) return;

  var items = Array.prototype.slice.call(timeline.querySelectorAll('[data-timeline-item]'));
  if (!items.length) return;

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    items.forEach(function (item) {
      item.classList.add('is-visible');
    });
    return;
  }

  timeline.classList.add('is-enhanced');

  var lastScrollY = window.scrollY || window.pageYOffset || 0;
  var timers = new WeakMap();

  function clearRevealTimer(item) {
    var timer = timers.get(item);
    if (timer) {
      window.clearTimeout(timer);
      timers.delete(item);
    }
  }

  var observer = new IntersectionObserver(function (entries) {
    var currentScrollY = window.scrollY || window.pageYOffset || 0;
    var scrollingDown = currentScrollY >= lastScrollY;
    lastScrollY = currentScrollY;

    entries.forEach(function (entry) {
      var item = entry.target;
      var index = items.indexOf(item);

      clearRevealTimer(item);

      if (!entry.isIntersecting) {
        item.classList.remove('is-visible');
        item.style.transitionDelay = '0ms';
        return;
      }

      var orderIndex = scrollingDown ? index : (items.length - 1 - index);
      var delay = Math.max(0, orderIndex) * 51;

      item.style.transitionDelay = delay + 'ms';

      var timer = window.setTimeout(function () {
        item.classList.add('is-visible');
        timers.delete(item);
      }, delay);

      timers.set(item, timer);
    });
  }, {
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.22
  });

  items.forEach(function (item) {
    observer.observe(item);
  });
})();
