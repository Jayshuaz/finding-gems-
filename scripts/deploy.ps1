# Gems Signals — Windows Deployment Script
# Usage: .\scripts\deploy.ps1

Write-Host "💎 Gems Signals — Deployment" -ForegroundColor Magenta
Write-Host "==============================" -ForegroundColor Magenta
Write-Host ""

# Check prerequisites
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Cyan

try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is required. Install from https://nodejs.org" -ForegroundColor Red
    exit 1
}

try {
    $npmVersion = npm --version
    Write-Host "✅ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm is required." -ForegroundColor Red
    exit 1
}

try {
    $gitVersion = git --version
    Write-Host "✅ $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Git is required. Install from https://git-scm.com" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Initialize git if not already
if (-not (Test-Path ".git")) {
    Write-Host "📦 Initializing git repository..." -ForegroundColor Cyan
    git init
    git add .
    git commit -m "Initial commit: Gems Signals platform"
    Write-Host "✅ Git initialized and committed" -ForegroundColor Green
} else {
    Write-Host "✅ Git already initialized" -ForegroundColor Green
}
Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Generate Prisma client
if (Test-Path "prisma/schema.prisma") {
    Write-Host "🗄️ Generating Prisma client..." -ForegroundColor Cyan
    npx prisma generate
    Write-Host "✅ Prisma client generated" -ForegroundColor Green
}
Write-Host ""

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Cyan
npm test -- --run
Write-Host ""

# Build
Write-Host "🏗️ Building application..." -ForegroundColor Cyan
npm run build
Write-Host "✅ Build complete" -ForegroundColor Green
Write-Host ""

# Deploy to Vercel
$vercelExists = Get-Command vercel -ErrorAction SilentlyContinue
if ($vercelExists) {
    Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
    vercel --prod
    Write-Host "✅ Deployed to Vercel" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Vercel CLI not installed. Install with: npm i -g vercel" -ForegroundColor Yellow
    Write-Host "   Then run: vercel --prod" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Deployment complete!" -ForegroundColor Magenta
Write-Host "==============================" -ForegroundColor Magenta
Write-Host "Next steps:" -ForegroundColor White
Write-Host "1. Create a GitHub repo and push: git remote add origin <url> && git push -u origin main"
Write-Host "2. Set up PostgreSQL database (Supabase/Railway/Neon)"
Write-Host "3. Configure environment variables in Vercel dashboard"
Write-Host "4. Run: npx prisma migrate dev --name init"
Write-Host "5. Run: npm run db:seed"
Write-Host ""