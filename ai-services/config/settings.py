from dotenv import load_dotenv
import os

load_dotenv()

class Settings:
    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    MODEL_NAME = os.getenv("MODEL_NAME")
    BACKEND_URL = (
        (os.getenv("BACKEND_URL") or os.getenv("BACKEND_API") or "http://localhost:4000")
        .rstrip("/")
    )
    if BACKEND_URL.endswith("/api"):
        BACKEND_URL = BACKEND_URL[:-4]

settings = Settings()