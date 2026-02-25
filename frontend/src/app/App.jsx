import { Routes, Route } from "react-router-dom";

import Footer1 from "../components/footer";
import NavBar from "../components/navbar";
import { useAuthStore } from "../store/useAuthStore.js";
import { useEffect } from "react";

import Home from "../pages/homepage.jsx";
import Prayer from "../pages/prayertime.jsx";
import AboutUs from "../pages/aboutus.jsx";
import Signup from "../pages/auth/signup.jsx";
import Login from "../pages/auth/login.jsx";
import Profile from "../pages/auth/profile.jsx";
import PrivateRoute from "./private.routes.jsx";
import PublicRoute from "./public.routes.jsx";
import DonatePage from "../pages/donate.jsx";
import ContactPage from "../pages/contactpage.jsx";
import EventsPage from "../pages/calendarPage.jsx";
import LeaderboardPage from "../pages/LeaderboardPage.jsx";
import AdminDashboard from "../pages/AdminDashboard.jsx";
import VolunteerPage from "../pages/VolunteerPage.jsx";
import MSAIPage from "../pages/MSAIPage.jsx";
import IftarTicketPage from "../pages/IftarTicketPage.jsx";

function App() {
  const { checkAuth, authUser } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, []);

  console.log(authUser);

  return (
    <div>
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/prayertime" element={<Prayer />} />
        <Route path="/calendar" element={<EventsPage />} />
        <Route path="/volunteer" element={<VolunteerPage />} />
        <Route path="/leaderboard" element={<LeaderboardPage />} />
        <Route path="/msai" element={<MSAIPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/iftar-tickets" element={<IftarTicketPage />} />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      <Footer1 />
    </div>
  );
}

export default App;
