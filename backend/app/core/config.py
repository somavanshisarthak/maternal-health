from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Maternal Health API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretkey-change-in-production"
    ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 1440
    DATABASE_URL: str = "sqlite:///./sql_app.db"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True)

settings = Settings()

