<?php

// Change this password if you want. It is the only admin login.
const CMS_ADMIN_PASSWORD = 'Vic.mente1';

if (session_status() !== PHP_SESSION_ACTIVE) {
    $sessionDir = __DIR__ . '/../data/sessions';
    if (!is_dir($sessionDir)) {
        mkdir($sessionDir, 0775, true);
    }
    if (is_dir($sessionDir) && is_writable($sessionDir)) {
        session_save_path($sessionDir);
    }

    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['SERVER_PORT'] ?? '') === '443')
        || strtolower((string) ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '')) === 'https';

    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $https,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    ini_set('session.use_strict_mode', '1');
    session_start();
}

if (empty($_SESSION['cms_csrf'])) {
    $_SESSION['cms_csrf'] = bin2hex(random_bytes(32));
}

const CMS_CONTENT_FILE = __DIR__ . '/../data/site.json';
const CMS_IMAGE_DIR = __DIR__ . '/../images';
const CMS_UPLOAD_DIR = __DIR__ . '/../images/uploads';

function cms_is_admin(): bool
{
    return !empty($_SESSION['cms_admin']) && $_SESSION['cms_admin'] === true;
}

function cms_csrf_token(): string
{
    return (string) ($_SESSION['cms_csrf'] ?? '');
}

function cms_require_csrf(): void
{
    $requestToken = (string) ($_SERVER['HTTP_X_CSRF_TOKEN'] ?? cms_value_from_request('csrf', ''));
    if ($requestToken === '' || !hash_equals(cms_csrf_token(), $requestToken)) {
        cms_error('Ongeldige sessie. Vernieuw de pagina en probeer opnieuw.', 403);
    }
}

function cms_admin_password_matches(string $password): bool
{
    return hash_equals(CMS_ADMIN_PASSWORD, $password);
}

function cms_content_file_path(): string
{
    return CMS_CONTENT_FILE;
}

function cms_load_content(): array
{
    if (!file_exists(CMS_CONTENT_FILE)) {
        return [];
    }

    $raw = file_get_contents(CMS_CONTENT_FILE);
    $decoded = json_decode($raw ?: '', true);

    return is_array($decoded) ? $decoded : [];
}

function cms_save_content(array $content): bool
{
    $directory = dirname(CMS_CONTENT_FILE);
    if (!is_dir($directory)) {
        mkdir($directory, 0775, true);
    }

    $json = json_encode($content, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    if ($json === false) {
        return false;
    }

    $tempFile = CMS_CONTENT_FILE . '.tmp';
    if (file_put_contents($tempFile, $json . PHP_EOL, LOCK_EX) === false) {
        return false;
    }

    return rename($tempFile, CMS_CONTENT_FILE);
}

function cms_json_response(array $payload, int $statusCode = 200): void
{
    http_response_code($statusCode);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function cms_error(string $message, int $statusCode = 400): void
{
    cms_json_response(['ok' => false, 'error' => $message], $statusCode);
}

function cms_value_from_request(string $key, $default = null)
{
    if (isset($_POST[$key])) {
        return $_POST[$key];
    }

    if (isset($_GET[$key])) {
        return $_GET[$key];
    }

    return $default;
}

function cms_parse_value($value)
{
    if (!is_string($value)) {
        return $value;
    }

    $trimmed = trim($value);
    if ($trimmed === '') {
        return '';
    }

    $decoded = json_decode($trimmed, true);
    if (json_last_error() === JSON_ERROR_NONE) {
        return $decoded;
    }

    return $value;
}

function cms_data_get(array $data, string $path, $default = null)
{
    $segments = array_values(array_filter(explode('.', $path), static fn ($segment) => $segment !== ''));
    $cursor = $data;

    foreach ($segments as $segment) {
        if (!is_array($cursor) || !array_key_exists($segment, $cursor)) {
            return $default;
        }

        $cursor = $cursor[$segment];
    }

    return $cursor;
}

function cms_data_set(array &$data, string $path, $value): void
{
    $segments = array_values(array_filter(explode('.', $path), static fn ($segment) => $segment !== ''));
    if (!$segments) {
        return;
    }

    $cursor =& $data;
    $lastIndex = count($segments) - 1;

    foreach ($segments as $index => $segment) {
        if ($index === $lastIndex) {
            $cursor[$segment] = $value;
            return;
        }

        if (!isset($cursor[$segment]) || !is_array($cursor[$segment])) {
            $cursor[$segment] = [];
        }

        $cursor =& $cursor[$segment];
    }
}

function cms_data_delete(array &$data, string $path): bool
{
    $segments = array_values(array_filter(explode('.', $path), static fn ($segment) => $segment !== ''));
    if (!$segments) {
        return false;
    }

    $cursor =& $data;
    $lastIndex = count($segments) - 1;

    foreach ($segments as $index => $segment) {
        if ($index === $lastIndex) {
            if (is_array($cursor) && array_key_exists($segment, $cursor)) {
                unset($cursor[$segment]);
                return true;
            }

            return false;
        }

        if (!isset($cursor[$segment]) || !is_array($cursor[$segment])) {
            return false;
        }

        $cursor =& $cursor[$segment];
    }

    return false;
}

function cms_normalize_path(string $path): string
{
    return str_replace('\\', '/', $path);
}

function cms_is_allowed_image(string $fileName): bool
{
    return (bool) preg_match('/\.(?:jpe?g|png|gif|webp|svg)$/i', $fileName);
}

function cms_list_images(string $directory = CMS_IMAGE_DIR): array
{
    $images = [];
    if (!is_dir($directory)) {
        return $images;
    }
    $projectRoot = rtrim(cms_normalize_path(dirname(__DIR__)), '/');

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $file) {
        if (!$file->isFile()) {
            continue;
        }
        $absolutePath = cms_normalize_path($file->getPathname());
        $relativePath = str_starts_with($absolutePath, $projectRoot . '/')
            ? substr($absolutePath, strlen($projectRoot) + 1)
            : $absolutePath;

        if (cms_is_allowed_image($relativePath)) {
            $images[] = $relativePath;
        }
    }

    sort($images, SORT_NATURAL | SORT_FLAG_CASE);
    return $images;
}

function cms_slugify(string $value): string
{
    $value = strtolower($value);
    $value = preg_replace('/[^a-z0-9]+/', '-', $value) ?? '';
    return trim($value, '-') ?: 'image';
}

function cms_store_uploaded_image(array $file): string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException('Upload mislukt.');
    }

    $originalName = (string) ($file['name'] ?? 'image');
    $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
    if (!in_array($extension, ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'], true)) {
        throw new RuntimeException('Onjuist bestandsformaat.');
    }

    if (!is_dir(CMS_UPLOAD_DIR)) {
        mkdir(CMS_UPLOAD_DIR, 0775, true);
    }

    $baseName = cms_slugify(pathinfo($originalName, PATHINFO_FILENAME));
    $targetName = $baseName . '-' . date('Ymd-His') . '-' . bin2hex(random_bytes(3)) . '.' . $extension;
    $targetPath = CMS_UPLOAD_DIR . '/' . $targetName;

    if (!move_uploaded_file($file['tmp_name'], $targetPath)) {
        throw new RuntimeException('Kan geüploade afbeelding niet opslaan.');
    }

    return cms_normalize_path('images/uploads/' . $targetName);
}

function cms_require_admin(): void
{
    if (!cms_is_admin()) {
        cms_error('Niet geautoriseerd.', 403);
    }
}

const CMS_PRODUCT_TEMPLATE = __DIR__ . '/../product-template.html';

function cms_slug_to_filename(string $slug): string
{
    $slug = trim($slug);
    $slug = ltrim($slug, '/');
    if ($slug === '') {
        return '';
    }

    $safeSlug = preg_replace('/[^a-z0-9_-]+/i', '-', $slug);
    $safeSlug = trim((string) $safeSlug, '-');
    if ($safeSlug === '') {
        return '';
    }

    return $safeSlug . '.html';
}

function cms_default_product_content(string $slug, string $name, string $navLabel): array
{
    $image = 'images/garage.jpg';
    $products = cms_data_get(cms_load_content(), 'shared.products', []);
    if (is_array($products)) {
        foreach ($products as $product) {
            if (($product['slug'] ?? '') === $slug && isset($product['image'])) {
                $image = $product['image'];
                break;
            }
        }
    }

    $safeName = (string) $name;
    return [
        'meta' => [
            'title' => $safeName . ' | Joris Menten bv',
            'description' => $safeName . ' van Joris Menten bv: professionele plaatsing en een verzorgde afwerking voor woning en project.',
        ],
        'hero' => [
            'eyebrow' => 'Service detail · 15+ jaar ervaring',
            'title' => $safeName . ' die comfort en kwaliteit combineren.',
            'lead' => 'Bij Joris Menten bv staat ' . strtolower($safeName) . ' voor een oplossing die perfect aansluit bij jouw woning, wensen en levensstijl.',
            'ctas' => [
                ['label' => 'Vraag advies', 'href' => 'index.html#contact'],
                ['label' => 'Bekijk werk', 'href' => 'projecten.html'],
            ],
            'chips' => ['Kwaliteit', 'Comfort', 'Stijl'],
            'image' => $image,
        ],
        'statement' => [
            'image' => 'images/projecten/2.jpg',
            'title' => 'Een oplossing die de gevel optilt',
            'caption' => 'Veiligheid, stille werking en een afwerking die met eigen vertrouwen uitstraalt — onze kernspecialiteit.',
        ],
        'benefitsSection' => [
            'kicker' => 'Voordelen',
            'title' => 'Sterke punten in één oogopslag.',
            'lead' => 'De focus ligt op wat echt telt: betrouwbare werking, nette montage en een resultaat dat er gewoon goed uitziet.',
            'image' => $image,
        ],
        'benefits' => [
            'Stevige constructie voor veiligheid en duurzaamheid',
            'Eenvoudige en stille bediening voor dagelijks comfort',
            'Premium uitstraling zonder schreeuwerig te worden',
            'Professionele plaatsing met aandacht voor detail',
            'Duurzame materialen en een strakke gevelintegratie',
        ],
        'approach' => [
            'kicker' => 'Aanpak',
            'title' => 'Alles draait om een stevige eerste indruk.',
            'lead' => 'Een ' . strtolower($safeName) . ' is vaak een van de zichtbare onderdelen van de woning. Daarom moet de plaatsing niet alleen technisch juist zijn, maar ook visueel kloppen.',
            'bullets' => [
                'Heldere communicatie van aanvraag tot oplevering',
                'Afwerking die meedraait in het totaalbeeld van de woning',
                'Oplossingen die zijn gemaakt voor comfort en gebruiksgemak',
            ],
            'image' => 'images/projecten/3.jpg',
        ],
        'closing' => [
            'kicker' => 'Klaar voor de volgende stap',
            'title' => 'Op zoek naar een ' . strtolower($safeName) . ' die er even goed uitziet als hij werkt?',
            'lead' => 'Neem contact op voor advies of een offerte. Kort, duidelijk en zonder omwegen.',
            'ctas' => [
                ['label' => 'Neem contact op', 'href' => 'index.html#contact'],
                ['label' => 'Terug naar home', 'href' => 'index.html'],
            ],
        ],
        'footer' => [
            'brandLine' => $safeName,
            'links' => [
                ['label' => 'Producten', 'href' => 'index.html#producten'],
                ['label' => 'Projecten', 'href' => 'projecten.html'],
                ['label' => 'Contact', 'href' => 'index.html#contact'],
            ],
        ],
    ];
}

function cms_generate_product_page(string $slug, string $name, string $description, string $image): bool
{
    if (!is_file(CMS_PRODUCT_TEMPLATE)) {
        return false;
    }

    $html = file_get_contents(CMS_PRODUCT_TEMPLATE);
    if ($html === false) {
        return false;
    }

    $navFile = dirname(CMS_PRODUCT_TEMPLATE) . '/inc/nav.html';
    if (is_file($navFile)) {
        $navHtml = file_get_contents($navFile);
        if ($navHtml !== false) {
            $html = str_replace('{{NAVIGATION}}', $navHtml, $html);
        }
    }

    $fileName = cms_slug_to_filename($slug);
    if ($fileName === '') {
        return false;
    }

    $jsonName = json_encode($name, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (!is_string($jsonName)) {
        $jsonName = htmlspecialchars($name, ENT_QUOTES);
    }

    $html = str_replace('{{PRODUCT_SLUG}}', $slug, $html);
    $html = str_replace('{{PRODUCT_NAME}}', htmlspecialchars($name, ENT_QUOTES), $html);
    $html = str_replace('{{PRODUCT_NAME_RAW_JSON}}', $jsonName, $html);
    $html = str_replace('{{PRODUCT_TITLE}}', htmlspecialchars($name . ' | Joris Menten bv', ENT_QUOTES), $html);
    $html = str_replace('{{PRODUCT_DESCRIPTION}}', htmlspecialchars($description, ENT_QUOTES), $html);
    $html = str_replace('{{PRODUCT_LEAD}}', htmlspecialchars('Bij Joris Menten bv vind je de perfecte ' . strtolower($name) . ' voor jouw woning — met premium kwaliteit en een strakke afwerking.', ENT_QUOTES), $html);
    $html = str_replace('{{PRODUCT_IMAGE}}', $image, $html);
    $html = str_replace('{{PRODUCT_CANONICAL}}', 'https://jorismenten.be/' . $fileName, $html);

    $targetPath = __DIR__ . '/../' . $fileName;
    return file_put_contents($targetPath, $html) !== false;
}

function cms_delete_product_page(string $slug): bool
{
    $fileName = cms_slug_to_filename($slug);
    if ($fileName === '') {
        return true;
    }

    $path = __DIR__ . '/../' . $fileName;
    if (!file_exists($path)) {
        return true;
    }

    return unlink($path);
}
