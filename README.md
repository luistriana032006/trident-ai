# Trident AI

Sistema de búsqueda inteligente con arquitectura de microservicios. Combina modelos de IA local (Ollama) con APIs de búsqueda para ofrecer tres modos de respuesta.

---

## Modos — V1 completo ✓

| Modo | Descripción | Fuente |
|------|-------------|--------|
| **Local** | Responde con IA sin internet | Ollama (modelos locales) |
| **Entity** | Busca personas por nombre y sintetiza su perfil | Wikidata API + Ollama |
| **Search** | Busca información web y sintetiza resultados | Brave Search API + Ollama |

---

## Stack

| Capa | Tecnología | Puerto |
|------|-----------|--------|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS | 3000 |
| Orquestador | Java 17, Spring Boot 3.2 | 8080 |
| IA wrapper | Python 3.10+, FastAPI | 8000 |
| Modelos | Ollama (deepseek-r1:8b, qwen2.5:1.5b, qwen2.5:7b) | 11434 |

---

## Arquitectura

```
Frontend (Next.js :3000)
        |
        v
Backend Orquestador (Spring Boot :8080)  ← API Gateway único
        |                    |
        v                    v
Backend IA              APIs externas
(FastAPI :8000)         - Brave Search API (modo Search)
        |               - Wikidata API (modo Entity)
        v
     Ollama :11434
```

El frontend nunca llama directo a Python ni a las APIs externas. Todo pasa por Java.

---

## Cómo correr

### Requisitos
- Java 17+, Maven
- Python 3.10+
- Node.js 18+
- Ollama corriendo con al menos uno de los modelos

### Variables de entorno
Crear `backend-java/trident-ia/.env`:
```
BRAVE_API_KEY=tu_key_aqui
```

### Arrancar servicios

```bash
# Python
cd backend-python && source venv/bin/activate
uvicorn app.main:app --reload --port 8000

# Java
cd backend-java/trident-ia
mvn spring-boot:run

# Frontend
cd frontend-react
npm run dev
```

---

## Modelos por modo

| Modelo | Modo |
|--------|------|
| deepseek-r1:8b | Local |
| qwen2.5:1.5b | Entity |
| qwen2.5:7b | Search |
