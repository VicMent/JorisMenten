<?php
$target = 'projecten.html';
if (!empty($_GET['admin']) && $_GET['admin'] === '1') {
    $target .= '?admin=1';
}

header('Location: ' . $target, true, 302);
exit;
?>
