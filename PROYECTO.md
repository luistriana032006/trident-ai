# Trident-AI — Documentación del Proyecto

> "Trident-AI es un sistema de búsqueda inteligente con arquitectura de microservicios. El nombre viene de los tres pilares que nunca cambian: IA local para privacidad, APIs estructuradas para precisión, y web search para alcance. Combina Spring Boot, Python y React para crear una experiencia de búsqueda poderosa y flexible."

---

## ¿Por qué "Trident"?

El tridente representa los **tres pilares fundamentales** de la arquitectura, inspirado en el tridente de Poseidón que domina los océanos. Como él, Trident-AI domina el océano de información.

| Pilar | Nombre | Descripción |
|-------|--------|-------------|
| 🔱 1 | **Local Intelligence** | Modelos de IA en tu hardware (Ollama). Privacidad total, sin internet. |
| 🔱 2 | **Structured Data** | APIs especializadas que retornan datos organizados (Bing Entity, Images, Video, GitHub). |
| 🔱 3 | **Unstructured Data** | Búsqueda web abierta para información diversa de múltiples fuentes (Bing Search). |

> El sistema puede tener 3, 5, 10 o 50 modos diferentes, pero **todos se categorizan en estos tres pilares**. Es una arquitectura conceptual, no un número fijo de funcionalidades.

---

## Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────┐
│  CAPA 1: FRONTEND (Next.js 16 + shadcn/ui)              │
│  Puerto: 3000                                            │
│  - Interface de usuario                                  │
│  - Selector de modo en dropdown (Local / Entity / Search)│
│  - Input de texto + mostrar respuestas                   │
│  - Panel lateral de referencias (Bing)                  │
│  - Mostrar "Powered by Bing" (requisito legal)          │
└─────────────────────────────────────────────────────────┘
                        ↓ HTTP REST
┌─────────────────────────────────────────────────────────┐
│  CAPA 2: BACKEND ORQUESTADOR (Spring Boot)              │
│  Puerto: 8080  ← API Gateway único                      │
│  - Recibe requests del frontend                          │
│  - Decide qué hacer según el modo                        │
│  - Consume Python service O Bing APIs                    │
│  - Validaciones, DTOs, manejo de errores, logging       │
│                                                          │
│  POST /api/chat/local   → llama Python service          │
│  POST /api/chat/entity  → llama Bing Entity + Python    │
│  POST /api/chat/search  → llama Bing Search + Python    │
└─────────────────────────────────────────────────────────┘
          ↓                              ↓
    ┌─────────┐                    ┌──────────────┐
    │ Python  │                    │  Bing APIs   │
    │ FastAPI │                    │  (Microsoft) │
    │ :8000   │                    │  Entity API  │
    └─────────┘                    │  Search API  │
          ↓                        └──────────────┘
    ┌─────────┐
    │ Ollama  │
    │ :11434  │
    └─────────┘
          ↓
    ┌─────────────────┐
    │ Modelos en VRAM │
    │  (1 a la vez)   │
    └─────────────────┘
```

**Comunicación entre capas:**
- Frontend ↔ Spring Boot: JSON via fetch/axios
- Spring Boot ↔ Python: JSON via RestTemplate/WebClient
- Spring Boot ↔ Bing: JSON via RestTemplate + API Keys
- Python ↔ Ollama: JSON via httpx (async)

---

## Versiones del Proyecto

### V1 — Los 3 Modos Fundamentales

Usa los 3 modelos de IA + Bing Entity Search + Bing Web Search.

```
MODO 1 — LOCAL (Sin Internet)
┌──────────────────────────────────────────────────────┐
│ Usuario: "Explica qué es polimorfismo en Java"       │
│   ↓                                                   │
│ Frontend → Spring Boot → Python → Ollama             │
│                                   (deepseek-r1:8b)   │
│ USO: Preguntas generales, código, explicaciones      │
│ API COST: $0 — no consume Bing                       │
└──────────────────────────────────────────────────────┘

MODO 2 — ENTITY (Búsqueda Específica)
┌──────────────────────────────────────────────────────┐
│ Usuario: "¿Quién es Satya Nadella?"                  │
│   ↓                                                   │
│ Spring Boot → Bing Entity API                        │
│              ↓ (nombre, cargo, empresa, bio)         │
│            Python → Ollama (qwen2.5:1.5b)            │
│              ↓ (formatea y resume la info)           │
│ USO: Personas, lugares, empresas, organizaciones     │
│ API COST: ~1–2 llamadas Bing por query               │
└──────────────────────────────────────────────────────┘

MODO 3 — SEARCH (Búsqueda Web Diversa)
┌──────────────────────────────────────────────────────┐
│ Usuario: "Novedades de IA en Colombia 2025"          │
│   ↓                                                   │
│ Spring Boot → Bing Web Search API                    │
│              ↓ (10 resultados: títulos, snippets)    │
│            Python → Ollama (qwen2.5:7b)              │
│              ↓ (analiza, resume, sintetiza)          │
│ USO: Noticias, temas amplios, investigación          │
│ API COST: ~1–3 llamadas Bing por query               │
└──────────────────────────────────────────────────────┘
```

### V2 — Modos Extendidos (6 en total)

Añade los modos restantes usando el resto de APIs disponibles.

```
🔱 PILAR 1: LOCAL INTELLIGENCE
└─ Modo 1: Local Chat         (deepseek-r1:8b)

🔱 PILAR 2: STRUCTURED DATA
├─ Modo 2: Entity Search      (Bing Entity API   + qwen2.5:1.5b)
├─ Modo 4: Image Search       (Bing Image API    + qwen2.5:1.5b)
├─ Modo 5: Video Search       (Bing Video API    + qwen2.5:1.5b)
└─ Modo 6: Code Search        (GitHub API        + qwen2.5:7b)

🔱 PILAR 3: UNSTRUCTURED DATA
└─ Modo 3: Web Search         (Bing Search API   + qwen2.5:7b)
```

---

## Stack Tecnológico

### Backend Java (Orquestador)
| Tecnología | Versión |
|-----------|---------|
| Java | 17+ |
| Spring Boot | 3.2.x |
| spring-boot-starter-web | REST APIs |
| spring-boot-starter-validation | Validaciones |
| lombok | Reducir boilerplate |
| spring-boot-devtools | Hot reload |

### Backend Python (Wrapper IA)
| Tecnología | Versión |
|-----------|---------|
| Python | 3.10+ |
| FastAPI | 0.109.0 |
| uvicorn | 0.27.0 |
| httpx | 0.26.0 |
| pydantic | 2.5.0 |
| python-dotenv | 1.0.0 |

### Frontend
| Tecnología | Versión |
|-----------|---------|
| Node.js | 18+ / 20+ |
| Next.js | 16.x (App Router) |
| React | 19.x |
| TypeScript | 5.7.x |
| Tailwind CSS | 4.x |
| shadcn/ui | componentes base |
| pnpm | package manager |
| Puerto | 3000 |

### Ollama (Modelos Locales)
```
Versión: Latest stable
OLLAMA_MAX_LOADED_MODELS=1   # 1 modelo en VRAM a la vez
OLLAMA_KEEP_ALIVE=5m
HSA_OVERRIDE_GFX_VERSION=11.0.0  # GPU AMD
OLLAMA_VULKAN=1
```

---

## APIs Externas

### Bing APIs (Microsoft Azure)

Una sola API Key, límites **separados** por servicio:

| API | Endpoint | Límite gratuito | Costo adicional |
|-----|----------|-----------------|-----------------|
| Bing Web Search | `/v7.0/search` | 1,000/mes | $7 / 1,000 |
| Bing Entity Search | `/v7.0/entities` | 1,000/mes | $7 / 1,000 |
| Bing Image Search | `/v7.0/images/search` | 1,000/mes | $7 / 1,000 |
| Bing Video Search | `/v7.0/videos/search` | 1,000/mes | $7 / 1,000 |

**Total gratuito: 4,000 llamadas/mes** con una sola cuenta de Azure.

**Obtener la key:** Azure Portal → Crear recurso "Bing Search v7" → Tier F1 (Free)

**Términos obligatorios de Bing:**
- Mostrar "Powered by Bing" donde se muestren resultados
- No almacenar resultados más de 24 horas
- No redistribuir ni revender datos
- Identificar tu app en headers HTTP (`User-Agent: TridentAI/1.0`)
- Mantener URLs y snippets originales sin modificar

### GitHub API

| Tier | Requests/hora | Costo |
|------|--------------|-------|
| Sin autenticación | 60 | Gratis |
| Con Personal Access Token | 5,000 | **Gratis siempre** |

**Permisos mínimos del token:** `public_repo`, `read:user`

---

## Estructura de Carpetas

```
trident-ai/
│
├── backend-spring/               # Java + Spring Boot (:8080)
│   └── src/main/java/com/tuapp/
│       ├── controller/           # Endpoints REST
│       │   └── ChatController.java
│       ├── service/              # Lógica de negocio
│       │   ├── ChatService.java
│       │   ├── BingEntityService.java
│       │   └── BingSearchService.java
│       ├── model/                # DTOs
│       │   ├── ChatRequest.java
│       │   └── ChatResponse.java
│       ├── config/               # Configuraciones
│       │   ├── CorsConfig.java
│       │   └── RestTemplateConfig.java
│       └── Application.java
│
├── backend-python/               # Python + FastAPI (:8000)
│   └── app/
│       ├── main.py               # Entry point FastAPI
│       ├── ollama_client.py      # Cliente HTTP async para Ollama
│       ├── chat_service.py       # Lógica de negocio del chat
│       ├── database.py           # SQLAlchemy + SQLite
│       └── models.py             # Pydantic models
│
├── frontend-react/               # Next.js 16 + shadcn/ui (:3000)
│   ├── app/                      # App Router de Next.js
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   └── components/
│       ├── model-selector.tsx    # Componente principal del chat
│       ├── model-dropdown.tsx    # Selector de modo (Entity/Search/Local)
│       ├── chat-input.tsx        # Input de mensajes
│       ├── chat-message.tsx      # Burbuja de mensaje
│       ├── references-panel.tsx  # Panel lateral de fuentes Bing
│       └── trident-logo.tsx      # Logo SVG
│
├── .gitignore                    # .env, node_modules, target/, __pycache__/
└── README.md
```

---

## Conceptos Técnicos Clave

| Concepto | Dónde se aplica |
|---------|----------------|
| **Microservicios** | Spring Boot y Python son servicios independientes, reemplazables por separado |
| **API Gateway Pattern** | Spring Boot es el único punto de entrada; el frontend nunca llama directamente a Python ni a Bing |
| **Strategy Pattern** | Cada modo es una estrategia distinta con la misma interfaz |
| **DTOs** | `ChatRequest` / `ChatResponse` validan y transportan datos entre capas |
| **Async/Await** | FastAPI + httpx hacen llamadas no bloqueantes a Ollama |
| **Model Routing** | deepseek (razonamiento) → llama (extracción) → qwen (síntesis) según la tarea |
| **One-Model-At-A-Time** | `OLLAMA_MAX_LOADED_MODELS=1` para no saturar la VRAM |
| **CORS** | CorsConfig.java permite que React (:5173) llame a Spring (:8080) |
| **Environment Variables** | API Keys de Bing en `.env`, nunca en código |
| **REST API** | Comunicación HTTP/JSON con status codes estándar |

---

## Costos Estimados (Uso de Desarrollo)

```
Escenario: 100 búsquedas/día distribuidas entre modos

40% Modo Local   → 0 API calls            → $0
20% Modo Entity  → ~600 calls/mes         → GRATIS (< 1,000)
25% Modo Web     → ~750 calls/mes         → GRATIS (< 1,000)
10% Modo Image   → ~300 calls/mes         → GRATIS (< 1,000)
 4% Modo Video   → ~120 calls/mes         → GRATIS (< 1,000)
 1% Modo Code    → ~30  calls/mes         → GRATIS (< 5,000/hora)

Ollama            → solo electricidad     → ~$2–5/mes

TOTAL MENSUAL PARA DESARROLLO: $0 USD ✅
```

---

## Plan de Desarrollo

| Etapa | Tareas | Estado |
|-------|--------|--------|
| Días 1–2 | Backend Python: `main.py`, `ollama_client.py`, funcional | ✅ |
| Días 3–4 | Backend Spring: Controllers, Services | Pendiente |
| Días 5–6 | Frontend React: Componentes, Vite | Pendiente |
| Día 7 | Integración final: los 3 servicios hablando entre sí | Pendiente |

---

## Buenas Prácticas del Proyecto

- **Seguridad:** API Keys en `.env`, nunca en commits; `.gitignore` incluye `.env`
- **Errores:** try-catch en todos los servicios; status codes 400 / 500 / 503; logging
- **Rate limiting:** Contador de llamadas a Bing; alertar si se acerca al límite
- **Performance:** Timeout de 30–60s en requests; loading states en frontend; streaming (avanzado)
- **UX:** Mensajes de progreso claros ("Cambiando modelo... 10–15 seg"); "Powered by Bing" visible; botón deshabilitado mientras procesa
- **Versionado:** `/api/v1/chat/...` en Spring Boot para compatibilidad futura
- **Git:** Branches `main` y `develop`; commits descriptivos; `__pycache__/`, `target/`, `node_modules/` ignorados