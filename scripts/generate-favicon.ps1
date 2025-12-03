# PowerShell script to generate favicon.ico from icon-192x192.png
# This script attempts multiple methods to create favicon.ico for legacy browser support

$ErrorActionPreference = "Continue"
$sourceIcon = "public/icon-192x192.png"
$outputFavicon = "public/favicon.ico"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Favicon.ico Generation Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if source file exists
if (-not (Test-Path $sourceIcon)) {
    Write-Host "ERROR: Source file not found: $sourceIcon" -ForegroundColor Red
    Write-Host "Please ensure icon-192x192.png exists in the public/ directory." -ForegroundColor Yellow
    exit 1
}

Write-Host "Source icon found: $sourceIcon" -ForegroundColor Green
Write-Host ""

# Method 1: Try ImageMagick
Write-Host "Attempting Method 1: ImageMagick..." -ForegroundColor Yellow
try {
    $magickCmd = Get-Command magick -ErrorAction SilentlyContinue
    if ($magickCmd) {
        Write-Host "ImageMagick found! Generating favicon.ico..." -ForegroundColor Green
        & magick $sourceIcon -resize 32x32 $outputFavicon
        if (Test-Path $outputFavicon) {
            Write-Host "SUCCESS: favicon.ico generated using ImageMagick!" -ForegroundColor Green
            Write-Host "Output: $outputFavicon" -ForegroundColor Green
            exit 0
        }
    } else {
        Write-Host "ImageMagick not found. Trying next method..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "ImageMagick method failed: $_" -ForegroundColor Yellow
}

Write-Host ""

# Method 2: Try Node.js with sharp package
Write-Host "Attempting Method 2: Node.js with sharp package..." -ForegroundColor Yellow
try {
    $nodeCmd = Get-Command node -ErrorAction SilentlyContinue
    if ($nodeCmd) {
        Write-Host "Node.js found! Checking for sharp package..." -ForegroundColor Green
        
        # Check if sharp is installed
        $sharpCheck = & node -e "try { require('sharp'); console.log('installed'); } catch(e) { console.log('not-installed'); }" 2>$null
        if ($sharpCheck -eq "installed") {
            Write-Host "sharp package found! Generating favicon.ico..." -ForegroundColor Green
            
            # Create temporary Node.js script
            $tempScript = @"
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sourceIcon = path.join(__dirname, 'public', 'icon-192x192.png');
const outputFavicon = path.join(__dirname, 'public', 'favicon.ico');

sharp(sourceIcon)
  .resize(32, 32)
  .toFile(outputFavicon)
  .then(() => {
    console.log('SUCCESS: favicon.ico generated using sharp!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('ERROR:', err.message);
    process.exit(1);
  });
"@
            $tempScriptPath = "temp-favicon-generator.js"
            $tempScript | Out-File -FilePath $tempScriptPath -Encoding UTF8
            
            & node $tempScriptPath
            $nodeExitCode = $LASTEXITCODE
            
            # Clean up temp script
            Remove-Item $tempScriptPath -ErrorAction SilentlyContinue
            
            if ($nodeExitCode -eq 0 -and (Test-Path $outputFavicon)) {
                Write-Host "SUCCESS: favicon.ico generated using Node.js/sharp!" -ForegroundColor Green
                Write-Host "Output: $outputFavicon" -ForegroundColor Green
                exit 0
            }
        } else {
            Write-Host "sharp package not installed. Trying next method..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "Node.js not found. Trying next method..." -ForegroundColor Yellow
    }
} catch {
    Write-Host "Node.js/sharp method failed: $_" -ForegroundColor Yellow
}

Write-Host ""

# Method 3: Manual instructions
Write-Host "========================================" -ForegroundColor Red
Write-Host "AUTOMATION FAILED" -ForegroundColor Red
Write-Host "========================================" -ForegroundColor Red
Write-Host ""
Write-Host "All automated methods failed. Please generate favicon.ico manually:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Option 1: Online Converter (Recommended)" -ForegroundColor Cyan
Write-Host "  1. Visit: https://favicon.io/favicon-converter/" -ForegroundColor White
Write-Host "     OR: https://realfavicongenerator.net/" -ForegroundColor White
Write-Host "  2. Upload: $sourceIcon" -ForegroundColor White
Write-Host "  3. Download the generated favicon.ico" -ForegroundColor White
Write-Host "  4. Save it to: $outputFavicon" -ForegroundColor White
Write-Host ""
Write-Host "Option 2: Install ImageMagick" -ForegroundColor Cyan
Write-Host "  1. Download from: https://imagemagick.org/script/download.php" -ForegroundColor White
Write-Host "  2. Install ImageMagick" -ForegroundColor White
Write-Host "  3. Run this script again" -ForegroundColor White
Write-Host ""
Write-Host "Option 3: Install Node.js sharp package" -ForegroundColor Cyan
Write-Host "  1. Run: npm install sharp" -ForegroundColor White
Write-Host "  2. Run this script again" -ForegroundColor White
Write-Host ""
Write-Host "For detailed instructions, see:" -ForegroundColor Yellow
Write-Host "  C:\Users\MaybeMax\Documents\UserActionNeeded\IconCacheClearing.md" -ForegroundColor White
Write-Host ""
exit 1

