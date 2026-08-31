@echo off
title Dashboard Analitico - Mercado Internacional de Tabaco
cd /d "%~dp0"
echo =====================================================================
echo  Iniciando Dashboard - Mercado Internacional de Tabaco (FAOstat)
echo =====================================================================
echo.
echo Abriendo aplicacion en el navegador web...
echo.
python -m streamlit run app.py --server.port 8502 --server.headless false
pause
