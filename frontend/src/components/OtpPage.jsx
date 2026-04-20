import { useState } from "react";
import axios from "axios";

export default function OtpPage() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("email");
  const [message, setMessage] = useState("");

  // ---------- Send OTP ----------
  const sendOtp = async () => {
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/api/email", {
        email,
      });

      setMessage("✅ OTP sent to your email!");
      setStep("otp");
    } catch (error) {
      if (error.response?.status === 400) {
        setMessage("❌ Email already registered. Please login instead.");
      } else {
        setMessage("❌ Failed to send OTP. Please try again.");
      }
    }
  };

  // ---------- Verify OTP ----------
  const verifyOtp = async () => {
    setMessage("");

    try {
      const res = await axios.post("http://localhost:3000/api/otp", {
        email,
        otp,
      });

      if (res.data === "success") {
        setMessage("🎉 OTP Verified! You can now complete registration.");
      } else {
        setMessage("❌ Invalid OTP. Try again.");
      }
    } catch (error) {
      setMessage("❌ OTP verification failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-xl p-6 rounded-2xl w-full max-w-md">

        <h1 className="text-2xl font-semibold text-center mb-6">
          Email OTP Verification
        </h1>

        {step === "email" && (
          <div className="flex flex-col gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className="border px-4 py-2 rounded-lg w-full"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendOtp}
              className="bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
              Send OTP
            </button>
          </div>
        )}

        {step === "otp" && (
          <div className="flex flex-col gap-4">
            <input
              type="number"
              placeholder="Enter OTP"
              className="border px-4 py-2 rounded-lg w-full"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
            >
              Verify OTP
            </button>
          </div>
        )}

        {message && (
          <p className="text-center mt-4 font-medium text-gray-700">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
