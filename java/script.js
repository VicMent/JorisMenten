(() => {
  let started = false;

  const start = () => {
    if (started) {
      return;
    }
    started = true;

    const header = document.querySelector('[data-header]');
    const toggle = document.querySelector('[data-nav-toggle]');
    const nav = document.querySelector('[data-site-nav]');
    const lightbox = document.querySelector('[data-lightbox]');
    const lightboxImage = document.querySelector('[data-lightbox-image]');
    const lightboxCaption = document.querySelector('[data-lightbox-caption]');
    const lightboxClose = document.querySelector('[data-lightbox-close]');
    const heroCarousel = document.querySelector('[data-hero-carousel]');
    const heroSlides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const heroDots = document.querySelector('[data-hero-carousel-dots]');
    const heroPrev = document.querySelector('[data-hero-carousel-prev]');
    const heroNext = document.querySelector('[data-hero-carousel-next]');
    let heroIndex = 0;
    let heroTimer = null;

    const closeNav = () => {
      if (!toggle || !nav) return;
      nav.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
    };

    const dropdownParents = document.querySelectorAll('.nav-item--dropdown');
    dropdownParents.forEach((parent) => {
      const link = parent.querySelector(':scope > a');
      if (!link) return;
      link.addEventListener('click', (e) => {
        const isOpen = parent.classList.toggle('is-open');
        if (window.innerWidth <= 780) {
          e.preventDefault();
        }
      });
    });

    if (toggle && nav) {
      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      nav.querySelectorAll('a').forEach((link) => {
        if (link.parentElement.classList.contains('nav-item--dropdown')) {
          return;
        }
        link.addEventListener('click', closeNav);
      });
    }

    const syncHeaderState = () => {
      if (!header) return;
      header.classList.toggle('is-scrolled', window.scrollY > 12);
    };

    syncHeaderState();
    window.addEventListener('scroll', syncHeaderState, { passive: true });

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!prefersReducedMotion && 'IntersectionObserver' in window) {
      const revealObserver = new SmartObserver({
        mode: 'scaleUp',
        y: 20,
        scale: 0.96,
        stagger: 0.06,
        duration: 0.7,
        ease: 'power2.out',
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px',
      });
      revealObserver.observe('.reveal');
    } else {
      document.querySelectorAll('.reveal').forEach(function (target) {
        target.style.opacity = '1';
      });
    }

    const openLightbox = (src, caption) => {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;
      lightboxImage.src = src;
      lightboxImage.alt = caption || 'Geselecteerde afbeelding';
      lightboxCaption.textContent = caption || '';
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      if (!lightbox || !lightboxImage || !lightboxCaption) return;
      lightbox.classList.remove('is-open');
      lightboxImage.removeAttribute('src');
      lightboxImage.removeAttribute('alt');
      lightboxCaption.textContent = '';
      document.body.style.overflow = '';
    };

    document.addEventListener('click', (event) => {
      const trigger = event.target.closest('[data-lightbox-trigger]');
      if (!trigger) {
        return;
      }

      const img = trigger.querySelector('img');
      if (!img) {
        return;
      }

      openLightbox(img.src, img.alt || trigger.getAttribute('data-caption') || 'Project');
    });

    if (lightbox) {
      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) {
          closeLightbox();
        }
      });
    }

    if (lightboxClose) {
      lightboxClose.addEventListener('click', closeLightbox);
    }

    const setHeroSlide = (nextIndex) => {
      if (!heroSlides.length) return;
      heroIndex = (nextIndex + heroSlides.length) % heroSlides.length;
      heroSlides.forEach((slide, index) => {
        slide.classList.toggle('is-active', index === heroIndex);
      });

      if (heroDots) {
        heroDots.querySelectorAll('button').forEach((dot, index) => {
          dot.classList.toggle('is-active', index === heroIndex);
          dot.setAttribute('aria-current', index === heroIndex ? 'true' : 'false');
        });
      }
    };

    const restartHeroTimer = () => {
      if (heroTimer) window.clearInterval(heroTimer);
      heroTimer = window.setInterval(() => setHeroSlide(heroIndex + 1), 4500);
    };

    const startHeroCarousel = () => {
      if (!heroCarousel || heroSlides.length < 2) return;

      if (heroDots) {
        heroDots.innerHTML = '';
        heroSlides.forEach((slide, index) => {
          const dot = document.createElement('button');
          dot.type = 'button';
          dot.setAttribute('aria-label', `Ga naar afbeelding ${index + 1}`);
          dot.addEventListener('click', () => {
            setHeroSlide(index);
            restartHeroTimer();
          });
          heroDots.appendChild(dot);
        });
      }

      if (heroPrev) {
        heroPrev.addEventListener('click', () => {
          setHeroSlide(heroIndex - 1);
          restartHeroTimer();
        });
      }

      if (heroNext) {
        heroNext.addEventListener('click', () => {
          setHeroSlide(heroIndex + 1);
          restartHeroTimer();
        });
      }

      heroCarousel.addEventListener('mouseenter', () => {
        if (heroTimer) window.clearInterval(heroTimer);
      });

      heroCarousel.addEventListener('mouseleave', () => {
        restartHeroTimer();
      });

      heroCarousel.addEventListener('touchstart', () => {
        if (heroTimer) window.clearInterval(heroTimer);
      }, { passive: true });

      heroCarousel.addEventListener('touchend', () => {
        restartHeroTimer();
      });

      setHeroSlide(0);
      restartHeroTimer();
    };

    const initHeroCarousel = () => {
      startHeroCarousel();
    };

    initHeroCarousel();
    document.addEventListener('cms:carousel-updated', initHeroCarousel);

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        closeNav();
        closeLightbox();
      }
    });
  };

  if (document.body?.dataset.cmsReady === '1') {
    start();
  } else {
    document.addEventListener('cms:ready', start, { once: true });
  }
})();
