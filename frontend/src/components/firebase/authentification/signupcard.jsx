import Email from '../../auth/email.jsx';
import Password from '../../auth/password.jsx';
import Username from '../../auth/username.jsx';
import { Eye, EyeOff } from 'lucide-react';
import { useState, useEffect, use } from "react";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router";
import { auth, db } from "../../../config/firebase.config.js";
import { createUserWithEmailAndPassword,  } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";


function SignupCardFireBase() {

    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: ''
    })

    const [isSigningUp, setIsSigningUp] = useState(false);
    const [isSignedUp, setIsSignedUp] = useState(false);
    const [error, setError] = useState("");

    const toggleShowPassword = ()=>{
        setShowPassword(showPassword => !showPassword)
    }

    const handleChange = (e) =>{
      setFormData(prev =>({
        ...prev,
        [e.target.name]: e.target.value
      }))
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSigningUp(true);
      setError("");

      try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const uid = userCredential.user.uid;

        await setDoc(doc(db, "users", uid), {
          username: formData.username.trim(),
          email: formData.email.trim(),
          createdAt: new Date()
        });

        setIsSignedUp(true);
        setFormData({ username: '', email: '', password: '' });
      } catch (err) {
        console.error("Signup failed:", err);
        setError(err.message);
      } finally {
        setIsSigningUp(false);
      }
    };

    if(isSignedUp){
      return (
        <Navigate to="/home" replace={true} />
      )
    }

  return (
    <div className='flex justify-center items-center m-auto w-3xl'>
      <div className='bg-green-600/45 flex flex-col gap-4 p-8 rounded-2xl shadow-md w-full items-center max-w-md mt-20'>
        <h1 className='font-bold font-serif text-3xl text-green-900 '>SIGNUP NOW !</h1>

        <form onSubmit={handleSubmit}>
          <div className='flex space-y-3 flex-col'>
            <Username onChange={handleChange} value={formData.username} name={"username"}/>
            <Email onChange={handleChange} value={formData.email} name={"email"}/>

            
            <div className='flex flex-row gap-2 items-center justify-center'>
              <Password onChange={handleChange} value={formData.password} name={"password"} showpassword={showPassword}/>
              
              {showPassword ? <button type="button" onClick={toggleShowPassword}>
                <Eye size={18}/>
              </button> : <button type="button" onClick={toggleShowPassword}>
                <EyeOff size={18} />
              </button> }
            </div>
            
          </div>
          <br />
          <div className='flex flex-row gap-3 mt-4'>
            <button type='submit' className="btn btn-success w-full rounded-2xl border-green-800 shadow-2xl" disabled={isSigningUp}>Signup
              {isSigningUp && <Loader2 className="animate-spin" />}
            </button>
          </div>
          
          {error && <p className="text-red-500">{error}</p>}
        </form>
         {isSignedUp &&  <Navigate to="/home" replace={true} />}
        
      </div>
    </div>
  )
}

export default SignupCardFireBase
