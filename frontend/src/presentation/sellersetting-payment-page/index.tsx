"use client";
import { useEffect, useState } from "react";
import { FaRegUserCircle } from "react-icons/fa";
import axios from "axios";
import { useAuth } from "@/context/auth/AuthContext";
import { usePathname, useRouter } from "next/navigation";

interface PaymentForm {
  email?: string;
  password: string;
  paypal: string | null;
}

export default function BuyerSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const [showRetype, setShowRetype] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<PaymentForm>({
    email: user?.email || "",
    password: "************",
    paypal: null,
  });
  const [paypalError, setPaypalError] = useState("");

  useEffect(() => {
    if (!loading && user) {
      if (path.includes("/seller") && user?.role !== "seller") {
        router.push("/buyersetting");
      }
      setForm({
        email: user.email,
        paypal: user.paypalEmail || "",
        password: "************",
      });
    } else if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading]);

  const isValidPaypalEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditing && e.target.name === "paypal") {
      setForm({ ...form, [e.target.name]: e.target.value || null });
      setPaypalError("");
    }
  };

  const handleConfirm = async () => {
    try {
      if (form.paypal && !isValidPaypalEmail(form.paypal)) {
        setPaypalError("Please enter a valid PayPal email address");
        return;
      }

      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE}/seller-profile/update`,
        {
          role: "seller",
          paypalEmail: form.paypal,
        },
        { withCredentials: true }
      );

      setIsEditing(false);
      setPaypalError("");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update profile");
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) {
      alert("Please enter a new password");
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/update-password`,
        { newPassword },
        { withCredentials: true }
      );
      alert("Password updated successfully!");
      setShowRetype(false);
      setNewPassword("");
      router.push("/login");
    } catch (error) {
      console.error("Error updating password:", error);
      alert("Failed to update password");
    }
  };

  return (
    <main className="flex-1 p-8 bg-white rounded-l-xl shadow ml-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-8">
        <FaRegUserCircle className="w-6 h-6" />
        Payment & Security
      </h2>

      {/* SECURITY SECTION */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Security</h3>
        <div className="grid grid-cols-1 gap-4">
          {/* Email */}
          <div>
            <label className="block font-medium mb-1">Email</label>
            <input
              name="email"
              value={form.email}
              readOnly
              type="email"
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              name="password"
              value={form.password}
              readOnly
              type="text"
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />

            {/* Change Password Button */}
            {!showRetype && (
              <button
                className="mt-3 px-4 py-1 rounded bg-blue-900 text-white hover:bg-blue-800"
                onClick={() => setShowRetype(true)}
              >
                Change Password
              </button>
            )}

            {/* Retype New Password Section */}
            {showRetype && (
              <div className="mt-4">
                <label className="block font-medium mb-1">New Password</label>
                <input
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  type="password"
                  className="w-full border rounded px-3 py-2 mb-3"
                />
                <div className="flex gap-2">
                  <button
                    className="px-4 py-1 rounded bg-blue-900 text-white hover:bg-blue-800"
                    onClick={handlePasswordChange}
                  >
                    Confirm
                  </button>
                  <button
                    className="px-4 py-1 rounded bg-gray-200 hover:bg-gray-300"
                    onClick={() => {
                      setShowRetype(false);
                      setNewPassword("");
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAYMENT SECTION */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Payment</h3>
        <div>
          <label className="block font-medium mb-1">Paypal Email</label>
          <input
            name="paypal"
            value={form.paypal || ""}
            onChange={handleChange}
            type="email"
            placeholder="Enter your PayPal email"
            readOnly={!isEditing}
            className={`w-full border rounded px-3 py-2 bg-white ${
              !isEditing ? "cursor-not-allowed" : ""
            } ${paypalError ? "border-red-500" : ""}`}
          />
          {paypalError && (
            <p className="text-red-500 text-sm mt-1">{paypalError}</p>
          )}
        </div>
      </div>

      {/* PAYPAL UPDATE BUTTONS */}
      <div className="flex gap-4">
        <button
          className="bg-blue-900 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? "Cancel Editing" : "Update PayPal"}
        </button>

        {isEditing && (
          <button
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        )}
      </div>
    </main>
  );
}
