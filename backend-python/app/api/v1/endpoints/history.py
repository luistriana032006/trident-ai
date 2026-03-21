from fastapi import APIRouter, HTTPException
from app.services.chat_service import ChatService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

chat_service = ChatService()


@router.get("/history")
async def get_history(limit: int = 10):
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
