'use client';
import Link from 'next/link';
import React, { useState } from 'react';
import {useRouter} from 'next/navigation';
export default function SignUpPage() {
  const [role, setRole] = useState<string | null>(null);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    retypePassword: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) {
      alert('Please select a role');
      return;
    }
    if (form.password !== form.retypePassword) {
      alert('Passwords do not match');
      return;
    }
    console.log(form, role);
    try {
      const response = await fetch(
        'http://localhost:5500/api/v1/auth/register',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            password: form.password,
            firstName: form.firstName,
            lastName: form.lastName,
            role,
          }),
        },
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      } else {
        // alert('Registration successful! Please log in.');
        // window.location.href = '/auth/login';
        router.push('/content-listing')
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Error: ${errorMessage}`);
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col lg:flex-row"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/images/content.png"
          alt="Sign Up Visual"
          className="object-cover w-full h-full"
          style={{ objectPosition: 'center' }}
        />
      </div>

      <div className="w-full md:w-1/2 bg-[#0c1e45] text-white flex flex-col justify-center items-center px-4 md:px-10 py-8 md:py-0">
        <div className="absolute top-6 left-1/2 md:left-[55%] transform -translate-x-1/2 md:translate-x-0 text-[#f3d175] text-3xl font-serif tracking-widest">
          INKBID
        </div>
        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-0 mt-16 sm:mt-8 lg:mt-0">
          <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-center">
            Sign Up
          </h2>

          <form onSubmit={handleRegister} className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="firstName"
                  className="block mb-1 text-xs sm:text-sm font-medium"
                >
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={form.firstName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter first name"
                />
              </div>
              <div className="w-full sm:w-1/2">
                <label
                  htmlFor="lastName"
                  className="block mb-1 text-xs sm:text-sm font-medium"
                >
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={form.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                  placeholder="Enter last name"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block mb-1 text-xs sm:text-sm font-medium"
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
                className="block mb-1 text-xs sm:text-sm font-medium"
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
                placeholder="Enter password"
              />
            </div>

            <div>
              <label
                htmlFor="retypePassword"
                className="block mb-1 text-xs sm:text-sm font-medium"
              >
                Re-type Password
              </label>
              <input
                id="retypePassword"
                type="password"
                value={form.retypePassword}
                onChange={handleChange}
                required
                className="w-full px-3 sm:px-4 py-2 sm:py-3 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm sm:text-base"
                placeholder="Confirm password"
              />
            </div>

            <div>
              <label className="block mb-2 text-xs sm:text-sm font-medium">
                Select Role
              </label>
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                  type="button"
                  className={`w-full sm:w-1/2 py-2 sm:py-3 border-2 rounded-full transition-all duration-200 font-medium text-sm sm:text-base
                    ${
                      role === 'buyer'
                        ? 'bg-[#f3d175] text-[#0c1e45] border-[#f3d175] shadow-lg'
                        : 'bg-transparent border-white text-white hover:bg-white hover:text-[#0c1e45] hover:shadow-md'
                    }`}
                  onClick={() => setRole('buyer')}
                >
                  Buyer
                </button>
                <button
                  type="button"
                  className={`w-full sm:w-1/2 py-2 sm:py-3 border-2 rounded-full transition-all duration-200 font-medium text-sm sm:text-base
                    ${
                      role === 'writer'
                        ? 'bg-[#f3d175] text-[#0c1e45] border-[#f3d175] shadow-lg'
                        : 'bg-transparent border-white text-white hover:bg-white hover:text-[#0c1e45] hover:shadow-md'
                    }`}
                  onClick={() => setRole('writer')}
                >
                  Seller
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-transparent border-2 border-white text-white py-2 sm:py-3 rounded-full hover:bg-white hover:text-[#0c1e45] transition-all duration-200 font-medium text-sm sm:text-base hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0c1e45]"
            >
              Sign Up
            </button>
          </form>

          <p className="text-xs sm:text-sm mt-4 sm:mt-6 text-center">
            <span className="text-white">Already have an account? </span>
            <Link href="/auth/login">
              <span className="text-[#f3d175] hover:underline cursor-pointer font-medium transition-all duration-200">
                Log In
              </span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
