import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Helper function to decode JWT token
function decodeJWT(
  token: string
): { user_id?: number; email?: string; [key: string]: unknown } | null {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

import {
  User,
  UpdateProfileData,
  SignupData,
  SignupResponse,
  LoginData,
  LoginResponse,
  AuthState,
} from '@/types/auth';

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  loading: false,
  error: null,
  signupSuccess: false,
  loginSuccess: false,
  updateSuccess: false,
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

      console.log('Login API Response:', data); // Debug log

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

// Async thunk for getting user profile
export const getUserProfile = createAsyncThunk(
  'auth/getUserProfile',
  async (_, { rejectWithValue, getState }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'https://todo-app.pioneeralpha.com';

      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      // Get user_id from current state (from JWT decode)
      const state = getState() as { auth: AuthState };
      const userId = state.auth.user?.id;

      console.log('Fetching profile for user ID:', userId);

      // Try multiple endpoints in order
      let response;
      let endpointUsed = '';

      console.log('Trying endpoint: /api/users/me/');
      response = await fetch(`${API_URL}/api/users/me/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      endpointUsed = '/api/users/me/';
      console.log('Response status:', response.status);

      if (response.status === 404) {
        console.log('Trying endpoint: /api/users/profile/');
        response = await fetch(`${API_URL}/api/users/profile/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        endpointUsed = '/api/users/profile/';
        console.log('Response status:', response.status);
      }

      if (response.status === 404 && userId) {
        console.log(`Trying endpoint: /api/users/${userId}/`);
        response = await fetch(`${API_URL}/api/users/${userId}/`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        endpointUsed = `/api/users/${userId}/`;
        console.log('Response status:', response.status);
      }

      console.log(
        `Final endpoint used: ${endpointUsed}, status: ${response.status}`
      );

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.warn(
          'API returned non-JSON response, status:',
          response.status
        );
        return rejectWithValue('User data endpoint not available');
      }

      const data = await response.json();
      console.log('User data from API:', data);

      if (!response.ok) {
        return rejectWithValue(data.detail || 'Failed to fetch user data');
      }

      return data;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Network error';
      console.warn('getUserProfile error:', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for updating user profile
export const updateUserProfile = createAsyncThunk(
  'auth/updateUserProfile',
  async (updateData: UpdateProfileData, { rejectWithValue }) => {
    try {
      const API_URL =
        process.env.NEXT_PUBLIC_API_URL || 'https://todo-app.pioneeralpha.com';

      const token = localStorage.getItem('token');
      if (!token) {
        return rejectWithValue('No authentication token found');
      }

      const formData = new FormData();

      // Append only provided fields
      if (updateData.firstName !== undefined) {
        formData.append('first_name', updateData.firstName);
      }
      if (updateData.lastName !== undefined) {
        formData.append('last_name', updateData.lastName);
      }
      if (updateData.address !== undefined) {
        formData.append('address', updateData.address);
      }
      if (updateData.contactNumber !== undefined) {
        formData.append('contact_number', updateData.contactNumber);
      }
      if (updateData.birthday !== undefined) {
        formData.append('birthday', updateData.birthday);
      }
      if (updateData.bio !== undefined) {
        formData.append('bio', updateData.bio);
      }
      if (updateData.profileImage) {
        formData.append('profile_image', updateData.profileImage);
      }

      const response = await fetch(`${API_URL}/api/users/me/`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle errors
        if (data.detail) {
          return rejectWithValue(data.detail);
        }
        const errorMessages = Object.entries(data)
          .map(([, errors]) => {
            if (Array.isArray(errors)) {
              return errors.join(', ');
            }
            return String(errors);
          })
          .join(', ');
        return rejectWithValue(errorMessages || 'Profile update failed');
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
    // Reset update success
    resetUpdateSuccess: (state) => {
      state.updateSuccess = false;
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
          console.log('Login fulfilled - payload:', action.payload);

          // Save tokens
          state.token = action.payload.access;
          state.refreshToken = action.payload.refresh;

          // Try multiple sources for user data
          if (action.payload.user) {
            console.log('User data from login response:', action.payload.user);
            state.user = action.payload.user;
          } else {
            console.log('No user in response, decoding JWT...');
            const tokenData = decodeJWT(action.payload.access);
            console.log('Decoded JWT data:', tokenData);

            if (tokenData) {
              const userId = tokenData.user_id || tokenData.id || tokenData.sub;
              const userEmail = tokenData.email || tokenData.username;
              const firstName =
                tokenData.first_name || tokenData.firstName || '';
              const lastName = tokenData.last_name || tokenData.lastName || '';

              if (userId) {
                state.user = {
                  id: Number(userId),
                  email: userEmail ? String(userEmail) : '',
                  first_name: firstName ? String(firstName) : '',
                  last_name: lastName ? String(lastName) : '',
                };
                console.log(
                  'Temporary user created from JWT (getUserProfile needed):',
                  state.user
                );
              } else {
                console.warn('JWT missing user_id');
              }
            } else {
              console.warn('Failed to decode JWT token');
            }
          }

          state.loginSuccess = true;
          state.error = null;
        }
      )
      // Login rejected
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.loginSuccess = false;
      })
      // Get user profile pending
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
      })
      // Get user profile fulfilled
      .addCase(
        getUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          console.log('User profile fetched:', action.payload);
          state.user = action.payload;
          state.error = null;
        }
      )
      // Get user profile rejected
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        console.warn('Failed to fetch user profile:', action.payload);
      })
      // Update user profile pending
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.updateSuccess = false;
      })
      // Update user profile fulfilled
      .addCase(
        updateUserProfile.fulfilled,
        (state, action: PayloadAction<User>) => {
          state.loading = false;
          state.user = action.payload;
          state.updateSuccess = true;
          state.error = null;
        }
      )
      // Update user profile rejected
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.updateSuccess = false;
      });
  },
});

export const {
  clearError,
  resetSignupSuccess,
  resetLoginSuccess,
  resetUpdateSuccess,
  logout,
} = authSlice.actions;
export default authSlice.reducer;
