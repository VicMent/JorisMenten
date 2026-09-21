$ErrorActionPreference = 'Stop'

$root = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $root

# Kill any existing processes listening on port 8000
$listener = netstat -ano 2>&1 | Select-String ":8000" | Select-String "LISTENING"
if ($listener) {
    foreach ($line in $listener) {
        $pidValue = ($line -split '\s+')[-1]
        if ($pidValue -match '^\d+$') {
            taskkill /PID $pidValue /F 2>$null
        }
    }
    Start-Sleep -Seconds 1
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
