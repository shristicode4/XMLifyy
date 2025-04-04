import { React, useEffect } from "react";
import Navbar from "./assets/components/Navbar";
import Home from "./assets/components/Home";
import Footer from "./assets/components/Footer";
import LoginPage from "./assets/components/LoginPage";
import SignUpPage from "./assets/components/SignUpPage";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Loader } from "lucide-react";
import { Toaster } from "react-hot-toast";
import History from "./assets/components/History";
import { useLocation } from "react-router-dom";

const App = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  if (isCheckingAuth && !authUser)
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );

  return (
    <>
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/history"
          element={authUser ? <History /> : <Navigate to="/login" />}
        />
      </Routes>
      <Footer />
      <Toaster />
    </>
  );
};

export default App;
