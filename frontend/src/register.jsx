import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom"; 

const Adduser = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const navigate = useNavigate(); 

  const adddata = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/api/adddata", {
        name,
        email,
        password,
        role,
      });

      if (response.data && response.data.user) {
        const { _id, role } = response.data.user;


        localStorage.setItem("user_id", _id);
        localStorage.setItem("role", role);

        alert("Account created successfully!");

        if (role === "admin") {
          navigate(`/admin/${_id}`);
        } else {
          navigate(`/home/${_id}`);
        }

      } else {
        alert("Account created, but no user data returned.");
      }
    } catch (error) {
      alert("Error while signing up. Maybe email already exists?");
      console.error(error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-linear-to-br from-blue-100 to-indigo-200">
      <form
        onSubmit={adddata}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md space-y-5"
      >
        <h2 className="text-2xl font-semibold text-center text-indigo-700">
          Create Account
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <select
          id="signup-role"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none"
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
        >
          Submit
        </button>

        <p className="text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-600 font-medium hover:underline hover:text-indigo-800"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Adduser;
