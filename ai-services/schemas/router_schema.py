from typing import Literal
from pydantic import BaseModel


class RouterOutput(BaseModel):
    intent: Literal[
        "complaint",
        "status",
        "assignment",
        "rag",
        "compleetion",
        "unknown",
    ]