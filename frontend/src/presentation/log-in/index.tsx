'use client';

import { useAuth } from '@/context/auth/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [form, setForm] = React.useState({
    email: '',
    password: '',
  });
  const [error, setError] = React.useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // console.log(form);
    setError(null);

    try {
      //Call context login (set cookies + fetches user)
      await login(form.email, form.password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login Failed');
    }
  };

  useEffect(() => {
    if (!user) return;
    if (user.role === 'seller') {
      router.push('/create-post');
    } else {
      router.push('/content-listing');
    }
  }, [user, router]);

  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/images/content.png"
          alt="Login Visual"
          className="object-cover w-full h-full"
          style={{ objectPosition: 'center' }}
        />
      </div>

      <div className="w-full md:w-1/2 bg-[#0c1e45] text-white flex flex-col justify-center items-center px-4 md:px-10 py-8 md:py-0">
        <div className="absolute top-6 left-1/2 md:left-[55%] transform -translate-x-1/2 md:translate-x-0 text-[#f3d175] text-3xl font-serif tracking-widest">
          INKBID
        </div>

        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-0 mt-8 sm:mt-12 lg:-mt-80">
          <h2 className="text-xl sm:text-2xl font-bold mb-6 sm:mb-8 text-center">
            Welcome Back
          </h2>

          {/* Show error if login failed */}
          {error && (
            <div className="mb-4 text-red-400 text-center text-sm">{error}</div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-white"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block mb-1 sm:mb-2 text-xs sm:text-sm font-medium text-white"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                placeholder="Enter your password"
              />
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs sm:text-sm space-y-2 sm:space-y-0">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 accent-blue-500"
                />
                <span className="text-white select-none">Remember Me</span>
              </label>
              <Link
                href="/forgotpassword"
                className="text-[#f3d175] hover:underline transition-all duration-200 font-medium"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-transparent border-2 border-white text-white py-2 sm:py-3 rounded-full hover:bg-white hover:text-[#0c1e45] transition-all duration-200 font-medium text-sm sm:text-base hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0c1e45] mt-6 sm:mt-8"
            >
              Log In
            </button>
          </form>

          <p className="text-xs sm:text-sm mt-4 sm:mt-6 text-center">
            <span className="text-white">Don&apos;t have an account yet? </span>
            <Link href="/signup">
              <span className="text-[#f3d175] hover:underline cursor-pointer font-medium transition-all duration-200">
                Sign Up
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
