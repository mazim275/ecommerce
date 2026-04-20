import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [step, setStep] = useState("email"); // email → otp → register

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(0);

  const navigate = useNavigate();

  // ================= TIMER FOR RESEND =================
  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // ================= SEND OTP =================
  const sendOtp = async () => {
    setMessage("");
    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/email", { email });
      setMessage("✅ OTP sent!");
      setStep("otp");
      setTimer(30); // start 30-second countdown
    } catch (err) {
      if (err.response?.status === 400) {
        setMessage("❌ Email already registered. Try login.");
      } else {
        setMessage("❌ Failed to send OTP.");
      }
    }

    setLoading(false);
  };

  // ================= VERIFY OTP =================
  const verifyOtp = async () => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:3000/api/otp", {
        email,
        otp,
      });

      if (res.data === "success") {
        setOtpVerified(true);
        setMessage("🎉 OTP Verified!");
        setStep("register");
      } else {
        setMessage("❌ Wrong OTP.");
      }
    } catch {
      setMessage("❌ OTP verification failed.");
    }
    setLoading(false);
  };

  // ================= REGISTER =================
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!otpVerified) {
      setMessage("❌ Please verify OTP first.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:3000/api/register", {
        name,
        email,
        password,
        role,
      });

      setMessage("🎉 Registration Successful!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }

    setLoading(false);
  };

  // ================= UI ELEMENT =================

  const LoadingSpinner = () => (
    <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
  );

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          Create Account
        </h2>

        {message && (
          <p className="text-center text-sm mb-4">{message}</p>
        )}

        {/* STEP 1 : EMAIL */}
        {step === "email" && (
          <>
            <input
              type="email"
              placeholder="Enter Email"
              className="w-full mb-3 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : "Send OTP"}
            </button>
          </>
        )}

        {/* STEP 2 : OTP */}
        {step === "otp" && (
          <>
            <input
              type="number"
              placeholder="Enter OTP"
              className="w-full mb-3 p-2 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : "Verify OTP"}
            </button>

            {/* RESEND OTP */}
            <button
              onClick={sendOtp}
              className={`w-full mt-3 p-2 rounded ${
                timer === 0
                  ? "bg-red-500 text-white"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              disabled={timer !== 0}
            >
              {timer === 0 ? "Resend OTP" : `Resend in ${timer}s`}
            </button>
          </>
        )}

        {/* STEP 3 : REGISTER */}
        {step === "register" && otpVerified && (
          <form onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full mb-3 p-2 border rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <select
              className="w-full mb-4 p-2 border rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
              disabled={loading}
            >
              {loading ? <LoadingSpinner /> : "Register"}
            </button>
          </form>
        )}

        <p className="text-sm mt-4 text-center">
          Already have an account?{" "}
          <span
            className="text-green-500 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
