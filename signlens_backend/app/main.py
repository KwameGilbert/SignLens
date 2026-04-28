from fastapi import FastAPI
from app.api_v1.auth import init_db
from app.api_v1 import endpoints

app = FastAPI(title="SignLens API", version="1.0.0")

# Initialize DB on startup
def on_startup():
    init_db()

app.add_event_handler("startup", on_startup)

# Include versioned API router
app.include_router(endpoints.router, prefix="/api/v1")

# Health check endpoint
@app.get("/", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "message": "SignLens API is running",
        "version": "1.0.0",
        "data": {
            "Supported input types": ["image", "video", "stream"],
            "API documentation": "/docs",
            "Rate limits": "100 requests per minute per API key (subject to change)"
        }
    }
