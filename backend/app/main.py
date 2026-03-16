from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.core.config import settings
from app.routes import auth, patients, survey


# Create database tables on startup (for development)
Base.metadata.create_all(bind=engine)


app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)


# Allow frontend to access backend
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register API routers
app.include_router(
    auth.router,
    prefix=f"{settings.API_V1_STR}/auth",
    tags=["auth"]
)

app.include_router(
    patients.router,
    prefix=f"{settings.API_V1_STR}/patients",
    tags=["patients"]
)

app.include_router(
    survey.router,
    prefix=f"{settings.API_V1_STR}/survey",
    tags=["survey"]
)


@app.get("/")
def read_root():
    return {"message": "Welcome to the Maternal Health API"}