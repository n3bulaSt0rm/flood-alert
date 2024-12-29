import React from "react";
import { useEffect, useState } from "react";
import { HiArrowNarrowUp } from "react-icons/hi";
import { Routes, useLocation, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import DeviceList from "./pages/devices/DeviceList";
import AddDevice from "./pages/devices/AddDevice";
import Analystic1 from "./pages/Analystic1/Analystic1";

// ===== THÊM 2 IMPORT DƯỚI =====
import AdminLogin from "./pages/admin/AdminLogin";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const location = useLocation();

  // Mỗi khi pathname thay đổi => cuộn lên top
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Thêm 2 useEffect cũ của bạn
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Quản lý hiển thị nút scrollToTop
  const [showArrow, setShowArrow] = useState(false);
  const handleArrow = () => {
    if (window.scrollY > 500) {
      setShowArrow(true);
    } else {
      setShowArrow(false);
    }
  };
  useEffect(() => {
    window.addEventListener("scroll", handleArrow);
    return () => {
      window.removeEventListener("scroll", handleArrow);
    };
  }, [showArrow]);

  return (
    <div className="w-screen min-h-screen flex flex-col font-inter">
      <Navbar />

      {/* Nút go upward arrow */}
      <button
        onClick={() => window.scrollTo(0, 0)}
        className={`bg-yellow-25 hover:bg-yellow-50 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-10 duration-500 ease-in-out ${
          showArrow ? "bottom-6" : "-bottom-24"
        }`}
      >
        <HiArrowNarrowUp />
      </button>

      <Routes>
        <Route path="/" element={<Home />} />

        {/* ====== ROUTE TRANG ADMIN LOGIN ====== */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* ====== PROTECTED ROUTES ====== */}
        <Route
          path="/devices"
          element={
            <ProtectedRoute>
              <DeviceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-device"
          element={
            <ProtectedRoute>
              <AddDevice />
            </ProtectedRoute>
          }
        />

        {/* Route khác */}
        <Route path="/analystic" element={<Analystic1 />} />
      </Routes>
    </div>
  );
}

export default App;
