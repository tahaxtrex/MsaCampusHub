import Email from "./email.jsx"
import Username from './username.jsx'
import Password from './password.jsx'
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from "../../store/useAuthStore.js";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';


function SignupCard() {

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });


  const [showPassword, setShowPassword] = useState(false);
  const { signup, isSigningUp, authUser } = useAuthStore();
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(showPassword => !showPassword)
  }

  useEffect(() => {
    if (authUser) {
      // Redirect to home after successful signup
      navigate('/');
    }
  }, [authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate username
    if (!formData.username || formData.username.trim().length < 3) {
      toast.error("Username must be at least 3 characters");
      return;
    }

    await signup(formData);
    // Toast messages are handled in useAuthStore
  }

  const handleChange = (e) => {
    const { name, value } = e.target;


    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className='flex justify-center items-center m-auto w-3xl'>
      <div className='bg-green-600/45 flex flex-col gap-4 p-8 rounded-2xl shadow-md w-full items-center max-w-md mt-20'>
        <h1 className='font-bold font-serif text-3xl text-green-900 '>SIGNUP NOW !</h1>
        <form onSubmit={handleSubmit}>
          <div className='flex space-y-3 flex-col'>
            <Username onChange={handleChange} value={formData.username} name={"username"} />
            <Email onChange={handleChange} value={formData.email} name={"email"} />


            <div className='flex flex-row gap-2 items-center justify-center'>
              <Password onChange={handleChange} value={formData.password} name={"password"} showpassword={showPassword} />

              {showPassword ? <button type="button" onClick={toggleShowPassword} className='transition-all'>
                <Eye size={18} />
              </button> : <button type="button" onClick={toggleShowPassword}>
                <EyeOff size={18} />
              </button>}
            </div>

          </div>
          <br />
          <div className='flex flex-row gap-3 mt-4'>
            <button type='submit' className="btn btn-success w-full rounded-2xl border-green-800 shadow-2xl" disabled={isSigningUp}>
              {isSigningUp ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Signing up...
                </span>
              ) : (
                "Signup !"
              )}
            </button>
          </div>
          <div className="text-center mt-4">
            <span className="text-gray-700">Already have an account? </span>
            <a href="/login" className="underline text-blue-900 font-semibold">Log in</a>
          </div>
        </form>



      </div>
    </div>
  )
}

export default SignupCard
