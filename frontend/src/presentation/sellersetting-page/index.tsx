'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { updateUserProfileAPI } from '@/hooks/userProfile.api';
import { SellerProfileUpdateData } from '@/interfaces/seller-profile-interface/seller-profile-types';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { FaRegUserCircle } from 'react-icons/fa';
import { FiTrash2 } from 'react-icons/fi';
import { LuImagePlus } from 'react-icons/lu';

interface SellerForm {
  firstName: string;
  lastName: string;
  bio: string | null;
  specialization: string | null;
  writingStyle: string | null;
}

export default function SellerSettingPage() {
  const { user, loading, setUser } = useAuth();
  const router = useRouter();
  const path = usePathname();
  const fileInputRef = useRef<HTMLInputElement>(null);

  //  Start with no image
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({
    firstName: '',
    lastName: '',
    bio: '',
    specialization: '',
    writingStyle: '',
  });
  const [form, setForm] = useState<SellerForm>({
    firstName: '',
    lastName: '',
    bio: null,
    specialization: null,
    writingStyle: null,
  });

  useEffect(() => {
    if (!loading && user) {
      if (path.includes('/seller') && user?.role !== 'seller') {
        router.push('/buyersetting');
      }
      setForm({
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ')[1] || '',
        bio: user.bio || '',
        specialization: user.specialization || '',
        writingStyle: user.writingStyle || '',
      });

      setProfileImage(user.img_url || null);
    } else if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, path, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const editableFields = [
      'bio',
      'specialization',
      'writingStyle',
      'firstName',
      'lastName',
    ];
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
        bio: !form.bio?.trim() ? 'Bio is required' : '',
        specialization: !form.specialization?.trim()
          ? 'Specialization is required'
          : '',
        writingStyle: !form.writingStyle?.trim()
          ? 'Writing style is required'
          : '',
      };

      if (Object.values(newErrors).some((error) => error !== '')) {
        setErrors(newErrors);
        return;
      }

      const payload: SellerProfileUpdateData = {
        role: 'seller',
        firstName: form.firstName,
        lastName: form.lastName,
        name: `${form.firstName} ${form.lastName}`,
        bio: form.bio || '',
        specialization: form.specialization || '',
        writingStyle: form.writingStyle || '',
      };

      const updatedProfile = await updateUserProfileAPI(payload);

      setUser(updatedProfile);

      setIsEditing(false);
      setErrors({
        firstName: '',
        lastName: '',
        bio: '',
        specialization: '',
        writingStyle: '',
      });
      alert('Updated successfully!');
    } catch (error) {
      console.error('Error updating:', error);
      alert('Update failed');
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('role', 'seller');
      formData.append('profileImage', file);

      const updatedProfile = await updateUserProfileAPI(formData);

      setProfileImage(updatedProfile.profileImage);
      setUser(updatedProfile);
      alert('Profile image updated');
    } catch (error) {
      console.error('Upload error: ', error);
      alert('Upload failed');
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null); // 👈 now resets to null, not default
  };

  return (
    <main className="flex-1 p-8 bg-white rounded-l-xl shadow ml-6">
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <FaRegUserCircle className="w-6 h-6" />
          Account Preferences
        </h1>

        {/* Profile Image Section */}
        <div className="flex flex-col items-center mb-8">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mb-3"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-3">
              <FaRegUserCircle className="text-gray-400 w-10 h-10" />
            </div>
          )}

          <div className="flex gap-3">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button
              className="flex items-center gap-1 border px-3 py-1 rounded text-sm hover:bg-gray-100"
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
        </div>

        {/* Rest of Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium mb-1">First name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded ${
                !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              type="text"
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Last name</label>
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
              className={`w-full border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } px-3 py-2 rounded ${
                !isEditing ? 'bg-gray-100 cursor-not-allowed' : ''
              }`}
              type="text"
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">Bio</label>
          <textarea
            name="bio"
            value={form.bio || ''}
            onChange={handleChange}
            placeholder="Enter your bio..."
            rows={5}
            className={`w-full border ${
              errors.bio ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 rounded resize-none`}
          />
          {errors.bio && (
            <p className="text-red-500 text-sm mt-1">{errors.bio}</p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1">
            Specialization
          </label>
          <input
            name="specialization"
            value={form.specialization || ''}
            onChange={handleChange}
            placeholder="Enter your specialization..."
            className={`w-full border ${
              errors.specialization ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 rounded`}
            type="text"
          />
          {errors.specialization && (
            <p className="text-red-500 text-sm mt-1">{errors.specialization}</p>
          )}
        </div>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-1">
            Writing Style
          </label>
          <input
            name="writingStyle"
            value={form.writingStyle || ''}
            onChange={handleChange}
            placeholder="Enter your writing style..."
            className={`w-full border ${
              errors.writingStyle ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 rounded`}
            type="text"
          />
          {errors.writingStyle && (
            <p className="text-red-500 text-sm mt-1">{errors.writingStyle}</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            className="bg-blue-900 text-white font-medium px-6 py-2 rounded hover:opacity-90"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Update'}
          </button>
          {isEditing && (
            <button
              className="bg-green-600 text-white font-medium px-6 py-2 rounded hover:opacity-90"
              onClick={handleConfirm}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
