# Database Schema Specification

## Users Table (Managed by Better Auth)
The users table is automatically managed by Better Auth and contains user account information. Direct manipulation of this table is not allowed.

Structure (as managed by Better Auth):
- `id` - Primary key (UUID)
- `email` - User's email address (unique)
- `emailVerified` - Boolean indicating email verification status
- `createdAt` - Account creation timestamp
- `updatedAt` - Last account update timestamp
- Additional fields managed by Better Auth as needed

## Tasks Table
The tasks table stores user-generated tasks with proper foreign key relationship to the users table.

### Schema Definition
```sql
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
    FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);
```

### Column Descriptions
- `id`: Unique identifier for each task (UUID)
- `user_id`: Foreign key referencing the user who owns the task (UUID, not null)
- `title`: Task title (varchar, 200 chars max, not null)
- `description`: Optional task description (text)
- `completed`: Boolean indicating task completion status (default: false, not null)
- `created_at`: Timestamp when the task was created (timestamp with timezone, default: current time, not null)
- `updated_at`: Timestamp when the task was last modified (timestamp with timezone, default: current time, not null)

### Indexes
- **Primary Key Index**: On `id` column (automatically created)
- **Foreign Key Index**: On `user_id` column (performance for user-specific queries)
- **Completed Status Index**: On `completed` column (for filtering completed/incomplete tasks)
- **Created At Index**: On `created_at` column (for sorting and time-based queries)
- **Composite Index**: On `user_id` and `completed` columns (for efficient user-specific status queries)

### Constraints
- **Foreign Key Constraint**: Ensures user_id references a valid user in auth.users table
- **Cascade Delete**: When a user is deleted, all their tasks are automatically removed
- **Not Null Constraints**: On id, user_id, title, completed, created_at, updated_at to ensure data integrity
- **Default Values**: For completed (FALSE) and timestamps (NOW()) to ensure proper initialization

### Relationship
- One user can have many tasks (1:N relationship)
- Tasks are tied to users via foreign key with cascade delete
- Users cannot access tasks belonging to other users due to foreign key enforcement