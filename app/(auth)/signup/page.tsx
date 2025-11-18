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

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user types
    if (error) dispatch(clearError());
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      toast.error('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    // Dispatch signup action
    dispatch(signupUser(formData));
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
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="First Name"
                  disabled={loading}
                />
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
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Last Name"
                  disabled={loading}
                />
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
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
                disabled={loading}
              />
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
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Confirm your password"
                disabled={loading}
              />
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
