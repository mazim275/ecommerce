import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Admin = () => {
  const navigate = useNavigate();

  
  const storedUser = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!storedUser || storedUser.role !== "admin") {
      alert("Access denied! Only admins can view this page.");
      navigate("/login");
    }
  }, [navigate, storedUser]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <div className="text-2xl font-bold text-pink-600">
          Admin<span className="text-gray-800">Panel</span>
        </div>

        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li>
            <Link to="/additem" className="hover:text-pink-600 transition">
              Add Item
            </Link>
          </li>
          <li>
            <Link to="/adminorder" className="hover:text-pink-600 transition">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/adminusers" className="hover:text-pink-600 transition">
              Users
            </Link>
          </li>
          <li>
            <Link to="/adminprofile" className="hover:text-pink-600 transition">
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Logout
            </button>
          </li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="flex flex-col md:flex-row items-center justify-between grow px-8 md:px-20 py-16">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Manage Store Effortlessly
          </h1>
          <p className="text-gray-600 mb-6">
            Welcome, <span className="font-semibold">{storedUser?.name}</span>!
            Here you can manage items, view orders, and oversee user activity.
          </p>
          <Link
            to="/additem"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-pink-700 transition"
          >
            Add New Product
          </Link>
        </div>
        <div className="mt-10 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
            alt="Admin"
            className="rounded-2xl shadow-lg w-full md:w-[400px] object-cover"
          />
        </div>
      </header>

      {/* Featured Section */}
      <section className="bg-white py-16 px-8 md:px-20">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          Quick Management
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {["Add Products", "View Orders", "User Accounts"].map((task, i) => (
            <div
              key={i}
              className="bg-gray-100 rounded-xl shadow hover:shadow-lg transition p-6 text-center"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {task}
              </h3>
              <p className="text-gray-500 text-sm">
                Manage all your shop’s essential features from here.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-auto">
        <p>&copy; {new Date().getFullYear()} DressShop Admin Panel.</p>
      </footer>
    </div>
  );
};

export default Admin;
