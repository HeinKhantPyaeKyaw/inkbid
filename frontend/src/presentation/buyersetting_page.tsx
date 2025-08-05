"use client";
import { useState } from 'react'
import { Bell, UserCircle, Trash2, ImagePlus } from 'lucide-react'
import { NavbarPrimary } from "./components/navbar/navbar_primary";

export default function BuyerSettingsPage() {
  const [form, setForm] = useState({
    firstName: 'Arthur',
    lastName: 'Bills',
    organization: 'The Journal Monthly',
    email: 'arthurbills@gmail.com',
    password: '************',
    paypal: 'bills.paypal@gmail.com'
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  return (
    <>
      <NavbarPrimary />
      <div className="min-h-screen bg-[#f3eee6] flex text-black">
      {/* Left Sidebar */}
      <aside className="w-64 p-6 bg-white rounded-r-xl shadow">
        <h2 className="text-xl font-semibold mb-6">Settings</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-black font-medium">
            <UserCircle className="w-5 h-5" />
            <span>Buyer Settings</span>
          </div>
          <div className="flex items-center gap-2 text-gray-500 hover:text-black cursor-pointer">
            <Bell className="w-5 h-5" />
            <span>Notification</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-white rounded-l-xl shadow ml-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-8">
          <UserCircle className="w-6 h-6" />
          Buyer Settings
        </h2>

        {/* Profile Row */}
        <div className="flex flex-wrap md:flex-nowrap gap-6 mb-8 items-start">
          {/* Profile Image + Buttons */}
          <div className="flex flex-col items-center">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <button className="flex items-center gap-1 border px-3 py-1 rounded mb-2 text-sm">
              <ImagePlus className="w-4 h-4" />
              Change
            </button>
            <button className="flex items-center gap-1 border px-3 py-1 rounded text-sm text-red-600">
              <Trash2 className="w-4 h-4" />
              Remove
            </button>
          </div>

          {/* Name & Org Inputs */}
          <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium mb-1">First name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Last name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div className="col-span-2">
              <label className="block font-medium mb-1">Organization</label>
              <input
                name="organization"
                value={form.organization}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Security</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block font-medium mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                type="email"
                className="w-full border rounded px-3 py-2"
              />
            </div>
            <div>
              <label className="block font-medium mb-1">Password</label>
              <input
                name="password"
                value={form.password}
                onChange={handleChange}
                type="password"
                className="w-full border rounded px-3 py-2"
              />
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-2">Payment</h3>
          <div>
            <label className="block font-medium mb-1">Paypal Email</label>
            <input
              name="paypal"
              value={form.paypal}
              onChange={handleChange}
              type="email"
              className="w-full border rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition">
          Update
        </button>
      </main>
      </div>
    </>
  )
}
