from fastapi import APIRouter, HTTPException
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.chat_service import ChatService
import logging

router = APIRouter()
logger = logging.getLogger(__name__)

chat_service = ChatService()

MODEL_MAP = {
    "local": "deepseek-r1:8b",
    "entity": "qwen2.5:1.5b",
    "search": "qwen2.5:7b"
}


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    logger.info(f"Chat request: mode={request.mode}, prompt_length={len(request.prompt)}")
    try:
        model = MODEL_MAP[request.mode]
        result = await chat_service.process_chat(mode=request.mode, prompt=request.prompt, model=model)
        logger.info(f"Chat completed: model={model}, time={result['response_time']}s")
        return ChatResponse(**result)
    except Exception as e:
        logger.error(f"Error in chat endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
