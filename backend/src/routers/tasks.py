from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel.ext.asyncio.session import AsyncSession
from typing import List
from uuid import UUID

from ..database.engine import get_session
from ..models.task import Task, TaskCreate, TaskUpdate, TaskRead
from ..auth.jwt import verify_token

router = APIRouter()

async def get_current_user(token: str) -> str:
    """Extract user_id from JWT token"""
    payload = verify_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    user_id: str = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
        )
    return user_id

async def verify_user_access(user_id: str, token: str):
    """Verify the user in token matches the user_id in path"""
    current_user = await get_current_user(token)
    if current_user != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access these resources",
        )
    return current_user

@router.get("/{user_id}/tasks", response_model=List[TaskRead])
async def get_tasks(
    user_id: str,
    token: str = Depends(lambda: None),  # Will be handled in dependency
    session: AsyncSession = Depends(get_session)
):
    """Get all tasks for a user"""
    # Token will be verified in the header
    from fastapi import Header
    auth_header = Header(None, alias="Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    token = auth_header.split(" ")[1]
    await verify_user_access(user_id, token)
    
    result = await session.execute(
        Task.__table__.select().where(Task.user_id == user_id).order_by(Task.created_at.desc())
    )
    tasks = result.scalars().all()
    return tasks

@router.post("/{user_id}/tasks", response_model=TaskRead, status_code=status.HTTP_201_CREATED)
async def create_task(
    user_id: str,
    task: TaskCreate,
    token: str = Depends(lambda: None),
    session: AsyncSession = Depends(get_session)
):
    """Create a new task for a user"""
    from fastapi import Header
    auth_header = Header(None, alias="Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    token = auth_header.split(" ")[1]
    await verify_user_access(user_id, token)
    
    db_task = Task(**task.dict(), user_id=user_id)
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.get("/{user_id}/tasks/{task_id}", response_model=TaskRead)
async def get_task(
    user_id: str,
    task_id: UUID,
    token: str = Depends(lambda: None),
    session: AsyncSession = Depends(get_session)
):
    """Get a specific task"""
    from fastapi import Header
    auth_header = Header(None, alias="Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    token = auth_header.split(" ")[1]
    await verify_user_access(user_id, token)
    
    result = await session.execute(
        Task.__table__.select().where(
            (Task.id == task_id) & (Task.user_id == user_id)
        )
    )
    task = result.scalar_one_or_none()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    return task

@router.put("/{user_id}/tasks/{task_id}", response_model=TaskRead)
async def update_task(
    user_id: str,
    task_id: UUID,
    task_update: TaskUpdate,
    token: str = Depends(lambda: None),
    session: AsyncSession = Depends(get_session)
):
    """Update a task"""
    from fastapi import Header
    auth_header = Header(None, alias="Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    token = auth_header.split(" ")[1]
    await verify_user_access(user_id, token)
    
    result = await session.execute(
        Task.__table__.select().where(
            (Task.id == task_id) & (Task.user_id == user_id)
        )
    )
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    update_data = task_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.utcnow()
    
    for key, value in update_data.items():
        setattr(db_task, key, value)
    
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task

@router.delete("/{user_id}/tasks/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    user_id: str,
    task_id: UUID,
    token: str = Depends(lambda: None),
    session: AsyncSession = Depends(get_session)
):
    """Delete a task"""
    from fastapi import Header
    auth_header = Header(None, alias="Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    token = auth_header.split(" ")[1]
    await verify_user_access(user_id, token)
    
    result = await session.execute(
        Task.__table__.select().where(
            (Task.id == task_id) & (Task.user_id == user_id)
        )
    )
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    await session.delete(db_task)
    await session.commit()

@router.patch("/{user_id}/tasks/{task_id}/complete", response_model=TaskRead)
async def toggle_complete(
    user_id: str,
    task_id: UUID,
    token: str = Depends(lambda: None),
    session: AsyncSession = Depends(get_session)
):
    """Toggle task completion status"""
    from fastapi import Header
    auth_header = Header(None, alias="Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid authorization header"
        )
    token = auth_header.split(" ")[1]
    await verify_user_access(user_id, token)
    
    result = await session.execute(
        Task.__table__.select().where(
            (Task.id == task_id) & (Task.user_id == user_id)
        )
    )
    db_task = result.scalar_one_or_none()
    
    if not db_task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found"
        )
    
    db_task.completed = not db_task.completed
    db_task.updated_at = datetime.utcnow()
    
    session.add(db_task)
    await session.commit()
    await session.refresh(db_task)
    return db_task