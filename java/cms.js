(() => {
  const PAGE = getPageName();
  const state = {
    content: null,
    admin: false,
    library: [],
    csrfToken: '',
    modal: null,
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
        { selector: 'main > section.surface:nth-of-type(5) .section-head .section-kicker', path: 'pages.index.featured.kicker', type: 'text' },
        { selector: 'main > section.surface:nth-of-type(5) .section-head .section-title', path: 'pages.index.featured.title', type: 'text' },
        { selector: 'main > section.surface:nth-of-type(5) .section-head .section-intro', path: 'pages.index.featured.lead', type: 'text' },
      ],
      images: [
        { selector: '.brand-mark', path: 'shared.brand.logo', type: 'image' },
        { selector: '.page-visual', path: 'pages.index.approach.image', type: 'background' },
        { selector: '.showcase-image', path: 'pages.index.approach.image', type: 'background' },
      ],
      collections: [
        {
          selector: '.hero-slide',
          path: 'pages.index.hero.carousel',
          fields: [
            { selector: 'img', type: 'image', source: 'src', altSource: 'alt' },
          ],
          addLabel: 'Carrouselbeeld toevoegen',
          itemLabel: 'Carrouselbeeld',
        },
        {
          selector: '.stat-card',
          path: 'pages.index.stats',
          fields: [
            { selector: 'strong', type: 'text', source: 'value' },
            { selector: 'span', type: 'text', source: 'label' },
          ],
          itemLabel: 'Statistiek',
        },
        {
          selector: '.service-card',
          path: 'pages.index.services',
          fields: [
            { selector: '.service-media', type: 'background', source: 'image' },
            { selector: '.card-tag', type: 'text', source: 'eyebrow' },
            { selector: 'h3', type: 'text', source: 'title' },
            { selector: 'p', type: 'text', source: 'description' },
            { selector: '.info-pill', type: 'text', source: 'badge' },
            { selector: '.link-pill', type: 'link', labelSource: 'linkLabel', hrefSource: 'linkHref' },
          ],
          itemLabel: 'Dienstkaart',
        },
        {
          selector: '.split-copy li',
          path: 'pages.index.approach.bullets',
          fields: [
            { selector: ':scope', type: 'text', source: 'value' },
          ],
          itemLabel: 'Bullet',
        },
        {
          selector: '.copy-card',
          path: 'pages.index.featured.cards',
          fields: [
            { selector: '.card-tag', type: 'text', source: 'eyebrow' },
            { selector: 'h3', type: 'text', source: 'title' },
            { selector: 'p', type: 'text', source: 'description' },
          ],
          itemLabel: 'Project teaser',
        },
        {
          selector: '.contact-card',
          path: 'pages.index.contact.cards',
          fields: [
            { selector: 'h3', type: 'text', source: 'title' },
            { selector: 'p', type: 'text', source: 'text' },
          ],
          itemLabel: 'Contactkaart',
        },
      ],
      extra: [
        { selector: '#diensten .section-head .section-kicker', path: 'pages.index.servicesSection.kicker', type: 'text' },
        { selector: '#diensten .section-head .section-title', path: 'pages.index.servicesSection.title', type: 'text' },
        { selector: '#diensten .section-head .section-intro', path: 'pages.index.servicesSection.lead', type: 'text' },
        { selector: '#aanpak .section-kicker', path: 'pages.index.approach.kicker', type: 'text' },
        { selector: '#aanpak h2', path: 'pages.index.approach.title', type: 'text' },
        { selector: '#aanpak p', path: 'pages.index.approach.lead', type: 'text' },
        { selector: '.hero-meta .meta-chip:nth-child(1) strong', path: 'pages.index.heroMeta.0.title', type: 'text' },
        { selector: '.hero-meta .meta-chip:nth-child(1) span', path: 'pages.index.heroMeta.0.text', type: 'text' },
        { selector: '.hero-meta .meta-chip:nth-child(2) strong', path: 'pages.index.heroMeta.1.title', type: 'text' },
        { selector: '.hero-meta .meta-chip:nth-child(2) span', path: 'pages.index.heroMeta.1.text', type: 'text' },
        { selector: '.hero-meta .meta-chip:nth-child(3) strong', path: 'pages.index.heroMeta.2.title', type: 'text' },
        { selector: '.hero-meta .meta-chip:nth-child(3) span', path: 'pages.index.heroMeta.2.text', type: 'text' },
        { selector: '.stat-strip .stat-card:nth-child(1) strong', path: 'pages.index.stats.0.value', type: 'text' },
        { selector: '.stat-strip .stat-card:nth-child(1) span', path: 'pages.index.stats.0.label', type: 'text' },
        { selector: '.stat-strip .stat-card:nth-child(2) strong', path: 'pages.index.stats.1.value', type: 'text' },
        { selector: '.stat-strip .stat-card:nth-child(2) span', path: 'pages.index.stats.1.label', type: 'text' },
        { selector: '.stat-strip .stat-card:nth-child(3) strong', path: 'pages.index.stats.2.value', type: 'text' },
        { selector: '.stat-strip .stat-card:nth-child(3) span', path: 'pages.index.stats.2.label', type: 'text' },
        { selector: '.stat-strip .stat-card:nth-child(4) strong', path: 'pages.index.stats.3.value', type: 'text' },
        { selector: '.stat-strip .stat-card:nth-child(4) span', path: 'pages.index.stats.3.label', type: 'text' },
        { selector: 'main > section.surface:nth-of-type(5) .hero-actions .button-primary', path: 'pages.index.featured.ctas.0', type: 'link' },
        { selector: 'main > section.surface:nth-of-type(5) .hero-actions .button-secondary', path: 'pages.index.featured.ctas.1', type: 'link' },
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
    garagepoorten: {
      meta: {
        title: 'pages.garagepoorten.meta.title',
        description: 'pages.garagepoorten.meta.description',
      },
      singles: [
        { selector: '.page-hero-copy .eyebrow', path: 'pages.garagepoorten.hero.eyebrow', type: 'text' },
        { selector: '.page-hero-copy h1', path: 'pages.garagepoorten.hero.title', type: 'text' },
        { selector: '.page-hero-copy p', path: 'pages.garagepoorten.hero.lead', type: 'text' },
        { selector: '.page-hero-copy .hero-actions .button-primary', path: 'pages.garagepoorten.hero.ctas.0', type: 'link' },
        { selector: '.page-hero-copy .hero-actions .button-secondary', path: 'pages.garagepoorten.hero.ctas.1', type: 'link' },
        { selector: 'main > section:nth-of-type(2).surface .section-head .section-kicker', path: 'pages.garagepoorten.benefitsSection.kicker', type: 'text' },
        { selector: 'main > section:nth-of-type(2).surface .section-head .section-title', path: 'pages.garagepoorten.benefitsSection.title', type: 'text' },
        { selector: 'main > section:nth-of-type(2).surface .section-head .section-intro', path: 'pages.garagepoorten.benefitsSection.lead', type: 'text' },
      ],
      images: [
        { selector: '.brand-mark', path: 'shared.brand.logo', type: 'image' },
        { selector: '.page-visual.service-poorten', path: 'pages.garagepoorten.hero.image', type: 'background' },
        { selector: '.showcase-image.service-poorten', path: 'pages.garagepoorten.approach.image', type: 'background' },
      ],
      collections: [
        {
          selector: '.kicker-row .pill',
          path: 'pages.garagepoorten.hero.chips',
          fields: [
            { selector: ':scope', type: 'text', source: 'value' },
          ],
          itemLabel: 'Chips',
        },
        {
          selector: '.feature-card',
          path: 'pages.garagepoorten.benefits',
          fields: [
            { selector: '.feature-icon', type: 'text', source: 'icon' },
            { selector: 'h3', type: 'text', source: 'title' },
            { selector: 'p', type: 'text', source: 'description' },
          ],
          itemLabel: 'Voordeelkaart',
        },
        {
          selector: '.split-copy li',
          path: 'pages.garagepoorten.approach.bullets',
          fields: [
            { selector: ':scope', type: 'text', source: 'value' },
          ],
          itemLabel: 'Bullet',
        },
      ],
      extra: [
        { selector: '.page-hero-card .kicker-row .pill:nth-child(1)', path: 'pages.garagepoorten.hero.chips.0', type: 'text' },
        { selector: '.page-hero-card .kicker-row .pill:nth-child(2)', path: 'pages.garagepoorten.hero.chips.1', type: 'text' },
        { selector: '.page-hero-card .kicker-row .pill:nth-child(3)', path: 'pages.garagepoorten.hero.chips.2', type: 'text' },
        { selector: '.split-copy .section-kicker', path: 'pages.garagepoorten.approach.kicker', type: 'text' },
        { selector: '.split-copy h2', path: 'pages.garagepoorten.approach.title', type: 'text' },
        { selector: '.split-copy p', path: 'pages.garagepoorten.approach.lead', type: 'text' },
        { selector: 'main > section:nth-of-type(4).surface .section-kicker', path: 'pages.garagepoorten.closing.kicker', type: 'text' },
        { selector: 'main > section:nth-of-type(4).surface .section-title', path: 'pages.garagepoorten.closing.title', type: 'text' },
        { selector: 'main > section:nth-of-type(4).surface .section-intro', path: 'pages.garagepoorten.closing.lead', type: 'text' },
        { selector: 'main > section:nth-of-type(4).surface .hero-actions .button-primary', path: 'pages.garagepoorten.closing.ctas.0', type: 'link' },
        { selector: 'main > section:nth-of-type(4).surface .hero-actions .button-secondary', path: 'pages.garagepoorten.closing.ctas.1', type: 'link' },
      ],
      footer: {
        brandSelectors: [
          { selector: 'footer .footer-top .brand-copy span', path: 'pages.garagepoorten.footer.brandLine' },
          { selector: 'footer .footer-links a:nth-child(1)', path: 'pages.garagepoorten.footer.links.0' },
          { selector: 'footer .footer-links a:nth-child(2)', path: 'pages.garagepoorten.footer.links.1' },
          { selector: 'footer .footer-links a:nth-child(3)', path: 'pages.garagepoorten.footer.links.2' },
        ],
      },
    },
    projecten: {
      meta: {
        title: 'pages.projecten.meta.title',
        description: 'pages.projecten.meta.description',
      },
      singles: [
        { selector: '.page-hero-copy .eyebrow', path: 'pages.projecten.hero.eyebrow', type: 'text' },
        { selector: '.page-hero-copy h1', path: 'pages.projecten.hero.title', type: 'text' },
        { selector: '.page-hero-copy p', path: 'pages.projecten.hero.lead', type: 'text' },
        { selector: '.page-hero-copy .hero-actions .button-primary', path: 'pages.projecten.hero.ctas.0', type: 'link' },
        { selector: '.page-hero-copy .hero-actions .button-secondary', path: 'pages.projecten.hero.ctas.1', type: 'link' },
        { selector: 'main > section:nth-of-type(2) .section-head .section-kicker', path: 'pages.projecten.gallerySection.kicker', type: 'text' },
        { selector: 'main > section:nth-of-type(2) .section-head .section-title', path: 'pages.projecten.gallerySection.title', type: 'text' },
        { selector: 'main > section:nth-of-type(2) .section-head .section-intro', path: 'pages.projecten.gallerySection.lead', type: 'text' },
      ],
      images: [
        { selector: '.brand-mark', path: 'shared.brand.logo', type: 'image' },
        { selector: '.page-visual', path: 'pages.projecten.hero.image', type: 'background' },
      ],
      collections: [
        {
          selector: '.kicker-row .pill',
          path: 'pages.projecten.hero.chips',
          fields: [
            { selector: ':scope', type: 'text', source: 'value' },
          ],
          itemLabel: 'Chip',
        },
        {
          selector: '.gallery-card',
          path: 'pages.projecten.gallery',
          fields: [
            { selector: 'img', type: 'image', source: 'src', altSource: 'alt' },
          ],
          itemLabel: 'Galerijfoto',
        },
      ],
      extra: [
        { selector: 'main > section:nth-of-type(3).surface .section-kicker', path: 'pages.projecten.closing.kicker', type: 'text' },
        { selector: 'main > section:nth-of-type(3).surface .section-title', path: 'pages.projecten.closing.title', type: 'text' },
        { selector: 'main > section:nth-of-type(3).surface .section-intro', path: 'pages.projecten.closing.lead', type: 'text' },
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
          continue;
        }
        return await response.json();
      } catch {
        // Try the next source.
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
    return PAGE_BINDINGS[PAGE] || null;
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

    element.textContent = String(value ?? '');
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
        container.appendChild(clone);
        existing.push(clone);
      }
    }

    existing.forEach((node, index) => {
      if (index >= targetCount) {
        node.remove();
        return;
      }

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

    if (state.admin && binding.containerSelector) {
      const containerElement = document.querySelector(binding.containerSelector);
      if (containerElement) {
        injectAddButton(containerElement, binding);
      }
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

      target.textContent = String(sourceValue ?? '');
    });
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
      const container = binding.containerSelector ? document.querySelector(binding.containerSelector) : document.querySelector(binding.selector)?.parentElement;
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
    const host = container.parentElement || container;
    if (!state.admin || host.querySelector(':scope > .cms-add-button[data-cms-bound="1"]')) {
      return;
    }

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'cms-add-button cms-add-inline';
    button.textContent = '+';
    button.dataset.cmsBound = '1';
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openEditor({ kind: 'collection-add', binding, index: null, path: binding.path, item: {} }, container);
    });

    if (container.parentElement) {
      container.parentElement.insertBefore(button, container);
      return;
    }

    container.appendChild(button);
  }

  function createToolbar() {
    if (state.toolbar) {
      return;
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'cms-toolbar';
    toolbar.innerHTML = '<span class="cms-pill">Admin</span><span>Bewerkmodus</span>';

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

  async function fetchLibrary() {
    try {
      const response = await fetch('admin-api.php?action=library', { credentials: 'same-origin' });
      const data = await response.json();
      state.library = data.images || [];
    } catch {
      state.library = [];
    }
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

      await saveField(target.path, { src: selectedSource.value, alt: altInput.value || deriveAlt(selectedSource.value) });
    }, 'primary'));
  }

  function buildCollectionForm(modalBody, modalActions, binding, item, index, isNew) {
    const inputs = [];
    const plainTextCollection = binding.fields.length === 1 && binding.fields[0].selector === ':scope' && binding.fields[0].type === 'text';

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
      const nextItem = buildItemFromInputs(inputs, binding, plainTextCollection);
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

  function buildItemFromInputs(inputs, binding, plainTextCollection = false) {
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
