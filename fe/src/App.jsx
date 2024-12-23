import React from "react";
import { useEffect, useState } from "react";
import { HiArrowNarrowUp } from "react-icons/hi";
import { Routes, useLocation, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar";
import Home from "./pages/Home";
import DeviceList from "./pages/devices/DeviceList";
import AddDevice from "./pages/devices/AddDevice";


import AltitudeChart from "./pages/Altitude/AltitudeChart";
// import Warring form "./pages/warring/warring";
function App() {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [])

  const [showArrow, setShowArrow] = useState(false)
  const handleArrow = () => {
    if (window.scrollY > 500) {
      setShowArrow(true)
    } else setShowArrow(false)
  }
  useEffect(() => {
    window.addEventListener('scroll', handleArrow);
    return () => {
      window.removeEventListener('scroll', handleArrow);
    }
  }, [showArrow])

  return (
    <div className="w-screen min-h-screen flex flex-col font-inter">
      <Navbar />

      {/* go upward arrow */}
      <button
        onClick={() => window.scrollTo(0, 0)}
        className={`bg-yellow-25 hover:bg-yellow-50 hover:scale-110 p-3 text-lg text-black rounded-2xl fixed right-3 z-10 duration-500 ease-in-out ${
          showArrow ? "bottom-6" : "-bottom-24"
        } `}
      >
        <HiArrowNarrowUp />
      </button>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/devices" element={<DeviceList />} />
        <Route path="/add-device" element={<AddDevice />} />
    
      
        <Route path="/altitude" element={<AltitudeChart />} />
      </Routes>
    </div>
  );
}

export default App;
