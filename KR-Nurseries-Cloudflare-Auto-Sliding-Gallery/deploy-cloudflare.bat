@echo off
setlocal
where npx >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm is required. Install Node.js first.
  exit /b 1
)
echo Logging in to Cloudflare if required...
npx wrangler login
if errorlevel 1 exit /b 1
echo Deploying KR Nurseries...
npx wrangler pages deploy public --project-name kr-nurseries
if errorlevel 1 exit /b 1
echo Deployment complete.
endlocal
