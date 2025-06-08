import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";
import logo from "../assets/baraka-logo.png"; // ✅ Make sure this file exists

export default function Navbar() {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/">
          <img src={logo} alt="Baraka Logo" className="h-16 w-auto object-contain" />
        </Link>

        <div className="space-x-4">
          {user ? (
            <>
              <Link to="/dashboard" className="text-gray-800 hover:text-blue-600 font-medium">
                Dashboard
              </Link>
              <Link to="/deposit" className="text-gray-800 hover:text-blue-600 font-medium">
                Deposit
              </Link>
              <Link to="/withdraw" className="text-gray-800 hover:text-blue-600 font-medium">
                Withdraw
              </Link>
              <Link to="/profile" className="text-gray-800 hover:text-blue-600 font-medium">
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600">
                Login
              </Link>
              <Link to="/signup" className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
