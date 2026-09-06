// Page-scoped parallax trials for Application (masked image) and Product (whole group).
(function () {
  if (window.__etinpoParallaxInitialized) return;
  window.__etinpoParallaxInitialized = true;

  var items = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  if (!items.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var framePending = false;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function render() {
    framePending = false;
    var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    var isMobile = window.innerWidth < 768;

    items.forEach(function (item) {
      if (reduceMotion.matches) {
        item.style.setProperty('--etinpo-parallax-y', '0px');
        return;
      }

      var rect = item.getBoundingClientRect();
      var travel = Number(item.getAttribute(isMobile ? 'data-parallax-mobile' : 'data-parallax-desktop')) || 0;
      var mode = item.getAttribute('data-parallax-mode') || 'viewport';
      var pageY = window.pageYOffset || document.documentElement.scrollTop || 0;
      var documentTop = rect.top + pageY;
      var offset;

      if (mode === 'from-top') {
        var speed = Number(item.getAttribute('data-parallax-speed')) || 0.18;
        offset = clamp((pageY - documentTop) * speed, 0, travel);
      } else if (mode === 'to-page-end' || mode === 'to-page-end-forward') {
        var start = Math.max(0, documentTop - viewportHeight);
        var documentHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
        var end = Math.max(start + 1, documentHeight - viewportHeight);
        var endProgress = clamp((pageY - start) / (end - start), 0, 1);
        offset = mode === 'to-page-end-forward' ? endProgress * travel : (endProgress - 0.5) * 2 * travel;
      } else if (mode === 'viewport-forward') {
        var forwardProgress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
        offset = forwardProgress * travel;
      } else {
        var progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
        offset = (progress - 0.5) * 2 * travel;
      }

      item.style.setProperty('--etinpo-parallax-y', offset.toFixed(2) + 'px');
    });
  }

  function requestRender() {
    if (framePending) return;
    framePending = true;
    window.requestAnimationFrame(render);
  }

  window.addEventListener('scroll', requestRender, { passive: true });
  window.addEventListener('resize', requestRender);
  window.addEventListener('load', requestRender, { once: true });

  if (typeof reduceMotion.addEventListener === 'function') {
    reduceMotion.addEventListener('change', requestRender);
  }

  requestRender();
})();
