# WidgetHub adaptado para los apuntes (kit scorm2libro)

Esta copia de WidgetHub incluye, además del plugin original:

- **Estilos de los apuntes** (`estilos_apuntes_moodle.css` sin la regla `body`) al final de `styles.css` (todas las
  páginas de Moodle) y de `editor_styles.css` (dentro del editor, con ayudas visuales). Están entre las marcas
  `>>> APUNTES scorm2libro` y `<<< APUNTES scorm2libro`.
- **19 widgets de serie** en la categoría «apuntes» (`repository/ib-apuntes-*.yml` y `repository/json/ib-apuntes-*.json`):
  - `apuntes-pagina`: Apuntes · Página nueva (contenedor y título)
  - `apuntes-objetivos`: Apuntes · Objetivos de aprendizaje
  - `apuntes-indice`: Apuntes · Mapa del contenido
  - `apuntes-bloque`: Apuntes · Bloque pedagógico
  - `apuntes-desplegable`: Apuntes · Desplegable (pista, solución o ampliación)
  - `apuntes-ejemplo-resuelto`: Apuntes · Ejemplo resuelto por subobjetivos
  - `apuntes-errores`: Apuntes · Tabla de errores frecuentes
  - `apuntes-tabla`: Apuntes · Tabla de consulta o comparación
  - `apuntes-codigo`: Apuntes · Bloque de código
  - `apuntes-h5p`: Apuntes · Contenido H5P
  - `apuntes-checklist`: Apuntes · Lista de comprobación
  - `apuntes-comprobacion`: Apuntes · Comprobación rápida (sin H5P)
  - `apuntes-imagen`: Apuntes · Imagen informativa
  - `apuntes-enlace`: Apuntes · Enlace, descarga o vídeo con contexto
  - `apuntes-resumen`: Apuntes · Resumen operativo
  - `apuntes-practica`: Apuntes · Conexión con la práctica
  - `apuntes-cita`: Apuntes · Cita
  - `apuntes-revisar`: Apuntes · Revisar la página (informe)
  - `apuntes-limpiar`: Apuntes · Limpiar formato pegado

## Instalación

- **Sitio sin WidgetHub**: copia esta carpeta en `lib/editor/tiny/plugins/widgethub` y completa la instalación desde
  Administración del sitio > Notificaciones. Los widgets y los estilos quedan activos sin más pasos.
- **Sitio con WidgetHub ya instalado**: sustituye la carpeta y completa la actualización (la versión
  `2026082505` fuerza la purga de cachés). Después, en la administración de WidgetHub, abre **Actualizar widgets**,
  marca los widgets «apuntes-*» (estado «Nuevo») y actualízalos.

No edites estos archivos a mano: cambia `estilos_apuntes_moodle.css` o `integracion_moodle/widgethub/*.yml` en el kit
y ejecuta `python3 herramientas/adaptar_widgethub.py`.
