$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

$localConfig = Join-Path $root 'inc/cms.local.php'
if (-not (Test-Path $localConfig)) {
    @"
<?php

define('CMS_ADMIN_PASSWORD_SALT', 'joris-menten-local-2026');
define('CMS_ADMIN_PASSWORD_HASH', '4a107366c3c636f767151b312e1406286dbe1d1cd295bab650f13f2000556883');
"@ | Set-Content -Path $localConfig -Encoding utf8
    Write-Host 'Created inc/cms.local.php for local admin login.'
}

$python = Get-Command python -ErrorAction SilentlyContinue
$py = Get-Command py -ErrorAction SilentlyContinue
$php = Get-Command php -ErrorAction SilentlyContinue

if ($python) {
    $serverCommand = @($python.Source, 'local-server.py', '8000')
} elseif ($py) {
    $serverCommand = @($py.Source, '-3', 'local-server.py', '8000')
} elseif ($php) {
    Start-Process -FilePath $php.Source -ArgumentList @('-S', '127.0.0.1:8000') -WorkingDirectory $root
    Start-Process 'http://127.0.0.1:8000/admin.php'
    Write-Host 'Started PHP development server at http://127.0.0.1:8000/admin.php'
    return
} else {
    throw 'Geen Python of PHP gevonden. Installeer Python 3 of PHP om de site lokaal te starten.'
}

Start-Process -FilePath $serverCommand[0] -ArgumentList $serverCommand[1..($serverCommand.Count - 1)] -WorkingDirectory $root
Start-Process 'http://127.0.0.1:8000/admin.php'
Write-Host 'Started local CMS server at http://127.0.0.1:8000/admin.php'