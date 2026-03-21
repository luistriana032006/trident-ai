from fastapi import APIRouter
from app.api.v1.endpoints import chat, history, export, stats

router = APIRouter()

router.include_router(chat.router)
router.include_router(history.router)
router.include_router(export.router)
router.include_router(stats.router)
