import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    PROJECT_NAME: str = "YatraAI API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = "/api"

    # Database
    MONGODB_URI: str = os.getenv("MONGODB_URI", "")
    DATABASE_NAME: str = os.getenv("DATABASE_NAME", "yatra_ai")

    # Gemini AI
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # CORS
    CORS_ORIGINS: list[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            (
                "http://localhost:5173,"
                "http://127.0.0.1:5173,"
                "http://localhost:3000,"
                "https://yatra-ai-sable.vercel.app"
            ),
        ).split(",")
        if origin.strip()
    ]


settings = Settings()