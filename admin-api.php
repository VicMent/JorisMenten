<?php

require_once __DIR__ . '/inc/cms.php';

$action = (string) cms_value_from_request('action', 'content');
$content = cms_load_content();

if ($action === 'session') {
    cms_json_response([
        'ok' => true,
        'admin' => cms_is_admin(),
        'csrfToken' => cms_csrf_token()
    ]);
}

if ($action === 'content') {
    cms_json_response([
        'ok' => true,
        'content' => $content,
        'admin' => cms_is_admin()
    ]);
}

if ($action === 'login') {
    cms_require_csrf();
    $password = (string) cms_value_from_request('password', '');
    if (cms_admin_hash($password) !== CMS_ADMIN_PASSWORD_HASH) {
        cms_error('Ongeldig wachtwoord.', 401);
    }

    session_regenerate_id(true);
    $_SESSION['cms_admin'] = true;

    cms_json_response([
        'ok' => true,
        'admin' => true
    ]);
}

if ($action === 'logout') {
    cms_require_csrf();
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], (bool) $params['secure'], (bool) $params['httponly']);
    }

    session_destroy();

    cms_json_response([
        'ok' => true,
        'admin' => false
    ]);
}

if ($action === 'library') {
    cms_require_admin();
    cms_json_response([
        'ok' => true,
        'images' => cms_list_images()
    ]);
}

if ($action === 'save-field') {
    cms_require_admin();
    cms_require_csrf();

    $path = trim((string) cms_value_from_request('path', ''));
    if ($path === '') {
        cms_error('Ontbrekende veldnaam.');
    }

    $value = cms_parse_value(cms_value_from_request('value', ''));
    cms_data_set($content, $path, $value);

    if (!cms_save_content($content)) {
        cms_error('Kan wijzigingen niet opslaan.', 500);
    }

    cms_json_response([
        'ok' => true,
        'content' => $content
    ]);
}

if ($action === 'set-collection-item') {
    cms_require_admin();
    cms_require_csrf();

    $path = trim((string) cms_value_from_request('path', ''));
    $index = (int) cms_value_from_request('index', -1);
    $field = trim((string) cms_value_from_request('field', ''));
    if ($path === '' || $index < 0 || $field === '') {
        cms_error('Ontbrekende collectiegegevens.');
    }

    $items = cms_data_get($content, $path, []);
    if (!is_array($items) || !array_key_exists($index, $items) || !is_array($items[$index])) {
        cms_error('Collectie-item niet gevonden.', 404);
    }

    $value = cms_parse_value(cms_value_from_request('value', ''));
    if ($field === 'payload') {
        $items[$index] = $value;
    } else {
        $items[$index][$field] = $value;
    }
    cms_data_set($content, $path, array_values($items));

    if (!cms_save_content($content)) {
        cms_error('Kan wijzigingen niet opslaan.', 500);
    }

    cms_json_response([
        'ok' => true,
        'content' => $content
    ]);
}

if ($action === 'add-collection-item') {
    cms_require_admin();
    cms_require_csrf();

    $path = trim((string) cms_value_from_request('path', ''));
    if ($path === '') {
        cms_error('Ontbrekende collectienaam.');
    }

    $items = cms_data_get($content, $path, []);
    if (!is_array($items)) {
        $items = [];
    }

    $item = cms_parse_value(cms_value_from_request('item', []));

    $insertAt = cms_value_from_request('index', null);
    if ($insertAt !== null && $insertAt !== '') {
        $index = max(0, (int) $insertAt);
        array_splice($items, $index, 0, [$item]);
    } else {
        $items[] = $item;
    }

    cms_data_set($content, $path, array_values($items));

    if (!cms_save_content($content)) {
        cms_error('Kan wijzigingen niet opslaan.', 500);
    }

    cms_json_response([
        'ok' => true,
        'content' => $content
    ]);
}

if ($action === 'delete-collection-item') {
    cms_require_admin();
    cms_require_csrf();

    $path = trim((string) cms_value_from_request('path', ''));
    $index = (int) cms_value_from_request('index', -1);
    if ($path === '' || $index < 0) {
        cms_error('Ontbrekende collectiegegevens.');
    }

    $items = cms_data_get($content, $path, []);
    if (!is_array($items) || !array_key_exists($index, $items)) {
        cms_error('Collectie-item niet gevonden.', 404);
    }

    array_splice($items, $index, 1);
    cms_data_set($content, $path, array_values($items));

    if (!cms_save_content($content)) {
        cms_error('Kan wijzigingen niet opslaan.', 500);
    }

    cms_json_response([
        'ok' => true,
        'content' => $content
    ]);
}

if ($action === 'move-collection-item') {
    cms_require_admin();
    cms_require_csrf();

    $path = trim((string) cms_value_from_request('path', ''));
    $from = (int) cms_value_from_request('from', -1);
    $to = (int) cms_value_from_request('to', -1);
    if ($path === '' || $from < 0 || $to < 0) {
        cms_error('Ontbrekende verplaatsingsgegevens.');
    }

    $items = cms_data_get($content, $path, []);
    if (!is_array($items) || !array_key_exists($from, $items)) {
        cms_error('Collectie-item niet gevonden.', 404);
    }

    $item = $items[$from];
    array_splice($items, $from, 1);
    $to = max(0, min($to, count($items)));
    array_splice($items, $to, 0, [$item]);
    cms_data_set($content, $path, array_values($items));

    if (!cms_save_content($content)) {
        cms_error('Kan wijzigingen niet opslaan.', 500);
    }

    cms_json_response([
        'ok' => true,
        'content' => $content
    ]);
}

if ($action === 'upload-image') {
    cms_require_admin();
    cms_require_csrf();

    if (empty($_FILES['image'])) {
        cms_error('Geen afbeelding ontvangen.');
    }

    try {
        $path = cms_store_uploaded_image($_FILES['image']);
    } catch (Throwable $throwable) {
        cms_error($throwable->getMessage(), 400);
    }

    cms_json_response([
        'ok' => true,
        'path' => $path
    ]);
}

cms_error('Onbekende actie.', 404);
