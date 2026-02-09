# Quickstart Guide: Hackathone Phase 2 Development

## Prerequisites

- Node.js 18+ installed
- Python 3.11+ installed
- PostgreSQL client tools (for local development)
- Git version control
- Neon account for PostgreSQL database

## Environment Setup

### 1. Clone and Initialize Repository

```bash
# Clone the repository
git clone <repository-url>
cd hackathone-phase-2

# Install backend dependencies
cd backend
pip install -r requirements.txt

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Database Setup with Neon

```bash
# Option 1: Use Neon CLI to create project
neonctl projects create hackathone-phase-2

# Option 2: Create database through Neon dashboard
# 1. Log into Neon dashboard
# 2. Create new project named "hackathone-phase-2"
# 3. Note the connection string for later configuration
```

### 3. Environment Variables

Create `.env` files in both backend and frontend directories:

**Backend (.env):**
```env
DATABASE_URL=your_neon_postgresql_connection_string
SECRET_KEY=your_super_secret_key_for_jwt_signing
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
```

**Frontend (.env.local):**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Running the Application

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Run database migrations
alembic upgrade head

# Start the backend server
uvicorn src.main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Start the development server
npm run dev
```

### 3. Complete Development Setup

For simultaneous backend/frontend development:

```bash
# Terminal 1: Start backend
cd backend
uvicorn src.main:app --reload --port 8000

# Terminal 2: Start frontend
cd frontend
npm run dev
```

Access the application at `http://localhost:3000`

## Project Structure Overview

```
hackathone-phase-2/
├── backend/
│   ├── src/
│   │   ├── models/          # SQLModel database models
│   │   ├── services/        # Business logic services
│   │   ├── api/            # FastAPI route handlers
│   │   ├── database/       # Database configuration
│   │   └── main.py         # Application entry point
│   ├── tests/              # Backend tests
│   ├── alembic/            # Database migrations
│   ├── requirements.txt    # Python dependencies
│   └── .env               # Backend environment variables
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Next.js pages
│   │   ├── services/      # API service clients
│   │   ├── types/         # TypeScript type definitions
│   │   └── utils/         # Utility functions
│   ├── tests/             # Frontend tests
│   ├── package.json       # Node.js dependencies
│   └── .env.local         # Frontend environment variables
├── shared/                # Shared types/utils between frontend/backend
└── docker-compose.yml     # Docker configuration
```

## Key Development Commands

### Backend Commands
```bash
# Run backend tests
cd backend
pytest

# Run with coverage
pytest --cov=src

# Format code
black src/
flake8 src/

# Generate new migration
alembic revision --autogenerate -m "Migration description"
```

### Frontend Commands
```bash
# Run frontend tests
cd frontend
npm test

# Run linter
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## API Documentation

Once the backend is running, API documentation is available at:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Authentication Flow

1. **Registration/Login**: User registers via frontend auth pages
2. **JWT Generation**: Backend generates JWT with user claims
3. **Token Storage**: Frontend stores token in secure cookies/local storage
4. **Authenticated Requests**: Token sent in Authorization header
5. **Token Validation**: Backend middleware validates token and extracts user ID
6. **User Isolation**: Services filter data based on authenticated user ID

## Database Migrations

### Creating New Migrations
```bash
# Navigate to backend
cd backend

# Generate migration from model changes
alembic revision --autogenerate -m "Description of changes"

# Apply pending migrations
alembic upgrade head
```

### Manual Migration Editing
Migration files in `backend/alembic/versions/` may require manual adjustments for:
- Custom constraints
- Data transformations
- Complex relationship changes

## Testing Strategy

### Backend Testing
```bash
# Run all tests
pytest

# Run tests with coverage report
pytest --cov=src --cov-report=html

# Run specific test file
pytest tests/test_tasks.py

# Run tests with verbose output
pytest -v
```

### Frontend Testing
```bash
# Run component tests
npm test

# Run integration tests
npm run test:integration

# Run E2E tests (if configured)
npm run test:e2e
```

## Common Development Tasks

### 1. Adding a New API Endpoint

**Backend (Python)**:
```python
# In backend/src/api/tasks.py
@router.post("/tasks/custom-action")
async def custom_task_action(
    task_id: UUID,
    current_user: User = Depends(get_current_user)
):
    # Your logic here
    pass
```

**Frontend (TypeScript)**:
```typescript
// In frontend/src/services/tasks.ts
export const customTaskAction = async (taskId: string) => {
  const response = await apiClient.post(`/tasks/${taskId}/custom-action`);
  return response.data;
};
```

### 2. Adding a New Database Model

**Python Model**:
```python
# In backend/src/models/task.py
class NewModel(SQLModel, table=True):
    id: UUID = Field(default_factory=uuid4, primary_key=True)
    name: str = Field(sa_column=Column(String, nullable=False))
    # Add other fields as needed
```

Then generate and run migration:
```bash
cd backend
alembic revision --autogenerate -m "Add new model"
alembic upgrade head
```

### 3. Implementing User Isolation

All data access methods should include user filtering:

```python
# In backend/src/services/task_service.py
async def get_user_tasks(user_id: UUID, db: AsyncSession) -> List[Task]:
    """Get only tasks belonging to the specified user."""
    result = await db.execute(
        select(Task).where(Task.user_id == user_id)
    )
    return result.scalars().all()
```

## Troubleshooting

### Common Issues

1. **Database Connection Errors**:
   - Verify Neon connection string in `.env`
   - Check internet connectivity to Neon database
   - Ensure database is active in Neon dashboard

2. **Authentication Issues**:
   - Verify JWT secret keys match between frontend/backend
   - Check that CORS settings allow frontend domain
   - Confirm time synchronization between client/server

3. **Frontend Build Failures**:
   - Ensure all TypeScript types are properly defined
   - Check that API endpoints are correctly configured
   - Verify environment variables are set correctly

### Development Tips

- Use the `--reload` flag when developing for automatic restart on code changes
- Enable detailed logging in development with `LOG_LEVEL=DEBUG`
- Use the API documentation (Swagger UI) to test endpoints during development
- Implement feature flags for incomplete functionality in development builds