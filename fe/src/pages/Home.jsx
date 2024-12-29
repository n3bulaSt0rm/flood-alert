//@ts-check

import React, { useState } from "react";
import Weather1 from "../assets/weather/weather1.jpg";
import Weather2 from "../assets/weather/weather2.jpg";
import Weather3 from "../assets/weather/weather3.jpg";
import Weather4 from "../assets/weather/weather4.jpg";

const Home = () => {
  // Quản lý bước hiển thị: "email", "verify" hoặc "success"
  const [currentStep, setCurrentStep] = useState("email");
  // Quản lý giá trị email được nhập
  const [email, setEmail] = useState("");
  // Quản lý mã xác thực được nhập
  const [verifyCode, setVerifyCode] = useState("");
  // Quản lý việc hiển thị form
  const [showForm, setShowForm] = useState(false);
  // Lưu thông tin lỗi của bước verify (nếu có)
  const [verifyError, setVerifyError] = useState("");
  // Lưu thông báo gửi lại OTP
  const [resendMessage, setResendMessage] = useState("");

  // Mở form
  const handleShowForm = () => {
    setShowForm(true);
    setCurrentStep("email");
    setEmail("");
    setVerifyCode("");
    setVerifyError("");
    setResendMessage("");
  };

  // Đóng form
  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentStep("email");
    setEmail("");
    setVerifyCode("");
    setVerifyError("");
    setResendMessage("");
  };

  // Xử lý khi bấm nút Xác nhận ở bước email
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Gửi OTP tới email tại đây (nếu cần)
    setCurrentStep("verify");
    setVerifyError("");
    setResendMessage("");
  };

  // **Nút Gửi lại OTP**: logic gọi API để gửi lại mã OTP hoặc reset verifyCode
  const handleResendOtp = () => {
    // Ở đây bạn có thể gọi API, đặt lại verifyCode hoặc hiển thị thông báo “Đã gửi lại OTP”
    setVerifyCode("");
    setVerifyError("");
    setResendMessage("OTP đã được gửi, vui lòng kiểm tra email");
  };

  // Xử lý khi bấm nút Xác nhận ở bước verify
  const handleVerifySubmit = (e) => {
    e.preventDefault();
    // Giả sử mã đúng là "123456"
    if (verifyCode === "123456") {
      setCurrentStep("success");
      setVerifyError("");
      setResendMessage("");
    } else {
      setVerifyError("Mã xác thực không đúng. Vui lòng thử lại!");
    }
  };

  // Form nhập email
  const renderEmailForm = () => (
    <div className="relative bg-white text-black p-6 rounded shadow-lg w-80">
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

  // Form nhập mã xác thực
  const renderVerifyForm = () => (
    <div className="relative bg-white text-black p-6 rounded shadow-lg w-80">
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
        {/* Hiển thị lỗi nếu mã sai */}
        {verifyError && (
          <p className="text-red-500 text-sm mt-1">{verifyError}</p>
        )}
        {/* Hiển thị thông báo Gửi lại OTP (nếu có) */}
        {resendMessage && (
          <p className="text-green-600 text-sm mt-1">{resendMessage}</p>
        )}

        {/* 
          Khối nút: Xác nhận & Gửi lại OTP (cùng màu)
          Dùng flex & gap-4 để đặt nút cạnh nhau.
        */}
        <div className="mt-4 flex gap-4">
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          >
            Xác nhận
          </button>
          <button
            type="button"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
            onClick={handleResendOtp}
          >
            Gửi lại OTP
          </button>
        </div>
      </form>
    </div>
  );

  // Form báo thành công
  const renderSuccessMessage = () => (
    <div className="relative bg-white text-black p-6 rounded shadow-lg w-80">
      <button
        className="absolute top-2 right-2 text-gray-500 text-xl font-bold
                   hover:text-gray-700 focus:outline-none"
        onClick={handleCloseForm}
      >
        &times;
      </button>
      <h3 className="text-xl font-bold text-green-600 mb-2">
        Xác thực thông tin chính xác!
      </h3>
      <p className="text-base mb-6">
        Đừng quên kiểm tra email để nhận thông báo sớm nhất.
      </p>
      <button
        onClick={handleCloseForm}
        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded"
      >
        Đóng
      </button>
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
          {!showForm ? (
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
              onClick={handleShowForm}
            >
              Keep yourself and those you care about protected by staying
              informed.
            </button>
          ) : currentStep === "email" ? (
            renderEmailForm()
          ) : currentStep === "verify" ? (
            renderVerifyForm()
          ) : (
            renderSuccessMessage()
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
