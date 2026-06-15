import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SignLens Mobile Backend"
    API_V1_STR: str = "/api/v1"
    
    # JWT Auth settings
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super_secret_signing_key_for_signlens_mobile_app_1234567890")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database config (defaults to a local SQLite database file, but can be overridden with MySQL)
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", 
        "sqlite:///./signlens_mobile.db"
    )
    
    # ML Model Endpoints config
    # Defaulting to local model endpoints backend port 8000
    MODEL_API_URL: str = os.getenv("MODEL_API_URL", "http://127.0.0.1:8000")
    MODEL_API_WS_URL: str = os.getenv("MODEL_API_WS_URL", "ws://127.0.0.1:8000")
    
    # The API key required to access the model endpoints (must match what's in model_endpoints DB)
    MODEL_API_KEY: str = os.getenv("MODEL_API_KEY", "")

    class Config:
        case_sensitive = True

settings = Settings()
