export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  address?: string;
  contact_number?: string;
  birthday?: string;
  profile_image?: string;
  bio?: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  address?: string;
  contactNumber?: string;
  birthday?: string;
  bio?: string;
  profileImage?: File;
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
  user?: User;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  signupSuccess: boolean;
  loginSuccess: boolean;
  updateSuccess: boolean;
}
