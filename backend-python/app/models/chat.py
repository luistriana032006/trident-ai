from sqlalchemy import Column, Integer, String, Text, DateTime, Float
from datetime import datetime
from app.db.database import Base


class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    mode = Column(String, index=True)
    prompt = Column(Text)
    response = Column(Text)
    model_used = Column(String)
    timestamp = Column(DateTime, default=datetime.now)
    response_time = Column(Float)
