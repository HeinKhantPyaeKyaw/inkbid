'use client';
import Link from 'next/link';
import React from 'react';
export default function ForgotPasswordPage() {
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    alert('Your password has been reset successfully.');
  };

  return (
    <div
      className="flex h-screen w-full"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <div className="w-1/2 h-full relative">
        <img
          src="/images/content.png"
          alt="Visual"
          className="object-cover w-full h-full"
          style={{ objectPosition: 'center' }}
        />
      </div>

      <div className="w-1/2 bg-[#0c1e45] text-white flex flex-col justify-center items-center px-10">
        <div className="absolute top-6 left-[55%] text-[#f3d175] text-3xl font-serif tracking-widest">
          INKBID
        </div>

        <div className="w-full max-w-md p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Forgot Password
          </h2>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-1 text-sm text-white">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="password"
                className="block mb-1 text-sm text-white"
              >
                New Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block mb-1 text-sm text-white"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-transparent border border-white text-white py-2 rounded-full hover:bg-white hover:text-[#0c1e45] transition duration-200"
            >
              Reset Password
            </button>

            <p className="text-sm mt-4 text-center">
              Remembered your password?{' '}
              <Link href="/login">
                <span className="text-[#f3d175] hover:underline cursor-pointer">
                  Back to Login
                </span>
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
