import { NavbarPrimary } from '../components/navbar/navbar_primary';
import PostingForm from './components/PostingForm';

const CreatePost = () => {
  return (
    <div>
      <NavbarPrimary user='seller'/>
      <div className="bg-secondary w-full h-lvh p-4">
        <PostingForm />
      </div>
    </div>
  );
};

export default CreatePost;
