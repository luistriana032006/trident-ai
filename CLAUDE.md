# Contexto para Claude — Trident-AI

---

## Qué es este proyecto

Sistema de búsqueda inteligente con arquitectura de microservicios.
Combina modelos de IA local (Ollama), APIs de búsqueda y GitHub para crear tres modos de búsqueda:
- **Local**: responde con modelos de IA sin internet
- **Entity**: busca personas, lugares o empresas con API de entidades (pendiente definir — Bing Entity se elimina) + IA
- **Search**: busca información web con Brave Search API + IA

El frontend es Next.js, el orquestador es Spring Boot y el wrapper de IA es FastAPI + Python.

---

## Stack tecnológico

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui — puerto 3000
- **Backend orquestador**: Java 17, Spring Boot 3.2 — puerto 8080
- **Backend IA**: Python 3.10+, FastAPI, httpx, SQLAlchemy, SQLite — puerto 8000
- **Modelos locales**: Ollama (deepseek-r1:8b, qwen2.5:1.5b, qwen2.5:7b)
- **APIs externas**: Brave Search API (web search), API de entidades TBD, GitHub API

---

## En qué etapa está

V1 en desarrollo: los 3 modos fundamentales (Local, Entity, Search).

Backend Python: COMPLETO y funcionando.
Estructura real (ver arquitectura.md para detalle):
config.py, db/database.py, models/chat.py, schemas/chat.py,
integrations/ollama.py, repositories/chat_repository.py,
services/chat_service.py, services/export_service.py,
api/v1/endpoints/ (chat, history, export, stats), main.py

Backend Spring Boot: pendiente de implementar.
Frontend Next.js: componentes creados, integracion pendiente.

El code review del backend Python esta pendiente — los apuntes anteriores
documentaban una estructura vieja que ya no existe. (ver log.md)

---

## Cómo quiero que me ayudes

- Cuando revises código, pregúntame qué hace cada bloque antes de explicármelo.
  Yo respondo con lo que entiendo, y lo que no entienda lo anotamos.
- No me des código completo a menos que te lo pida explícitamente.
  Puedes dar ejemplos parciales para ilustrar un concepto.
- Cuando propongas algo, muéstrame máximo 2 opciones y dime cuál es mejor y por qué.
- Si ves algo incorrecto en mi código aunque no te lo haya preguntado, dímelo.

---

## Marco para estudiar versiones nuevas (comoEstudiarVersiones)

Antes de implementar una versión nueva (V2, V3, etc.), seguir este orden:

1. ¿Qué hace esta versión que la anterior no hace?
2. ¿Qué conceptos nuevos aparecen?
3. ¿Qué librerías los implementan y por qué esa y no otra?
4. ¿Cómo se conecta con lo que ya existe?
5. Ahí sí → implementar con IA asistiendo

---

## Decisiones ya tomadas (no cuestionar)

- Spring Boot es el API Gateway único. El frontend nunca llama directo a Python ni a Bing.
- Un solo modelo cargado en VRAM a la vez (OLLAMA_MAX_LOADED_MODELS=1) por limitación de 8GB RDNA3.
- SQLite como base de datos del backend Python (historial de chats). Sin PostgreSQL en esta versión.
- Los API Keys (Brave Search, y la de entidades cuando se defina) van en .env, nunca en el código.
