export interface Todo {
  id: number;
  title: string;
  description: string;
  priority: 'extreme' | 'moderate' | 'low';
  is_completed: boolean;
  position: number;
  todo_date: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoData {
  title: string;
  description: string;
  priority: 'extreme' | 'moderate' | 'low';
  todo_date?: string;
}

export interface UpdateTodoData {
  id: number;
  title?: string;
  description?: string;
  priority?: 'extreme' | 'moderate' | 'low';
  todo_date?: string;
  is_completed?: boolean;
  position?: number;
}

export interface GetTodosParams {
  is_completed?: boolean;
  priority?: 'extreme' | 'moderate' | 'low';
  todo_date?: string;
  search?: string;
}

export interface TodosResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Todo[];
}

export interface TodoState {
  todos: Todo[];
  count: number;
  next: string | null;
  previous: string | null;
  loading: boolean;
  error: string | null;
  createSuccess: boolean;
  updateSuccess: boolean;
  deleteSuccess: boolean;
}
