//@ts-check

import React, { useState } from "react";
import Weather1 from "../assets/weather/weather1.jpg";
import Weather2 from "../assets/weather/weather2.jpg";
import Weather3 from "../assets/weather/weather3.jpg";
import Weather4 from "../assets/weather/weather4.jpg";

const Home = () => {
  const [currentStep, setCurrentStep] = useState("email");
  const [email, setEmail] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  const handleShowForm = () => {
    setShowForm(true);
    setCurrentStep("email");
    setEmail("");
    setVerifyCode("");
    setVerifyError("");
    setResendMessage("");
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setCurrentStep("email");
    setEmail("");
    setVerifyCode("");
    setVerifyError("");
    setResendMessage("");
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("API response:", data);
        setCurrentStep("verify");
        setVerifyError("");
        setResendMessage("");
      } else {
        const errorData = await response.json();
        console.error("API error:", errorData);
        alert("Đã xảy ra lỗi khi gửi email. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert(
        "Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối của bạn!"
      );
    }
  };

  const handleResendOtp = () => {
    setVerifyCode("");
    setVerifyError("");
    setResendMessage("OTP đã được gửi, vui lòng kiểm tra email");
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8081/user/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ otp: verifyCode }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.message === "OTP verification successful.") {
          setCurrentStep("success");
          setVerifyError("");
          setResendMessage("");
        } else {
          setVerifyError("Mã xác thực không đúng. Vui lòng thử lại!");
        }
      } else {
        const errorData = await response.json();
        console.error("API error:", errorData);
        setVerifyError("Đã xảy ra lỗi khi xác thực. Vui lòng thử lại!");
      }
    } catch (error) {
      console.error("Network error:", error);
      setVerifyError(
        "Không thể kết nối với máy chủ. Vui lòng kiểm tra kết nối của bạn!"
      );
    }
  };

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
        {verifyError && (
          <p className="text-red-500 text-sm mt-1">{verifyError}</p>
        )}
        {resendMessage && (
          <p className="text-green-600 text-sm mt-1">{resendMessage}</p>
        )}
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
        <header className="text-center py-10">
          <h1 className="text-4xl font-bold">Welcome to flood warning App</h1>
          <p className="mt-4 text-lg">
            Monitor flood risks and protect your community.
          </p>
        </header>

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
