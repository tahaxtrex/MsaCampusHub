import React from 'react'
import { useFirebaseStore } from '../../store/useFirebaseStore'
import { Navigate, useNavigate } from 'react-router';
import { Mail, User } from "lucide-react";

function Profile() {

  const {authUser, logout} = useFirebaseStore();
  const navigate = useNavigate();

  const handleClick = () => {
    logout();
    <Navigate to="/home" replace={true} />
    navigate("/home")
  }

  if(!authUser){
    return (<Navigate to="/home" replace={true} />)
  }

  return (
    <>

    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto p-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold ">Profile Information</h1>
          </div>

          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={"/user/user.png"}
                alt="Profile"
                className="size-32 rounded-full object-cover border-4 "
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.username}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>
          </div>
        </div>
        </div>
          <button className='btn btn-active' onClick={handleClick}>logout</button>
        </div>
      </>
    
  )
}

export default Profile
