import React, { useState } from "react";
import axios from "axios";

const AddDevice = ({ fetchDevices, setShowAddDevice }) => {
  const [newDevice, setNewDevice] = useState({
    name: "",
    embedId: "",
    location: "",
  });

  const handleAddDevice = async () => {
    if (!newDevice.name || !newDevice.embedId || !newDevice.location) {
      alert("Please fill out all fields!");
      return;
    }

    try {
      await axios.post("http://localhost:3000/devices", {
        name: newDevice.name,
        embedId: newDevice.embedId,
        location: { name: newDevice.location },
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
          Name of Device
        </label>
        <input
          className="border rounded w-full p-2"
          type="text"
          value={newDevice.name}
          onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
          placeholder="Enter device name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">Embed ID</label>
        <input
          className="border rounded w-full p-2"
          type="text"
          value={newDevice.embedId}
          onChange={(e) =>
            setNewDevice({ ...newDevice, embedId: e.target.value })
          }
          placeholder="Enter embed ID"
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
