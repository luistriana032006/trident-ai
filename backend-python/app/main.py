from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from sqlalchemy import func
from app.config import settings
from app.models import ChatRequest, ChatResponse
from app.chat_service import ChatService
from app.markdown_export import MarkdownExporter
from app.database import ChatMessage, SessionLocal
import logging
import os

# Configurar logging primero, antes de instanciar la app
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Trident-AI python service",
    description="Servicio de IA local con ollama",
    version="1.0.0"
)

## instanciar servicios
chat_service = ChatService()
markdown_exporter = MarkdownExporter()

# CORS para que react pueda llamar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {
        "service": "Trident-AI Python",
        "status": "running",
        "version": "1.0.0",
        "ollama_url": settings.OLLAMA_BASE_URL,
        "features": ["chat", "history", "export", "stats"]
    }

@app.get("/health")
async def health():
    return {"status": "healthy"}

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Endpoint principal de chat
    - Procesa el mensaje con IA
    - Guarda en base de datos
    - Retorna respuesta
    """
    logger.info(f"Chat request: mode={request.mode}, prompt_length={len(request.prompt)}")

    try:
        model_map = {
            "local": "deepseek-r1:8b",
            "entity": "qwen2.5:1.5b",
            "search": "qwen2.5:7b"
        }

        model = model_map[request.mode]

        # Procesar chat (incluye guardado en DB)
        result = await chat_service.process_chat(
            mode=request.mode,
            prompt=request.prompt,
            model=model
        )

        logger.info(f"Chat completed: model={model}, time={result['response_time']}s")

        return ChatResponse(**result)

    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history")
async def get_history(limit: int = 10):
    """
    Obtiene el historial de conversaciones

    Query params:
    - limit: Numero maximo de chats (default: 10)
    """
    try:
        messages = chat_service.get_chat_history(limit=limit)

        return {
            "total": len(messages),
            "messages": [
                {
                    "id": msg.id,
                    "mode": msg.mode,
                    "prompt": msg.prompt[:100] + "..." if len(msg.prompt) > 100 else msg.prompt,
                    "response": msg.response[:100] + "..." if len(msg.response) > 100 else msg.response,
                    "model_used": msg.model_used,
                    "timestamp": msg.timestamp.isoformat(),
                    "response_time": msg.response_time
                }
                for msg in messages
            ]
        }
    except Exception as e:
        logger.error(f"Error getting history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/export/chat/{chat_id}")
async def export_chat(chat_id: int):
    """
    Exporta un chat específico a archivo Markdown

    Path params:
    - chat_id: ID del chat en la base de datos

    Returns: Archivo .md para descargar
    """
    try:
        filepath = markdown_exporter.export_chat(chat_id)
        logger.info(f"Chat {chat_id} exported to {filepath}")

        return FileResponse(
            filepath,
            media_type="text/markdown",
            filename=os.path.basename(filepath)
        )
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        logger.error(f"Error exporting chat: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/export/history")
async def export_history(limit: int = 10):
    """
    Exporta el historial completo a archivo Markdown

    Query params:
    - limit: Número de chats a exportar (default: 10)

    Returns: Archivo .md con todas las conversaciones
    """
    try:
        filepath = markdown_exporter.export_history(limit=limit)
        logger.info(f"History exported to {filepath}")

        return FileResponse(
            filepath,
            media_type="text/markdown",
            filename=os.path.basename(filepath)
        )
    except Exception as e:
        logger.error(f"Error exporting history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/stats")
async def get_stats():
    """
    Obtiene estadisticas de uso del sistema

    Returns:
    - total_chats: total de conversaciones
    - chats_by_mode: cantidad por cada modo
    - avg_response_time: tiempo promedio de respuesta
    """
    db = SessionLocal()
    try:
        # Total de chats
        total_chats = db.query(ChatMessage).count()

        # Chats por modo
        modes = db.query(ChatMessage.mode, func.count(ChatMessage.id))\
            .group_by(ChatMessage.mode)\
            .all()

        # Tiempo promedio de respuesta
        avg_time = db.query(func.avg(ChatMessage.response_time)).scalar()

        return {
            "total_chats": total_chats,
            "chats_by_mode": {mode: count for mode, count in modes},
            "avg_response_time": round(avg_time or 0, 2)
        }
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
