'use client';
import { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import { LuImagePlus } from 'react-icons/lu';
import axios from 'axios';
import { useAuth } from '@/context/auth/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import { updateUserProfileAPI } from '@/hooks/userProfile.api';
import { SellerProfileUpdateData } from '@/interfaces/seller-profile-interface/seller-profile-types';
interface UserData {
  firstName: string;
  lastName: string;
  organization: string | null;
  email: string;
  password: string;
  paypal: string | null;
}

export default function BuyerSettingsPage() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showRetype, setShowRetype] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // 👇 Start with null image
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [form, setForm] = useState<UserData>({
    firstName: '',
    lastName: '',
    organization: null,
    email: '',
    password: '',
    paypal: null,
  });

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    organization: '',
    paypal: '',
  });

  useEffect(() => {
    if (!loading && user) {
      if (path.includes('/buyer') && user?.role !== 'buyer') {
        router.push('/sellersetting');
      }
      setForm({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        organization: user.organization || '',
        paypal: user.paypalEmail || '',
        email: user.email || '',
        password: '********', // Placeholder for security
      });

      //  Only set image if exists
      setProfileImage(user.img_url || null);
    } else if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, path, router]);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const editableFields = ['organization', 'paypal', 'firstName', 'lastName'];
    if (editableFields.includes(e.target.name) && isEditing) {
      setForm({ ...form, [e.target.name]: e.target.value });
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleConfirm = async () => {
    try {
      const newErrors = {
        firstName: !form.firstName.trim() ? 'First name is required' : '',
        lastName: !form.lastName.trim() ? 'Last name is required' : '',
        organization: !form.organization?.trim()
          ? 'Organization is required'
          : '',
        paypal: form.paypal
          ? !isValidEmail(form.paypal)
            ? 'Please enter a valid PayPal email'
            : ''
          : 'PayPal email is required',
      };

      if (Object.values(newErrors).some((error) => error !== '')) {
        setErrors(newErrors);
        return;
      }

      const payload: SellerProfileUpdateData = {
        role: 'buyer',
        firstName: form.firstName,
        lastName: form.lastName,
        name: `${form.firstName} ${form.lastName}`,
        organization: form.organization || '',
        paypalEmail: form.paypal || '',
      };

      const updatedProfile = await updateUserProfileAPI(payload);

      setUser(updatedProfile);

      setIsEditing(false);
      setErrors({ firstName: '', lastName: '', organization: '', paypal: '' });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update profile');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('role', 'buyer');
      formData.append('profileImage', file);

      const updatedProfile = await updateUserProfileAPI(formData);

      setProfileImage(updatedProfile.profileImage);
      setUser(updatedProfile);

      alert('Profile image updated sccessfully');
    } catch (error) {
      console.error('Upload error: ', error);
      alert('Failed to upload image');
    }
  };

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) {
      alert('Please enter a new password');
      return;
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_BASE}/auth/update-password`,
        { newPassword },
        { withCredentials: true },
      );
      alert('Password updated successfully!');
      setShowRetype(false);
      setNewPassword('');
      router.push('/login');
    } catch (error) {
      console.error('Error updating password:', error);
      alert('Failed to update password');
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null); // 👈 reset to null (no default)
    // Add image removal API call here
  };

  if (loading) {
    return (
      <main className="flex-1 p-8 bg-white rounded-l-xl shadow ml-6">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="flex-1 p-8 bg-white rounded-l-xl shadow ml-6">
      <h2 className="text-2xl font-semibold flex items-center gap-2 mb-8">
        <FaUserCircle className="w-6 h-6" />
        Buyer Settings
      </h2>

      {/* Profile Section */}
      <div className="flex flex-wrap md:flex-nowrap gap-6 mb-8 items-start">
        <div className="flex flex-col items-center">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <FaUserCircle className="text-gray-400 w-10 h-10" />
            </div>
          )}

          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          <button
            className="flex items-center gap-1 border px-3 py-1 rounded mb-2 text-sm hover:bg-gray-100"
            onClick={() => fileInputRef.current?.click()}
          >
            <LuImagePlus className="w-4 h-4" />
            {profileImage ? 'Change' : 'Upload'}
          </button>
          {profileImage && (
            <button
              className="flex items-center gap-1 border px-3 py-1 rounded text-sm text-red-600 hover:bg-red-50"
              onClick={handleRemoveImage}
            >
              <FiTrash2 className="w-4 h-4" />
              Remove
            </button>
          )}
        </div>

        {/* Editable Info */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium mb-1">First name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full border rounded px-3 py-2 ${
                !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
              } ${errors.firstName ? 'border-red-500' : ''}`}
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block font-medium mb-1">Last name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full border rounded px-3 py-2 ${
                !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
              } ${errors.lastName ? 'border-red-500' : ''}`}
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
          <div className="col-span-2">
            <label className="block font-medium mb-1">Organization</label>
            <input
              name="organization"
              value={form.organization || ''}
              onChange={handleChange}
              placeholder="Enter your organization"
              className={`w-full border rounded px-3 py-2 ${
                errors.organization ? 'border-red-500' : ''
              }`}
            />
            {errors.organization && (
              <p className="text-red-500 text-sm mt-1">{errors.organization}</p>
            )}
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
              readOnly
              type="email"
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Password</label>
            <input
              name="password"
              value={form.password}
              readOnly
              type="text"
              className="w-full border rounded px-3 py-2 bg-gray-100 cursor-not-allowed"
            />

            {/* Moved Change Password Button under Password */}
            {!showRetype && (
              <button
                className="mt-3 px-4 py-1 rounded bg-blue-900 text-white hover:bg-blue-800"
                onClick={() => setShowRetype(true)}
              >
                Change Password
              </button>
            )}

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
                      setNewPassword('');
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

      {/* Payment Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold mb-2">Payment</h3>
        <div>
          <label className="block font-medium mb-1">Paypal Email</label>
          <input
            name="paypal"
            value={form.paypal || ''}
            onChange={handleChange}
            type="email"
            placeholder="Enter your PayPal email"
            className={`w-full border rounded px-3 py-2 ${
              errors.paypal ? 'border-red-500' : ''
            }`}
          />
          {errors.paypal && (
            <p className="text-red-500 text-sm mt-1">{errors.paypal}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          className="bg-blue-900 text-white font-medium px-6 py-2 rounded hover:opacity-90"
          onClick={() => {
            if (isEditing) {
              // When user clicks "Cancel"
              setIsEditing(false);
            } else {
              // When user clicks "Update"
              setIsEditing(true);
            }
          }}
        >
          {isEditing ? 'Cancel' : 'Update'}
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
