import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, axios, fetchUser } = useAppContext();
  const [image, setImage] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.post('/api/user/update-image', formData);
      if (data.success) {
        toast.success(data.message);
        fetchUser(); // Refresh user data in context
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-2xl font-semibold mb-5">Profile</h2>
      <img 
        src={image ? URL.createObjectURL(image) : (user?.image || 'default_avatar_url')} 
        className="w-32 h-32 rounded-full object-cover border" 
        alt="Profile" 
      />
      <form onSubmit={handleUpdate} className="mt-5 flex flex-col gap-3">
        <input type="file" onChange={(e) => setImage(e.target.files[0])} accept="image/*" />
        <button type="submit" className="bg-orange-500 text-white px-4 py-2 rounded">
          Update Picture
        </button>
      </form>
    </div>
  );
};

export default Profile;