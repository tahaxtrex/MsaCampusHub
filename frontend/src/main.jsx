import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.jsx'
import Prayer from './pages/prayerpage.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './app/index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
      
        <Route path="/" element={< App/>} />
        <Route path="/prayerpage" element={< Prayer/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
