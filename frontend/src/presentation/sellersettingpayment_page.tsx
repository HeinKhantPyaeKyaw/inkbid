"use client";
import { useState } from 'react'
import { Bell, UserCircle, Trash2, ImagePlus } from 'lucide-react'
import { NavbarPrimary } from "./components/navbar/navbar_primary"; 

export default function BuyerSettingsPage() {
  const [showRetype, setShowRetype] = useState(false);
  const [newPassword, setNewPassword] = useState("");
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
      <main className="flex-1 p-8 bg-white rounded-l-xl shadow ml-6">
        <h2 className="text-2xl font-semibold flex items-center gap-2 mb-8">
          <UserCircle className="w-6 h-6" />
          Payment & Security
        </h2>

       

         
  
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
                type="text"
                className="w-full border rounded px-3 py-2"
              />
              {showRetype && (
                <div className="mt-4">
                  <label className="block font-medium mb-1">New Password</label>
                  <input
                    name="newPassword"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    type="password"
                    className="w-full border rounded px-3 py-2 mb-3"
                  />
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-1 rounded bg-blue-900 text-white hover:bg-blue-800"
                      onClick={() => {
                        if (newPassword.length < 6) {
                          alert("Password must be at least 6 characters.");
                          return;
                        }
                        setForm({ ...form, password: newPassword });
                        setShowRetype(false);
                        setNewPassword("");
                      }}
                    >
                      Confirm
                    </button>
                    <button
                      className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
                      onClick={() => { setShowRetype(false); setNewPassword(""); }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

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

        <button
          className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          onClick={() => setShowRetype(true)}
        >
          Update
        </button>
      </main>
  )
}
