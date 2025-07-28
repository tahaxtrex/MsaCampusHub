import { Routes, Route } from 'react-router-dom'

import Footer1 from '../components/footer';
import NavBar from '../components/navbar';

import { useAuthStore } from '../store/useAuthStore.js';
import { useFirebaseStore } from '../store/useFirebaseStore.js';
import { use, useEffect } from 'react';

import Home from '../pages/homepage.jsx';
import Prayer from '../pages/prayertime.jsx'
import AboutUs from '../pages/aboutus.jsx'
import Signup from '../pages/auth/signup.jsx';
import Login from '../pages/auth/login.jsx';
import Profile from '../pages/auth/profile.jsx';


function App() {

  const { checkAuth } = useFirebaseStore(); // re-render
  
  useEffect(() => {
    checkAuth()
  }, [])
  

  // useEffect(() => {
  //     useFirebaseStore.getState().checkAuth(); // no re-render subscription
  //   }, []);  


  return (
    <>
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={< Home/>} />
        <Route path="/home" element={< Home/>} />
        <Route path="/prayertime" element={< Prayer/>} />
        <Route path="/aboutus" element={< AboutUs />} />

        <Route path="/signup" element={< Signup/>} />
        <Route path="/login" element={< Login/>} />
        <Route path="/settings" element={< Home/>} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer1/>
      </div>
    </>
  );
}


export default App
