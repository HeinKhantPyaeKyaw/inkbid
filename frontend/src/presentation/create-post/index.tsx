'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { NavbarPrimary } from '../components/navbar/navbar_primary';
import PostingForm from './components/PostingForm';

const CreatePost = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f7f3]">
      <NavbarPrimary user={user?.role} userId={user?.id} />
      <div className="flex justify-center px-4 sm:px-8 md:px-12 py-2">
        <div className="w-full bg-white shadow-lg rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 border border-[#e6e6e6]">
          <PostingForm />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
