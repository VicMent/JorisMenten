<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex,nofollow">
    <title>Admin | Joris Menten bv</title>
    <link rel="stylesheet" href="css/style.css">
    <link rel="stylesheet" href="css/admin.css">
    <script src="java/cms.js" defer></script>
</head>
<body class="admin-page">
    <div class="site-shell">
        <main class="admin-shell">
            <section class="admin-hero">
                <div class="admin-card">
                    <div class="eyebrow">Admin toegang</div>
                    <h1>Beheer de inhoud van de site.</h1>
                    <p>Log in om tekst, afbeeldingen, carrousels en producten te beheren. Nieuwe producten krijgen automatisch een pagina.</p>
                    <div id="adminStatus" class="cms-note"></div>
                </div>
            </section>

            <section class="admin-grid" id="adminGrid">
                <div class="admin-card">
                    <h2>Inloggen</h2>
                    <form id="adminLoginForm" class="admin-form">
                        <label class="cms-field">
                            <span>Wachtwoord</span>
                            <input type="password" name="password" autocomplete="current-password" required>
                        </label>
                        <div class="cms-actions">
                            <button type="submit" class="button button-primary">Login</button>
                        </div>
                    </form>
                </div>

                <div class="admin-card">
                    <h2>Open site</h2>
                    <p class="cms-note">Na login kun je de pagina's openen in bewerkmodus.</p>
                    <div id="openSiteLinks" class="cms-actions"></div>
                </div>

                <div class="admin-card">
                    <h2>Producten</h2>
                    <p class="cms-note">Beheer de producten in de navbar. Elk product krijgt automatisch een pagina.</p>
                    <div class="cms-actions">
                        <button type="button" class="button button-primary" id="addProductBtn">+ Product toevoegen</button>
                    </div>
                    <div id="productList" class="cms-product-list-admin"></div>
                </div>

                <div class="admin-card">
                    <h2>Opmerking</h2>
                    <p class="cms-note">De admin overlay verschijnt alleen als je bent ingelogd. Wijzigingen worden opgeslagen in de JSON content store. Nieuwe productpaginas worden automatisch gegenereerd.</p>
                </div>
            </section>
        </main>
    </div>

    <script>
        (async () => {
            const status = document.getElementById('adminStatus');
            const form = document.getElementById('adminLoginForm');
            const openSiteLinks = document.getElementById('openSiteLinks');
            const productList = document.getElementById('productList');
            const addProductBtn = document.getElementById('addProductBtn');
            let csrfToken = '';
            let admin = false;

            async function fetchContent() {
                try {
                    const response = await fetch('admin-api.php?action=content', { credentials: 'same-origin' });
                    const data = await response.json();
                    return data.content || {};
                } catch {
                    return {};
                }
            }

            function getPath(source, path, fallback = '') {
                if (!source || !path) return fallback;
                const segments = path.split('.').filter(Boolean);
                let cursor = source;
                for (const segment of segments) {
                    if (cursor == null || typeof cursor !== 'object' || !(segment in cursor)) return fallback;
                    cursor = cursor[segment];
                }
                return cursor ?? fallback;
            }

            function escapeHtml(value) {
                return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            }

            function renderOpenSiteLinks(products) {
                const links = [
                    { label: 'Home', href: 'index.html?admin=1' },
                    { label: 'Projecten', href: 'projecten.html?admin=1' },
                ];
                products.forEach(p => {
                    links.push({ label: p.name || p.slug, href: p.slug + '.html?admin=1' });
                });

                openSiteLinks.innerHTML = '';
                links.forEach(link => {
                    const a = document.createElement('a');
                    a.href = link.href;
                    a.textContent = link.label;
                    a.className = 'button button-secondary';
                    openSiteLinks.appendChild(a);
                });
            }

            function renderProducts(products) {
                if (!products.length) {
                    productList.innerHTML = '<p class="cms-note">Nog geen producten gedefinieerd.</p>';
                    return;
                }

                productList.innerHTML = products.map(product => `
                    <div class="cms-product-row">
                        <div class="cms-product-info">
                            <strong>${escapeHtml(product.slug)}.html</strong>
                            <span>${escapeHtml(product.name || '')}</span>
                            <small>Nav: ${escapeHtml(product.navLabel || '')}</small>
                        </div>
                        <div class="cms-product-actions">
                            <a href="${product.slug}.html?admin=1" class="button button-secondary">Bewerken</a>
                            <button type="button" class="cms-product-delete" data-slug="${escapeHtml(product.slug)}">Verwijderen</button>
                        </div>
                    </div>
                `).join('');

                productList.querySelectorAll('.cms-product-delete').forEach(btn => {
                    btn.addEventListener('click', () => deleteProduct(btn.dataset.slug));
                });
            }

            async function loadAdminData() {
                const content = await fetchContent();
                const products = getPath(content, 'shared.products', []);
                renderOpenSiteLinks(products);
                renderProducts(products);
            }

            async function createProduct() {
                const slug = prompt('Product slug (gebruikt voor bestandsnaam, bv. "zonwering"):');
                if (!slug) return;
                const name = prompt('Productnaam (bv. "Zonwering"):') || slug;
                const navLabel = prompt('Label in navigatie (optioneel):', name) || name;

                const formData = new FormData();
                formData.append('slug', slug);
                formData.append('name', name);
                formData.append('navLabel', navLabel);

                const response = await fetch('admin-api.php?action=create-product', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {},
                    body: formData
                });
                const data = await response.json();
                if (data.ok) {
                    loadAdminData();
                } else {
                    alert(data.error || 'Fout bij aanmaken product.');
                }
            }

            async function deleteProduct(slug) {
                if (!confirm('Weet je zeker dat je "' + slug + '" wilt verwijderen? De pagina en alle inhoud worden verwijderd.')) return;

                const response = await fetch('admin-api.php?action=delete-product', {
                    method: 'POST',
                    credentials: 'same-origin',
                    headers: {
                        'X-CSRF-Token': csrfToken,
                        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
                    },
                    body: new URLSearchParams({ slug })
                });
                const data = await response.json();
                if (data.ok) {
                    loadAdminData();
                } else {
                    alert(data.error || 'Fout bij verwijderen product.');
                }
            }

            const sessionResponse = await fetch('admin-api.php?action=session', { credentials: 'same-origin' });
            const sessionData = await sessionResponse.json();
            csrfToken = sessionData.csrfToken || '';
            admin = sessionData.admin;

            if (admin) {
                status.textContent = 'Je bent al ingelogd.';
                loadAdminData();
            } else {
                status.textContent = 'Nog niet ingelogd.';
            }

            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const formData = new FormData(form);
                let response;
                try {
                    response = await fetch('admin-api.php?action=login', {
                        method: 'POST',
                        credentials: 'same-origin',
                        headers: csrfToken ? { 'X-CSRF-Token': csrfToken } : {},
                        body: formData
                    });
                } catch (error) {
                    status.textContent = 'Kan geen verbinding maken met de server.';
                    return;
                }

                let data;
                try {
                    data = await response.json();
                } catch (error) {
                    status.textContent = 'Login mislukt. Probeer de pagina te vernieuwen.';
                    return;
                }

                if (!response.ok || !data.ok) {
                    status.textContent = data.error || 'Login mislukt.';
                    return;
                }
                status.textContent = 'Login geslaagd. Start de pagina op.';
                window.location.href = 'index.html?admin=1';
            });

            addProductBtn.addEventListener('click', createProduct);
        })();
    </script>
</body>
</html>
