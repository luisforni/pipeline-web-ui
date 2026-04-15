# Pipeline Web UI

Dashboard web para interactuar con el Multi-Agent AI Pipeline. Construido con Next.js 15, TypeScript y Tailwind CSS. Permite configurar y ejecutar el pipeline completo desde el navegador, con vista de resultados en pestañas separadas para investigación, resumen y contenido generado.

## Características

- Formulario con selector de tema, formato de salida, estilo de resumen, motor de orquestación e idioma
- Indicador de progreso animado durante la ejecución del pipeline
- Panel de resultados con tres pestañas: Investigación, Resumen y Contenido
- Botón de copia al portapapeles por pestaña
- Tema oscuro con diseño minimalista
- Proxy de API server-side para evitar problemas de CORS

## Pantalla principal

Al abrir la aplicación se muestra un formulario con los siguientes controles:

| Campo | Opciones |
|---|---|
| Tema | Campo de texto libre con ejemplos predefinidos |
| Formato de salida | Blog post, Reporte, Redes sociales |
| Estilo de resumen | Bullets, Narrativo, Técnico |
| Motor | CrewAI, LangGraph |
| Idioma | Inglés, Español, Portugués, Francés, Alemán |

Al hacer clic en **Run pipeline**, el frontend llama al proxy `/api/pipeline/run` que redirige la petición al orchestrator en `http://orchestrator:9000` dentro de la red Docker.

## Estructura

```
pipeline-web-ui/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── pipeline/
│   │   │       └── run/
│   │   │           └── route.ts      # Proxy server-side al orchestrator
│   │   ├── globals.css               # Estilos Tailwind base
│   │   ├── layout.tsx                # Layout raíz con fuente Inter
│   │   └── page.tsx                  # Página principal con estado y lógica
│   └── components/
│       ├── PipelineForm.tsx          # Formulario de configuración
│       └── ResultPanel.tsx           # Panel de resultados con pestañas
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── Dockerfile
```

### `page.tsx`

Componente cliente principal. Gestiona el estado global: `loading`, `error` y `result`. Orquesta la llamada al API y pasa los datos a los componentes hijo.

### `PipelineForm.tsx`

Formulario controlado con estado local `PipelineParams`. Incluye un helper `SelectField` reutilizable para los selectores y ejemplos de temas predefinidos como shortcuts.

### `ResultPanel.tsx`

Panel de resultados con tabs (`research`, `summary`, `content`). Muestra la barra de metadata (motor utilizado, estado del pipeline) y el botón de copia.

### `route.ts` (API route)

Proxy server-side que recibe el POST del cliente y reenvía la petición al orchestrator usando `process.env.ORCHESTRATOR_URL`. Esto permite que la URL del orchestrator se resuelva en runtime desde la variable de entorno, y evita que el navegador tenga que acceder directamente al servicio interno.

## Variables de entorno

| Variable | Descripción | Por defecto |
|---|---|---|
| `ORCHESTRATOR_URL` | URL del servicio orchestrator | `http://localhost:9000` |
| `WEB_PORT` | Puerto del servidor Next.js | `3010` |

## Ejecución local (modo desarrollo)

```bash
npm install
ORCHESTRATOR_URL=http://localhost:9000 npm run dev
```

La aplicación estará disponible en `http://localhost:3000`.

## Docker

El Dockerfile usa un build multi-stage:

1. **deps**: instala las dependencias npm
2. **builder**: compila la aplicación Next.js con output `standalone`
3. **runner**: imagen mínima con el servidor de producción

```bash
docker build -t pipeline-web-ui .
docker run -p 3010:3000 -e ORCHESTRATOR_URL=http://orchestrator:9000 pipeline-web-ui
```

## Integración con Docker Compose

El servicio `web` en `docker-compose.yml` inyecta automáticamente `ORCHESTRATOR_URL=http://orchestrator:9000`, lo que permite la comunicación interna entre contenedores sin exponer el orchestrator al exterior.
