import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Helper function to convert any date format to YYYY-MM-DD
const convertToYYYYMMDD = (dateString: string): string | null => {
  if (!dateString || !dateString.trim()) return null;

  // Try to parse various date formats
  const date = new Date(dateString);

  // Check if valid date
  if (isNaN(date.getTime())) {
    return null;
  }

  // Convert to YYYY-MM-DD
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// Types
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

// Initial state
const initialState: TodoState = {
  todos: [],
  count: 0,
  next: null,
  previous: null,
  loading: false,
  error: null,
  createSuccess: false,
  updateSuccess: false,
  deleteSuccess: false,
};

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Async thunk for getting todos
export const getTodos = createAsyncThunk(
  'todos/getTodos',
  async (params: GetTodosParams = {}, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'https://todo-app.pioneeralpha.com';

      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      // Build query string
      const queryParams = new URLSearchParams();
      if (params.is_completed !== undefined) {
        queryParams.append('is_completed', String(params.is_completed));
      }
      if (params.priority) {
        queryParams.append('priority', params.priority);
      }
      if (params.todo_date) {
        queryParams.append('todo_date', params.todo_date);
      }
      if (params.search) {
        queryParams.append('search', params.search);
      }

      const queryString = queryParams.toString();
      const url = `${API_URL}/api/todos/${
        queryString ? `?${queryString}` : ''
      }`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail) {
          return rejectWithValue(data.detail);
        }
        return rejectWithValue('Failed to fetch todos');
      }

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for creating todo
export const createTodo = createAsyncThunk(
  'todos/createTodo',
  async (todoData: CreateTodoData, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'https://todo-app.pioneeralpha.com';

      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const formData = new FormData();
      formData.append('title', todoData.title);
      formData.append('description', todoData.description);
      formData.append('priority', todoData.priority);

      // Convert and append date if provided
      if (todoData.todo_date) {
        const convertedDate = convertToYYYYMMDD(todoData.todo_date);
        if (convertedDate) {
          formData.append('todo_date', convertedDate);
        }
      }

      const response = await fetch(`${API_URL}/api/todos/`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail) {
          return rejectWithValue(data.detail);
        }
        // Handle field errors
        const errorMessages = Object.entries(data)
          .map(([, errors]) => {
            if (Array.isArray(errors)) {
              return errors.join(', ');
            }
            return String(errors);
          })
          .join(', ');
        return rejectWithValue(errorMessages || 'Failed to create todo');
      }

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating todo
export const updateTodo = createAsyncThunk(
  'todos/updateTodo',
  async (todoData: UpdateTodoData, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'https://todo-app.pioneeralpha.com';

      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const formData = new FormData();
      if (todoData.title !== undefined) {
        formData.append('title', todoData.title);
      }
      if (todoData.description !== undefined) {
        formData.append('description', todoData.description);
      }
      if (todoData.priority !== undefined) {
        formData.append('priority', todoData.priority);
      }
      if (todoData.todo_date !== undefined) {
        const convertedDate = convertToYYYYMMDD(todoData.todo_date);
        if (convertedDate) {
          formData.append('todo_date', convertedDate);
        }
      }
      if (todoData.is_completed !== undefined) {
        formData.append('is_completed', String(todoData.is_completed));
      }
      if (todoData.position !== undefined) {
        formData.append('position', String(todoData.position));
      }

      const response = await fetch(`${API_URL}/api/todos/${todoData.id}/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.detail) {
          return rejectWithValue(data.detail);
        }
        // Handle field errors
        const errorMessages = Object.entries(data)
          .map(([, errors]) => {
            if (Array.isArray(errors)) {
              return errors.join(', ');
            }
            return String(errors);
          })
          .join(', ');
        return rejectWithValue(errorMessages || 'Failed to update todo');
      }

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for deleting todo
export const deleteTodo = createAsyncThunk(
  'todos/deleteTodo',
  async (todoId: number, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'https://todo-app.pioneeralpha.com';

      const token = getAuthToken();
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const response = await fetch(`${API_URL}/api/todos/${todoId}/`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.detail) {
          return rejectWithValue(data.detail);
        }
        return rejectWithValue('Failed to delete todo');
      }

      // Return the deleted todo ID
      return todoId;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(errorMessage);
    }
  }
);

// Todo slice
const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Reset success flags
    resetCreateSuccess: (state) => {
      state.createSuccess = false;
    },
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
    },
    resetDeleteSuccess: (state) => {
      state.deleteSuccess = false;
    },
    // Clear todos (on logout)
    clearTodos: (state) => {
      state.todos = [];
      state.count = 0;
      state.next = null;
      state.previous = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get todos pending
      .addCase(getTodos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Get todos fulfilled
      .addCase(
        getTodos.fulfilled,
        (state, action: PayloadAction<TodosResponse>) => {
          state.loading = false;
          state.todos = action.payload.results;
          state.count = action.payload.count;
          state.next = action.payload.next;
          state.previous = action.payload.previous;
          state.error = null;
        }
      )
      // Get todos rejected
      .addCase(getTodos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create todo pending
      .addCase(createTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.createSuccess = false;
      })
      // Create todo fulfilled
      .addCase(createTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false;
        state.todos.unshift(action.payload); // Add to beginning
        state.count += 1;
        state.createSuccess = true;
        state.error = null;
      })
      // Create todo rejected
      .addCase(createTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.createSuccess = false;
      })
      // Update todo pending
      .addCase(updateTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.updateSuccess = false;
      })
      // Update todo fulfilled
      .addCase(updateTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.loading = false;
        const index = state.todos.findIndex(
          (todo) => todo.id === action.payload.id
        );
        if (index !== -1) {
          state.todos[index] = action.payload;
        }
        state.updateSuccess = true;
        state.error = null;
      })
      // Update todo rejected
      .addCase(updateTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      })
      // Delete todo pending
      .addCase(deleteTodo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.deleteSuccess = false;
      })
      // Delete todo fulfilled
      .addCase(deleteTodo.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.todos = state.todos.filter((todo) => todo.id !== action.payload);
        state.count -= 1;
        state.deleteSuccess = true;
        state.error = null;
      })
      // Delete todo rejected
      .addCase(deleteTodo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.deleteSuccess = false;
      });
  },
});

export const {
  clearError,
  resetCreateSuccess,
  resetUpdateSuccess,
  resetDeleteSuccess,
  clearTodos,
} = todoSlice.actions;

export default todoSlice.reducer;
