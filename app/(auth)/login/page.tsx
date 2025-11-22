'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/libs/hook';
import {
  loginUser,
  clearError,
  resetLoginSuccess,
  getUserProfile,
} from '@/libs/feature/authSlice';
import { toast } from 'sonner';
import { z } from 'zod';
import { loginSchema } from '@/libs/validations/authSchema';

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, loginSuccess } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validate field if already touched
    if (touched[name]) {
      try {
        const fieldSchema =
          loginSchema.shape[name as keyof typeof loginSchema.shape];
        if (fieldSchema) {
          fieldSchema.parse(value);
          setFieldErrors((prev) => ({ ...prev, [name]: '' }));
        }
      } catch (err) {
        if (err instanceof z.ZodError) {
          setFieldErrors((prev) => ({
            ...prev,
            [name]: err.issues[0]?.message || '',
          }));
        }
      }
    }

    // Clear error when user types
    if (error) dispatch(clearError());
  };

  // Handle field blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    try {
      const fieldSchema =
        loginSchema.shape[name as keyof typeof loginSchema.shape];
      if (fieldSchema) {
        fieldSchema.parse(value);
        setFieldErrors((prev) => ({ ...prev, [name]: '' }));
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setFieldErrors((prev) => ({
          ...prev,
          [name]: err.issues[0]?.message || '',
        }));
      }
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched: Record<string, boolean> = {};
    Object.keys(formData).forEach((key) => {
      allTouched[key] = true;
    });
    setTouched(allTouched);

    // Validate using Zod
    try {
      loginSchema.parse(formData);
      setFieldErrors({});
      dispatch(loginUser(formData));
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          if (issue.path[0]) {
            errors[issue.path[0] as string] = issue.message;
          }
        });
        setFieldErrors(errors);
        toast.error('Please fix all validation errors');
      }
    }
  };

  // Show notifications for success/error
  useEffect(() => {
    if (loginSuccess) {
      toast.success('Login successful! Redirecting...');

      // Always fetch user profile to get complete user data
      // JWT token only contains user_id, not email/first_name/last_name
      console.log('Login successful, fetching complete user profile...');
      dispatch(getUserProfile());

      setTimeout(() => {
        dispatch(resetLoginSuccess());
        router.push('/todos');
      }, 1500);
    }
  }, [loginSuccess, router, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-0 md:gap-[100px] lg:gap-[193px]">
      <div className="hidden md:flex bg-[#E2ECF8] items-center justify-center p-10 w-full">
        <Image
          src="/loginimage.png"
          alt="Illustration"
          className="h-auto w-full max-w-[663px]"
          width={663}
          height={414}
        />
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center p-6 md:p-8 md:pr-[50px] lg:pr-[193px]">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-[30px] font-bold">Log in to your account</h1>
            <p className="text-[#4B5563] text-sm mt-1">
              Start managing your tasks efficiently
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${
                  touched.email && fieldErrors.email
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-[#D1D5DB] focus:ring-blue-300'
                }`}
                placeholder="Enter your email"
                disabled={loading}
              />
              {touched.email && fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${
                  touched.password && fieldErrors.password
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-[#D1D5DB] focus:ring-blue-300'
                }`}
                placeholder="Enter your password"
                disabled={loading}
              />
              {touched.password && fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4" /> Remember me
              </label>
              <Link href="#" className="text-blue-600 hover:underline">
                Forgot your password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5272FF] text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <p className="text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link
              href="/signup"
              className="text-[#5272FF] font-medium hover:underline"
            >
              Register now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
