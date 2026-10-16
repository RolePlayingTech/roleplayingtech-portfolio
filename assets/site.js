(function () {
  var root = document.documentElement;
  var items = document.querySelectorAll('.reveal');
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function showAll() {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  }

  if (reduce || !('IntersectionObserver' in window)) {
    showAll();
    return;
  }

  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var duration = 1600;
    var start = null;
    function step(now) {
      if (start === null) start = now;
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('[data-count]').forEach(countUp);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(function (el) { observer.observe(el); });
  root.classList.add('js-ready');
})();
