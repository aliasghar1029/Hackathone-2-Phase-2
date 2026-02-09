/**
 * Task-related TypeScript interfaces for the Hackathon Todo Application
 */

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskData {
  title: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
}

export interface UpdateTaskData {
  title?: string;
  description?: string;
  status?: 'todo' | 'in-progress' | 'done';
}

export interface TaskFilters {
  status?: 'todo' | 'in-progress' | 'done';
  limit?: number;
  offset?: number;
  sort?: 'created_at' | 'updated_at' | 'title';
  order?: 'asc' | 'desc';
}

export interface TaskListResponse {
  tasks: Task[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    pages: number;
  };
}

export interface TaskApiResponse {
  id: string;
  title: string;
  description?: string;
  status: string; // String from backend, will be converted to union type
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  status?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  status?: string;
}