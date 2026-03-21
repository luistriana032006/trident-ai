from fastapi import APIRouter, HTTPException
from app.repositories.chat_repository import ChatRepository
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

chat_repository = ChatRepository()


@router.get("/stats")
async def get_stats():
    try:
        return chat_repository.get_stats()
    except Exception as e:
        logger.error(f"Error getting stats: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
