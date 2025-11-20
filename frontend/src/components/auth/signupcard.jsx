import Email from "./email.jsx"
import { isValidPhoneNumber } from 'react-phone-number-input';
import Username from './username.jsx'
import Password from './password.jsx'
import PhoneNumber from './phonenumber.jsx'
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
    phone_number: "",
  });

  const [errors, setErrors] = useState({});
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



  const validateForm = () => {
    const newErrors = {};

    // Username validation
    if (!formData.username || formData.username.trim().length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Phone validation (optional but must be valid if provided)
    if (formData.phone_number && !isValidPhoneNumber(formData.phone_number)) {
      newErrors.phone_number = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Object.values(errors).forEach(error => toast.error(error));
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
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  return (
    <div className='flex justify-center items-center m-auto max-w-md w-full px-4'>
      <div className='bg-white/80 backdrop-blur-sm flex flex-col gap-6 p-8 rounded-2xl shadow-xl w-full items-center mt-20 border border-green-100'>
        <div className="text-center">
          <h1 className='font-bold font-serif text-3xl text-green-900 mb-2'>Create Account</h1>
          <p className="text-gray-500 text-sm">Join our community today</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full">
          <div className='flex space-y-4 flex-col'>
            <Username onChange={handleChange} value={formData.username} name={"username"} />
            <Email onChange={handleChange} value={formData.email} name={"email"} />
            <PhoneNumber
              onChange={handleChange}
              value={formData.phone_number}
              name={"phone_number"}
              error={errors.phone_number}
            />

            <div className='relative'>
              <Password onChange={handleChange} value={formData.password} name={"password"} showpassword={showPassword} />
              <button
                type="button"
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
              disabled={isSigningUp}
            >
              {isSigningUp ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="animate-spin" size={18} />
                  Creating Account...
                </span>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <div className="text-center mt-6">
            <span className="text-gray-600">Already have an account? </span>
            <a href="/login" className="text-green-700 font-bold hover:underline hover:text-green-800 transition-colors">Log in</a>
          </div>
        </form>
      </div>
    </div>
  )
}

export default SignupCard
