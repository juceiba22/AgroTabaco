# Dashboard Analítico del Mercado Internacional de Tabaco 🍃

Plataforma analítica corporativa e interactiva para el estudio y visualización del **Mercado Internacional de Tabaco**, basada en las series estadísticas históricas oficiales de **FAOstat / Our World in Data (1961 - 2024)**.

---

## 🚀 Características Principales

1. **Robustez y Resiliencia de Datos**:
   - Carga segura multienconding (`utf-8-sig`, `utf-8`, `latin-1`, `cp1252`) con tolerancia a caracteres especiales y nulos.
   - Clasificación automatizada de **Países Soberanos (códigos ISO-3)** frente a **Agregados Regionales / Continentales**.
   - Mapeo bilingüe (Español / Inglés) con banderas nacionales y agrupación regional.

2. **Diseño Visual Corporativo Dark Mode**:
   - Estética ejecutiva con tarjetas KPI interactivas, métricas con variación interanual (YoY) y cuotas de mercado.
   - Paleta cromática optimizada de alto contraste.

3. **Visualizaciones Analíticas Avanzadas**:
   - **Evolución Histórica**: Líneas temporales con multiselección de países, escala lineal/logarítmica y análisis de crecimiento indexado (Base 100).
   - **Ranking Global & Cuota de Mercado**: Gráficos de barras de los principales productores mundiales y distribución porcentual del mercado (% Share).
   - **Mapa Mundial Interactivo**: Mapa coroplético global interactivo con intensidad de producción por país.
   - **Foco Estratégico Argentina**: Diagnóstico de la posición de Argentina a nivel global y regional en Sudamérica.
   - **Matriz de Datos & Exportador CSV**: Búsqueda, ordenamiento y descarga directa en CSV con codificación UTF-8.

4. **Extensibilidad Multi-Dataset**:
   - Motor dinámico que auto-detecta cualquier nuevo archivo CSV que se incorpore a la carpeta `FAOstat/` (ej. importaciones, exportaciones, precios de mercado o consumo global).

---

## 📂 Estructura del Proyecto

```
mercado-global-tabaco/
├── FAOstat/
│   ├── tobacco-production.csv           # Datos históricos de producción mundial (FAO / OWID)
│   ├── tobacco-production.metadata.json # Metadatos oficiales y citaciones
│   └── readme.md                        # Documentación técnica del dataset original
├── data_loader.py                       # Módulo de lectura robusta, normalización y detección dinámica
├── styles.py                            # Sistema de diseño Dark Mode y componentes visuales HTML/CSS
├── charts.py                            # Generador de gráficos interactivos Plotly
├── app.py                               # Aplicación principal de Streamlit
├── run_dashboard.bat                    # Script de inicio en 1-clic (Windows)
├── requirements.txt                     # Dependencias del proyecto
└── README.md                            # Documentación del proyecto
```

---

## 💻 Instrucciones de Instalación y Ejecución

### Opción 1: Ejecución Rápida en Windows
Doble clic en el archivo:
```bat
run_dashboard.bat
```

### Opción 2: Desde la Terminal
```bash
# 1. Instalar dependencias (si aún no están instaladas)
pip install -r requirements.txt

# 2. Ejecutar la aplicación
streamlit run app.py
```

La aplicación se abrirá automáticamente en tu navegador web en `http://localhost:8501` (o el puerto asignado).

---

## 📚 Citación Oficial

> **Food and Agriculture Organization of the United Nations (2025) – with major processing by Our World in Data.**  
> *“Tobacco production – UN FAO” [dataset]. Food and Agriculture Organization of the United Nations, “Production: Crops and livestock products”.*
