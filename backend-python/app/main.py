from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1.router import router
from app.db.database import Base, engine
import app.models.chat  # registrar modelos antes de create_all
import logging
import os

# Configurar logging
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('logs/app.log'),
        logging.StreamHandler()
    ]
)

# Crear tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Trident-AI python service",
    description="Servicio de IA local con ollama",
    version="1.0.0"
)

# CORS para que Next.js pueda llamar
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)


@app.get("/")
async def root():
    return {
        "service": "Trident-AI Python",
        "status": "running",
        "version": "1.0.0",
        "ollama_url": settings.OLLAMA_BASE_URL,
        "features": ["chat", "history", "export", "stats"]
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}
