# Quickstart Guide: Task Management Application

## Prerequisites
- Node.js 18+
- Python 3.9+
- PostgreSQL (local or Neon)
- Docker (for local development)

## Setup Instructions

### 1. Clone and Initialize
```bash
git clone <repository-url>
cd <project-directory>
npm install  # Installs both frontend and backend dependencies via monorepo setup
```

### 2. Environment Configuration
```bash
# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Configure database connection in backend/.env
DATABASE_URL="postgresql://username:password@ep-aged-math-xxxx.us-east-1.aws.neon.tech/dbname?sslmode=require"
NEON_PROJECT_ID="your-neon-project-id"
POOL_MIN_SIZE=5
POOL_MAX_SIZE=20
STATEMENT_TIMEOUT=30000
```

### 3. Database Setup
```bash
# Install SQLModel and initialize database
cd backend
pip install sqlmodel
python -c "from database import engine, create_db_and_tables; create_db_and_tables()"
```

### 4. Run Applications
```bash
# Option A: Run separately
cd frontend && npm run dev  # Runs on port 3000
cd backend && uvicorn main:app --reload --port 8000  # Runs on port 8000

# Option B: Run with Docker
docker-compose up --build
```

## Development Commands
```bash
# Run backend tests
cd backend && pytest

# Run frontend tests
cd frontend && npm test

# Format code
cd backend && black .
cd frontend && npm run format

# Lint code
cd backend && flake8 .
cd frontend && npm run lint
```

## Architecture Overview
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Frontend      │    │     Backend      │    │   Database      │
│   (Next.js)     │◄──►│    (FastAPI)     │◄──►│  (Neon PG)      │
│                 │    │                  │    │                 │
│ - Better Auth   │    │ - JWT Auth       │    │ - SQLModel ORM  │
│ - Task UI       │    │ - API Routes     │    │ - Relations     │
│ - API Calls     │    │ - Business Logic │    │ - Migrations    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## Key Integration Points
1. **Auth Flow**: Better Auth (frontend) → JWT → FastAPI middleware validation
2. **Data Flow**: React components → API calls → FastAPI → SQLModel → Neon PG
3. **User Isolation**: JWT user ID → query filter → user-specific data only

## Troubleshooting
- If database connection fails, verify NEON connection string format
- If auth fails, check JWT configuration between Better Auth and FastAPI
- For CORS issues, ensure API and frontend domains are properly configured