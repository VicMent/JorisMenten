$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

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
