import Email from '../../auth/email.jsx';
import Password from '../../auth/password.jsx';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router";
import { auth } from "../../../config/firebase.config.js";
import { signInWithEmailAndPassword } from "firebase/auth";

function LoginCardFirebase() {

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");

  const toggleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        formData.email.trim(),
        formData.password.trim()
      );

      setIsLoggedIn(true);
      setFormData({ email: '', password: '' });

    } catch (err) {
      console.error("Login failed:", err);
      setError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/home" replace={true} />;
  }

  return (
    <div className='flex justify-center items-center m-auto w-3xl'>
      <div className='bg-green-600/45 flex flex-col gap-4 p-8 rounded-2xl shadow-md w-full items-center max-w-md mt-20'>
        <h1 className='font-bold font-serif text-3xl text-green-900 '>LOGIN</h1>

        <form onSubmit={handleSubmit}>
          <div className='flex space-y-3 flex-col'>
            <Email onChange={handleChange} value={formData.email} name={"email"} />

            <div className='flex flex-row gap-2 items-center justify-center'>
              <Password
                onChange={handleChange}
                value={formData.password}
                name={"password"}
                showpassword={showPassword}
              />
              <button type="button" onClick={toggleShowPassword}>
                {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
          </div>

          <div className='flex flex-row gap-3 mt-6'>
            <button
              type='submit'
              className="btn btn-success w-full rounded-2xl border-green-800 shadow-2xl"
              disabled={isLoggingIn}
            >
              Login
              {isLoggingIn && <Loader2 className="animate-spin" />}
            </button>
          </div>

          
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}

export default LoginCardFirebase;
