import { Routes, Route } from 'react-router-dom'

import Footer1 from '../components/footer';
import NavBar from '../components/navbar';

import { useAuthStore } from '../store/useAuthStore.js';
import { useEffect } from 'react';

import Home from '../pages/homepage.jsx';
import Prayer from '../pages/prayertime.jsx'
import AboutUs from '../pages/aboutus.jsx'
import Signup from '../pages/auth/signup.jsx';
import Login from '../pages/auth/login.jsx';


function App() {

/*   const {authUser, checkAuth } = useAuthStore();

  useEffect(()=>{
    checkAuth();
  }, [checkAuth])

  console.log(authUser); */

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
        <Route path="/profile" element={< Home/>} />
      </Routes>
      <Footer1/>
      </div>
    </>
  );
}


export default App
