import { useState } from 'react'
import Footer1 from '../components/footer';
import NavBar from '../components/navbar';
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Home from '../pages/homepage.jsx';
import Prayer from '../pages/prayertime.jsx'
import AboutUs from '../pages/aboutus.jsx'


function App() {


  return (
    <>
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={< Home/>} />
        <Route path="/prayertime" element={< Prayer/>} />
        <Route path="/aboutus" element={< AboutUs/>} />
      </Routes>
      <Footer1/>
      </div>
    </>
  );
}


export default App
