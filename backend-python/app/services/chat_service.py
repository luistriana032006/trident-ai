import time
from typing import Dict, Any
from app.integrations.ollama import OllamaClient
from app.repositories.chat_repository import ChatRepository


class ChatService:
    def __init__(self):
        self.ollama = OllamaClient()
        self.repository = ChatRepository()

    async def process_chat(self, mode: str, prompt: str, model: str) -> Dict[str, Any]:
        start_time = time.time()

        ollama_response = await self.ollama.generate(model, prompt)
        response_time = time.time() - start_time
        response_text = ollama_response["response"]

        self.repository.save(
            mode=mode,
            prompt=prompt,
            response=response_text,
            model_used=model,
            response_time=response_time
        )

        return {
            "mode": mode,
            "response": response_text,
            "model_used": model,
            "response_time": round(response_time, 2)
        }

    def get_chat_history(self, limit: int = 10):
        return self.repository.get_history(limit=limit)
