
import React from 'react'
import Link from 'next/link'

export default function LoginPage() {
  return (
    <div className="flex h-screen w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="w-1/2 h-full relative">
        <img
          src="/content.jpg"  
          alt="Login Visual"
          className="object-cover w-full h-full" 
          style={{ objectPosition: 'center' }}
        />
      </div>

      <div className="w-1/2 bg-[#0c1e45] text-white flex flex-col justify-center items-center px-10">
        <div className="absolute top-6 left-[55%] text-[#f3d175] text-3xl font-serif tracking-widest">
          INKBID
        </div>

        <div className="w-full max-w-md p-8 text-white">
          <h2 className="text-2xl font-bold mb-15 text-center">Welcome Back</h2>

          <div className="mb-9">
            <label htmlFor="email1" className="block mb-1 text-sm text-white">Email</label>
            <input
              id="email1"
              type="email"
              className="w-full px-4 py-2 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email2" className="block mb-1 text-sm text-white">Password</label>
            <input
              id="email2"
              type="password"
              className="w-full px-4 py-2 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm mb-6">
            <label className="flex items-center space-x-2">
              <input type="checkbox" className="accent-blue-500" />
              <span className="text-white">Remember Me</span>
            </label>
            <Link href="/auth/forgotpassword" className="text-[#f3d175] hover:underline">Forgot Password?</Link>
          </div>

          <button className="w-full bg-transparent border border-white text-white py-2 rounded-full hover:bg-white hover:text-[#0c1e45] transition duration-200">
            Log In
          </button>

          <p className="text-sm mt-6 text-center">
            <span className="text-white">Don't have an account yet? </span>
            <Link href="/auth/signup">
              <span className="text-[#f3d175] hover:underline cursor-pointer">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
