from sqlalchemy import func
from app.db.database import SessionLocal
from app.models.chat import ChatMessage


class ChatRepository:

    def save(self, mode: str, prompt: str, response: str, model_used: str, response_time: float):
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
            raise e
        finally:
            db.close()

    def get_history(self, limit: int = 10):
        db = SessionLocal()
        try:
            return (
                db.query(ChatMessage)
                .order_by(ChatMessage.timestamp.desc())
                .limit(limit)
                .all()
            )
        finally:
            db.close()

    def get_by_id(self, chat_id: int):
        db = SessionLocal()
        try:
            return db.query(ChatMessage).filter(ChatMessage.id == chat_id).first()
        finally:
            db.close()

    def get_stats(self):
        db = SessionLocal()
        try:
            total_chats = db.query(ChatMessage).count()
            modes = (
                db.query(ChatMessage.mode, func.count(ChatMessage.id))
                .group_by(ChatMessage.mode)
                .all()
            )
            avg_time = db.query(func.avg(ChatMessage.response_time)).scalar()
            return {
                "total_chats": total_chats,
                "chats_by_mode": {mode: count for mode, count in modes},
                "avg_response_time": round(avg_time or 0, 2)
            }
        finally:
            db.close()
