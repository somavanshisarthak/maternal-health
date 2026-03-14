from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Maternal Health API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretkey-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    DATABASE_URL: str = "sqlite:///./sql_app.db"

    class Config:
        case_sensitive = True

settings = Settings()
