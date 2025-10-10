'use client';

import { useAuth } from '@/context/auth/AuthContext';
import { NavbarPrimary } from '../components/navbar/navbar_primary';
import PostingForm from './components/PostingForm';

const CreatePost = () => {
  const { user } = useAuth();

  return (
    <div>
      <NavbarPrimary user={user?.role} userId={user?.id} />
      <div className="bg-secondary w-full h-lvh p-4">
        <PostingForm />
      </div>
    </div>
  );
};

export default CreatePost;
