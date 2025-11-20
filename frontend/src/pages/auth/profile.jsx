import React, { useState } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import { Navigate, useNavigate } from 'react-router-dom';
import { Mail, User, LogOut, Edit2, Check, X, Camera, Phone } from "lucide-react";
import { openCloudinaryWidget } from '../../utils/cloudinaryWidget';
import PhoneNumber from '../../components/auth/phonenumber';
import { isValidPhoneNumber } from 'react-phone-number-input';
import toast from 'react-hot-toast';

function Profile() {

  const { authUser, logout, checkAuth, isCheckingAuth, updateProfilePicture, updateProfile } = useAuthStore();
  const navigate = useNavigate();

  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState(authUser?.username || '');

  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [newPhone, setNewPhone] = useState(authUser?.phone_number || '');

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
      await updateProfile({ username: newUsername.trim() });
      setIsEditingUsername(false);
    } catch (error) {
      // Error handled in store
    } finally {
      setIsSaving(false);
    }
  };

  const handleSavePhone = async () => {
    if (newPhone && !isValidPhoneNumber(newPhone)) {
      toast.error("Invalid phone number format");
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({ phone_number: newPhone });
      setIsEditingPhone(false);
    } catch (error) {
      // Error handled in store
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = () => {
    const cloudName = 'digjxrtqs';
    const uploadPreset = 'ml_default';

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

  const handleCancelEditUsername = () => {
    setNewUsername(authUser?.username || '');
    setIsEditingUsername(false);
  };

  const handleCancelEditPhone = () => {
    setNewPhone(authUser?.phone_number || '');
    setIsEditingPhone(false);
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
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 px-4">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
          <div className="bg-green-600 h-32 w-full relative">
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                <img
                  src={authUser?.avatar_url || "/user/user.png"}
                  alt="Profile"
                  className="size-32 rounded-full object-cover border-4 border-white shadow-lg bg-white"
                />
                {isUploadingImage && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full border-4 border-white">
                    <span className="loading loading-spinner loading-md text-white"></span>
                  </div>
                )}
                {!isUploadingImage && (
                  <button
                    onClick={handleImageUpload}
                    className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-40 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 border-4 border-transparent"
                    title="Change profile picture"
                  >
                    <Camera className="text-white drop-shadow-md" size={28} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="pt-20 pb-6 px-8 flex justify-between items-end">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{authUser?.username || 'User'}</h1>
              <p className="text-gray-500">{authUser?.email}</p>
            </div>
            <div className="flex gap-3">
              {authUser?.is_admin && (
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium border border-yellow-200">
                  Admin
                </span>
              )}
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium border border-green-200">
                {authUser?.fajr_points || 0} Fajr Points
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Personal Info Column */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <User className="text-green-600" size={20} /> Personal Information
              </h2>

              <div className="space-y-6">
                {/* Username Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Username</label>
                  {isEditingUsername ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="flex-1 px-4 py-2 bg-white rounded-lg border border-green-500 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter username"
                        maxLength={30}
                      />
                      <button onClick={handleSaveUsername} disabled={isSaving} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                        {isSaving ? <span className="loading loading-spinner loading-xs"></span> : <Check size={18} />}
                      </button>
                      <button onClick={handleCancelEditUsername} disabled={isSaving} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-green-200 transition-colors">
                      <span className="text-gray-800 font-medium">{authUser?.username}</span>
                      <button onClick={() => setIsEditingUsername(true)} className="text-gray-400 hover:text-green-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Phone Number Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Phone Number</label>
                  {isEditingPhone ? (
                    <div className="flex gap-2 items-start">
                      <div className="flex-1">
                        <PhoneNumber
                          value={newPhone}
                          onChange={(e) => setNewPhone(e.target.value)}
                          name="phone_number"
                        />
                      </div>
                      <button onClick={handleSavePhone} disabled={isSaving} className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 mt-1">
                        {isSaving ? <span className="loading loading-spinner loading-xs"></span> : <Check size={18} />}
                      </button>
                      <button onClick={handleCancelEditPhone} disabled={isSaving} className="p-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300 mt-1">
                        <X size={18} />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-green-200 transition-colors">
                      <span className="text-gray-800 font-medium">{authUser?.phone_number || 'Not set'}</span>
                      <button onClick={() => setIsEditingPhone(true)} className="text-gray-400 hover:text-green-600 transition-colors">
                        <Edit2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Email Field (Read Only) */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">Email Address</label>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-500 cursor-not-allowed">
                    <Mail size={16} />
                    <span>{authUser?.email}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Actions Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-6">Account Actions</h2>
              <button
                className='w-full btn btn-error text-white flex items-center gap-2 justify-center shadow-lg hover:shadow-red-500/30 transition-all duration-300'
                onClick={handleLogout}
              >
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
