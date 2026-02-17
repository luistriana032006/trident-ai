import httpx
from typing import Dict, Any 
from app.config import Settings

class ollama_client:
    def __init__(self):
        self.base_url = Settings.OLLAMA_BASE_URL

    async def generate(self, model: str, prompt: str) -> Dict[str,Any]:
     """
        Genera una respuesta usando un modelo de Ollama
        
        Args:
            model: Nombre del modelo (ej: "deepseek-r1:8b")
            prompt: El texto a enviar al modelo
            
        Returns:
            Diccionario con la respuesta del modelo
        """
    
     async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                f"{self.base_url}/api/generate",
                json={
                "model": model,
                "prompt":prompt,
                "stream":False
                }
            )
            response.raise_for_status()
            return response.json()
     

