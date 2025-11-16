import Image from 'next/image';
import Link from 'next/link';

export default function LoginPage() {
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

          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-[#D1D5DB] rounded-lg px-3 py-2"
                placeholder="Enter your password"
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

            <button className="w-full bg-[#5272FF] text-white py-2 rounded-lg hover:bg-blue-700 transition">
              Log In
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
