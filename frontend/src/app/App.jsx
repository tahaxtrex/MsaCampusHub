import { Routes, Route } from "react-router-dom";

import Footer1 from "../components/footer";
import NavBar from "../components/navbar";
import { useFirebaseStore } from "../store/useFirebaseStore.js";
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

function App() {
  const { checkAuth, authUser } = useFirebaseStore();

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
        <Route path="/calendar" element={<Home />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/donate" element={<DonatePage />} />
        <Route path="/contact" element={<ContactPage />} />
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
