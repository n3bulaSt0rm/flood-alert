import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminLogin() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Kiểm tra cứng: "admin" / "123"
    if (username === "admin" && password === "123") {
      login(); // Thông báo với Context rằng đã đăng nhập
      navigate("/devices"); // Chuyển sang trang /devices
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h2 className="text-2xl font-semibold mb-6 text-center">Admin Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-1 text-gray-700 font-medium">Tài khoản</label>
          <input
            type="text"
            placeholder="Nhập tài khoản..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border rounded px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <label className="mb-1 text-gray-700 font-medium">Mật khẩu</label>
          <input
            type="password"
            placeholder="Nhập mật khẩu..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold"
          >
            Đăng nhập
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
