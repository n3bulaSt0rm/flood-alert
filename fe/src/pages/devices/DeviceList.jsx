import React, { useEffect, useState } from "react";
import axios from "axios";
import AddDevice from "./AddDevice";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [showAddDevice, setShowAddDevice] = useState(false);

  // Fetch danh sách thiết bị từ API
  const fetchDevices = async () => {
    try {
      const response = await axios.get("http://localhost:3000/devices");
      setDevices(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
      alert("Failed to load devices.");
    }
  };

  // Xóa thiết bị
  const handleDeleteDevice = async (id) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      try {
        await axios.delete(`http://localhost:3000/devices/${id}`);
        alert("Device deleted successfully!");
        fetchDevices(); // Refresh danh sách thiết bị
      } catch (error) {
        console.error("Error deleting device:", error);
        alert("Failed to delete device.");
      }
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div className="container mx-auto mt-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Device List</h1>
        <button
          onClick={() => setShowAddDevice(!showAddDevice)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md"
        >
          {showAddDevice ? "Close" : "+ Add Device"}
        </button>
      </div>

      {/* Form thêm thiết bị */}
      {showAddDevice && (
        <AddDevice
          fetchDevices={fetchDevices}
          setShowAddDevice={setShowAddDevice}
        />
      )}

      {/* Device Table */}
      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">ID</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Embed ID</th>
            <th className="border px-4 py-2">Location</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.length > 0 ? (
            devices.map((device) => (
              <tr key={device.id}>
                <td className="border px-4 py-2">{device.id}</td>
                <td className="border px-4 py-2">{device.name}</td>
                <td className="border px-4 py-2">{device.embedId}</td>
                <td className="border px-4 py-2">
                  {device.location?.name || "N/A"}
                </td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 shadow-md"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No devices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DeviceList;
