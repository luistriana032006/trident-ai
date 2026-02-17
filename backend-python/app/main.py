from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import Settings
from app.models import chatRequest, ChatResponse
from app.ollama_client import ollama_client

app = FastAPI(
    title= "Trident-AI python service",
    description= "Servicio de IA local con ollama",
    version= "1.0.0"
)

## crecion de instancia de ollama
ollama_client = ollama_client() 


# CORS para que react pueda llamar
app.add_middleware(
    CORSMiddleware,
    allow_origins = ["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return{
        "service":"trident-AI Python",
        "status": "running",
        "version": "1.0.0",
        "Ollama_url": Settings.OLLAMA_BASE_URL
    }

@app.get("/health")
async def health():
    return{"status":"healthy"}

@app.post("/chat",response_model=ChatResponse)
async def chat(request:chatRequest):
    # MOKEAREMOS POR EL MOMENTO

    ## mapeo del modo a modelo
    model_map ={
        "local": "deepseek-r1:8b",
        "entity":"qwen2.5:1.5b",
        "search":"qwen2.5:7b"

    }

    # selecccionar el modelo segun modo
    model = model_map[request.mode]
    
    ## llamar a ollama 

    ollama_response = await ollama_client.generate(model,request.prompt)

    # retornar respuesta real

    return ChatResponse(
        mode=request.mode,
        response=ollama_response["response"], ## respuesta real del modelo
        model_used= model


    )
