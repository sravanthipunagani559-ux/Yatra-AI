from contextlib import asynccontextmanager
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
import database
from routes import trips, discovery, budget, safety, business, admin, users


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database connection and data
    await database.init_db()

    yield

    # Shutdown logic if needed


app = FastAPI(
    title="YatraAI API",
    description=(
        "Smart tourism platform API for itinerary generation, "
        "adaptive replanning, discovery, safety, and local business empowerment."
    ),
    version="1.0.0",
    lifespan=lifespan,
)


# --------------------------------------------------
# CORS CONFIGURATION
# --------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# --------------------------------------------------
# ROOT ENDPOINT
# --------------------------------------------------

@app.get("/")
def read_root():
    return {
        "message": "YatraAI API is running",
        "status": "success",
    }


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "YatraAI Backend",
    }


# --------------------------------------------------
# API ROUTES
# --------------------------------------------------

app.include_router(trips.router, prefix="/api")
app.include_router(discovery.router, prefix="/api")
app.include_router(budget.router, prefix="/api")
app.include_router(safety.router, prefix="/api")
app.include_router(business.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(users.router, prefix="/api")


# --------------------------------------------------
# LOCAL DEVELOPMENT / RENDER STARTUP
# --------------------------------------------------

if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=int(os.environ.get("PORT", 8000)),
    )