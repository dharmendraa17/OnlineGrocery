import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { assets } from '../assets/assets';

const Profile = () => {
  const { user, axios, fetchUser } = useAppContext();
  const [image, setImage] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!image) {
      return toast.error("Please select an image first");
    }

    try {
      const formData = new FormData();
      formData.append('image', image);

      const { data } = await axios.post('/api/user/update-image', formData);
      if (data.success) {
        toast.success(data.message);
        if (typeof fetchUser === 'function') {
          await fetchUser(); 
        } // Refresh user data in context to update the UI globally
        setImage(null);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <div className="flex flex-col items-center mt-12 mb-20">
      <div className="bg-white p-8 rounded-lg shadow-sm border w-full max-w-md flex flex-col items-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
        
        <div className="relative group">
          <img 
            src={image ? URL.createObjectURL(image) : (user?.image || assets.profile_icon)} 
            className="w-40 h-40 rounded-full object-cover border-4 border-orange-100" 
            alt="Profile" 
          />
          <label htmlFor="profile-upload" className="absolute bottom-2 right-2 bg-orange-500 p-2 rounded-full cursor-pointer hover:bg-orange-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            <input 
              id="profile-upload" 
              type="file" 
              className="hidden" 
              onChange={(e) => setImage(e.target.files[0])} 
              accept="image/*" 
            />
          </label>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xl font-medium text-gray-700">{user?.name}</p>
          <p className="text-gray-500">{user?.email}</p>
        </div>

        {image && (
          <button 
            onClick={handleUpdate}
            className="mt-8 w-full bg-orange-500 text-white font-semibold py-2 rounded-md hover:bg-orange-600 transition-all"
          >
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
};

export default Profile;