import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
}

export interface SignupResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  signupSuccess: boolean;
  loginSuccess: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  signupSuccess: false,
  loginSuccess: false,
};

// Async thunk for signup
export const signupUser = createAsyncThunk(
  'auth/signup',
  async (signupData: SignupData, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'https://todo-app.pioneeralpha.com';

      // Transform data to match backend API format
      const formData = new FormData();
      formData.append('first_name', signupData.firstName);
      formData.append('last_name', signupData.lastName);
      formData.append('email', signupData.email);
      formData.append('password', signupData.password);

      const response = await fetch(`${API_URL}/api/users/signup/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 400 Bad Request with field-specific errors
        if (response.status === 400) {
          if (data.detail) {
            return rejectWithValue(data.detail);
          }
          // Handle other field errors
          const errorMessages = Object.entries(data)
            .map(([, errors]) => {
              if (Array.isArray(errors)) {
                return errors.join(', ');
              }
              return String(errors);
            })
            .join(', ');
          return rejectWithValue(errorMessages || 'Signup failed');
        }
        return rejectWithValue(data.message || data.detail || 'Signup failed');
      }

      // Return user data (no token in response based on your API spec)
      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/login',
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'https://todo-app.pioneeralpha.com';

      const formData = new FormData();
      formData.append('email', loginData.email);
      formData.append('password', loginData.password);

      const response = await fetch(`${API_URL}/api/auth/login/`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle 400/401 errors
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
        return rejectWithValue(errorMessages || 'Login failed');
      }

      // Save tokens to localStorage
      if (data.access) {
        localStorage.setItem('token', data.access);
      }
      if (data.refresh) {
        localStorage.setItem('refreshToken', data.refresh);
      }

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Network error';
      return rejectWithValue(errorMessage);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
    // Reset signup success
    resetSignupSuccess: (state) => {
      state.signupSuccess = false;
    },
    // Reset login success
    resetLoginSuccess: (state) => {
      state.loginSuccess = false;
    },
    // Logout
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.signupSuccess = false;
      state.loginSuccess = false;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    },
  },
  extraReducers: (builder) => {
    builder
      // Signup pending
      .addCase(signupUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.signupSuccess = false;
      })
      // Signup fulfilled
      .addCase(
        signupUser.fulfilled,
        (state, action: PayloadAction<SignupResponse>) => {
          state.loading = false;
          // Map backend response to user state
          state.user = {
            id: action.payload.id,
            email: action.payload.email,
            first_name: action.payload.first_name,
            last_name: action.payload.last_name,
          };
          state.signupSuccess = true;
          state.error = null;
        }
      )
      // Signup rejected
      .addCase(signupUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.signupSuccess = false;
      })
      // Login pending
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.loginSuccess = false;
      })
      // Login fulfilled
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<LoginResponse>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.access;
          state.refreshToken = action.payload.refresh;
          state.loginSuccess = true;
          state.error = null;
        }
      )
      // Login rejected
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.loginSuccess = false;
      });
  },
});

export const { clearError, resetSignupSuccess, resetLoginSuccess, logout } =
  authSlice.actions;
export default authSlice.reducer;
