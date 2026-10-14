# diagnose-web.ps1  -  run from the repo root
$project = 'merci-509500'
$webUrl  = ''   # optional: your deployed frontend URL, e.g. https://prairiejoy-web-xxxx.run.app
$marker  = 'https://pjb-test-api.example.run.app'

# 1. What did Cloud Build actually extract as the API URL?
Write-Host "`n=== 1. Cloud Build log: extracted API URL ===" -ForegroundColor Cyan
$id = gcloud builds list --project=$project --limit=1 --format="value(id)"
Write-Host "Latest build: $id"
gcloud builds log $id --project=$project 2>&1 | Select-String 'Extracted Backend API URL', 'ERROR', 'PERMISSION_DENIED'

# 2. What is inside the bundle that is deployed right now?
if ($webUrl) {
  Write-Host "`n=== 2. Deployed bundle ===" -ForegroundColor Cyan
  $base = $webUrl.TrimEnd('/')
  $html = (Invoke-WebRequest $base -UseBasicParsing).Content
  foreach ($m in [regex]::Matches($html, 'src="(/assets/[^"]+\.js)"')) {
    $path = $m.Groups[1].Value
    $js   = (Invoke-WebRequest ($base + $path) -UseBasicParsing).Content
    $urls = [regex]::Matches($js, 'https://[a-z0-9-]+[a-z0-9.-]*run\.app') | ForEach-Object Value | Sort-Object -Unique
    Write-Host ("{0}`n  localhost:4000 hits: {1}`n  run.app URLs baked in: {2}" -f $path, [regex]::Matches($js, 'localhost:4000').Count, ($urls -join ', '))
  }
}

# 3. Hardcoded localhost, client constructions, env usage in source
Write-Host "`n=== 3. Source scan ===" -ForegroundColor Cyan
Get-ChildItem -Path apps, packages -Recurse -File -Include *.ts, *.tsx, *.js, *.jsx -ErrorAction SilentlyContinue |
  Where-Object { $_.FullName -notmatch '\\(node_modules|dist|\.turbo)\\' } |
  Select-String -Pattern 'localhost', 'new PrairieJoyClient', 'VITE_API_URL' |
  ForEach-Object { "{0}:{1}: {2}" -f (Resolve-Path -Relative $_.Path), $_.LineNumber, $_.Line.Trim() }

Write-Host "`n--- packages/api-client/package.json ---"
Get-Content packages/api-client/package.json

# 4. Build the web image locally with a marker URL and look inside it
Write-Host "`n=== 4. Local Docker build with marker URL ===" -ForegroundColor Cyan
docker build --build-arg VITE_API_URL=$marker -t pjb-web-test -f Dockerfile .
if ($LASTEXITCODE -ne 0) { Write-Host 'Docker build failed' -ForegroundColor Red; exit 1 }
$cmd = "grep -rhoE 'localhost:[0-9]+|pjb-test-api[a-z0-9.-]*' /usr/share/nginx/html | sort | uniq -c"
docker run --rm --entrypoint sh pjb-web-test -c $cmd