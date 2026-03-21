import httpx
from typing import Dict, Any
from app.config import settings


class OllamaClient:
    def __init__(self):
        self.base_url = settings.OLLAMA_BASE_URL

    async def generate(self, model: str, prompt: str) -> Dict[str, Any]:
        """
        Genera una respuesta usando un modelo de Ollama

        Args:
            model: Nombre del modelo (ej: "deepseek-r1:8b")
            prompt: El texto a enviar al modelo

        Returns:
            Diccionario con la respuesta del modelo
        """
        prompt = f"Responde siempre en español. \n\nPregunta:{prompt}"

        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json={"model": model, "prompt": prompt, "stream": False}
            )
            response.raise_for_status()
            return response.json()
