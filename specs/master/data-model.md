# Data Model: Hackathone Phase 2 Task Management

## Overview

This document defines the data models for the Hackathone Phase 2 platform, including user accounts and task management functionality with proper relationships and validation rules.

## Entity Definitions

### 1. User Entity

**Table Name**: `users`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique identifier for the user |
| email | VARCHAR(255) | UNIQUE, NOT NULL, INDEX | User's email address |
| name | VARCHAR(255) | NOT NULL | User's display name |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Account creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification timestamp |

**Validation Rules**:
- Email must be a valid email format
- Name must be 1-255 characters
- Email uniqueness enforced at database level

**Relationships**:
- One User to Many Tasks (via user_id foreign key)

### 2. Task Entity

**Table Name**: `tasks`

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | PRIMARY KEY, NOT NULL | Unique identifier for the task |
| title | VARCHAR(255) | NOT NULL | Task title (short description) |
| description | TEXT | NULL | Detailed task description |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'todo' | Task status ('todo', 'in-progress', 'done') |
| user_id | UUID | FOREIGN KEY, NOT NULL, INDEX | Reference to owning user |
| created_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Task creation timestamp |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT NOW() | Last modification timestamp |

**Validation Rules**:
- Title must be 1-255 characters
- Status must be one of: 'todo', 'in-progress', 'done'
- Description can be null or up to text limit
- user_id must reference a valid user

**State Transitions**:
- 'todo' → 'in-progress': When user starts working on task
- 'in-progress' → 'done': When user completes task
- 'done' → 'in-progress': When user needs to reopen task
- 'in-progress' → 'todo': When user resets task

**Relationships**:
- Many Tasks to One User (via user_id foreign key)

## Database Schema

```sql
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index on email for authentication lookups
CREATE INDEX idx_users_email ON users(email);

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'todo',
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create indexes for efficient queries
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at);
```

## API Data Transfer Objects (DTOs)

### User DTOs

```python
# User Registration Request
{
    "email": "user@example.com",
    "name": "John Doe"
}

# User Response (without sensitive data)
{
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2026-02-05T10:00:00Z",
    "updated_at": "2026-02-05T10:00:00Z"
}
```

### Task DTOs

```python
# Task Creation Request
{
    "title": "Create project plan",
    "description": "Develop a comprehensive plan for the project",
    "status": "todo"  // Optional, defaults to 'todo'
}

# Task Response
{
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Create project plan",
    "description": "Develop a comprehensive plan for the project",
    "status": "todo",
    "user_id": "b2c3d4e5-f678-90ab-cdef-1234567890ab",
    "created_at": "2026-02-05T10:00:00Z",
    "updated_at": "2026-02-05T10:00:00Z"
}

# Task Update Request (partial update allowed)
{
    "title": "Updated task title",
    "description": "Updated description",
    "status": "in-progress"
}
```

## Relationship Diagram

```
┌─────────┐    1    *    ┌─────────┐
│  User   │ ←────────── │  Task   │
├─────────┤              ├─────────┤
│ id      │              │ id      │
│ email   │              │ title   │
│ name    │              │ desc    │
│ ...     │              │ status  │
└─────────┘              │ user_id │
                         │ ...     │
                         └─────────┘
```

## Indexing Strategy

### Primary Indexes
- `users.id`: Primary key index (auto-created)
- `tasks.id`: Primary key index (auto-created)

### Supporting Indexes
- `users.email`: For authentication lookups
- `tasks.user_id`: For user-specific task queries
- `tasks.status`: For filtering by task status
- `tasks.created_at`: For chronological sorting

## Constraints and Rules

### Data Integrity
1. **Referential Integrity**: Tasks must reference valid users (foreign key constraint)
2. **Cascade Delete**: When a user is deleted, all their tasks are automatically deleted
3. **Email Uniqueness**: No two users can have the same email address
4. **Non-Null Requirements**: All required fields must have values

### Business Rules
1. **User Isolation**: Users can only access/modify their own tasks
2. **Status Validation**: Task status must be one of predefined values
3. **Ownership Enforcement**: Task ownership cannot be transferred between users
4. **Audit Trail**: Creation and modification timestamps maintained automatically

## Migration Considerations

### From Phase I In-Memory Storage
- Phase I used simple in-memory data structures
- Migration to SQLModel with Neon PostgreSQL
- Data transformation from console-based to structured database records
- Preservation of core functionality while adding persistence

### Schema Evolution Strategy
- Additive-first approach (only add columns, avoid removing/changing existing)
- Backward compatibility maintained during transitions
- Proper migration scripts with rollback capabilities
- Validation layers to ensure data consistency