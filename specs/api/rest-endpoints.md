# REST API Endpoints Specification

## Authentication Requirements
All endpoints require valid JWT authentication in the Authorization header: `Bearer <token>`

## Base URL
`/api/v1/tasks`

## Endpoint List

### 1. GET /api/v1/tasks
**Purpose**: Retrieve list of tasks for the authenticated user
**Authentication**: Required
**Query Parameters**:
- `page` (optional, default: 1) - Page number for pagination
- `limit` (optional, default: 10) - Number of items per page
- `completed` (optional) - Filter by completion status (true/false)
- `sort` (optional, default: created_at) - Sort field (created_at, updated_at, title)
- `order` (optional, default: desc) - Sort order (asc, desc)

**Response (200 OK)**:
```json
{
  "tasks": [
    {
      "id": "uuid-string",
      "title": "Task title",
      "description": "Task description",
      "completed": false,
      "created_at": "2024-01-01T10:00:00Z",
      "updated_at": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "has_next": true,
    "has_prev": false
  }
}
```

**Error Responses**:
- 401: Unauthorized
- 422: Invalid query parameters

### 2. GET /api/v1/tasks/{id}
**Purpose**: Retrieve a specific task by ID
**Authentication**: Required
**Path Parameter**: `id` - UUID of the task
**Response (200 OK)**:
```json
{
  "id": "uuid-string",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (attempting to access other user's task)
- 404: Task not found

### 3. POST /api/v1/tasks
**Purpose**: Create a new task
**Authentication**: Required
**Request Body**:
```json
{
  "title": "Task title (required)",
  "description": "Task description (optional)",
  "completed": false
}
```

**Response (201 Created)**:
```json
{
  "id": "uuid-string",
  "title": "Task title",
  "description": "Task description",
  "completed": false,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-01T10:00:00Z"
}
```

**Error Responses**:
- 401: Unauthorized
- 422: Validation error (missing required fields, invalid data)
- 400: Bad request

### 4. PUT /api/v1/tasks/{id}
**Purpose**: Update an existing task completely
**Authentication**: Required
**Path Parameter**: `id` - UUID of the task
**Request Body**:
```json
{
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true
}
```

**Response (200 OK)**:
```json
{
  "id": "uuid-string",
  "title": "Updated task title",
  "description": "Updated task description",
  "completed": true,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-02T15:00:00Z"
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (attempting to access other user's task)
- 404: Task not found
- 422: Validation error

### 5. PATCH /api/v1/tasks/{id}
**Purpose**: Partially update an existing task
**Authentication**: Required
**Path Parameter**: `id` - UUID of the task
**Request Body** (at least one field):
```json
{
  "title": "Partially updated title",
  "description": "Partially updated description",
  "completed": true
}
```

**Response (200 OK)**:
```json
{
  "id": "uuid-string",
  "title": "Partially updated title",
  "description": "Partially updated description",
  "completed": true,
  "created_at": "2024-01-01T10:00:00Z",
  "updated_at": "2024-01-02T15:30:00Z"
}
```

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (attempting to access other user's task)
- 404: Task not found
- 422: Validation error

### 6. DELETE /api/v1/tasks/{id}
**Purpose**: Delete a specific task
**Authentication**: Required
**Path Parameter**: `id` - UUID of the task
**Response (204 No Content)**: Empty response body

**Error Responses**:
- 401: Unauthorized
- 403: Forbidden (attempting to access other user's task)
- 404: Task not found