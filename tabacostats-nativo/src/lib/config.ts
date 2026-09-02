// Pestaña "Mercado Internacional" oculta a pedido del usuario, mismo
// estado que en la versión Streamlit (SHOW_MERCADO_INTERNACIONAL = False
// en mercado-argentino-tabaco/app.py) y mismo patrón que MERCADO_ENABLED
// del portal principal — el código queda intacto, este flag es lo único
// que la apaga (no se renderiza ni el trigger de la pestaña ni su contenido).
export const MERCADO_INTERNACIONAL_ENABLED = false;
