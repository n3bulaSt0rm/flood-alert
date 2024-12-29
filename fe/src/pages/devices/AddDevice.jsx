import React, { useState } from "react";
import axios from "axios";

const AddDevice = ({ fetchDevices, setShowAddDevice }) => {
  const [newDevice, setNewDevice] = useState({
    id: "",
    deviceName: "",
    location: "",
  });

  const handleAddDevice = async () => {
    if (!newDevice.id || !newDevice.deviceName || !newDevice.location) {
      alert("Please fill out all fields!");
      return;
    }

    try {
      await axios.post("http://localhost:8081/device", {
        id: newDevice.id,
        deviceName: newDevice.deviceName,
        location: newDevice.location,
      });
      alert("Device added successfully!");
      fetchDevices(); // Refresh danh sách thiết bị
      setShowAddDevice(false); // Đóng form
      setNewDevice({ name: "", embedId: "", location: "" }); // Reset form
    } catch (error) {
      console.error("Error adding device:", error);
      alert("Failed to add device. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded mb-6 shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Device</h2>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Device Id
        </label>
        <input
          className="border rounded w-full p-2"
          type="text"
          value={newDevice.id}
          onChange={(e) => setNewDevice({ ...newDevice, id: e.target.value })}
          placeholder="Enter Device Id"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Name Of Device</label>
        <input
          className="border rounded w-full p-2"
          type="text"
          value={newDevice.deviceName}
          onChange={(e) =>
            setNewDevice({ ...newDevice, deviceName: e.target.value })
          }
          placeholder="Enter name of device"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Location</label>
        <input
          className="border rounded w-full p-2"
          type="text"
          value={newDevice.location}
          onChange={(e) =>
            setNewDevice({ ...newDevice, location: e.target.value })
          }
          placeholder="Enter location"
        />
      </div>
      <button
        onClick={handleAddDevice}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md"
      >
        Add Device
      </button>
    </div>
  );
};

export default AddDevice;
