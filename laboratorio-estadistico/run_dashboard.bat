@echo off
title Laboratorio Estadistico - Mercado Interno de Tabaco
cd /d "%~dp0"
echo =====================================================================
echo  Iniciando Laboratorio Estadistico - Volumen, Precios y Consumo
echo =====================================================================
echo.
echo Abriendo aplicacion en el navegador web...
echo.
python -m streamlit run app.py --server.port 8503 --server.headless false
pause
