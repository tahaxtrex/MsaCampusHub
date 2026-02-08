import Email from '../../auth/email.jsx';
import Password from '../../auth/password.jsx';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router";
import { auth, db } from "../../../config/firebase.config.js";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getDoc, setDoc, doc } from "firebase/firestore";
import { FcGoogle } from "react-icons/fc";

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
      // setError(err.message); for firebase error
      setError("invalid creadentials, try again.")
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setError("");

    try {
      const userCredential = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, {
          username: user.displayName ?? "Anonymous",
          email: user.email,
          createdAt: new Date()
        });
      }

      setIsLoggedIn(true);

    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError(err.message);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoggedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className='flex justify-center items-center m-auto w-3xl'>
      <div className='bg-gray-50 flex flex-col gap-4 p-8 rounded-2xl shadow-md w-full items-center max-w-md mt-20'>
        <h1 className='font-bold font-serif text-3xl text-green-700 '>LOGIN</h1>

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
              {isLoggingIn && <Loader2 className="animate-spin ml-2" />}
            </button>
          </div>
        </form>

        <div className="w-full mt-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-gray-300 rounded-2xl shadow-md bg-white text-black hover:bg-gray-100"
            disabled={isLoggingIn}
          >
            <FcGoogle size={20} />
            Continue with Google
          </button>
        </div>

        {error && <p className="text-red-500 mt-3">{error}</p>}
      </div>
    </div>
  );
}

export default LoginCardFirebase;
