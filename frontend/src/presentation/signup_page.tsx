
"use client";
import React, { useState } from 'react'
import Link from 'next/link'

export default function SignUpPage() {
  const [role, setRole] = useState<string | null>(null);
  return (
    <div className="flex h-screen w-full" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div className="w-1/2 h-full relative">
        <img
          src="/content.jpg"  
          alt="Sign Up Visual"
          className="object-cover w-full h-full"
          style={{ objectPosition: 'center' }}
        />
      </div>

      <div className="w-1/2 bg-[#0c1e45] text-white flex flex-col justify-center items-center px-10">
        <div className="absolute top-6 left-[55%] text-[#f3d175] text-3xl font-serif tracking-widest">
          INKBID
        </div>

        <div className="w-full max-w-md p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>

          <div className="flex space-x-4 mb-6">
            <div className="w-1/2">
              <label htmlFor="firstName" className="block mb-1 text-sm">First Name</label>
              <input
                id="firstName"
                type="text"
                className="w-full px-4 py-2 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="w-1/2">
              <label htmlFor="lastName" className="block mb-1 text-sm">Last Name</label>
              <input
                id="lastName"
                type="text"
                className="w-full px-4 py-2 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label htmlFor="email" className="block mb-1 text-sm">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block mb-1 text-sm">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="retypePassword" className="block mb-1 text-sm">Re-type Password</label>
            <input
              id="retypePassword"
              type="password"
              className="w-full px-4 py-2 text-black rounded border-2 border-blue-400 bg-[#D9D9D9] shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label className="block mb-1 text-sm">Select Role</label>
            <div className="flex space-x-4">
              <button
                type="button"
                className={`w-1/2 py-2 border rounded-full transition duration-200 
                  ${role === 'buyer' ? 'bg-[#f3d175] text-[#0c1e45] border-[#f3d175]' : 'bg-transparent border-white text-white hover:bg-white hover:text-[#0c1e45]'}`}
                onClick={() => setRole('buyer')}
              >
                Buyer
              </button>
              <button
                type="button"
                className={`w-1/2 py-2 border rounded-full transition duration-200 
                  ${role === 'writer' ? 'bg-[#f3d175] text-[#0c1e45] border-[#f3d175]' : 'bg-transparent border-white text-white hover:bg-white hover:text-[#0c1e45]'}`}
                onClick={() => setRole('writer')}
              >
                Writer
              </button>
            </div>
          </div>

          <button className="w-full bg-transparent border border-white text-white py-2 rounded-full hover:bg-white hover:text-[#0c1e45] transition duration-200">
            Sign Up
          </button>

          <p className="text-sm mt-6 text-center">
            <span className="text-white">Already have an account? </span>
            <Link href="/auth/login">
              <span className="text-[#f3d175] hover:underline cursor-pointer">Log In</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
