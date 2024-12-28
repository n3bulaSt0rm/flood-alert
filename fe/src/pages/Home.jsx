//@ts-check

import React, { useState } from "react";
import Weather1 from "../assets/weather/weather1.jpg";
import Weather2 from "../assets/weather/weather2.jpg";
import Weather3 from "../assets/weather/weather3.jpg";
import Weather4 from "../assets/weather/weather4.jpg";

const Home = () => {
  // Quản lý bước hiển thị: "email" hoặc "verify"
  const [currentStep, setCurrentStep] = useState("email");
  // Quản lý giá trị email được nhập
  const [email, setEmail] = useState("");
  // Quản lý mã xác thực được nhập
  const [verifyCode, setVerifyCode] = useState("");
  // Quản lý việc hiển thị form
  const [showForm, setShowForm] = useState(false);

  // Hàm để mở khối form
  const handleShowForm = () => {
    setShowForm(true);
    setCurrentStep("email"); // Mặc định là hiển thị bước nhập email
  };

  // Đóng form
  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentStep("email"); // reset về bước email
    setEmail("");
    setVerifyCode("");
  };

  // Xử lý khi bấm nút xác nhận ở bước email
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email);

    // Ở đây bạn có thể gọi API để gửi mã xác thực về email

    // Chuyển sang bước "verify" để nhập mã xác thực
    setCurrentStep("verify");
  };

  // Xử lý khi bấm nút xác nhận ở bước verify
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    console.log("Verify Code:", verifyCode);
    // Logic xác thực mã (gọi API, v.v.)
    alert(`Mã xác thực bạn vừa nhập: ${verifyCode}`);

    // Sau khi xác thực thành công, tuỳ ý ẩn form hoặc chuyển trang
    setShowForm(false);
    setCurrentStep("email");
    setEmail("");
    setVerifyCode("");
  };

  // Giao diện form nhập email
  const renderEmailForm = () => (
    <div className="relative bg-white text-black p-6 rounded shadow-lg w-80">
      {/* Nút đóng form - dấu X */}
      <button
        className="absolute top-2 right-2 text-gray-500 text-xl font-bold 
                          hover:text-gray-700 focus:outline-none"
        onClick={handleCloseForm}
      >
        &times;
      </button>
      <h3 className="text-lg font-semibold mb-4">Đăng ký nhận thông tin</h3>
      <form onSubmit={handleEmailSubmit}>
        <label htmlFor="email" className="block mb-2 font-medium">
          Nhập email:
        </label>
        <input
          id="email"
          name="email"
          type="email"
          placeholder="abc@gmail.com"
          className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        >
          Xác nhận
        </button>
      </form>
    </div>
  );

  // Giao diện form nhập mã xác thực
  const renderVerifyForm = () => (
    <div className="relative bg-white text-black p-6 rounded shadow-lg w-80">
      {/* Nút đóng form - dấu X */}
      <button
        className="absolute top-2 right-2 text-gray-500 text-xl font-bold 
                          hover:text-gray-700 focus:outline-none"
        onClick={handleCloseForm}
      >
        &times;
      </button>
      <h3 className="text-lg font-semibold mb-4">Nhập mã xác thực</h3>
      <form onSubmit={handleVerifySubmit}>
        <label htmlFor="verify" className="block mb-2 font-medium">
          Mã xác thực:
        </label>
        <input
          id="verify"
          name="verify"
          type="text"
          placeholder="Nhập mã gồm 6 chữ số..."
          className="border border-gray-300 rounded w-full py-2 px-3 text-gray-700"
          value={verifyCode}
          onChange={(e) => setVerifyCode(e.target.value)}
          required
        />
        <button
          type="submit"
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
        >
          Xác nhận
        </button>
      </form>
    </div>
  );

  return (
    <React.Fragment>
      <div
        className="bg-cover bg-center min-h-screen text-white"
        style={{ backgroundImage: `url(${Weather4})` }}
      >
        {/* Header */}
        <header className="text-center py-10">
          <h1 className="text-4xl font-bold">Welcome to flood warning App</h1>
          <p className="mt-4 text-lg">
            Monitor flood risks and protect your community.
          </p>
        </header>

        {/* About Section */}
        <section className="max-w-4xl mx-auto text-center my-12 px-6">
          <h2 className="text-3xl font-semibold mb-6">What We Do</h2>
          <p className="text-lg leading-7">
            Our flood warning app is designed to provide real-time flood alerts
            and preparedness tips. Whether you're at home, at work, or
            traveling, our app ensures you stay informed with:
          </p>
          <ul className="list-disc list-inside mt-6 text-left mx-auto max-w-2xl">
            <li>Real-time flood warnings for your area.</li>
            <li>Detailed flood risk maps and impact analysis.</li>
            <li>Safety tips to prepare for and respond to flooding.</li>
            <li>
              Customizable notifications to stay updated on potential risks.
            </li>
          </ul>
        </section>

        {/* Nút “Bạn muốn nhận thông tin?” và Form */}
        <section className="flex justify-center mb-12">
          {/* Nếu chưa mở form thì hiện nút, ngược lại hiển thị form */}
          {!showForm ? (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
              onClick={handleShowForm}
            >
              Bạn muốn nhận thông tin?
            </button>
          ) : currentStep === "email" ? (
            renderEmailForm()
          ) : (
            renderVerifyForm()
          )}
        </section>

        {/* Image Gallery */}
        <section className="my-12">
          <h2 className="text-3xl font-semibold text-center mb-8">Gallery</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-6">
            <div className="relative aspect-w-4 aspect-h-3 rounded-lg shadow-lg overflow-hidden">
              <img
                src={Weather1}
                alt="Weather Illustration 1"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="relative aspect-w-4 aspect-h-3 rounded-lg shadow-lg overflow-hidden">
              <img
                src={Weather2}
                alt="Weather Illustration 2"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
            <div className="relative aspect-w-4 aspect-h-3 rounded-lg shadow-lg overflow-hidden">
              <img
                src={Weather3}
                alt="Weather Illustration 3"
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-blue-600 py-6 text-center">
          <p className="text-lg">
            &copy; {new Date().getFullYear()} Flood warning App. All rights
            reserved.
          </p>
          <p className="text-sm mt-2">
            Designed with ❤️ using{" "}
            <a
              href="https://reactjs.org/"
              className="text-yellow-300 hover:underline"
            >
              ReactJS
            </a>{" "}
            and{" "}
            <a
              href="https://tailwindcss.com/"
              className="text-yellow-300 hover:underline"
            >
              TailwindCSS
            </a>
            .
          </p>
        </footer>
      </div>
    </React.Fragment>
  );
};

export default Home;
