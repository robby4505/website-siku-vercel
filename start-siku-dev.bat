@echo off
chcp 65001 >nul
title SIKU Local Dev Launcher
echo ========================================
echo   SIKU Local Development Environment
echo ========================================
echo.

REM Pastikan script berjalan di folder proyek
cd /d "%~dp0"

REM Cek apakah Ollama terinstal
where ollama >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Ollama tidak ditemukan. Silakan instal Ollama terlebih dahulu.
    pause
    exit /b
)

REM Cek apakah Vercel CLI terinstal
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Vercel CLI tidak ditemukan. Jalankan: npm i -g vercel
    pause
    exit /b
)

echo [1/2] Memulai Ollama & memuat model qwen2.5:7b...
start "🤖 Ollama - Qwen2.5" cmd /k "ollama run qwen2.5:7b"
timeout /t 5 /nobreak >nul

echo [2/2] Memulai Vercel Local Server...
start "🚀 Vercel Dev" cmd /k "vercel dev"

echo.
echo ✅ Semua layanan berhasil diluncurkan di jendela terpisah!
echo    🌐 Website: http://localhost:3000
echo    🔌 Ollama API: http://localhost:11434
echo.
echo 💡 Tip: Tutup jendela Ollama/Vercel untuk menghentikan layanan.
echo.
pause >nul