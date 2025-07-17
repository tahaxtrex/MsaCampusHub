import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import Prayer from './pages/prayertime.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './app/index.css'
import AboutUs from './pages/aboutus.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={< App/>} />
        <Route path="/prayertime" element={< Prayer/>} />
        <Route path="/aboutus" element={< AboutUs/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
