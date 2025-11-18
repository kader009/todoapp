'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/libs/hook';
import {
  signupUser,
  clearError,
  resetSignupSuccess,
} from '@/libs/feature/authSlice';
import { toast } from 'sonner';
import { z } from 'zod';
import { signupSchema } from '@/libs/validations/authSchema';

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error, signupSuccess } = useAppSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Validate field if already touched using Zod
    if (touched[name]) {
      try {
        // Validate single field
        const fieldSchema =
          signupSchema.shape[name as keyof typeof signupSchema.shape];
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

    // Clear global error when user types
    if (error) dispatch(clearError());
  };

  // Handle field blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate field using Zod
    try {
      const fieldSchema =
        signupSchema.shape[name as keyof typeof signupSchema.shape];
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

    // Validate all fields using Zod
    try {
      signupSchema.parse(formData);
      // If validation passes, clear errors and submit
      setFieldErrors({});
      dispatch(signupUser(formData));
    } catch (err) {
      if (err instanceof z.ZodError) {
        // Convert Zod errors to field errors
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
    if (signupSuccess) {
      toast.success('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        dispatch(resetSignupSuccess());
        router.push('/login');
      }, 1500);
    }
  }, [signupSuccess, router, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-[193px]">
      {/* Left Illustration */}
      <div className="bg-[#E2ECF8] w-[606px] flex items-center justify-center p-10">
        <Image
          src="/registerimage.png"
          alt="Signup Illustration"
          className="h-auto w-full"
          width={613}
          height={344}
        />
      </div>

      {/* Right Signup Form */}
      <div className="flex items-center justify-center p-8 pr-[193px]">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-[30px] font-bold">Create your account</h1>
            <p className="text-[#4B5563] text-sm mt-1">
              Start managing your tasks efficiently
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${
                    touched.firstName && fieldErrors.firstName
                      ? 'border-red-500 focus:ring-red-300'
                      : 'border-[#D1D5DB] focus:ring-blue-300'
                  }`}
                  placeholder="First Name"
                  disabled={loading}
                />
                {touched.firstName && fieldErrors.firstName && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${
                    touched.lastName && fieldErrors.lastName
                      ? 'border-red-500 focus:ring-red-300'
                      : 'border-[#D1D5DB] focus:ring-blue-300'
                  }`}
                  placeholder="Last Name"
                  disabled={loading}
                />
                {touched.lastName && fieldErrors.lastName && (
                  <p className="text-red-500 text-xs mt-1">
                    {fieldErrors.lastName}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
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

            {/* Password */}
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

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring ${
                  touched.confirmPassword && fieldErrors.confirmPassword
                    ? 'border-red-500 focus:ring-red-300'
                    : 'border-[#D1D5DB] focus:ring-blue-300'
                }`}
                placeholder="Confirm your password"
                disabled={loading}
              />
              {touched.confirmPassword && fieldErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5272FF] text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center text-sm">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#5272FF] font-medium hover:underline"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
