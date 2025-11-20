import Email from './email.jsx'
import Password from './password.jsx'
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from "../../store/useAuthStore.js";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { useNavigate } from 'react-router-dom';



function LoginCard() {

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });


  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoggingIn, authUser } = useAuthStore();
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword(showPassword => !showPassword)
  }

  useEffect(() => {
    if (authUser) {
      // Redirect to home after successful login
      navigate('/');
    }
  }, [authUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await login(formData);
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
    <div className='flex justify-center items-center m-auto max-w-md w-full px-4'>
      <div className='bg-white/80 backdrop-blur-sm flex flex-col gap-6 p-8 rounded-2xl shadow-xl w-full items-center mt-20 border border-green-100'>
        <div className="text-center">
          <h1 className='font-bold font-serif text-3xl text-green-900 mb-2'>Welcome Back</h1>
          <p className="text-gray-500 text-sm">Login to access your account</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className='flex space-y-4 flex-col'>
            <Email onChange={handleChange} value={formData.email} name={"email"} />

            <div className='relative'>
              <Password onChange={handleChange} value={formData.password} name={"password"} showpassword={showPassword} />
              <button
                type='button'
                onClick={toggleShowPassword}
                className='absolute right-3 top-3.5 text-gray-500 hover:text-gray-700 transition-colors'
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

          </div>

          <div className='mt-8'>
            <button
              type='submit'
              className="btn btn-success w-full rounded-xl shadow-lg hover:shadow-green-500/30 transition-all duration-300 font-bold text-white"
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-600">Don't have an account? </span>
            <a href="/signup" className="text-green-700 font-bold hover:underline hover:text-green-800 transition-colors">Sign up</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginCard
