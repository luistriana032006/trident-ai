from pydantic import BaseModel
from typing import Literal

class ChatRequest(BaseModel):
    mode: Literal["local","entity","search"]
    prompt: str

class ChatResponse(BaseModel):
    mode: str
    response: str
    model_used: str
    response_time: float

