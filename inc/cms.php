<?php

if (session_status() !== PHP_SESSION_ACTIVE) {
    $isHttps = !empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off';
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => $isHttps,
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
const CMS_ADMIN_PASSWORD_SALT = 'JorisMentenCMSSalt';
const CMS_ADMIN_PASSWORD_HASH = '181e965bcacc0c8846336c311e5bcaf9de89f25860cbdc588b724b8d65be1209';

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

function cms_admin_hash(string $password): string
{
    return hash('sha256', CMS_ADMIN_PASSWORD_SALT . $password);
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

    $iterator = new RecursiveIteratorIterator(
        new RecursiveDirectoryIterator($directory, FilesystemIterator::SKIP_DOTS),
        RecursiveIteratorIterator::SELF_FIRST
    );

    foreach ($iterator as $file) {
        if (!$file->isFile()) {
            continue;
        }

        $absolutePath = $file->getPathname();
        $relativePath = cms_normalize_path(substr($absolutePath, strlen(__DIR__) + 1));

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
