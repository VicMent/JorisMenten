# Joris Menten bv

Public website plus a small PHP admin so you can edit text, images, carousels, and products without changing HTML by hand.

Visitors see normal HTML pages. Content is loaded from `data/site.json`. After you log in, the same pages get an edit overlay.

## How it works

- **Public site:** static HTML (`index.html`, `projecten.html`, product pages, …) plus CSS and JS.
- **Content store:** `data/site.json` holds all editable copy, images, and product data.
- **Admin login:** `admin.php` asks for one password. A successful login starts a PHP session.
- **Edit mode:** after login you are sent to `index.html?admin=1`. The `?admin=1` flag plus a valid session turns on the overlay (edit buttons, toolbar, product manager).
- **Saving:** the overlay talks to `admin-api.php`, which writes `data/site.json` and (for new products) generates an HTML page from `product-template.html`.
- **Images:** pick an existing file under `images/` or upload a new one to `images/uploads/`.

Without a login, `/admin.php` and the public pages stay public. Edit controls never show for visitors.

## Admin password

Default password:

```
jorismenten
```

Go to `/admin.php`, enter that password, then use the site in edit mode.

To change it, edit this line in `inc/cms.php`:

```php
const CMS_ADMIN_PASSWORD = 'jorismenten';
```

If you also use the local Python server, set the same value in `local-server.py` (`ADMIN_PASSWORD`). There is no extra config file, salt, or hash.

## Edit a page

1. Open `/admin.php` and log in.
2. You land on the homepage with `?admin=1`. The Admin toolbar appears at the top.
3. Click an edit control on the page to change text, links, or images.
4. Use **Producten** in the toolbar to add or remove products. Each product gets a navbar entry and its own HTML page.
5. Click **Uitloggen** to end the session.

You can also stay on `/admin.php` after a refresh (if you are still logged in) and open a specific page from there.

To view the public site while still logged in, open a page **without** `?admin=1`. The overlay stays off until that query flag is present.

## Local run

From the project root:

```powershell
.\start-local.ps1
```

This starts Python (`local-server.py`) if available, otherwise PHP’s built-in server, then opens `http://127.0.0.1:8000/admin.php`.

You can also start PHP yourself:

```powershell
php -S 127.0.0.1:8000
```

Then open `http://127.0.0.1:8000/admin.php` and log in with `jorismenten`.

Opening HTML files directly in the browser (no server) will not log you in. The admin API needs PHP or the local Python server.

## Production (PHP hosting)

Upload the project into `www/` (or the host’s web root). PHP must be enabled. No extra framework or database is required.

### Upload these

```
www/
├── admin-api.php
├── admin.php
├── info.php
├── projecten.php
├── index.html
├── product-template.html
├── garagepoorten.html
├── zonwering.html
├── rolluiken.html
├── terras.html
├── projecten.html
├── css/
│   ├── style.css
│   └── admin.css
├── java/
│   ├── cms.js
│   ├── projecten.js
│   ├── smart-observer.js
│   ├── interactions.js
│   └── script.js
├── data/
│   ├── site.json
│   └── sessions/          ← created automatically if missing; must be writable
├── images/
│   ├── (all existing images)
│   └── uploads/           ← must exist and be writable
└── inc/
    ├── cms.php
    └── nav.html
```

### Do not upload

Local-only or tooling files:

- `local-server.py`
- `generate-product-pages.py`
- `start-local.ps1`
- `__pycache__/`, `.venv/`
- `.vscode/`, `.git/`, `.kilo/`

### Permissions

The host must be able to write:

- `data/site.json` — every content save
- `data/sessions/` — login sessions
- `images/uploads/` — new images
- the site root — new product HTML files (for example `zonwering.html`)

Typical shared-hosting values: `666` for `data/site.json`, `755` or `775` for `data/sessions/` and `images/uploads/`. Create `images/uploads/` if it is missing.

### After upload

1. Visit `https://your-domain/admin.php`.
2. Log in with `jorismenten` (or the password you set in `inc/cms.php`).
3. Confirm the Admin toolbar on `index.html?admin=1` and that a small text change saves.

If login fails, PHP sessions cannot be stored. Check that `data/sessions/` exists and is writable.

## Notes

- `local-server.py` is only for local development. Production uses `admin-api.php` and `inc/cms.php`.
- `info.php` redirects to `index.html`. `projecten.php` redirects to `projecten.html` and keeps `?admin=1` when present.
- This is a small site: the admin password lives in `inc/cms.php`. Anyone who can read that file on the server can see it. Change the password if the files are shared more widely.
