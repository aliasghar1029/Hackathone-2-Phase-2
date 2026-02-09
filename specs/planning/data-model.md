# Data Model: Task Management System

## Task Entity

### Fields
- **id** (UUID)
  - Type: UUID string
  - Required: Yes
  - Unique: Yes
  - Description: Primary key, auto-generated
- **user_id** (UUID)
  - Type: UUID string
  - Required: Yes
  - Description: Foreign key referencing the user who owns the task
  - Relationship: Links to Better Auth user
- **title** (String)
  - Type: String (1-200 characters)
  - Required: Yes
  - Description: Task title/description
  - Validation: Length 1-200 characters
- **description** (Text)
  - Type: String (0-1000 characters)
  - Required: No
  - Description: Optional detailed description of the task
  - Validation: Max 1000 characters
- **completed** (Boolean)
  - Type: Boolean
  - Required: Yes
  - Default: false
  - Description: Whether the task is completed
- **created_at** (DateTime)
  - Type: ISO 8601 timestamp
  - Required: Yes
  - Default: Current time
  - Description: When the task was created
- **updated_at** (DateTime)
  - Type: ISO 8601 timestamp
  - Required: Yes
  - Default: Current time, updated on modification
  - Description: When the task was last modified

### Relationships
- **Owner Relationship**
  - One user owns many tasks
  - Foreign key: user_id → auth.users.id
  - Cascade delete: When user is deleted, tasks are deleted too

### Validation Rules
1. Title must be between 1 and 200 characters
2. Description cannot exceed 1000 characters
3. user_id must reference an existing user in the auth.users table
4. completed defaults to false when creating a new task
5. created_at and updated_at are automatically set by the system

### State Transitions
- Creation: status = false (default)
- Update: status can be toggled between true/false
- Deletion: record removed (with cascade delete on user deletion)

## User Entity (Managed by Better Auth)

### Fields
- **id** (UUID)
  - Primary key, managed by Better Auth
- **email** (String)
  - Unique identifier for the user
- **other fields** managed by Better Auth

### Access Control
- Each task is tied to exactly one user
- Users can only access tasks with matching user_id
- Authentication handled through JWT tokens
- Authorization enforced at API layer using user_id comparison

## Constraints and Indexes

### Constraints
- NOT NULL constraints on id, user_id, title, completed, created_at, updated_at
- Foreign key constraint from tasks.user_id to auth.users.id
- Check constraint on title length (1-200 chars)
- Check constraint on description length (0-1000 chars)

### Indexes
- Primary index on id
- Foreign key index on user_id (for user-specific queries)
- Index on completed field (for filtering by completion status)
- Index on created_at (for sorting and time-based queries)
- Composite index on (user_id, completed) for efficient user-specific status queries