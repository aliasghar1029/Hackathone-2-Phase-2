# Implementation Plan: Phase II Web Application

## Technical Context

This plan outlines the migration of Phase I console-based task CRUD functionality to a full-featured web application with user authentication, database persistence, and responsive UI. The system will follow clean architecture principles with clear separation between presentation, business logic, and data layers.

### Architecture Overview
- **Frontend**: Next.js application with responsive UI
- **Backend**: FastAPI REST API with JWT authentication
- **Authentication**: Better Auth for frontend, JWT token validation
- **Database**: Neon PostgreSQL with SQLModel ORM
- **User Isolation**: JWT-based enforcement preventing cross-user data access

### Core Components to Implement
1. Monorepo structure for frontend/backend co-location
2. Authentication flow: Better Auth → JWT → FastAPI middleware
3. Task CRUD services with user isolation
4. Database schema with proper relationships
5. Responsive UI components for task management
6. API endpoints with full CRUD operations

### Key Unknowns
- Specific Neon PostgreSQL connection parameters - RESOLVED in research.md
- Better Auth configuration details for our use case - RESOLVED in research.md
- Exact deployment strategy for monorepo - RESOLVED in research.md

## Constitution Check

### Compliance Verification
- ✅ Follows Next.js frontend architecture principles
- ✅ Adheres to FastAPI backend architecture guidelines
- ✅ Implements JWT user isolation strategy as required
- ✅ Uses SQLModel for database integration as specified
- ✅ Maintains clean separation of concerns
- ✅ Implements proper authentication and authorization
- ✅ Follows monorepo guidelines for shared repository

### Potential Violations & Justifications
- None identified - plan aligns with constitutional principles

## Research Phase (Phase 0)

### research.md

#### Neon PostgreSQL Configuration
**Decision**: Use Neon's serverless PostgreSQL with connection pooling
**Rationale**: Neon provides automatic scaling, branch-based development, and excellent Postgres compatibility
**Implementation**: Configure connection pooling in FastAPI with appropriate timeout and max connections values

#### Better Auth Integration
**Decision**: Implement Better Auth with JWT verification middleware in FastAPI
**Rationale**: Better Auth provides a complete authentication solution that integrates well with Next.js and generates standard JWT tokens that FastAPI can validate
**Integration Points**:
- Frontend: Better Auth for login/logout
- API Layer: JWT token extraction and validation
- Backend: User ID extraction from claims for data isolation

#### Monorepo Structure
**Decision**: Separate frontend and backend in distinct directories with shared config
**Rationale**: Enables independent development cycles while maintaining shared dependencies and configurations
**Structure**:
```
project/
├── frontend/          # Next.js application
│   ├── pages/
│   ├── components/
│   ├── lib/
│   └── package.json
├── backend/           # FastAPI application
│   ├── api/
│   ├── models/
│   ├── services/
│   └── requirements.txt
├── shared/            # Shared types/configs (optional)
├── docker-compose.yml # For local development
└── package.json       # Root monorepo config
```

#### API Authentication Middleware
**Decision**: Custom JWT validation middleware in FastAPI
**Rationale**: Provides centralized authentication handling and user isolation enforcement
**Implementation**: Extract and validate JWT from Authorization header, decode user ID, attach to request context

## Data Model Design (Phase 1)

### data-model.md

#### Task Entity
- **Fields**:
  - id: UUID (primary key, auto-generated)
  - user_id: UUID (foreign key to auth.users)
  - title: String (1-200 characters, required)
  - description: String (0-1000 characters, optional)
  - completed: Boolean (default: false)
  - created_at: DateTime (auto-generated on creation)
  - updated_at: DateTime (auto-generated on update/modification)

- **Relationships**:
  - Belongs to one User (via user_id foreign key)
  - User has many Tasks (one-to-many relationship)

- **Validation Rules**:
  - Title must be 1-200 characters
  - Description limited to 1000 characters max
  - user_id must reference valid user
  - completed status can be toggled by task owner only

#### User Entity
- **Management**: Handled by Better Auth
- **Access**: Via foreign key relationship from tasks
- **Isolation**: Enforced through JWT claims and user_id foreign key

## API Contracts (Phase 1)

### contracts/openapi.yaml
```yaml
openapi: 3.0.0
info:
  title: Task Management API
  version: 1.0.0
paths:
  /api/v1/tasks:
    get:
      summary: Get user's tasks
      security:
        - bearerAuth: []
      parameters:
        - name: page
          in: query
          schema:
            type: integer
            default: 1
        - name: limit
          in: query
          schema:
            type: integer
            default: 10
      responses:
        '200':
          description: List of user's tasks
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskListResponse'
    post:
      summary: Create a new task
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateTaskRequest'
      responses:
        '201':
          description: Task created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskResponse'
  /api/v1/tasks/{id}:
    get:
      summary: Get a specific task
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Task details
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskResponse'
        '404':
          description: Task not found
    put:
      summary: Update a task completely
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UpdateTaskRequest'
      responses:
        '200':
          description: Task updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskResponse'
    patch:
      summary: Partially update a task
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/PatchTaskRequest'
      responses:
        '200':
          description: Task updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/TaskResponse'
    delete:
      summary: Delete a task
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      responses:
        '204':
          description: Task deleted successfully
        '404':
          description: Task not found

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
  schemas:
    TaskResponse:
      type: object
      properties:
        id:
          type: string
          format: uuid
        title:
          type: string
          maxLength: 200
        description:
          type: string
          maxLength: 1000
        completed:
          type: boolean
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time
    CreateTaskRequest:
      type: object
      required: [title]
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 200
        description:
          type: string
          maxLength: 1000
        completed:
          type: boolean
          default: false
    UpdateTaskRequest:
      type: object
      required: [title]
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 200
        description:
          type: string
          maxLength: 1000
        completed:
          type: boolean
    PatchTaskRequest:
      type: object
      properties:
        title:
          type: string
          minLength: 1
          maxLength: 200
        description:
          type: string
          maxLength: 1000
        completed:
          type: boolean
    TaskListResponse:
      type: object
      properties:
        tasks:
          type: array
          items:
            $ref: '#/components/schemas/TaskResponse'
        pagination:
          type: object
          properties:
            page:
              type: integer
            limit:
              type: integer
            total:
              type: integer
            has_next:
              type: boolean
            has_prev:
              type: boolean
```

## Quickstart Guide (Phase 1)

### quickstart.md

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
DATABASE_URL="postgresql://username:password@localhost:5432/taskapp"
NEON_PROJECT_ID="your-neon-project-id"
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

### 5. Access Application
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs
- Database: Neon PostgreSQL instance

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