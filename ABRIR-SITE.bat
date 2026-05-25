@echo off
cd /d "%~dp0"
title FeedMKT - servidor local
echo ========================================
echo FeedMKT - servidor local
echo ========================================
echo.
echo Pasta:
echo %cd%
echo.
echo Gerando build final do site...
call npm.cmd run build
if errorlevel 1 (
  echo.
  echo O build falhou. Veja os erros acima.
  pause
  exit /b 1
)
echo.
echo Site pronto em:
echo http://127.0.0.1:5173/
echo.
echo Mantenha esta janela aberta enquanto usa o site.
echo Se esta janela fechar, o site sai do ar.
echo.
node.exe scripts\serve-dist.cjs 5173
echo.
echo O servidor parou. Se apareceu erro acima, mande essa mensagem.
pause
