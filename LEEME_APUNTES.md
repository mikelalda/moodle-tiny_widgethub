# WidgetHub adaptado para los apuntes de Moodle (kit scorm2libro)

Fork de [jmulet/moodle-tiny_widgethub](https://github.com/jmulet/moodle-tiny_widgethub) (rama `main` del original;
los cambios están en la rama `apuntes`). Añade al plugin original:

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

## H5P en el editor

WidgetHub no lleva un editor de H5P: usa el de Moodle, que cubre todos los tipos del sitio.

1. Crea el H5P en el **Banco de contenido** del curso (Añadir > tipo de contenido) o ten a mano su `.h5p` o su URL.
2. En el editor, inserta **Apuntes · Contenido H5P** y escribe el texto alternativo (qué se practica).
3. Pulsa el recuadro «H5P pendiente» y después el **botón H5P** del editor: elige el contenido del banco, sube el
   `.h5p` o pega la URL. Moodle sustituye el recuadro y el H5P queda dentro del contenedor de los apuntes.

Si ya tienes la URL, pégala en el formulario del widget y te saltas el paso 3. Un recuadro pendiente que se guarde por
descuido no se muestra al alumnado, y «Revisar la página» lo señala. **Comprobación rápida** es la alternativa sin H5P:
pregunta, opciones y solución explicada en un desplegable (no corrige ni puntúa).

## Filtros

- **Apuntes · Revisar la página**: escribe al principio un recuadro con los problemas (varios h1, saltos de nivel,
  imágenes sin archivo o sin alt, enlaces «aquí», iframes que no son H5P, H5P pendientes o sin texto alternativo,
  marcas TODO-IA…) y los avisos (estilos pegados, desplegables largos, tablas sin encabezados, falta de conexión con
  la práctica). El recuadro solo se ve en el editor; bórralo al terminar.
- **Apuntes · Limpiar formato pegado**: quita estilos en línea, fuentes, spans y párrafos vacíos, cambia b/i por
  strong/em y elimina el recuadro de revisión.

## Instalación

- **Sitio sin WidgetHub**: copia esta carpeta en `lib/editor/tiny/plugins/widgethub` (o clona el repositorio ahí con
  `git clone -b apuntes …`) y completa la instalación desde Administración del sitio > Notificaciones. Los widgets y
  los estilos quedan activos sin más pasos.
- **Sitio con WidgetHub ya instalado**: sustituye la carpeta y completa la actualización (la versión `2026082506`
  fuerza la purga de cachés). Después, en la administración de WidgetHub, abre **Actualizar widgets**, marca los
  widgets «apuntes-*» y actualízalos. En un Moodle de pruebas, `recargar_widgets_apuntes.php` del kit lo hace por CLI.

## Mantenimiento

No edites a mano estos archivos: cambia `estilos_apuntes_moodle.css` o `integracion_moodle/widgethub/*.yml` en el kit
y ejecuta `python3 herramientas/adaptar_widgethub.py`; después haz commit en la rama `apuntes`. Para incorporar
mejoras del original: `git fetch upstream && git merge upstream/main` y vuelve a ejecutar el script.
WidgetHub descarta sin avisar los widgets cuyo código contiene `<script` o `<style`: el script lo comprueba.
