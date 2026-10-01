(() => {
  const PAGE = getPageName();
  const state = {
    content: null,
    admin: false,
    library: [],
    csrfToken: '',
    modal: null,
    productModal: null,
    toolbar: null,
    currentTarget: null,
  };

  const PAGE_BINDINGS = {
    index: {
      meta: {
        title: 'pages.index.meta.title',
        description: 'pages.index.meta.description',
      },
      singles: [
        { selector: '.hero-copy .eyebrow', path: 'pages.index.hero.eyebrow', type: 'text' },
        { selector: '.hero-copy h1', path: 'pages.index.hero.title', type: 'text' },
        { selector: '.hero-copy p', path: 'pages.index.hero.lead', type: 'text' },
        { selector: '.hero-actions .button-primary', path: 'pages.index.hero.ctas.0', type: 'link' },
        { selector: '.hero-actions .button-secondary', path: 'pages.index.hero.ctas.1', type: 'link' },
        { selector: '#featured .section-head .section-kicker', path: 'pages.index.featured.kicker', type: 'text' },
        { selector: '#featured .section-head .section-title', path: 'pages.index.featured.title', type: 'text' },
        { selector: '#featured .section-head .section-intro', path: 'pages.index.featured.lead', type: 'text' },
      ],
      images: [
        { selector: '.brand-mark', path: 'shared.brand.logo', type: 'image' },
        { selector: '#aanpak .showcase-image', path: 'pages.index.approach.image', type: 'background' },
        { selector: '#featured .featured-hero-block', path: 'pages.index.featured.heroProject', type: 'image' },
      ],
      collections: [
        {
          selector: '.hero-slide',
          path: 'pages.index.hero.carousel',
          containerSelector: '[data-hero-carousel-track]',
          addButtonSelector: '.hero-carousel-ui',
          addLabel: 'Beeld',
          defaultItem: { src: 'images/garage.jpg', alt: 'Nieuw carousselbeeld' },
          fields: [
            { selector: 'img', type: 'image', source: 'src', altSource: 'alt' },
          ],
          itemLabel: 'Carrouselbeeld',
        },
        {
          selector: '.trust-bar-item',
          path: 'pages.index.trust.stats',
          fields: [
            { selector: 'strong', type: 'text', source: 'value' },
            { selector: 'span', type: 'text', source: 'label' },
          ],
          itemLabel: 'Vertrouwensstatistiek',
        },
        {
          selector: '.service-band',
          path: 'pages.index.services',
          layoutField: 'layout',
          fields: [
            { selector: '.service-band-media', type: 'background', source: 'image' },
            { selector: '.card-tag', type: 'text', source: 'eyebrow' },
            { selector: 'h3', type: 'text', source: 'title' },
            { selector: 'p', type: 'text', source: 'description' },
            { selector: '.info-pill', type: 'text', source: 'badge' },
            { selector: '.link-pill', type: 'link', labelSource: 'linkLabel', hrefSource: 'linkHref' },
          ],
          itemLabel: 'Dienstband',
        },
        {
          selector: '.compact-service',
          path: 'pages.index.compactServices',
          fields: [
            { selector: 'h4', type: 'text', source: 'title' },
            { selector: 'p', type: 'text', source: 'description' },
            { selector: '.link-pill', type: 'link', labelSource: 'linkLabel', hrefSource: 'linkHref' },
          ],
          itemLabel: 'Compacte dienst',
        },
        {
          selector: '#aanpak .split-copy li',
          path: 'pages.index.approach.bullets',
          fields: [
            { selector: ':scope', type: 'text', source: 'value' },
          ],
          itemLabel: 'Bullet',
        },
        {
          selector: '#featured .featured-duo .featured-block',
          path: 'pages.index.featured.projects',
          containerSelector: '#featured .featured-duo',
          addButtonSelector: '#featured .featured-duo',
          addLabel: 'Project',
          defaultItem: {
            src: 'images/projecten/3.jpg',
            alt: 'Nieuw project',
            title: 'Nieuw project',
            caption: 'Korte beschrijving van de realisatie.',
          },
          fields: [
            { selector: 'img', type: 'image', source: 'src', altSource: 'alt' },
            { selector: '.gallery-overlay strong', type: 'text', source: 'title' },
            { selector: '.gallery-overlay span', type: 'text', source: 'caption' },
          ],
          itemLabel: 'Uitgelicht project',
        },
        {
          selector: '.contact-card',
          path: 'pages.index.contact.cards',
          fields: [
            { selector: 'h3', type: 'text', source: 'title' },
            { selector: 'p', type: 'contact', source: 'text' },
          ],
          itemLabel: 'Contactkaart',
        },
      ],
      extra: [
        { selector: '#producten .section-head .section-kicker', path: 'pages.index.servicesSection.kicker', type: 'text' },
        { selector: '#producten .section-head .section-title', path: 'pages.index.servicesSection.title', type: 'text' },
        { selector: '#producten .section-head .section-intro', path: 'pages.index.servicesSection.lead', type: 'text' },
        { selector: '#aanpak .section-kicker', path: 'pages.index.approach.kicker', type: 'text' },
        { selector: '#aanpak h2', path: 'pages.index.approach.title', type: 'text' },
        { selector: '#aanpak p', path: 'pages.index.approach.lead', type: 'text' },
        { selector: '.featured-hero-block .gallery-overlay strong', path: 'pages.index.featured.heroProject.title', type: 'text' },
        { selector: '.featured-hero-block .gallery-overlay span', path: 'pages.index.featured.heroProject.caption', type: 'text' },
        { selector: '#featured .hero-actions .button-primary', path: 'pages.index.featured.ctas.0', type: 'link' },
        { selector: '#featured .hero-actions .button-secondary', path: 'pages.index.featured.ctas.1', type: 'link' },
        { selector: '#contact .section-kicker', path: 'pages.index.contact.kicker', type: 'text' },
        { selector: '#contact .section-title', path: 'pages.index.contact.title', type: 'text' },
        { selector: '#contact .section-intro', path: 'pages.index.contact.lead', type: 'text' },
      ],
      footer: {
        brandSelectors: [
          { selector: 'footer .footer-top .brand-copy span', path: 'pages.index.footer.brandLine' },
          { selector: 'footer .footer-links a:nth-child(1)', path: 'pages.index.footer.links.0' },
          { selector: 'footer .footer-links a:nth-child(2)', path: 'pages.index.footer.links.1' },
          { selector: 'footer .footer-links a:nth-child(3)', path: 'pages.index.footer.links.2' },
        ],
      },
    },
    projecten: {
      meta: {
        title: 'pages.projecten.meta.title',
        description: 'pages.projecten.meta.description',
      },
      singles: [
        { selector: '.page-hero-content .eyebrow', path: 'pages.projecten.hero.eyebrow', type: 'text' },
        { selector: '.page-hero-content h1', path: 'pages.projecten.hero.title', type: 'text' },
        { selector: '.page-hero-content p', path: 'pages.projecten.hero.lead', type: 'text' },
        { selector: '.page-hero-content .hero-actions .button-primary', path: 'pages.projecten.hero.ctas.0', type: 'link' },
        { selector: '.page-hero-content .hero-actions .button-secondary', path: 'pages.projecten.hero.ctas.1', type: 'link' },
        { selector: '#featured-projects .section-head .section-kicker', path: 'pages.projecten.featuredSection.kicker', type: 'text' },
        { selector: '#featured-projects .section-head .section-title', path: 'pages.projecten.featuredSection.title', type: 'text' },
        { selector: '#featured-projects .section-head .section-intro', path: 'pages.projecten.featuredSection.lead', type: 'text' },
        { selector: '#gallery .section-head .section-kicker', path: 'pages.projecten.gallerySection.kicker', type: 'text' },
        { selector: '#gallery .section-head .section-title', path: 'pages.projecten.gallerySection.title', type: 'text' },
        { selector: '#gallery .section-head .section-intro', path: 'pages.projecten.gallerySection.lead', type: 'text' },
      ],
      images: [
        { selector: '.brand-mark', path: 'shared.brand.logo', type: 'image' },
        { selector: '#featured-projects .featured-hero-block', path: 'pages.projecten.featuredProjects.hero', type: 'image' },
        { selector: '.page-hero--bleed .page-hero-visual', path: 'pages.projecten.hero.image', type: 'background' },
      ],
      collections: [
        {
          selector: '.page-hero-content .kicker-row .pill',
          path: 'pages.projecten.hero.chips',
          fields: [
            { selector: ':scope', type: 'text', source: 'value' },
          ],
          itemLabel: 'Chip',
        },
        {
          selector: '#featured-projects .featured-duo .featured-block',
          path: 'pages.projecten.featuredProjects.projects',
          containerSelector: '#featured-projects .featured-duo',
          addButtonSelector: '#featured-projects .featured-duo',
          addLabel: 'Project',
          defaultItem: {
            src: 'images/projecten/4.jpg',
            alt: 'Nieuw project',
            title: 'Nieuw project',
            caption: 'Korte beschrijving van de realisatie.',
          },
          fields: [
            { selector: 'img', type: 'image', source: 'src', altSource: 'alt' },
            { selector: '.gallery-overlay strong', type: 'text', source: 'title' },
            { selector: '.gallery-overlay span', type: 'text', source: 'caption' },
          ],
          itemLabel: 'Uitgelicht project',
        },
        {
          selector: '.editorial-block',
          path: 'pages.projecten.gallery',
          layoutField: 'layout',
          fields: [
            { selector: 'img', type: 'image', source: 'src', altSource: 'alt' },
            { selector: '.gallery-overlay strong', type: 'text', source: 'title' },
            { selector: '.gallery-overlay span', type: 'text', source: 'caption' },
          ],
          itemLabel: 'Galerijfoto',
        },
      ],
      extra: [
        { selector: '#featured-projects .featured-hero-block .gallery-overlay strong', path: 'pages.projecten.featuredProjects.hero.title', type: 'text' },
        { selector: '#featured-projects .featured-hero-block .gallery-overlay span', path: 'pages.projecten.featuredProjects.hero.caption', type: 'text' },
        { selector: '#closing .section-kicker', path: 'pages.projecten.closing.kicker', type: 'text' },
        { selector: '#closing .split-copy h2', path: 'pages.projecten.closing.title', type: 'text' },
        { selector: '#closing .split-copy p', path: 'pages.projecten.closing.lead', type: 'text' },
        { selector: '.quote-card h3', path: 'pages.projecten.closing.contactCard.title', type: 'text' },
        { selector: '.quote-card p', path: 'pages.projecten.closing.contactCard.text', type: 'text' },
        { selector: '.quote-card .button-primary', path: 'pages.projecten.closing.cta', type: 'link' },
      ],
      footer: {
        brandSelectors: [
          { selector: 'footer .footer-top .brand-copy span', path: 'pages.projecten.footer.brandLine' },
          { selector: 'footer .footer-links a:nth-child(1)', path: 'pages.projecten.footer.links.0' },
          { selector: 'footer .footer-links a:nth-child(2)', path: 'pages.projecten.footer.links.1' },
          { selector: 'footer .footer-links a:nth-child(3)', path: 'pages.projecten.footer.links.2' },
        ],
      },
    },
  };

  function buildProductBindings(slug) {
    const svc = `service-${slug}`;
    return {
      meta: {
        title: `pages.${slug}.meta.title`,
        description: `pages.${slug}.meta.description`,
      },
      singles: [
        { selector: '.page-hero-content .eyebrow', path: `pages.${slug}.hero.eyebrow`, type: 'text' },
        { selector: '.page-hero-content h1', path: `pages.${slug}.hero.title`, type: 'text' },
        { selector: '.page-hero-content p', path: `pages.${slug}.hero.lead`, type: 'text' },
        { selector: '.page-hero-content .hero-actions .button-primary', path: `pages.${slug}.hero.ctas.0`, type: 'link' },
        { selector: '.page-hero-content .hero-actions .button-secondary', path: `pages.${slug}.hero.ctas.1`, type: 'link' },
        { selector: '.statement-caption strong', path: `pages.${slug}.statement.title`, type: 'text' },
        { selector: '.statement-caption span', path: `pages.${slug}.statement.caption`, type: 'text' },
        { selector: '#benefits .section-kicker', path: `pages.${slug}.benefitsSection.kicker`, type: 'text' },
        { selector: '#benefits .section-title', path: `pages.${slug}.benefitsSection.title`, type: 'text' },
        { selector: '#benefits .section-intro', path: `pages.${slug}.benefitsSection.lead`, type: 'text' },
        { selector: '#approach .section-kicker', path: `pages.${slug}.approach.kicker`, type: 'text' },
        { selector: '#approach h2', path: `pages.${slug}.approach.title`, type: 'text' },
        { selector: '#approach p', path: `pages.${slug}.approach.lead`, type: 'text' },
      ],
      images: [
        { selector: '.brand-mark', path: 'shared.brand.logo', type: 'image' },
        { selector: `.page-hero--bleed .page-hero-visual.${svc}`, path: `pages.${slug}.hero.image`, type: 'background' },
        { selector: `.statement-image.${svc}`, path: `pages.${slug}.statement.image`, type: 'background' },
        { selector: `#benefits .benefit-band-media.${svc}`, path: `pages.${slug}.benefitsSection.image`, type: 'background' },
        { selector: '#approach .benefit-band-media', path: `pages.${slug}.approach.image`, type: 'background' },
      ],
      collections: [
        {
          selector: '.page-hero-content .kicker-row .pill',
          path: `pages.${slug}.hero.chips`,
          fields: [
            { selector: ':scope', type: 'text', source: 'value' },
          ],
          itemLabel: 'Chip',
        },
        {
          selector: '#benefits .benefit-list li',
          path: `pages.${slug}.benefits`,
          fields: [
            { selector: ':scope', type: 'text', source: 'value' },
          ],
          itemLabel: 'Voordeel',
        },
        {
          selector: '#approach .benefit-list li',
          path: `pages.${slug}.approach.bullets`,
          fields: [
            { selector: ':scope', type: 'text', source: 'value' },
          ],
          itemLabel: 'Bullet',
        },
      ],
      extra: [
        { selector: '#closing .section-kicker', path: `pages.${slug}.closing.kicker`, type: 'text' },
        { selector: '#closing .section-title', path: `pages.${slug}.closing.title`, type: 'text' },
        { selector: '#closing .section-intro', path: `pages.${slug}.closing.lead`, type: 'text' },
        { selector: '#closing .hero-actions .button-primary', path: `pages.${slug}.closing.ctas.0`, type: 'link' },
        { selector: '#closing .hero-actions .button-secondary', path: `pages.${slug}.closing.ctas.1`, type: 'link' },
      ],
      footer: {
        brandSelectors: [
          { selector: 'footer .footer-top .brand-copy span', path: `pages.${slug}.footer.brandLine` },
          { selector: 'footer .footer-links a:nth-child(1)', path: `pages.${slug}.footer.links.0` },
          { selector: 'footer .footer-links a:nth-child(2)', path: `pages.${slug}.footer.links.1` },
          { selector: 'footer .footer-links a:nth-child(3)', path: `pages.${slug}.footer.links.2` },
        ],
      },
    };
  }

  function renderProductNav() {
    const products = getPath(state.content, 'shared.products', []);
    const navContainers = document.querySelectorAll('[data-cms-nav-products]');
    if (navContainers.length === 0) {
      return;
    }

    navContainers.forEach((container) => {
      container.innerHTML = '';
      container.classList.toggle('is-empty', !Array.isArray(products) || products.length === 0);

      if (!Array.isArray(products) || products.length === 0) {
        container.textContent = 'Geen producten beschikbaar';
        return;
      }

      const megaMenu = document.createElement('div');
      megaMenu.className = 'nav-mega-menu';
      
      products.forEach((product) => {
        if (!product || !product.slug) {
          return;
        }
        
        if (product.category && product.subcategories && product.subcategories.length > 0) {
          // Category with subcategories
          const categoryCol = document.createElement('div');
          categoryCol.className = 'mega-menu-column';
          
          const categoryHeader = document.createElement('div');
          categoryHeader.className = 'mega-menu-category-header';
          
          const categoryLink = document.createElement('a');
          categoryLink.href = `${product.slug}.html`;
          categoryLink.textContent = product.navLabel || product.name;
          categoryHeader.appendChild(categoryLink);
          
          categoryCol.appendChild(categoryHeader);
          
          const subList = document.createElement('ul');
          subList.className = 'mega-menu-sub-list';
          
          product.subcategories.forEach((sub) => {
            if (!sub || !sub.slug) return;
            
            const li = document.createElement('li');
            const subLink = document.createElement('a');
            subLink.href = `${product.slug}.html#${sub.slug}`;
            subLink.textContent = sub.name;
            subLink.setAttribute('data-description', sub.description || '');
            li.appendChild(subLink);
            
            // Add sub-subcategories if they exist
            if (sub.subcategories && sub.subcategories.length > 0) {
              const subSubList = document.createElement('ul');
              subSubList.className = 'mega-menu-sub-sub-list';
              
              sub.subcategories.forEach((subSub) => {
                if (!subSub || !subSub.slug) return;
                const subSubLi = document.createElement('li');
                const subSubLink = document.createElement('a');
                subSubLink.href = `${product.slug}.html#${subSub.slug}`;
                subSubLink.textContent = subSub.name;
                subSubLink.setAttribute('data-description', subSub.description || '');
                subSubLi.appendChild(subSubLink);
                subSubList.appendChild(subSubLi);
              });
              
              li.appendChild(subSubList);
              li.classList.add('has-sub-sub');

              const subToggle = document.createElement('button');
              subToggle.type = 'button';
              subToggle.className = 'mega-menu-sub-toggle';
              subToggle.setAttribute('aria-expanded', 'false');
              subToggle.setAttribute('aria-label', `Meer onder ${sub.name}`);
              subToggle.textContent = '';
              li.insertBefore(subToggle, subSubList);
            }
            
            subList.appendChild(li);
          });
          
          categoryCol.appendChild(subList);
          megaMenu.appendChild(categoryCol);
        } else {
          // Simple product link (fallback)
          const link = document.createElement('a');
          link.href = `${product.slug}.html`;
          link.textContent = product.navLabel || product.name;
          megaMenu.appendChild(link);
        }
      });
      
      container.appendChild(megaMenu);
    });
  }

  bootstrap();

  async function bootstrap() {
    try {
      const contentPayload = await loadContentPayload();
      const sessionPayload = await loadSessionPayload();
      state.content = contentPayload.content || contentPayload || {};
      state.admin = Boolean(sessionPayload.admin && new URLSearchParams(window.location.search).get('admin') === '1');
      state.csrfToken = sessionPayload.csrfToken || '';

      applyPageContent();
      if (state.admin) {
        await enableAdminMode();
      }

      document.body.dataset.cmsReady = '1';
      document.dispatchEvent(new CustomEvent('cms:ready', { detail: { admin: state.admin, content: state.content } }));
    } catch (error) {
      document.body.dataset.cmsReady = '1';
      document.dispatchEvent(new CustomEvent('cms:ready', { detail: { admin: false, content: null } }));
    }
  }

  async function loadContentPayload() {
    const sources = [
      { url: 'admin-api.php?action=content', init: { credentials: 'same-origin', cache: 'no-store' } },
      { url: 'data/site.json', init: { cache: 'no-store' } },
    ];

    for (const source of sources) {
      try {
        const response = await fetch(source.url, source.init);
        if (!response.ok) {
          console.warn(`[CMS] Contentbron gaf HTTP ${response.status}: ${source.url}`);
          continue;
        }
        const payload = await response.json();
        if (source.url.includes('admin-api.php') && (!payload || typeof payload.content !== 'object' || payload.content === null)) {
          console.warn(`[CMS] Contentbron bevat geen geldige content: ${source.url}`);
          continue;
        }
        return payload;
      } catch (error) {
        console.warn(`[CMS] Contentbron kon niet geladen worden: ${source.url}`, error);
      }
    }

    throw new Error('Content kon niet geladen worden.');
  }

  async function loadSessionPayload() {
    try {
      const response = await fetch('admin-api.php?action=session', { credentials: 'same-origin', cache: 'no-store' });
      if (response.ok) {
        return await response.json();
      }
    } catch {
      // Live Server does not expose the PHP session API.
    }

    return { admin: false, csrfToken: '' };
  }

  function getRequestHeaders() {
    return state.csrfToken ? { 'X-CSRF-Token': state.csrfToken } : {};
  }

  function getPageName() {
    const fileName = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const baseName = fileName.replace(/\.(html|php)$/i, '');
    return baseName === '' ? 'index' : baseName;
  }

  function getBindingPage() {
    if (PAGE_BINDINGS[PAGE]) {
      return PAGE_BINDINGS[PAGE];
    }

    const products = getPath(state.content, 'shared.products', []);
    if (Array.isArray(products)) {
      const product = products.find(p => p.slug === PAGE);
      if (product) {
        return buildProductBindings(PAGE);
      }
    }

    return null;
  }

  function getPath(source, path, fallback = '') {
    if (!source || !path) {
      return fallback;
    }

    const segments = path.split('.').filter(Boolean);
    let cursor = source;

    for (const segment of segments) {
      if (cursor == null || typeof cursor !== 'object' || !(segment in cursor)) {
        return fallback;
      }
      cursor = cursor[segment];
    }

    return cursor ?? fallback;
  }

  function setPath(source, path, value) {
    const segments = path.split('.').filter(Boolean);
    let cursor = source;

    segments.forEach((segment, index) => {
      const isLast = index === segments.length - 1;
      if (isLast) {
        cursor[segment] = value;
        return;
      }

      if (!(segment in cursor) || typeof cursor[segment] !== 'object' || cursor[segment] === null) {
        const nextIsIndex = !Number.isNaN(Number(segments[index + 1]));
        cursor[segment] = nextIsIndex ? [] : {};
      }

      cursor = cursor[segment];
    });
  }

  function updateMeta(title, description) {
    if (title) {
      document.title = title;
    }

    if (description) {
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.name = 'description';
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
  }

  function applyPageContent() {
    renderProductNav();

    const page = getBindingPage();
    if (!page || !state.content) {
      return;
    }

    updateMeta(getPath(state.content, page.meta.title), getPath(state.content, page.meta.description));

    const sharedLogo = getPath(state.content, 'shared.brand.logo');
    document.querySelectorAll('.brand-mark').forEach((image) => {
      if (sharedLogo) {
        image.setAttribute('src', sharedLogo);
      }
    });

    (page.singles || []).forEach((binding) => {
      const value = getPath(state.content, binding.path);
      const element = document.querySelector(binding.selector);
      if (!element || value == null) {
        return;
      }
      renderSingle(element, binding, value, binding.path);
    });

    (page.images || []).forEach((binding) => {
      const value = getPath(state.content, binding.path);
      const element = document.querySelector(binding.selector);
      if (!element || value == null) {
        return;
      }
      renderImageTarget(element, binding, value, binding.path);
    });

    (page.collections || []).forEach((binding) => {
      const items = getPath(state.content, binding.path, []);
      if (Array.isArray(items)) {
        renderCollection(binding, items);
      }
    });

    (page.extra || []).forEach((binding) => {
      const value = getPath(state.content, binding.path);
      const element = document.querySelector(binding.selector);
      if (!element || value == null) {
        return;
      }
      renderSingle(element, binding, value, binding.path);
    });

    if (page.footer) {
      (page.footer.brandSelectors || []).forEach((binding) => {
        const value = getPath(state.content, binding.path);
        const element = document.querySelector(binding.selector);
        if (!element || value == null) {
          return;
        }
        if (binding.selector.includes('.footer-links a') && element.tagName === 'A') {
          element.textContent = value.label || value;
          if (typeof value === 'object' && value.href) {
            element.setAttribute('href', value.href);
          }
          return;
        }
        renderSingle(element, { ...binding, type: 'text' }, value, binding.path);
      });
    }
  }

  function renderSingle(element, binding, value, path) {
    if (value == null) {
      return;
    }

    element.dataset.cmsPath = path;
    element.dataset.cmsType = binding.type || 'text';
    if (state.admin) {
      element.classList.add('cms-edit-target');
    }

    if (binding.type === 'link' && typeof value === 'object') {
      element.textContent = value.label || '';
      if (value.href) {
        element.setAttribute('href', value.href);
      }
      return;
    }

    if (binding.type === 'image' && typeof value === 'object') {
      renderImageTarget(element, binding, value, path);
      return;
    }

    if (binding.type === 'background' && typeof value === 'string') {
      renderBackgroundTarget(element, binding, value, path);
      return;
    }

    if (typeof value === 'object' && value !== null && 'label' in value && binding.type !== 'text') {
      element.textContent = value.label || '';
      if (element.tagName === 'A' && value.href) {
        element.setAttribute('href', value.href);
      }
      return;
    }

    element.textContent = String(value);
  }

  function renderImageTarget(element, binding, value, path) {
    if (element.tagName === 'IMG') {
      element.setAttribute('src', value.src || value);
      if (value.alt != null) {
        element.setAttribute('alt', value.alt);
      }
    } else {
      const target = element.querySelector('img');
      if (target) {
        target.setAttribute('src', value.src || value);
        if (value.alt != null) {
          target.setAttribute('alt', value.alt);
        }
      } else {
        element.style.backgroundImage = `url("${value.src || value}")`;
      }
    }

    element.dataset.cmsPath = path;
    element.dataset.cmsType = binding.type || 'image';
    if (state.admin) {
      element.classList.add('cms-edit-target');
    }
  }

  function renderBackgroundTarget(element, binding, value, path) {
    element.style.backgroundImage = `url("${value}")`;
    element.dataset.cmsPath = path;
    element.dataset.cmsType = binding.type || 'background';
    if (state.admin) {
      element.classList.add('cms-edit-target');
    }
  }

  function renderCollection(binding, items) {
    const existing = Array.from(document.querySelectorAll(binding.selector));
    const container = binding.containerSelector ? document.querySelector(binding.containerSelector) : (existing[0] && existing[0].parentElement);
    if (!container) {
      return;
    }

    const template = existing[0] || null;
    const targetCount = items.length;
    const currentCount = existing.length;

    if (targetCount > currentCount && template) {
      for (let index = currentCount; index < targetCount; index += 1) {
        const clone = template.cloneNode(true);
        clone.classList.remove('is-active');
        container.appendChild(clone);
        existing.push(clone);
      }
    }

    existing.forEach((node, index) => {
      if (index >= targetCount) {
        node.remove();
        return;
      }

      node.classList.toggle('is-active', binding.selector === '.hero-slide' && index === 0);

      const item = items[index] || {};
      node.dataset.cmsCollection = binding.path;
      node.dataset.cmsIndex = String(index);
      node.dataset.cmsType = 'collection';
      node.dataset.cmsItemLabel = binding.itemLabel || 'Item';
      if (state.admin) {
        node.classList.add('cms-edit-target');
      }
      renderCollectionItem(node, binding, item, index);
      if (state.admin) {
        injectEditButton(node, {
          kind: 'collection-item',
          binding,
          index,
          path: binding.path,
          item,
        });
      }
    });

    if (state.admin && binding.selector === '.hero-slide') {
      document.dispatchEvent(new CustomEvent('cms:carousel-updated'));
    }
  }

  function renderCollectionItem(node, binding, item, index) {
    binding.fields.forEach((field) => {
      const target = field.selector === ':scope' ? node : node.querySelector(field.selector);
      if (!target) {
        return;
      }

      const sourceValue = getFieldValue(item, field);
      if (field.type === 'link') {
        target.textContent = sourceValue.label || '';
        if (sourceValue.href) {
          target.setAttribute('href', sourceValue.href);
          if (node.tagName === 'A') {
            node.setAttribute('href', sourceValue.href);
            if (item.title) {
              node.setAttribute('aria-label', item.title);
            }
          }
        }
        return;
      }

      if (field.type === 'image') {
        if (target.tagName === 'IMG') {
          target.setAttribute('src', sourceValue.src || '');
          target.setAttribute('alt', sourceValue.alt || sourceValue.src || '');
        } else {
          const img = target.querySelector('img');
          if (img) {
            img.setAttribute('src', sourceValue.src || '');
            img.setAttribute('alt', sourceValue.alt || sourceValue.src || '');
          }
        }
        return;
      }

      if (field.type === 'background') {
        target.style.backgroundImage = `url("${sourceValue || ''}")`;
        return;
      }

      if (field.type === 'contact') {
        renderContactText(target, sourceValue);
        return;
      }

      target.textContent = String(sourceValue ?? '');
    });

    applyLayoutClasses(node, binding, item);
  }

  // Contactkaarten tonen een telefoonnummer of e-mailadres. Die moeten
  // klikbaar blijven, dus een tel:- of mailto:-link opbouwen in plaats van
  // de tekst plat te schrijven.
  function renderContactText(target, value) {
    const text = String(value ?? '').trim();
    target.textContent = '';

    if (!text) {
      return;
    }

    const parts = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
    parts.forEach((line, index) => {
      if (index > 0) {
        target.appendChild(document.createElement('br'));
      }
      target.appendChild(buildContactLine(line));
    });
  }

  function buildContactLine(line) {
    const phone = line.match(/^(\+?[\d\s().-]{7,}\d)$/);
    if (phone) {
      const digits = line.replace(/[^\d+]/g, '');
      const link = document.createElement('a');
      link.setAttribute('href', 'tel:' + digits);
      link.textContent = line;
      return link;
    }

    if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(line)) {
      const link = document.createElement('a');
      link.setAttribute('href', 'mailto:' + line);
      link.textContent = line;
      return link;
    }

    return document.createTextNode(line);
  }

  const LAYOUT_CLASSES = [
    'band-statement',
    'band-left',
    'band-right',
    'band-full',
    'layout-hero',
    'layout-wide',
    'layout-tall',
    'layout-standard',
  ];

  function applyLayoutClasses(node, binding, item) {
    if (!binding.layoutField || !item || typeof item !== 'object') {
      return;
    }

    const layout = item[binding.layoutField];
    if (!layout) {
      return;
    }

    LAYOUT_CLASSES.forEach((className) => node.classList.remove(className));
    node.classList.add(layout);
    node.dataset.layout = layout;
  }

  function getFieldValue(item, field) {
    if (typeof item === 'string') {
      return item;
    }

    if (field.type === 'link') {
      return {
        label: item[field.labelSource || 'label'] || '',
        href: item[field.hrefSource || 'href'] || '',
      };
    }

    if (field.type === 'image') {
      return {
        src: item[field.source || 'src'] || '',
        alt: item[field.altSource || 'alt'] || '',
      };
    }

    return item[field.source || 'value'] ?? '';
  }

  async function enableAdminMode() {
    patchLinksForAdmin();
    createToolbar();
    createModal();
    await fetchLibrary();
    document.body.classList.add('cms-admin-active');

    document.querySelectorAll('[data-cms-path], .cms-edit-target').forEach((element) => {
      const path = element.dataset.cmsPath;
      if (!path) {
        return;
      }
      injectEditButton(element, {
        kind: getElementKind(element),
        path,
        binding: null,
      });
    });

    (getBindingPage().collections || []).forEach((binding) => {
      if (binding.selector === '.hero-slide') {
        injectHeroCarouselControls(binding);
        return;
      }

      const container = binding.containerSelector
        ? document.querySelector(binding.containerSelector)
        : document.querySelector(binding.selector)?.parentElement;
      if (container) {
        injectAddButton(container, binding);
      }
    });
  }

  function patchLinksForAdmin() {
    document.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('javascript:') || href.startsWith('#')) {
        return;
      }

      try {
        const url = new URL(href, window.location.href);
        if (url.origin === window.location.origin) {
          url.searchParams.set('admin', '1');
          anchor.setAttribute('href', `${url.pathname}${url.search}${url.hash}`);
        }
      } catch {
        // Ignore malformed links.
      }
    });
  }

  function getElementKind(element) {
    if (element.dataset.cmsType) {
      return element.dataset.cmsType;
    }

    if (element.tagName === 'IMG') {
      return 'image';
    }

    if (element.tagName === 'A') {
      return 'link';
    }

    if (element.style && element.style.backgroundImage) {
      return 'background';
    }

    return 'text';
  }

  function injectEditButton(element, target) {
    if (!state.admin || element.querySelector(':scope > .cms-edit-button[data-cms-bound="1"]')) {
      return;
    }

    if (getComputedStyle(element).position === 'static') {
      element.classList.add('cms-edit-wrap');
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cms-edit-button';
    button.textContent = '✎';
    button.dataset.cmsBound = '1';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openEditor(target, element);
    });

    element.appendChild(button);
  }

  function injectAddButton(container, binding) {
    const anchor = binding.addButtonSelector
      ? document.querySelector(binding.addButtonSelector)
      : null;
    const host = anchor || container.parentElement || container;

    if (!state.admin || host.querySelector(`[data-cms-add-path="${binding.path}"]`)) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cms-add-button cms-add-inline';
    button.textContent = binding.addLabel ? `+ ${binding.addLabel}` : '+';
    button.dataset.cmsBound = '1';
    button.dataset.cmsAddPath = binding.path;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openEditor({
        kind: 'collection-add',
        binding,
        index: null,
        path: binding.path,
        item: binding.defaultItem ? { ...binding.defaultItem } : {},
      }, container);
    });

    if (anchor) {
      anchor.insertBefore(button, anchor.firstChild);
      return;
    }

    if (container.parentElement) {
      container.parentElement.insertBefore(button, container);
      return;
    }

    container.appendChild(button);
  }

  function injectHeroCarouselControls(binding) {
    if (document.querySelector('[data-cms-hero-carousel-bar="1"]')) {
      return;
    }

    const container = binding.containerSelector
      ? document.querySelector(binding.containerSelector)
      : document.querySelector(binding.selector)?.parentElement;
    if (!container) {
      return;
    }

    const openActiveSlideEditor = (event) => {
      event.preventDefault();
      event.stopPropagation();
      const slides = Array.from(document.querySelectorAll(binding.selector));
      const index = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
      const items = getPath(state.content, binding.path, []);
      openEditor({
        kind: 'collection-item',
        binding,
        index,
        path: binding.path,
        item: items[index] || {},
      }, slides[index] || slides[0]);
    };

    const bar = document.createElement('div');
    bar.className = 'cms-hero-carousel-bar';
    bar.dataset.cmsHeroCarouselBar = '1';

    const addButton = document.createElement('button');
    addButton.type = 'button';
    addButton.className = 'cms-hero-carousel-action';
    addButton.textContent = binding.addLabel ? `+ ${binding.addLabel}` : '+ Item';
    addButton.dataset.cmsBound = '1';
    addButton.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openEditor({
        kind: 'collection-add',
        binding,
        index: null,
        path: binding.path,
        item: binding.defaultItem ? { ...binding.defaultItem } : {},
      }, container);
    });

    const editButton = document.createElement('button');
    editButton.type = 'button';
    editButton.className = 'cms-hero-carousel-action';
    editButton.textContent = '✎ Beeld';
    editButton.dataset.cmsBound = '1';
    editButton.addEventListener('click', openActiveSlideEditor);

    bar.appendChild(addButton);
    bar.appendChild(editButton);
    document.body.appendChild(bar);
  }

  function createToolbar() {
    if (state.toolbar) {
      return;
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'cms-toolbar';
    toolbar.innerHTML = '<span class="cms-pill">Admin</span><span>Bewerkmodus</span>';

    const productsButton = document.createElement('button');
    productsButton.type = 'button';
    productsButton.textContent = 'Producten';
    productsButton.addEventListener('click', (e) => {
      e.preventDefault();
      openProductManager();
    });

    const logoutButton = document.createElement('button');
    logoutButton.type = 'button';
    logoutButton.textContent = 'Uitloggen';
    logoutButton.addEventListener('click', async () => {
      await fetch('admin-api.php?action=logout', {
        method: 'POST',
        credentials: 'same-origin',
        headers: getRequestHeaders(),
      });
      window.location.href = 'admin.php';
    });

    toolbar.appendChild(productsButton);
    toolbar.appendChild(logoutButton);
    document.body.appendChild(toolbar);
    state.toolbar = toolbar;
  }

  function createModal() {
    if (state.modal) {
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'cms-modal';
    modal.innerHTML = `
      <div class="cms-modal-card" role="dialog" aria-modal="true" aria-label="Content editor">
        <div class="cms-modal-head">
          <div class="cms-modal-title">
            <strong>Bewerk inhoud</strong>
            <span>Pas tekst, afbeeldingen of collectie-items aan</span>
          </div>
          <button type="button" class="cms-close">×</button>
        </div>
        <div class="cms-modal-body"></div>
        <div class="cms-modal-foot">
          <div class="cms-actions cms-modal-actions"></div>
        </div>
      </div>`;

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });

    modal.querySelector('.cms-close').addEventListener('click', closeModal);
    document.body.appendChild(modal);
    state.modal = modal;
  }

  async   function fetchLibrary() {
    try {
      const response = await fetch('admin-api.php?action=library', { credentials: 'same-origin' });
      const data = await response.json();
      state.library = data.images || [];
    } catch {
      state.library = [];
    }
  }

  function createProductModal() {
    if (state.productModal) {
      return;
    }

    const modal = document.createElement('div');
    modal.className = 'cms-modal';
    modal.innerHTML = `
      <div class="cms-modal-card" role="dialog" aria-modal="true" aria-label="Productbeheer">
        <div class="cms-modal-head">
          <div class="cms-modal-title">
            <strong>Productbeheer</strong>
            <span>Beheer de producten die in de site verschijnen</span>
          </div>
          <button type="button" class="cms-close" data-cms-product-close>×</button>
        </div>
        <div class="cms-modal-body">
          <div class="cms-product-list"></div>
        </div>
        <div class="cms-modal-foot">
          <div class="cms-actions cms-modal-actions"></div>
        </div>
      </div>
    `;

    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeProductModal();
      }
    });

    modal.querySelector('[data-cms-product-close]').addEventListener('click', closeProductModal);
    document.body.appendChild(modal);
    state.productModal = modal;
  }

  async function openProductManager() {
    createProductModal();
    await renderProductList();
    state.productModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeProductModal() {
    if (!state.productModal) {
      return;
    }
    state.productModal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  function getProductSlug() {
    const products = getPath(state.content, 'shared.products', []);
    return Array.isArray(products) ? products : [];
  }

  async function renderProductList() {
    const products = getProductSlug();
    const list = state.productModal.querySelector('.cms-product-list');
    list.innerHTML = '';

    if (products.length === 0) {
      list.innerHTML = '<p class="cms-note">Nog geen producten gedefinieerd.</p>';
    } else {
      products.forEach((product, index) => {
        const row = document.createElement('div');
        row.className = 'cms-product-row';
        row.innerHTML = `
          <div class="cms-product-info">
            <strong>${escapeHtml(product.slug)}</strong>
            <span>${escapeHtml(product.name || '')}</span>
            <small>${escapeHtml(product.navLabel || '')}</small>
          </div>
          <div class="cms-product-actions">
            <a href="${product.slug}.html?admin=1" class="button button-secondary cms-product-edit" style="padding:0.4rem 0.8rem;font-size:0.8rem;">Bewerken</a>
            <button type="button" class="cms-product-delete" data-slug="${escapeHtml(product.slug)}" style="padding:0.4rem 0.8rem;font-size:0.8rem;">Verwijderen</button>
          </div>
        `;
        list.appendChild(row);
      });

      list.querySelectorAll('.cms-product-delete').forEach((button) => {
        button.addEventListener('click', (e) => {
          e.preventDefault();
          const slug = e.currentTarget.dataset.slug;
          deleteProduct(slug);
        });
      });
    }

    const modalActions = state.productModal.querySelector('.cms-modal-actions');
    modalActions.innerHTML = '';

    const addButton = createActionButton('Product toevoegen', () => {
      const slug = prompt('Product slug (wordt gebruikt voor de bestandsnaam, bv. "zonwering"):');
      if (!slug) {
        return;
      }
      const name = prompt('Productnaam (bv. "Zonwering"):') || slug;
      const navLabel = prompt('Label in navigatie (bv. "Zonwering"):') || name;
      if (slug) {
        createProduct(slug.trim(), name.trim(), navLabel.trim());
      }
    }, 'primary');

    modalActions.appendChild(addButton);
  }

  async function createProduct(slug, name, navLabel) {
    const formData = new FormData();
    formData.append('slug', slug);
    formData.append('name', name);
    formData.append('navLabel', navLabel);
    formData.append('image', getPath(state.content, 'shared.brand.logo', 'images/garage.jpg'));

    const response = await fetch('admin-api.php?action=create-product', {
      method: 'POST',
      credentials: 'same-origin',
      headers: getRequestHeaders(),
      body: new URLSearchParams({
        slug,
        name,
        navLabel,
      }),
    });
    const data = await response.json();
    if (!data.ok) {
      alert(data.error || 'Product kon niet worden aangemaakt.');
      return;
    }

    Object.assign(state.content, data.content || {});
    renderProductNav();
    await renderProductList();
  }

  async function deleteProduct(slug) {
    if (!confirm(`Weet je zeker dat je "${slug}" wilt verwijderen? De pagina en alle inhoud worden verwijderd.`)) {
      return;
    }

    const response = await fetch('admin-api.php?action=delete-product', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { ...getRequestHeaders(), 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ slug }),
    });
    const data = await response.json();
    if (!data.ok) {
      alert(data.error || 'Product kon niet worden verwijderd.');
      return;
    }

    Object.assign(state.content, data.content || {});
    renderProductNav();
    await renderProductList();
  }

  function openEditor(target, referenceElement) {
    state.currentTarget = { ...target, referenceElement };
    const page = getBindingPage();
    const modalBody = state.modal.querySelector('.cms-modal-body');
    const modalActions = state.modal.querySelector('.cms-modal-actions');
    modalBody.innerHTML = '';
    modalActions.innerHTML = '';

    const title = state.modal.querySelector('.cms-modal-title strong');
    const subtitle = state.modal.querySelector('.cms-modal-title span');

    if (target.kind === 'collection-add') {
      title.textContent = 'Nieuw item toevoegen';
      subtitle.textContent = target.binding.itemLabel || 'Nieuw collectie-item';
      buildCollectionForm(modalBody, modalActions, target.binding, {}, null, true);
      openModal();
      return;
    }

    if (target.kind === 'collection-item') {
      title.textContent = `Bewerk ${target.binding.itemLabel || 'item'}`;
      subtitle.textContent = `Positie ${target.index + 1}`;
      buildCollectionForm(modalBody, modalActions, target.binding, target.item || {}, target.index, false);
      openModal();
      return;
    }

    const label = target.path || 'Veld';
    title.textContent = 'Bewerk inhoud';
    subtitle.textContent = label;

    if (target.kind === 'image' || target.kind === 'background') {
      buildImageEditor(modalBody, modalActions, target);
    } else if (target.kind === 'link') {
      buildLinkEditor(modalBody, modalActions, target);
    } else {
      buildTextEditor(modalBody, modalActions, target);
    }

    openModal();
  }

  function buildTextEditor(modalBody, modalActions, target) {
    const field = document.createElement('label');
    field.className = 'cms-field';
    field.innerHTML = `<span>Tekst</span>`;

    const input = document.createElement('textarea');
    input.value = getPath(state.content, target.path, '');
    field.appendChild(input);
    modalBody.appendChild(field);

    modalActions.appendChild(createActionButton('Opslaan', async () => {
      await saveField(target.path, input.value);
    }, 'primary'));
  }

  function buildLinkEditor(modalBody, modalActions, target) {
    const current = getPath(state.content, target.path, { label: '', href: '' });
    const labelField = document.createElement('label');
    labelField.className = 'cms-field';
    labelField.innerHTML = '<span>Tekst</span>';
    const labelInput = document.createElement('input');
    labelInput.type = 'text';
    labelInput.value = current.label || '';
    labelField.appendChild(labelInput);

    const hrefField = document.createElement('label');
    hrefField.className = 'cms-field';
    hrefField.innerHTML = '<span>Link</span>';
    const hrefInput = document.createElement('input');
    hrefInput.type = 'text';
    hrefInput.value = current.href || '';
    hrefField.appendChild(hrefInput);

    modalBody.appendChild(labelField);
    modalBody.appendChild(hrefField);

    modalActions.appendChild(createActionButton('Opslaan', async () => {
      await saveField(target.path, { label: labelInput.value, href: hrefInput.value });
    }, 'primary'));
  }

  function buildImageEditor(modalBody, modalActions, target) {
    const current = getPath(state.content, target.path, target.kind === 'background' ? '' : { src: '', alt: '' });
    const selectedSource = document.createElement('input');
    selectedSource.type = 'hidden';
    selectedSource.value = target.kind === 'background' ? String(current || '') : String(current.src || '');

    const preview = document.createElement('div');
    preview.className = 'cms-preview';
    preview.innerHTML = target.kind === 'background'
      ? `<div class="cms-note">Huidige afbeelding</div><img alt="" src="${escapeHtml(String(current || ''))}">`
      : `<div class="cms-note">Huidige afbeelding</div><img alt="" src="${escapeHtml(String(current.src || ''))}">`;
    modalBody.appendChild(preview);
    modalBody.appendChild(selectedSource);

    const currentLine = document.createElement('div');
    currentLine.className = 'cms-current-row';
    currentLine.innerHTML = `<span>Actief bestand</span><strong>${escapeHtml(selectedSource.value || 'Geen afbeelding gekozen')}</strong>`;
    modalBody.appendChild(currentLine);

    const pickerTabs = document.createElement('div');
    pickerTabs.className = 'cms-media-tabs';

    const existingTabButton = document.createElement('button');
    existingTabButton.type = 'button';
    existingTabButton.className = 'is-active';
    existingTabButton.textContent = 'Bestaande afbeeldingen';

    const uploadTabButton = document.createElement('button');
    uploadTabButton.type = 'button';
    uploadTabButton.textContent = 'Uploaden';

    pickerTabs.appendChild(existingTabButton);
    pickerTabs.appendChild(uploadTabButton);
    modalBody.appendChild(pickerTabs);

    const pickerPanels = document.createElement('div');
    pickerPanels.className = 'cms-media-panels';
    modalBody.appendChild(pickerPanels);

    const existingPanel = document.createElement('div');
    existingPanel.className = 'cms-media-panel is-active';

    const uploadPanel = document.createElement('div');
    uploadPanel.className = 'cms-media-panel';

    pickerPanels.appendChild(existingPanel);
    pickerPanels.appendChild(uploadPanel);

    const switchTab = (tab) => {
      const isExisting = tab === 'existing';
      existingTabButton.classList.toggle('is-active', isExisting);
      uploadTabButton.classList.toggle('is-active', !isExisting);
      existingPanel.classList.toggle('is-active', isExisting);
      uploadPanel.classList.toggle('is-active', !isExisting);
    };

    existingTabButton.addEventListener('click', () => switchTab('existing'));
    uploadTabButton.addEventListener('click', () => switchTab('upload'));

    const pickImage = (imagePath) => {
      selectedSource.value = imagePath;
      if (target.kind !== 'background') {
        altInput.value = altInput.value || deriveAlt(imagePath);
      }
      currentLine.querySelector('strong').textContent = imagePath || 'Geen afbeelding gekozen';
      updatePreview(preview, imagePath, target.kind);
    };

    const altField = document.createElement('label');
    altField.className = 'cms-field';
    altField.innerHTML = '<span>Alt tekst</span>';
    const altInput = document.createElement('input');
    altInput.type = 'text';
    altInput.value = target.kind === 'background' ? '' : String(current.alt || '');
    altField.appendChild(altInput);
    if (target.kind !== 'background') {
      modalBody.appendChild(altField);
    }

    const uploadInput = document.createElement('input');
    uploadInput.type = 'file';
    uploadInput.accept = 'image/*';

    const uploadInfo = document.createElement('div');
    uploadInfo.className = 'cms-note';
    uploadInfo.textContent = 'Upload een nieuw bestand of kies uit de bestaande afbeeldingen.';
    uploadPanel.appendChild(uploadInfo);

    const uploadButton = document.createElement('button');
    uploadButton.type = 'button';
    uploadButton.className = 'cms-upload-button';
    uploadButton.textContent = 'Bestand kiezen';
    uploadButton.addEventListener('click', () => uploadInput.click());
    uploadPanel.appendChild(uploadButton);
    uploadPanel.appendChild(uploadInput);

    const uploadPathText = document.createElement('div');
    uploadPathText.className = 'cms-note';
    uploadPathText.textContent = 'Na upload wordt de nieuwe afbeelding direct geselecteerd.';
    uploadPanel.appendChild(uploadPathText);

    const library = document.createElement('div');
    library.className = 'cms-library';
    const renderLibrary = () => {
      library.innerHTML = '';
      state.library.forEach((imagePath) => {
      const button = document.createElement('button');
      button.type = 'button';
      if (imagePath === selectedSource.value) {
        button.classList.add('is-selected');
      }
      button.innerHTML = `<img src="${imagePath}" alt=""><span>${imagePath.replace(/^images\//, '')}</span>`;
      button.addEventListener('click', () => {
        pickImage(imagePath);
        renderLibrary();
      });
      library.appendChild(button);
    });
    };
    renderLibrary();
    modalBody.appendChild(library);

    uploadInput.addEventListener('change', async () => {
      const file = uploadInput.files && uploadInput.files[0];
      if (!file) {
        return;
      }

      const uploadedPath = await uploadImage(file);
      if (uploadedPath) {
        state.library.unshift(uploadedPath);
        pickImage(uploadedPath);
        renderLibrary();
        switchTab('existing');
      }
    });

    modalActions.appendChild(createActionButton('Opslaan', async () => {
      if (target.kind === 'background') {
        await saveField(target.path, selectedSource.value);
        return;
      }

      const nextValue = {
        ...(typeof current === 'object' && current !== null ? current : {}),
        src: selectedSource.value,
        alt: altInput.value || deriveAlt(selectedSource.value),
      };
      await saveField(target.path, nextValue);
    }, 'primary'));
  }

  function buildCollectionForm(modalBody, modalActions, binding, item, index, isNew) {
    const inputs = [];
    const plainTextCollection = binding.fields.length === 1 && binding.fields[0].selector === ':scope' && binding.fields[0].type === 'text';
    let layoutInput = null;

    if (binding.layoutField) {
      const layoutWrap = document.createElement('label');
      layoutWrap.className = 'cms-field';
      layoutWrap.innerHTML = '<span>Layout</span>';
      layoutInput = document.createElement('select');
      const layoutOptions = binding.layoutField.startsWith('layout')
        ? ['layout-hero', 'layout-wide', 'layout-tall', 'layout-standard']
        : ['band-statement', 'band-left', 'band-right', 'band-full'];
      layoutOptions.forEach((optionValue) => {
        const option = document.createElement('option');
        option.value = optionValue;
        option.textContent = optionValue;
        layoutInput.appendChild(option);
      });
      layoutInput.value = (item && item[binding.layoutField]) || layoutOptions[0];
      layoutWrap.appendChild(layoutInput);
      modalBody.appendChild(layoutWrap);
    }

    binding.fields.forEach((field) => {
      if (field.selector === ':scope' && field.type === 'text') {
        const fieldWrap = document.createElement('label');
        fieldWrap.className = 'cms-field';
        fieldWrap.innerHTML = '<span>Waarde</span>';
        const input = document.createElement('textarea');
        input.value = getFieldValue(item, field) || '';
        fieldWrap.appendChild(input);
        modalBody.appendChild(fieldWrap);
        inputs.push({ field, input });
        return;
      }

      const fieldWrap = document.createElement('label');
      fieldWrap.className = 'cms-field';
      fieldWrap.innerHTML = `<span>${field.label || field.source || field.selector.replace('.','')}</span>`;

      if (field.type === 'link') {
        const labelInput = document.createElement('input');
        labelInput.type = 'text';
        labelInput.placeholder = 'Tekst';
        labelInput.value = getFieldValue(item, field).label || '';
        const hrefInput = document.createElement('input');
        hrefInput.type = 'text';
        hrefInput.placeholder = 'Link';
        hrefInput.value = getFieldValue(item, field).href || '';
        fieldWrap.appendChild(labelInput);
        fieldWrap.appendChild(hrefInput);
        inputs.push({ field, labelInput, hrefInput });
      } else if (field.type === 'image' || field.type === 'background') {
        const value = getFieldValue(item, field);
        const pickerState = document.createElement('input');
        pickerState.type = 'hidden';
        pickerState.value = field.type === 'background' ? String(value || '') : String(value.src || '');

        const preview = document.createElement('div');
        preview.className = 'cms-preview';
        preview.innerHTML = field.type === 'background'
          ? `<div class="cms-note">Huidige afbeelding</div><img alt="" src="${escapeHtml(pickerState.value)}">`
          : `<div class="cms-note">Huidige afbeelding</div><img alt="" src="${escapeHtml(pickerState.value)}">`;

        const currentLine = document.createElement('div');
        currentLine.className = 'cms-current-row';
        currentLine.innerHTML = `<span>Actief bestand</span><strong>${escapeHtml(pickerState.value || 'Geen afbeelding gekozen')}</strong>`;

        const pickerTabs = document.createElement('div');
        pickerTabs.className = 'cms-media-tabs';

        const existingTabButton = document.createElement('button');
        existingTabButton.type = 'button';
        existingTabButton.className = 'is-active';
        existingTabButton.textContent = 'Bestaande afbeeldingen';

        const uploadTabButton = document.createElement('button');
        uploadTabButton.type = 'button';
        uploadTabButton.textContent = 'Uploaden';

        pickerTabs.appendChild(existingTabButton);
        pickerTabs.appendChild(uploadTabButton);

        const pickerPanels = document.createElement('div');
        pickerPanels.className = 'cms-media-panels';

        const existingPanel = document.createElement('div');
        existingPanel.className = 'cms-media-panel is-active';

        const uploadPanel = document.createElement('div');
        uploadPanel.className = 'cms-media-panel';

        pickerPanels.appendChild(existingPanel);
        pickerPanels.appendChild(uploadPanel);

        const altInput = document.createElement('input');
        altInput.type = 'text';
        altInput.placeholder = 'Alt tekst';
        altInput.value = field.type === 'background' ? '' : String(value.alt || '');

        const uploadInput = document.createElement('input');
        uploadInput.type = 'file';
        uploadInput.accept = 'image/*';

        const uploadButton = document.createElement('button');
        uploadButton.type = 'button';
        uploadButton.className = 'cms-upload-button';
        uploadButton.textContent = 'Bestand kiezen';
        uploadButton.addEventListener('click', () => uploadInput.click());

        uploadPanel.appendChild(document.createElement('div')).className = 'cms-note';
        uploadPanel.lastChild.textContent = 'Upload een nieuw bestand of kies uit de bestaande afbeeldingen.';
        uploadPanel.appendChild(uploadButton);
        uploadPanel.appendChild(uploadInput);

        const uploadHint = document.createElement('div');
        uploadHint.className = 'cms-note';
        uploadHint.textContent = 'Na upload wordt de nieuwe afbeelding direct geselecteerd.';
        uploadPanel.appendChild(uploadHint);

        const library = document.createElement('div');
        library.className = 'cms-library';
        const renderLibrary = () => {
          library.innerHTML = '';
          state.library.forEach((imagePath) => {
            const button = document.createElement('button');
            button.type = 'button';
            if (imagePath === pickerState.value) {
              button.classList.add('is-selected');
            }
            button.innerHTML = `<img src="${imagePath}" alt=""><span>${imagePath.replace(/^images\//, '')}</span>`;
            button.addEventListener('click', () => {
              pickerState.value = imagePath;
              currentLine.querySelector('strong').textContent = imagePath || 'Geen afbeelding gekozen';
              if (field.type !== 'background') {
                altInput.value = altInput.value || deriveAlt(imagePath);
              }
              updatePreview(preview, imagePath, field.type);
              renderLibrary();
            });
            library.appendChild(button);
          });
        };
        renderLibrary();
        existingPanel.appendChild(library);

        const switchTab = (tab) => {
          const isExisting = tab === 'existing';
          existingTabButton.classList.toggle('is-active', isExisting);
          uploadTabButton.classList.toggle('is-active', !isExisting);
          existingPanel.classList.toggle('is-active', isExisting);
          uploadPanel.classList.toggle('is-active', !isExisting);
        };

        existingTabButton.addEventListener('click', () => switchTab('existing'));
        uploadTabButton.addEventListener('click', () => switchTab('upload'));

        uploadInput.addEventListener('change', async () => {
          const file = uploadInput.files && uploadInput.files[0];
          if (!file) {
            return;
          }

          const uploadedPath = await uploadImage(file);
          if (uploadedPath) {
            state.library.unshift(uploadedPath);
            pickerState.value = uploadedPath;
            currentLine.querySelector('strong').textContent = uploadedPath;
            if (field.type !== 'background') {
              altInput.value = altInput.value || deriveAlt(uploadedPath);
            }
            updatePreview(preview, uploadedPath, field.type);
            renderLibrary();
            switchTab('existing');
          }
        });

        fieldWrap.appendChild(preview);
        fieldWrap.appendChild(pickerState);
        fieldWrap.appendChild(currentLine);
        fieldWrap.appendChild(pickerTabs);
        fieldWrap.appendChild(pickerPanels);
        if (field.type !== 'background') {
          fieldWrap.appendChild(altInput);
        }

        inputs.push({ field, pickerState, altInput });
      } else {
        const input = document.createElement('textarea');
        input.value = String(getFieldValue(item, field) || '');
        fieldWrap.appendChild(input);
        inputs.push({ field, input });
      }

      modalBody.appendChild(fieldWrap);
    });

    modalActions.appendChild(createActionButton(isNew ? 'Toevoegen' : 'Opslaan', async () => {
      const nextItem = buildItemFromInputs(inputs, binding, plainTextCollection, layoutInput);
      if (isNew) {
        await addCollectionItem(binding.path, nextItem, index);
      } else {
        await updateCollectionItem(binding.path, index, nextItem);
      }
    }, 'primary'));

    if (!isNew) {
      modalActions.appendChild(createActionButton('Omhoog', async () => {
        await moveCollectionItem(binding.path, index, Math.max(0, index - 1));
      }));

      modalActions.appendChild(createActionButton('Omlaag', async () => {
        await moveCollectionItem(binding.path, index, index + 1);
      }));

      modalActions.appendChild(createActionButton('Verwijderen', async () => {
        await deleteCollectionItem(binding.path, index);
      }, 'danger'));
    }
  }

  function buildItemFromInputs(inputs, binding, plainTextCollection = false, layoutInput = null) {
    if (plainTextCollection && inputs[0]?.input) {
      return inputs[0].input.value;
    }

    const item = {};

    inputs.forEach((entry) => {
      const { field } = entry;
      if (field.type === 'link') {
        item[field.labelSource || 'label'] = entry.labelInput.value;
        item[field.hrefSource || 'href'] = entry.hrefInput.value;
        return;
      }

      if (field.type === 'image') {
        item[field.source || 'src'] = entry.pickerState.value;
        item[field.altSource || 'alt'] = entry.altInput.value || deriveAlt(entry.pickerState.value);
        return;
      }

      if (field.type === 'background') {
        item[field.source || 'value'] = entry.pickerState.value;
        return;
      }

      if (field.selector === ':scope' && field.type === 'text') {
        item[field.source || 'value'] = entry.input.value;
        return;
      }

      item[field.source || 'value'] = entry.input.value;
    });

    if (binding.layoutField && layoutInput) {
      item[binding.layoutField] = layoutInput.value;
    }

    return item;
  }

  async function saveField(path, value) {
    const formData = new FormData();
    formData.append('path', path);
    formData.append('value', typeof value === 'string' ? value : JSON.stringify(value));
    const response = await fetch('admin-api.php?action=save-field', {
      method: 'POST',
      credentials: 'same-origin',
      headers: getRequestHeaders(),
      body: formData,
    });
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || 'Opslaan mislukt.');
    }
    window.location.reload();
  }

  async function updateCollectionItem(path, index, item) {
    const formData = new FormData();
    formData.append('path', path);
    formData.append('index', String(index));
    Object.entries(item).forEach(([key, value]) => {
      formData.append(`field[${key}]`, value);
    });

    const response = await fetch('admin-api.php?action=set-collection-item', {
      method: 'POST',
      credentials: 'same-origin',
      headers: getRequestHeaders(),
      body: new URLSearchParams({ path, index: String(index), field: 'payload', value: JSON.stringify(item) }),
    });
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || 'Opslaan mislukt.');
    }
    window.location.reload();
  }

  async function addCollectionItem(path, item, index = null) {
    const response = await fetch('admin-api.php?action=add-collection-item', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { ...getRequestHeaders(), 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ path, index: index === null ? '' : String(index), item: JSON.stringify(item) }),
    });
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || 'Toevoegen mislukt.');
    }
    window.location.reload();
  }

  async function deleteCollectionItem(path, index) {
    const response = await fetch('admin-api.php?action=delete-collection-item', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { ...getRequestHeaders(), 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ path, index: String(index) }),
    });
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || 'Verwijderen mislukt.');
    }
    window.location.reload();
  }

  async function moveCollectionItem(path, from, to) {
    const response = await fetch('admin-api.php?action=move-collection-item', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { ...getRequestHeaders(), 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
      body: new URLSearchParams({ path, from: String(from), to: String(to) }),
    });
    const data = await response.json();
    if (!data.ok) {
      throw new Error(data.error || 'Verplaatsen mislukt.');
    }
    window.location.reload();
  }

  async function uploadImage(file) {
    const formData = new FormData();
    formData.append('image', file);
    const response = await fetch('admin-api.php?action=upload-image', {
      method: 'POST',
      credentials: 'same-origin',
      headers: getRequestHeaders(),
      body: formData,
    });
    const data = await response.json();
    return data.ok ? data.path : '';
  }

  function createActionButton(label, handler, variant = '') {
    const button = document.createElement('button');
    button.type = 'button';
    if (variant === 'danger') {
      button.className = 'danger';
    }
    button.textContent = label;
    button.addEventListener('click', async () => {
      try {
        await handler();
      } catch (error) {
        alert(error.message || 'Er ging iets mis.');
      }
    });
    return button;
  }

  function openModal() {
    state.modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!state.modal) {
      return;
    }
    state.modal.classList.remove('is-open');
    document.body.style.overflow = '';
    state.currentTarget = null;
  }

  function updatePreview(preview, value, kind) {
    const img = preview.querySelector('img');
    if (!img) {
      return;
    }
    img.setAttribute('src', value || '');
    img.setAttribute('alt', kind === 'background' ? '' : deriveAlt(value));
  }

  function deriveAlt(path) {
    return (path || '')
      .replace(/^.*\//, '')
      .replace(/[-_]+/g, ' ')
      .replace(/\.(jpg|jpeg|png|gif|webp|svg)$/i, '')
      .trim() || 'Afbeelding';
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
})();
