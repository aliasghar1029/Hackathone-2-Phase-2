from sqlmodel import SQLModel, create_engine
from sqlmodel.ext.asyncio.session import AsyncSession, AsyncEngine
from typing import AsyncGenerator
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:password@localhost/todo_db")

# Create async engine
engine = AsyncEngine(create_engine(DATABASE_URL, echo=True, future=True))

async def init_db():
    """Create all tables on startup"""
    async with engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)

async def get_session() -> AsyncGenerator[AsyncSession, None]:
    """Dependency to get async session"""
    async with AsyncSession(engine) as session:
        yield session