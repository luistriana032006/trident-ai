from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from app.services.export_service import MarkdownExporter
import logging
import os

router = APIRouter()
logger = logging.getLogger(__name__)

markdown_exporter = MarkdownExporter()


@router.get("/export/chat/{chat_id}")
async def export_chat(chat_id: int):
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


@router.get("/export/history")
async def export_history(limit: int = 10):
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
