# Script de inicio de Trident-AI
Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  🔱 TRIDENT-AI - INICIANDO SERVIDOR" -ForegroundColor Green
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Verificar que Ollama esté corriendo
Write-Host "📌 Verificando Ollama..." -ForegroundColor Yellow
try {
    response = Invoke-WebRequest -Uri "http://localhost:11434" -UseBasicParsing -ErrorAction Stop
    Write-Host "   ✅ Ollama corriendo" -ForegroundColor Green
} catch {
    Write-Host "   ⚠️  Ollama no responde, iniciando..." -ForegroundColor Yellow
    Start-ScheduledTask -TaskName "OllamaAutoStart"
    Start-Sleep -Seconds 5
}

Write-Host ""
Write-Host "📌 Activando entorno virtual..." -ForegroundColor Yellow

# Navegar a backend-python
Set-Location -Path "$PSScriptRoot\backend-python"

# Activar venv
& "..\venv_trindentIA\Scripts\Activate.ps1"

Write-Host "   ✅ Entorno activado" -ForegroundColor Green
Write-Host ""
Write-Host "📌 Iniciando servidor FastAPI..." -ForegroundColor Yellow
Write-Host "   🌐 URL: http://localhost:8000" -ForegroundColor Cyan
Write-Host "   📚 Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "  ✅ SERVIDOR CORRIENDO" -ForegroundColor Green
Write-Host "  Para detener: Ctrl+C" -ForegroundColor Yellow
Write-Host "═══════════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Iniciar servidor
uvicorn app.main:app --reload --port 8000
