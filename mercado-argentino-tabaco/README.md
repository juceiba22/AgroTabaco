# TabacoStats Argentina 🌿
### Dashboard Interactivo de Inteligencia y Analítica del Sector Tabacalero Argentino

**TabacoStats Argentina** es una aplicación web analítica de grado empresarial desarrollada en **Python (Streamlit + Plotly + Pandas)**, diseñada para procesar, limpiar y visualizar datos históricos sobre la producción primaria, acopio, dinámica de precios e impacto del **Fondo Especial del Tabaco (FET)** y la estructura competitiva de las empresas acopiadoras en la República Argentina.

---

## 📁 Estructura del Proyecto

```text
mercado-argentino-tabaco/
├── app.py                                          # Punto de entrada principal del Dashboard Streamlit
├── data_loader.py                                  # Módulo ETL: carga segura, limpieza y normalización de datos
├── charts.py                                       # Biblioteca de gráficos interactivos Plotly con estilo corporativo
├── styles.py                                       # Hojas de estilo CSS personalizadas y componentes de tarjetas métricas
├── test_app.py                                     # Suite de pruebas automatizadas del pipeline de datos y gráficos
├── requirements.txt                                # Dependencias del proyecto
├── .streamlit/
│   └── config.toml                                 # Configuración del tema visual y servidor de Streamlit
│
├── csv_anuario_produccion_primaria.csv             # Dataset 1: Producción, superficie y rendimiento (1991-2023)
├── acopio_historico_unificado.csv                  # Dataset 2: Acopio por clases comerciales de calidad (2018-2025)
├── acopio_empresas_historico_unificado.csv         # Dataset 3: Acopio por empresa / razón social (2018-2025)
└── acopio_resumen_precios_historico_unificado.csv  # Dataset 4: Precios base de acopio y FET (2018-2025)
```

---

## 🚀 Cómo Ejecutar la Aplicación

1. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Ejecutar el dashboard:**
   ```bash
   streamlit run app.py
   ```
   *La aplicación se abrirá automáticamente en tu navegador en `http://localhost:8501`.*

3. **Ejecutar pruebas de validación:**
   ```bash
   python test_app.py
   ```

---

## 🧭 Módulos y Pestañas del Dashboard

### 🎛️ Barra Lateral (Sidebar) & Filtros Globales
- **Ámbito Geográfico / Provincia**: Selección dinámica entre *Nacional* o provincias tabacaleras individuales (*Jujuy, Salta, Misiones, Tucumán, Corrientes, Catamarca, Chaco*).
- **Campaña de Referencia**: Selector multianual para enfocar el análisis.
- **Variedad de Tabaco**: Filtrado por tipo (*Virginia, Burley, Criollo Misionero, Criollo Correntino, Criollo Chaqueño, Criollo Argentino, Kentucky, etc.*).

---

### 📊 Pestaña 1: KPIs Generales y Evolución Histórica (Producción & Rendimientos)
- **Tarjetas de Rendimiento Clave**:
  - Producción Total (Toneladas) con indicador delta de variación interanual.
  - Superficie Cosechada y Sembrada (Hectáreas).
  - Rendimiento Agrícola Promedio (kg/ha).
  - Tasa de Pérdida de Superficie (%).
- **Evolución Histórica Multianual (1991 a 2023+)**:
  - Gráfico interactivo con selector de desglose: *Por Variedad de Tabaco*, *Por Provincia* o *Total Nacional*.
- **Distribución Geográfica y Productividad**:
  - Gráfico Donut de participación provincial en el volumen nacional.
  - Comparativa de rendimiento agrícola (kg/ha) por provincia y variedad.
- **Tabla interactiva y exportación a CSV**.

---

### 💰 Pestaña 2: Dinámica de Precios y Fondo Especial del Tabaco (FET)
- **Estructura del Ingreso del Productor**:
  - Desglose entre **Precio de Acopio Base ($/kg)** y **Complemento FET ($/kg)**.
  - Cálculo del **Precio Total al Productor ($/kg)**.
  - Indicador porcentual de **Participación del FET en el ingreso total**.
- **Visualizaciones de Precios**:
  - Gráfico de barras apiladas multianual: evolución histórica de la composición del precio e impacto relativo del FET.
  - Paridad de precios por tipo de tabaco (Virginia vs Burley vs Criollos).
  - Dispersión y ranking de precios totales recibidos por provincia.
- **Descarga de datos de precios en CSV**.

---

### 🏢 Pestaña 3: Participación de Empresas y Razones Sociales
- **Indicadores de Concentración**:
  - Total de empresas acopiadoras activas.
  - Identificación del Líder de Mercado y cuota (%).
  - Participación conjunta del **Top 3 de empresas**.
  - **Índice Herfindahl-Hirschman (HHI)** de concentración de mercado con semáforo de competitividad.
- **Gráficos de Mercado**:
  - **Top N Empresas Acopiadoras** con control interactivo (slider de 5 a 20 empresas).
  - **Curva de Pareto (80/20)**: volumen individual y porcentaje acumulado de concentración.
  - **Treemap Jerárquico**: visualización de la estructura *Provincia > Variedad > Empresa* coloreada por precio promedio pagado ($/kg).
- **Directorio de razones sociales con ranking y exportación**.

---

### 🏷️ Pestaña 4: Clases Comerciales y Calidad de Acopio
- Identificación de clases comerciales registradas (*B1F, C1F, X1F, T1L, etc.*).
- Gráfico de las **Top 15 Clases Comerciales** más acopiadas a nivel nacional o provincial.
- Explorador tabular de calidad y volumen.

---

## 🛠️ Ingeniería de Datos y Normalización (`data_loader.py`)

1. **Gestión de Delimitadores y Encodings**: Manejo transparente de delimitadores coma (`,`) y punto y coma (`;`), con codificación robusta ante caracteres especiales (tildes, eñes, mojibake).
2. **Reconciliación de Escalas Numéricas**: Corrección de anomalías de separación de miles vs decimales en volúmenes históricos para garantizar cálculos exactos de precios y participaciones.
3. **Cálculo Automático de Precios Unitarios Faltantes**: Derivación precisa de precios unitarios a partir de las relaciones `valor_pesos / volumen_kg`.
4. **Caché Inteligente de Streamlit (`@st.cache_data`)**: Carga instantánea y navegación ultra fluida.
