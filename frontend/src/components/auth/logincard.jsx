import Username from './username.jsx'
import Password from './password.jsx'
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from "../../store/useAuthStore.js";
import { useState } from "react";



function LoginCard() {

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });


    const [showPassword, setShowPassword] = useState(false);
    const {login, isLoggingIn} = useAuthStore();

    const toggleShowPassword = ()=>{
        setShowPassword(showPassword => !showPassword)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData)
        login(formData);
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
        <h1 className='font-bold font-serif text-3xl text-green-900 '>Login NOW !</h1>
        <form onSubmit={handleSubmit}>
          <div className='flex space-y-3 flex-col'>
            <Username onChange={handleChange} value={formData.username} name={"username"}/>

            
            <div className='flex flex-row gap-2 items-center justify-center'>
              <Password onChange={handleChange} value={formData.password} name={"password"} showpassword={showPassword}/>
              
              {showPassword ? <button onClick={toggleShowPassword} className='transition-all'>
                <Eye size={18}/>
              </button> : <button className='transition-all' onClick={toggleShowPassword}>
                <EyeOff size={18} />
              </button> }
            </div>
            
          </div>
          <br />
          <div className='flex flex-row gap-3 mt-4'>
            <button type='submit' className="btn btn-success w-full rounded-2xl border-green-800 shadow-2xl" disabled={isLoggingIn}>Login</button>
          </div>
          {isLoggingIn ? <Loader2>loading...</Loader2>: <a href="/signup" className='underline text-blue-900 mt-2'> no account? signup! </a>}
        </form>
        
      </div>
    </div>
  )
}

export default LoginCard
