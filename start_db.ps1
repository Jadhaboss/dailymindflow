$mongoPath = "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe"
$dataPath = ".\data"

if (!(Test-Path $dataPath)) {
    New-Item -ItemType Directory -Force -Path $dataPath
}

Write-Host "Starting MongoDB..."
& $mongoPath --dbpath $dataPath
