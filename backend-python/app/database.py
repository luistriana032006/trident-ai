from sqlalchemy import create_engine, Column, Integer,String,Text,DateTime,Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os


## base de datos sqlite
DATABASE_URL ="sqlite:///./data/chats.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread":False})
SessionLocal = sessionmaker(autocommit=False,autoflush=False,bind=engine)
Base = declarative_base()

class ChatMessage(Base):
    """
    Docstring for ChatMessage
    modelo de base de datos para mensajes de chat
    """

    __tablename__="chat_messages"

    id = Column(Integer,primary_key=True, index=True)
    mode = Column(String,index=True)
    prompt = Column(Text)
    response = Column(Text)
    model_used=Column(String)
    timestamp = Column(DateTime,default=datetime.now)
    response_time = Column(Float)


# crear las tablas
Base.metadata.create_all(bind=engine)

def get_db():
    """
    Docstring for get_db
    dependency para obtener seccion de base de datos
    """

    db = SessionLocal(
        
    )
    try:
        yield db
    finally:
        db.close()