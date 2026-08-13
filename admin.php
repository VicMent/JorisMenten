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
                    <p>Log in om tekst, afbeeldingen, carrouselbeelden en projectvolgorde te wijzigen.</p>
                    <div id="adminStatus" class="cms-note"></div>
                </div>
            </section>

            <section class="admin-grid">
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
                    <div class="cms-actions">
                        <a href="index.html?admin=1" class="button button-secondary">Home</a>
                        <a href="garagepoorten.html?admin=1" class="button button-secondary">Garagepoorten</a>
                        <a href="projecten.html?admin=1" class="button button-secondary">Projecten</a>
                    </div>
                </div>

                <div class="admin-card">
                    <h2>Opmerking</h2>
                    <p class="cms-note">De admin overlay verschijnt alleen als je bent ingelogd. Wijzigingen worden opgeslagen in de JSON content store.</p>
                </div>
            </section>
        </main>
    </div>

    <script>
        (async () => {
            const status = document.getElementById('adminStatus');
            const form = document.getElementById('adminLoginForm');
            let csrfToken = '';

            const sessionResponse = await fetch('admin-api.php?action=session', { credentials: 'same-origin' });
            const sessionData = await sessionResponse.json();
            csrfToken = sessionData.csrfToken || '';
            if (sessionData.admin) {
                status.textContent = 'Je bent al ingelogd.';
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
                    status.textContent = 'Login mislukt. Controleer of de lokale server draait.';
                    return;
                }

                if (!response.ok || !data.ok) {
                    status.textContent = data.error || 'Login mislukt.';
                    return;
                }
                status.textContent = 'Login geslaagd.';
                window.location.href = 'index.html?admin=1';
            });
        })();
    </script>
</body>
</html>
