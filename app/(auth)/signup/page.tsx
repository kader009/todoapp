import Image from 'next/image';
import Link from 'next/link';

export default function SignupPage() {
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

          <form className="space-y-4">
            {/* First & Last Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="First Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Last Name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2 focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Confirm your password"
              />
            </div>

            <button className="w-full bg-[#5272FF] text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Sign Up
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
