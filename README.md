# Hackathon Todo Application

A modern web-based task management platform built with Next.js frontend, FastAPI backend, and Neon PostgreSQL database.

## Project Overview

This monorepo contains a full-stack web application for task management with the following features:
- User authentication and authorization
- Task CRUD operations with user isolation
- Responsive web interface
- JWT-based security
- Clean architecture with separation of concerns

## Tech Stack

- **Frontend**: Next.js 14+, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11+, SQLModel
- **Database**: Neon PostgreSQL
- **Authentication**: Better Auth
- **Deployment**: Docker, Cloud-ready

## Architecture

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

## Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL client (for local development)
- Docker (optional, for containerized deployment)

## Setup Instructions

### 1. Clone and Initialize

```bash
# Clone the repository
git clone <repository-url>
cd hackathon-todo

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install backend dependencies (in virtual environment)
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Configuration

Copy the example environment files:

```bash
# Copy backend environment file
cp .env.example backend/.env

# Copy frontend environment file
cp .env.example frontend/.env.local
```

Update the environment variables with your actual values, particularly the database connection string and authentication secrets.

### 3. Database Setup

Create a Neon PostgreSQL database and update the `DATABASE_URL` in your environment files.

Run database migrations:

```bash
cd backend
# Make sure you have the correct async driver in DATABASE_URL (postgresql+asyncpg://)
alembic upgrade head
```

### 4. Running the Application

#### Development Mode

```bash
# Run both frontend and backend in development mode
npm run dev

# Or run individually:
npm run dev:frontend  # Runs frontend on http://localhost:3000
npm run dev:backend   # Runs backend on http://localhost:8000
```

#### Production Build

```bash
# Build the application
npm run build

# Run the production build
npm start
```

## API Documentation

Once the backend is running, API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Testing

```bash
# Run all tests
npm run test

# Run frontend tests
npm run test:frontend

# Run backend tests
npm run test:backend
```

## Linting and Formatting

```bash
# Lint and format all code
npm run lint

# Lint frontend
npm run lint:frontend

# Lint backend
npm run lint:backend
```

## Deployment

The application is designed for containerized deployment using Docker. Use the provided `docker-compose.yml` file for easy orchestration of services.

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Security Features

- JWT-based authentication with proper token expiration
- User isolation ensuring users can only access their own data
- Input validation and sanitization
- Rate limiting for API endpoints
- Secure session management

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm run test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.