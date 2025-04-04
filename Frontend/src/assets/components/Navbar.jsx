import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any auth token or user data if stored
    localStorage.removeItem("authUser");
    navigate("/signup");
  };

  return (
    <div className="fixed top-0 w-full z-50 bg-black bg-opacity-50 shadow-lg">
      <div className="max-w-screen-2xl mx-auto container px-6 py-3 md:px-40 flex justify-between items-center">
        {/* Logo or Brand */}
        <h1
          className="text-3xl font-extrabold text-transparent bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text cursor-pointer"
          onClick={() => navigate("/")}
        >
          XMLifyy PDF 🚀
        </h1>

        {/* Navigation Links */}
        <div className="flex items-center space-x-8">
          <button
            onClick={() => navigate("/")}
            className="text-white text-lg font-semibold hover:scale-110 transition duration-200"
          >
            Home
          </button>
          <button
            onClick={() => navigate("/history")}
            className="text-white text-lg font-semibold hover:scale-110 transition duration-200"
          >
            History
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-md shadow transition duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
