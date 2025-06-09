import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./pages/UserProfile";
import AboutUs from "./pages/AboutUs";
import Contact from "./pages/Contact";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Disclaimer from "./pages/Disclaimer";
import AdminDashboard from "./pages/AdminDashboard";
import Deposit from "./pages/Deposit";
import Investments from "./pages/Investments";
import KYCUpload from "./components/KYCUpload";
import PrivateRoute from "./components/PrivateRoute";
import WithdrawRequest from "./pages/WithdrawRequest";
import KYCVerification from "./pages/KYCVerification";
import Profile from "./pages/Profile"; // ✅ make sure it's imported




export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />

            <Route path="/dashboard" element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } />
            <Route path="/deposit" element={
              <PrivateRoute>
                <Deposit />
              </PrivateRoute>
            } />
            <Route path="/investments" element={
              <PrivateRoute>
                <Investments />
              </PrivateRoute>
            } />
            <Route path="/profile" element={
              <PrivateRoute>
                <UserProfile />
              </PrivateRoute>
            } />

            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/disclaimer" element={<Disclaimer />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/kyc-upload" element={<KYCUpload />} />
            <Route path="/withdraw" element={<WithdrawRequest />} />
            <Route path="/verify" element={<KYCVerification />} />

            import Profile from "./pages/Profile"; // ✅ make sure it's imported

<Route path="/profile" element={<Profile />} />


          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
