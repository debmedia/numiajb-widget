# Chat Embebido para Journey Builder

El chat embebido es un componente Web que permite integrar fácilmente una ventana de chat interactiva en cualquier página web o aplicación.
Este chat está diseñado para conectarse directamente a un flujo previamente creado y configurado en Journey Builder, lo que permite orquestar conversaciones, automatizar respuestas y personalizar la experiencia del usuario según los escenarios definidos en dicho flujo.

## Características

- **Integración simple:** insertá el widget con solo un tag `<script>`.
- **Interfaz conversacional:** interactuá con tus usuarios en tiempo real.
- **Altamente personalizable:** ajustá el estilo del widget según tu marca.

## ¿Qué es Journey Builder?

Journey Builder es un producto de NUMIA que permite diseñar, configurar y ejecutar flujos de interacción (journeys) con usuarios a través de distintos canales digitales. Está orientado a facilitar experiencias personalizadas de atención y respuesta automatizada, permitiendo definir caminos, condiciones, respuestas y acciones.

## Instalación

### CDN Link
Usá el Widget de Journey Builder directamente desde el CDN incluyendo la siguiente etiqueta <script> en tu archivo HTML:

```html
<script src="https://cdn.jsdelivr.net/gh/debmedia/numiajb-widget@1.0.0/dist/build/static/js/bundle.min.js"></script>
```

## Usage
```html
 <journey-builder-chat
    window_title="Journey Builder Chat"
    flow_id="flow id"
    host_url="jb url"
    api_key="user api key">
</journey-builder-chat>
```
