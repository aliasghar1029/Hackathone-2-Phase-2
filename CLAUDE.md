# Claude Code Rules - Hackathon Todo Application

You are an expert AI assistant working on the Hackathon Todo Application - a modern web-based task management platform built with Next.js frontend, FastAPI backend, and Neon PostgreSQL database.

## Project Context

**Application**: Hackathon Todo Application
**Architecture**: Monorepo with Next.js frontend, FastAPI backend, Neon PostgreSQL
**Purpose**: Task management platform with user authentication and isolation
**Tech Stack**: Next.js 14+, FastAPI, Python 3.11+, SQLModel, TypeScript, Neon PostgreSQL

## Project Structure

```
hackathon-todo/
├── backend/                 # FastAPI backend
│   ├── src/
│   │   ├── models/          # Database models
│   │   ├── services/        # Business logic
│   │   ├── api/            # API endpoints
│   │   └── database/       # DB configuration
│   ├── tests/              # Backend tests
│   └── requirements.txt    # Python dependencies
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Next.js pages
│   │   └── services/      # API services
│   ├── tests/             # Frontend tests
│   └── package.json       # Node.js dependencies
├── shared/                # Shared types/utils
└── docker-compose.yml     # Docker configuration
```

## Development Guidelines

### 1. Architecture Principles
- Maintain separation of concerns between frontend, backend, and shared components
- Follow clean architecture principles with clear boundaries
- Implement proper user isolation using JWT-based authentication
- Use consistent error handling across all layers
- Follow RESTful API conventions for backend endpoints

### 2. Code Quality Standards
- Write type-safe code with proper TypeScript definitions
- Use meaningful variable and function names
- Implement proper validation for all user inputs
- Follow security best practices (avoid SQL injection, XSS, etc.)
- Write comprehensive tests for all business logic

### 3. Database Interactions
- Use SQLModel for all database operations
- Implement proper transaction handling
- Create efficient queries with appropriate indexing
- Follow ACID principles for data consistency
- Use UUIDs for primary keys

### 4. Authentication & Authorization
- Implement JWT-based authentication
- Ensure user isolation (users can only access their own data)
- Validate all requests for proper authentication
- Use secure password hashing
- Implement proper session management

### 5. API Design
- Follow RESTful conventions
- Implement proper HTTP status codes
- Use consistent error response format
- Implement rate limiting for API endpoints
- Document all endpoints with OpenAPI

### 6. Frontend Development
- Use Next.js best practices for routing and data fetching
- Implement responsive design for all screen sizes
- Create accessible UI components
- Manage state effectively using appropriate patterns
- Implement proper error boundaries and loading states

## Critical Directories and Files

### Backend Key Locations:
- `backend/src/models/` - Database models using SQLModel
- `backend/src/services/` - Business logic implementations
- `backend/src/api/` - FastAPI endpoints
- `backend/src/database/engine.py` - Database connection
- `backend/alembic/` - Database migrations

### Frontend Key Locations:
- `frontend/src/components/` - Reusable React components
- `frontend/src/pages/` - Next.js pages and routing
- `frontend/src/services/` - API service clients
- `frontend/src/types/` - TypeScript type definitions

### Shared Components:
- `shared/types/` - Shared TypeScript interfaces
- `shared/utils/` - Shared utility functions

## Common Tasks

### Backend Development:
- Add new API endpoints in `backend/src/api/`
- Create new models in `backend/src/models/`
- Implement business logic in `backend/src/services/`
- Run migrations with Alembic
- Write tests in `backend/tests/`

### Frontend Development:
- Create new components in `frontend/src/components/`
- Add new pages in `frontend/src/pages/`
- Implement API calls in `frontend/src/services/`
- Define types in `frontend/src/types/`

## Environment Variables

Always respect the environment configuration:
- Database connection via `DATABASE_URL`
- JWT secrets via `SECRET_KEY`
- API base URLs via `NEXT_PUBLIC_API_BASE_URL`
- Authentication secrets via `BETTER_AUTH_SECRET`

## Error Handling

- Return appropriate HTTP status codes (4xx for client errors, 5xx for server errors)
- Provide meaningful error messages without exposing internal details
- Log errors appropriately for debugging while protecting sensitive information
- Implement proper exception handling in all layers

## Security Considerations

- Sanitize all user inputs to prevent injection attacks
- Validate and sanitize all data before database operations
- Implement proper access controls and user authorization
- Use HTTPS in production environments
- Never expose sensitive information in error messages
- Implement rate limiting to prevent abuse

## Testing Guidelines

- Write unit tests for all business logic functions
- Create integration tests for API endpoints
- Implement end-to-end tests for critical user flows
- Maintain high test coverage (>80%) for critical components
- Test error scenarios and edge cases
- Verify user isolation and authentication flow

Remember: The primary goal is to build a secure, scalable, and maintainable task management platform with proper user authentication and data isolation.