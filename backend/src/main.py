from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import os
from dotenv import load_dotenv

from .database.engine import init_db
from .routers import tasks
from .auth.jwt import generate_demo_token

load_dotenv()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    print("✅ Database initialized")
    yield
    # Shutdown
    print("🛑 Application shutting down")

app = FastAPI(
    title="Todo API",
    description="A full-stack Todo application with JWT authentication",
    version="1.0.0",
    lifespan=lifespan
)

# CORS configuration
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(tasks.router, prefix="/api", tags=["tasks"])

@app.get("/")
async def root():
    return {"message": "Todo API is running 🚀"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.get("/demo-token/{user_id}")
async def get_demo_token(user_id: str = "user123"):
    """Generate a demo JWT token for testing"""
    token = generate_demo_token(user_id)
    return {"token": token, "user_id": user_id}