import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });

      if (res.status === 200 && res.data.user) {
        const { token, role, name, email, _id, profilePic } = res.data.user;

        localStorage.setItem("token", token);
        localStorage.setItem("role", role);

        localStorage.setItem(
          "loggedInUser",
          JSON.stringify({
            _id,
            name,
            email,
            role,
            token,
            profilePic: profilePic || "",
          })
        );

        if (role === "admin") {
          localStorage.setItem(
            "admin",
            JSON.stringify({
              _id,
              name,
              email,
              profilePic: profilePic || "",
            })
          );
        }

        alert("Login successful!");

        role === "admin" ? navigate("/admin") : navigate("/user");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#090A1A] flex items-center justify-center relative overflow-hidden">

      {/* Neon Background Blurs */}
      <div className="absolute top-20 left-0 w-80 h-80 bg-purple-600/30 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-20 right-0 w-80 h-80 bg-pink-600/30 blur-[120px] rounded-full"></div>

      {/* Login Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-sm bg-white/10 backdrop-blur-xl border border-white/20 
        rounded-2xl shadow-[0_0_25px_rgba(150,0,255,0.4)] p-8"
      >
        <h2 className="text-3xl font-bold text-center text-white drop-shadow-[0_0_10px_#A855F7]">
          Welcome Back
        </h2>

        <p className="text-purple-200 text-center mt-1">Login to continue</p>

        {error && (
          <p className="text-red-400 text-sm text-center mt-3 bg-red-900/30 p-2 rounded-lg">
            {error}
          </p>
        )}

        <form onSubmit={handleLogin} className="mt-6 space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full bg-black/20 text-white border border-purple-500/40 
            px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full bg-black/20 text-white border border-purple-500/40 
            px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold 
            py-3 rounded-xl shadow-[0_0_15px_#A855F7]"
          >
            Login
          </motion.button>
        </form>

        <p className="text-center text-purple-200 mt-5 text-sm">
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-pink-400 cursor-pointer hover:underline"
          >
            Register
          </span>
        </p>
      </motion.div>
    </div>
  );
}
