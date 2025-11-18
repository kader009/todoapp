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
} from '@/libs/feature/authSlice';
import { toast } from 'sonner';

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
    if (!formData.email || !formData.password) {
      toast.error('Email and password are required');
      return;
    }

    // Dispatch login action
    dispatch(loginUser(formData));
  };

  // Show notifications for success/error
  useEffect(() => {
    if (loginSuccess) {
      toast.success('Login successful! Redirecting...');
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
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 gap-[193px]">
      <div className="bg-[#E2ECF8] flex items-center justify-center p-10 w-[606px]">
        <Image
          src="/loginimage.png"
          alt="Illustration"
          className="h-auto w-full"
          width={663}
          height={414}
        />
      </div>

      {/* Right Login Form */}
      <div className="flex items-center justify-center p-8 pr-[193px]">
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
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

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
