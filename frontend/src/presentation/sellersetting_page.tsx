"use client";

import { useState } from "react";
import { NavbarPrimary } from "./components/navbar/navbar_primary";
import { Trash2, ImagePlus, UserCircle } from "lucide-react";

export default function AccountPreferencesPage() {
  const [form, setForm] = useState({
    firstName: "Arthur",
    lastName: "Bills",
    bio: `I'm a freelance economic analyst and writer with a Ph.D. in Economics from the University of Chicago. Over the past decade, I've focused on macroeconomic trends, income inequality, and international trade policy. My work aims to translate complex data into accessible narratives, combining academic rigor with a clear, grounded voice.\nI’ve written extensively for both policy think tanks and business publications, with bylines in Bloomberg...`,
    specialization: "Politics, Macroeconomics, Policy Analysis",
    writingStyle: "Academical, Data-driven, Clear and Concise",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
      <main className="flex-1 p-8 bg-white rounded-l-xl shadow ml-6">
        <div className="flex-1 p-10">
          <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
            <UserCircle className="w-6 h-6" />
            Account Preferences
          </h1>

          <div className="flex flex-col items-center mb-8">
            <img
              src="https://randomuser.me/api/portraits/men/75.jpg"
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
            <div className="flex gap-3">
              <button className="flex items-center gap-1 border px-3 py-1 rounded text-sm">
                <ImagePlus className="w-4 h-4" />
                Change
              </button>
              <button className="flex items-center gap-1 border px-3 py-1 rounded text-sm text-red-600">
                <Trash2 className="w-4 h-4" />
                Remove
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-1">First name</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                type="text"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Last name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full border border-gray-300 px-3 py-2 rounded"
                type="text"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea
              name="bio"
              value={form.bio}
              onChange={handleChange}
              rows={5}
              className="w-full border border-gray-300 px-3 py-2 rounded resize-none"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-1">Specialization</label>
            <input
              name="specialization"
              value={form.specialization}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              type="text"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium mb-1">Writing Style</label>
            <input
              name="writingStyle"
              value={form.writingStyle}
              onChange={handleChange}
              className="w-full border border-gray-300 px-3 py-2 rounded"
              type="text"
            />
          </div>

          <button
            className="bg-blue-900 text-white font-medium px-6 py-2 rounded hover:opacity-90"
            onClick={() => alert("Updated successfully!")}
          >
            Update
          </button>
        </div>
      </main>
  );
}
