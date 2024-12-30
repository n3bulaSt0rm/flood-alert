import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import AddDevice from "./AddDevice";
import { AuthContext } from "../../context/AuthContext";

const DeviceList = () => {
  const [devices, setDevices] = useState([]);
  const [showAddDevice, setShowAddDevice] = useState(false);
  const [editingDevice, setEditingDevice] = useState(null);

  const { logout } = useContext(AuthContext); // Lấy hàm logout từ AuthContext

  const fetchDevices = async () => {
    try {
      const response = await axios.get("http://localhost:8081/device");
      setDevices(response.data);
    } catch (error) {
      console.error("Error fetching devices:", error);
      alert("Failed to load devices.");
    }
  };

  const handleDeleteDevice = async (id) => {
    if (window.confirm("Are you sure you want to delete this device?")) {
      try {
        await axios.delete(`http://localhost:8081/device/${id}`);
        alert("Device deleted successfully!");
        fetchDevices();
      } catch (error) {
        console.error("Error deleting device:", error);
        alert("Failed to delete device.");
      }
    }
  };

  const handleEditDevice = (device) => {
    setEditingDevice(device);
  };

  const handleUpdateDevice = async (updatedDevice) => {
    try {
      await axios.patch(`http://localhost:8081/device`, updatedDevice);
      alert("Device updated successfully!");
      setEditingDevice(null);
      fetchDevices();
    } catch (error) {
      console.error("Error updating device:", error);
      alert("Failed to update device.");
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  return (
    <div className="container mx-auto mt-10 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Device List</h1>
        <button
          onClick={() => setShowAddDevice(!showAddDevice)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow-md"
        >
          {showAddDevice ? "Close" : "+ Add Device"}
        </button>
      </div>

      {showAddDevice && (
        <AddDevice
          fetchDevices={fetchDevices}
          setShowAddDevice={setShowAddDevice}
        />
      )}

      {editingDevice && (
        <div className="mb-6 p-4 border rounded bg-gray-50 relative">
          <h2 className="text-lg font-bold mb-4">Edit Device</h2>
          <label className="block mb-2">
            Name:
            <input
              type="text"
              className="border px-2 py-1 rounded w-full"
              value={editingDevice.deviceName}
              onChange={(e) =>
                setEditingDevice({
                  ...editingDevice,
                  deviceName: e.target.value,
                })
              }
            />
          </label>
          <label className="block mb-2">
            Location:
            <input
              type="text"
              className="border px-2 py-1 rounded w-full"
              value={editingDevice.location}
              onChange={(e) =>
                setEditingDevice({ ...editingDevice, location: e.target.value })
              }
            />
          </label>
          <div className="flex justify-end space-x-4 mt-4">
            <button
              onClick={() => handleUpdateDevice(editingDevice)}
              className="bg-blue-500 text-white px-8 py-2 rounded-md hover:bg-gray-600 shadow-md"
            >
              Save
            </button>
            <button
              onClick={() => setEditingDevice(null)}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 shadow-md"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <table className="table-auto w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2 text-center">ID</th>
            <th className="border px-4 py-2 text-center">Name</th>
            <th className="border px-4 py-2 text-center">Location</th>
            <th className="border px-4 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {devices.length > 0 ? (
            devices.map((device) => (
              <tr key={device.id}>
                <td className="border px-4 py-2 text-center">{device.id}</td>
                <td className="border px-4 py-2 text-center">
                  {device.deviceName}
                </td>
                <td className="border px-4 py-2 text-center">
                  {device.location || "N/A"}
                </td>
                <td className="border px-4 py-2 text-center">
                  <button
                    onClick={() => handleEditDevice(device)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-yellow-600 shadow-md"
                  >
                    Update
                  </button>
                  <button
                    onClick={() => handleDeleteDevice(device.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-teal-800 shadow-md ml-2"
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

      <button
        onClick={logout}
        className="fixed bottom-5 right-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-red-600 shadow-md z-50"
      >
        Logout
      </button>
    </div>
  );
};

export default DeviceList;
