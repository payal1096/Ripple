import os
from pathlib import Path
from typing import List
from dotenv import load_dotenv

# Load .env file from backend root if present
env_path = Path(__file__).resolve().parent.parent.parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "Ripple — Urban Resource Coordination System API"
    VERSION: str = "2.0.0"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    API_HOST: str = os.getenv("API_HOST", "127.0.0.1")
    API_PORT: int = int(os.getenv("API_PORT", "8000"))

    # Storage & MongoDB Configuration
    STORAGE_MODE: str = os.getenv("STORAGE_MODE", "mongodb")
    STORAGE_DESCRIPTION: str = "Persistent storage powered by MongoDB (ripple_db)."
    MONGODB_URI: str = os.getenv("MONGODB_URI") or os.getenv("MONGO_URI", "mongodb://localhost:27017")
    MONGO_DB_NAME: str = os.getenv("MONGO_DB_NAME", "ripple_db")

    # CORS
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000",
        ).split(",")
        if origin.strip()
    ]

    # JWT Authentication
    JWT_SECRET: str = os.getenv("JWT_SECRET", "ripple_urban_jwt_dev_secret_key_2026_change_in_production")
    JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "1440"))

    # Simulation & Defaults
    DEFAULT_CITY: str = os.getenv("DEFAULT_CITY", "Mumbai")
    DEFAULT_WEATHER_SCENARIO: str = os.getenv("DEFAULT_WEATHER_SCENARIO", "moderate")

settings = Settings()
