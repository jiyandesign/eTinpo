// eTINPO shared interactions — initialized once even when a page loads this file more than once.
(function () {
  if (window.__etinpoAllInitialized) return;
  window.__etinpoAllInitialized = true;

  function updateNavbarColors() {
    const navbar = document.getElementById('mainNavbar');
    if (!navbar) return;

    const dropdownMenus = document.querySelectorAll('.dropdown-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const dropdownItems = document.querySelectorAll('.dropdown-item');

    navbar.style.backgroundColor = '#004E42';
    navLinks.forEach(link => { link.style.color = '#fff'; });
    dropdownItems.forEach(link => { link.style.color = '#fff'; });
    dropdownMenus.forEach(menu => { menu.style.backgroundColor = '#004E42'; });

    const logoSVG = document.querySelector('#logoSVG');
    if (logoSVG) {
      logoSVG.querySelectorAll('.cls-1').forEach(path => { path.style.fill = '#fff'; });
    }
  }

  function initSwipers() {
    if (!window.Swiper) return;

    document.querySelectorAll('.swiper').forEach(swiperEl => {
      // Swiper stores the instance on the element. Do not initialize the same carousel twice.
      if (swiperEl.swiper) return;

      const section = swiperEl.closest('section, .functionSwiper');
      const isLeadProductCarousel = Boolean(swiperEl.closest('.productSwiper'));
      const nextEl = swiperEl.querySelector('.swiper-button-next');
      const prevEl = swiperEl.querySelector('.swiper-button-prev');

      // The lead Product carousel has four unique items but displays three at
      // once on desktop. Swiper 9 needs more than one viewport of slides to
      // keep both loop edges filled, so add one semantic-hidden repeat set.
      if (isLeadProductCarousel && !swiperEl.dataset.loopFilled) {
        const wrapper = swiperEl.querySelector(':scope > .swiper-wrapper');
        const originals = wrapper ? Array.from(wrapper.children) : [];
        if (wrapper && originals.length === 4) {
          originals.forEach(slide => {
            const repeat = slide.cloneNode(true);
            repeat.dataset.etinpoLoopCopy = 'true';
            repeat.setAttribute('aria-hidden', 'true');
            wrapper.appendChild(repeat);
          });
        }
        swiperEl.dataset.loopFilled = 'true';
      }

      new window.Swiper(swiperEl, {
        centeredSlides: true,
        // A real loop keeps cloned slides on both sides, so the first/last
        // transition never exposes an empty slot.
        loop: true,
        loopAdditionalSlides: isLeadProductCarousel ? 4 : 3,
        loopPreventsSliding: false,
        watchSlidesProgress: true,
        spaceBetween: 30,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        navigation: {
          nextEl: nextEl || (section && section.querySelector('.swiper-button-next')),
          prevEl: prevEl || (section && section.querySelector('.swiper-button-prev'))
        },
        breakpoints: {
          768: {
            slidesPerView: 1,
            centeredSlides: false
          },
          1024: {
            slidesPerView: 3,
            slidesPerGroup: 1
          }
        },
        touchStartPreventDefault: false,
        preventClicks: false,
        preventClicksPropagation: false
      });
    });
  }

  function init() {
    updateNavbarColors();
    initSwipers();
  }

  window.addEventListener('scroll', updateNavbarColors, { passive: true });
  window.addEventListener('resize', updateNavbarColors);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }

  // Swiper can load after this file because some pages insert scripts dynamically.
  window.addEventListener('load', initSwipers, { once: true });
})();
