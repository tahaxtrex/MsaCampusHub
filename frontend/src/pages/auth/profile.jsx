import React, { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { Navigate, useNavigate } from 'react-router-dom';
import { Mail, User, LogOut, Edit2, Check, X, Camera } from "lucide-react";
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { openCloudinaryWidget } from '../../utils/cloudinaryWidget';

function Profile() {

  const { authUser, logout, checkAuth, isCheckingAuth, updateProfilePicture } = useAuthStore();
  const navigate = useNavigate();
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(authUser?.username || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  }

  const handleSaveUsername = async () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: authUser.id,
          username: newUsername.trim(),
          email: authUser.email,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      toast.success("Username updated successfully!");
      setIsEditingUsername(false);
      await checkAuth(); // Refresh user data
    } catch (error) {
      console.error("Error updating username:", error);
      toast.error(error.message || "Failed to update username");
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = () => {
    const cloudName = 'digjxrtqs';
    const uploadPreset = 'ml_default'; // Use the default unsigned preset or create your own

    setIsUploadingImage(true);

    openCloudinaryWidget(
      cloudName,
      uploadPreset,
      async (imageUrl) => {
        try {
          await updateProfilePicture(imageUrl);
          toast.success('Profile picture updated successfully!');
        } catch (error) {
          console.error('Error updating profile picture:', error);
          toast.error('Failed to update profile picture');
        } finally {
          setIsUploadingImage(false);
        }
      },
      (error) => {
        console.error('Upload error:', error);
        toast.error('Failed to upload image');
        setIsUploadingImage(false);
      }
    );
  };

  const handleCancelEdit = () => {
    setNewUsername(authUser?.username || '');
    setIsEditingUsername(false);
  };

  if (isCheckingAuth) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg text-green-500"></span>
      </div>
    );
  }

  if (!authUser) {
    return (<Navigate to="/" replace={true} />)
  }

  return (
    <>

      <div className="h-screen pt-20 bg-gray-50">
        <div className="max-w-2xl mx-auto p-4 py-8">
          <div className="bg-white rounded-xl p-6 space-y-8 shadow-lg">
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-gray-800">Profile Information</h1>
            </div>

            <div className="flex flex-col items-center gap-4">
              <div className="relative group">
                <img
                  src={authUser?.avatar_url || "/user/user.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-green-500"
                />
                {isUploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <span className="loading loading-spinner loading-md text-white"></span>
                  </div>
                )}
                {!isUploadingImage && (
                  <button
                    onClick={handleImageUpload}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-60 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                    title="Change profile picture"
                  >
                    <Camera className="text-white" size={32} />
                  </button>
                )}
              </div>
              <p className="text-sm text-gray-500">Click to change profile picture</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-1.5">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Username
                </div>
                {isEditingUsername ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-white rounded-lg border border-green-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Enter username"
                      maxLength={30}
                    />
                    <button
                      onClick={handleSaveUsername}
                      disabled={isSaving}
                      className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      {isSaving ? "..." : <Check size={20} />}
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      disabled={isSaving}
                      className="px-3 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                    >
                      <X size={20} />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <p className="flex-1 px-4 py-2.5 bg-gray-100 rounded-lg border text-gray-800">
                      {authUser?.username || 'No username set'}
                    </p>
                    <button
                      onClick={() => setIsEditingUsername(true)}
                      className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-1"
                    >
                      <Edit2 size={16} />
                      Edit
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="px-4 py-2.5 bg-gray-100 rounded-lg border text-gray-800">{authUser?.email}</p>
              </div>

              {authUser?.is_admin && (
                <div className="space-y-1.5">
                  <div className="px-4 py-2 bg-yellow-100 border border-yellow-300 rounded-lg text-center">
                    <span className="text-yellow-800 font-semibold">🔑 Admin Account</span>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="text-sm text-gray-600 flex items-center gap-2">
                  <span className="text-2xl">🌙</span>
                  Fajr Points
                </div>
                <p className="px-4 py-2.5 bg-green-50 rounded-lg border border-green-200 text-green-700 font-bold text-lg">
                  {authUser?.fajr_points || 0} points
                </p>
              </div>
            </div>

            <button
              className='btn btn-error w-full text-white flex items-center gap-2 justify-center'
              onClick={handleLogout}
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>

  )
}

export default Profile
