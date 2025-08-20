# ============================================
# VIRTAAVA OY - DOMAINHOTELLI SIIRTOSKRIPTI
# ============================================
# Luo ZIP-tiedosto päivitetystä index.html:stä Desktop:iin
# Käyttö: Aja PowerShell:ssä: .\siirra_domainhotelliin.ps1

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "VIRTAAVA OY - DOMAINHOTELLI SIIRTOSKRIPTI" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Määritä polut
$projektiKansio = "C:\Users\HP\Dev\Virtaava Oy"
$desktopKansio = "$env:USERPROFILE\Desktop"
$paivays = Get-Date -Format "yyyy-MM-dd_HH-mm"
$zipNimi = "Virtaava_Oy_paivitetty_$paivays.zip"
$zipPolku = Join-Path $desktopKansio $zipNimi

# Tarkista että projekti löytyy
if (!(Test-Path $projektiKansio)) {
    Write-Host "❌ VIRHE: Projekti ei löydy polusta: $projektiKansio" -ForegroundColor Red
    exit 1
}

Write-Host "📁 Lähdepolku: $projektiKansio" -ForegroundColor Green
Write-Host "📁 Kohdepolku: $zipPolku" -ForegroundColor Green
Write-Host ""

# Luo väliaikainen kansio ZIP-sisältöä varten
$tempKansio = Join-Path $env:TEMP "Virtaava_Oy_temp"
if (Test-Path $tempKansio) {
    Remove-Item $tempKansio -Recurse -Force
}
New-Item -Path $tempKansio -ItemType Directory | Out-Null

Write-Host "🔄 Kopioidaan tiedostot..." -ForegroundColor Yellow

# Kopioi vain tarvittavat tiedostot (ei dev-tiedostoja)
$tiedostot = @(
    "index.html",
    "styles.css", 
    "script.js",
    "cookie-consent.js",
    ".htaccess",
    "favicon.svg",
    "robots.txt",
    "sitemap.xml"
)

# Luo img-kansio ja kopioi kuvat
$imgLahde = Join-Path $projektiKansio "img"
$imgKohde = Join-Path $tempKansio "img"
if (Test-Path $imgLahde) {
    New-Item -Path $imgKohde -ItemType Directory | Out-Null
    Copy-Item "$imgLahde\*" $imgKohde -Recurse
    Write-Host "  ✅ img/ kansio kopioitu" -ForegroundColor Green
}

# Tarkista erityisesti index.html (tärkeä!)
$indexHtml = Join-Path $projektiKansio "index.html"
if (!(Test-Path $indexHtml)) {
    Write-Host "❌ KRIITTINEN VIRHE: index.html ei löydy!" -ForegroundColor Red
    Write-Host "Polku: $indexHtml" -ForegroundColor Red
    exit 1
}

# Kopioi pääkansion tiedostot
foreach ($tiedosto in $tiedostot) {
    $lahde = Join-Path $projektiKansio $tiedosto
    if (Test-Path $lahde) {
        Copy-Item $lahde $tempKansio
        Write-Host "  ✅ $tiedosto kopioitu" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  $tiedosto ei löydy (ei kriittinen)" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "📦 Luodaan ZIP-tiedosto..." -ForegroundColor Yellow

# Poista vanha ZIP jos olemassa
if (Test-Path $zipPolku) {
    Remove-Item $zipPolku -Force
}

# Luo ZIP-tiedosto
try {
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    [System.IO.Compression.ZipFile]::CreateFromDirectory($tempKansio, $zipPolku)
    Write-Host "✅ ZIP-tiedosto luotu onnistuneesti!" -ForegroundColor Green
} catch {
    Write-Host "❌ VIRHE ZIP-tiedoston luonnissa: $_" -ForegroundColor Red
    exit 1
}

# Siivoa väliaikaiset tiedostot
Remove-Item $tempKansio -Recurse -Force

# Näytä tulokset
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "✅ VALMIS!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "📦 ZIP-tiedosto:" -ForegroundColor White
Write-Host "   $zipPolku" -ForegroundColor Yellow
Write-Host ""
Write-Host "📋 SEURAAVAT VAIHEET:" -ForegroundColor White
Write-Host "   1. Avaa Domainhotelli tiedostojenhallinta" -ForegroundColor Gray
Write-Host "   2. Mene public_html/ kansioon" -ForegroundColor Gray  
Write-Host "   3. TEE VARMUUSKOPIO vanhasta index.html:stä" -ForegroundColor Red
Write-Host "   4. Poista vanha index.html" -ForegroundColor Gray
Write-Host "   5. Siirrä ZIP:n sisältö public_html/ kansioon" -ForegroundColor Gray
Write-Host "   6. Testaa: https://hyvinvointivirtaava.fi/" -ForegroundColor Gray
Write-Host ""

# Avaa Desktop kansio
Write-Host "📂 Avataan Desktop..." -ForegroundColor Yellow
Start-Process "explorer.exe" -ArgumentList $desktopKansio

Write-Host "🎉 Skripti suoritettu onnistuneesti!" -ForegroundColor Green
Write-Host ""