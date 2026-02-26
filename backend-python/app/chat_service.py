from datetime import datetime
from typing import Dict,Any
import time
from app.ollama_client import ollama_client
from app.database import ChatMessage, SessionLocal

class ChatService:
    """
    servicio que maneja a logica de negocio de chat
    """
    def __init__(self):
        self.ollama_client = ollama_client()

    async def process_chat(
        self,
        mode:str,
        prompt: str,
        model: str
    )-> Dict[str,Any]:

        """
        procesa un mensaje de chat y lo guarda en la base de datos

        args:
        mode: modo de chat (local, entity, search)
        prompt: pregunta del usuario
        model: modelo a usar

        returns:
        diccionario con la respuesta y metadata
        """

        # medir tiempo
        start_time = time.time()

        ## llamar al modelo
        ollama_response = await self.ollama_client.generate(model, prompt)

        ## calcular tiempo de respuesta
        response_time = time.time() - start_time

        ## extraer la respuesta
        response_text = ollama_response["response"]

        ## guardar en base de datos
        self._save_to_database(
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

    def _save_to_database(
        self,
        mode: str,
        prompt: str,
        response: str,
        model_used: str,
        response_time: float
    ):
        """
        guarda el mensaje y la respuesta en la base de datos
        """
        db = SessionLocal()
        try:
            chat_message = ChatMessage(
                mode=mode,
                prompt=prompt,
                response=response,
                model_used=model_used,
                response_time=response_time
            )
            db.add(chat_message)
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"Error guardando en DB: {e}")
        finally:
            db.close()

    def get_chat_history(self, limit: int = 10):
        """obtiene el historial de chats"""

        db = SessionLocal()

        try:
            messages = db.query(ChatMessage)\
                .order_by(ChatMessage.timestamp.desc())\
                .limit(limit)\
                .all()

            return messages

        finally:
            db.close()