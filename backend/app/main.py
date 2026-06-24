from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.config import settings
from app.core.database import engine, Base
from app.api.api_v1.router import router as api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create database tables on startup if they don't exist
    Base.metadata.create_all(bind=engine)
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS middleware to allow mobile clients or web frontends to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, restrict this to specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the main API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "message": f"Welcome to the {settings.PROJECT_NAME} API Gateway",
        "version": "1.0.0",
        "api_docs": "/docs"
    }
