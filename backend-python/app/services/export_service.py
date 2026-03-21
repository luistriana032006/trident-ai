from datetime import datetime
from typing import List
import os
from app.repositories.chat_repository import ChatRepository
from app.models.chat import ChatMessage


class MarkdownExporter:
    def __init__(self):
        self.exports_dir = "exports"
        os.makedirs(self.exports_dir, exist_ok=True)
        self.repository = ChatRepository()

    def export_chat(self, chat_id: int) -> str:
        chat = self.repository.get_by_id(chat_id)

        if not chat:
            raise ValueError(f"Chat {chat_id} no encontrado")

        timestamp = chat.timestamp.strftime("%Y%m%d_%H%M%S")
        filename = f"chat_{chat_id}_{timestamp}.md"
        filepath = os.path.join(self.exports_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(self._generate_markdown(chat))

        return filepath

    def export_history(self, limit: int = 10) -> str:
        chats = self.repository.get_history(limit=limit)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"history_{timestamp}.md"
        filepath = os.path.join(self.exports_dir, filename)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(self._generate_history_markdown(chats))

        return filepath

    def _generate_markdown(self, chat: ChatMessage) -> str:
        return (
            f"# Chat - {chat.timestamp.strftime('%Y-%m-%d %H:%M:%S')}\n\n"
            f"## Metadata\n"
            f"- **Modo**: {chat.mode}\n"
            f"- **Modelo**: {chat.model_used}\n"
            f"- **Tiempo de respuesta**: {chat.response_time:.2f}s\n\n"
            f"---\n\n"
            f"## Pregunta\n{chat.prompt}\n\n"
            f"---\n\n"
            f"## Respuesta\n{chat.response}\n\n"
            f"---\n\n"
            f"*Generado por Trident-AI*\n"
        )

    def _generate_history_markdown(self, chats: List[ChatMessage]) -> str:
        header = (
            f"# Historial de Conversaciones - Trident-AI\n\n"
            f"**Generado**: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}  \n"
            f"**Total de conversaciones**: {len(chats)}\n\n"
            f"---\n\n"
        )

        entries = ""
        for i, chat in enumerate(reversed(chats), 1):
            entries += (
                f"## {i}. {chat.timestamp.strftime('%Y-%m-%d %H:%M:%S')} - {chat.mode.upper()}\n\n"
                f"**Modelo**: {chat.model_used} | **Tiempo**: {chat.response_time:.2f}s\n\n"
                f"### Pregunta\n{chat.prompt}\n\n"
                f"### Respuesta\n{chat.response}\n\n"
                f"---\n\n"
            )

        return header + entries + "*Generado por Trident-AI*\n"
