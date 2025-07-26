import { Routes, Route } from 'react-router-dom'

import Footer1 from '../components/footer';
import NavBar from '../components/navbar';

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
        <Route path="/home" element={< Home/>} />
        <Route path="/prayertime" element={< Prayer/>} />
        <Route path="/aboutus" element={< AboutUs />} />
        <Route path="/signup" element={< Home/>} />
        <Route path="/login" element={< Home/>} />
        <Route path="/settings" element={< Home/>} />
        <Route path="/profile" element={< Home/>} />
      </Routes>
      <Footer1/>
      </div>
    </>
  );
}


export default App
