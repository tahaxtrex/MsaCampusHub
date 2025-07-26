import Email from "./email.jsx"
import Username from './username.jsx'
import Password from './password.jsx'
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from "../../store/useAuthStore.js";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Navigate } from "react-router";


function SignupCard() {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });


    const [showPassword, setShowPassword] = useState(false);
    const [isSignedUp, setisSignedUp] = useState(false);
    const {signup, isSigninup, authUser} = useAuthStore();

    const toggleShowPassword = ()=>{
      setShowPassword(showPassword => !showPassword)
    }

    const toggleIssignedup = () => {
      setisSignedUp(isSignedUp => !isSignedUp)
    }


    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        signup(formData);
        if(authUser){
          toggleIssignedup();
        }
        
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
            <Username onChange={handleChange} value={formData.username} name={"username"}/>
            <Email onChange={handleChange} value={formData.email} name={"email"}/>

            
            <div className='flex flex-row gap-2 items-center justify-center'>
              <Password onChange={handleChange} value={formData.password} name={"password"} showpassword={showPassword}/>
              
              {showPassword ? <button onClick={toggleShowPassword} className='transition-all'>
                <Eye size={18}/>
              </button> : <button onClick={toggleShowPassword}>
                <EyeOff size={18} />
              </button> }
            </div>
            
          </div>
          <br />
          <div className='flex flex-row gap-3 mt-4'>
            <button type='submit' className="btn btn-success w-full rounded-2xl border-green-800 shadow-2xl" disabled={isSigninup}>Signup !</button>
          </div>
          {isSigninup ? <Loader2>loading...</Loader2>: <a href="/login" className='underline text-blue-900 mt-2'> Login </a>}
        </form>

        

        {
          isSignedUp &&  <Navigate to="/home" replace={true} />
        }
        
      </div>
    </div>
  )
}

export default SignupCard
