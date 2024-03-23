import React, { useState } from "react";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resultMessage, setResultMessage] = useState("");

  const sendOTP = async () => {
    const response = await fetch("http://localhost:3000/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    setResultMessage(result.message);

    if (result.verificationLink) {
      window.location.href = result.verificationLink;
    }

    if (result.message === "OTP sent successfully") {
      setOtpSent(true);
    }
  };

  const verifyOTP = async () => {
    const response = await fetch("http://localhost:3000/verify-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, otp }),
    });

    const result = await response.json();
    setResultMessage(result.message);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (otpSent) {
      verifyOTP();
    } else {
      sendOTP();
    }
  };

  return (
    <div className="bg-pink-200 h-screen flex items-center justify-center">
      <form onSubmit={handleSubmit} className="text-white text-center">
        <h2 className="text-black  text-3xl font-extrabold mb-5">Email Verification</h2>

        <label htmlFor="email" className="block mb-2 text-blue-600 text-2xl">
          Enter your email:
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:border-blue-500 bg-gray-800 text-white"
          required
        />

        {otpSent && (
          <>
            <label htmlFor="otp" className="block mb-2 text-gray-300">
              Enter OTP:
            </label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:border-black-800 bg-gray-800 text-white"
              required
            />
          </>
        )}

        <button
          type="submit"
          className="bg-green-500 text-white px-6 py-3 mr-5 rounded-full cursor-pointer transition duration-300 hover:bg-blue-600"
        >
          {otpSent ? "Verify OTP" : "Send OTP"}
        </button>

        <p id="resultMessage" className="mt-8 font-bold text-blue-500">
          {resultMessage}
        </p>
      </form>
    </div>
  );
}

export default App;
