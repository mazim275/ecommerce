import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
} from "lucide-react";

import { motion } from "framer-motion";
import axios from "axios";

export default function HomePage() {
  const navigate = useNavigate();
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("loggedInUser");
    if (stored) setLoggedInUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const addToCart = async (productId) => {
    if (!loggedInUser) {
      alert("Please log in first.");
      navigate("/login");
      return;
    }

    try {
      await axios.post("http://localhost:3000/api/addtocart", {
        userId: loggedInUser._id,
        productId,
      });

      setCartCount((prev) => prev + 1);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart.");
    }
  };

  const logout = () => {
    localStorage.clear();
    setLoggedInUser(null);
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f0f15] to-[#1a1a2e] text-white">

      {/* 🔹 Glass Navbar */}
      <motion.header
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed w-full z-50 backdrop-blur-xl bg-white/5 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <h1
            onClick={() => navigate("/")}
            className="text-3xl font-bold cursor-pointer"
          >
            <span className="text-white/90">Style</span>
            <span className="text-blue-300">Store</span>
          </h1>

          {/* Search Bar */}
          <div className="hidden md:flex items-center w-80 bg-white/10 backdrop-blur-lg border border-white/20 py-2 px-4 rounded-xl">
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-transparent text-white placeholder-gray-300 outline-none"
            />
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-6">
            {/* Cart */}
            <motion.div
              whileHover={{ scale: 1.1 }}
              onClick={() => navigate("/cart")}
              className="relative cursor-pointer"
            >
              <ShoppingCartIcon className="w-6 h-6 text-blue-300" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </motion.div>

            {/* Login / Profile */}
            {loggedInUser ? (
              <div className="relative group">
                <div className="flex items-center gap-2 cursor-pointer">
                  <img
                    src={loggedInUser.profilePic}
                    className="w-10 h-10 rounded-full border border-white/20 backdrop-blur-md"
                  />
                  <span className="font-medium">{loggedInUser.name}</span>
                </div>

                {/* Dropdown */}
                <div className="absolute right-0 mt-3 w-44 bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">
                  <button
                    className="w-full text-left py-2 hover:bg-white/10 rounded-lg"
                    onClick={() => navigate(loggedInUser.role === "admin" ? "/admin" : "/user")}
                  >
                    Dashboard
                  </button>

                  <button
                    className="w-full text-left py-2 hover:bg-white/10 rounded-lg"
                    onClick={() => navigate("/orders")}
                  >
                    My Orders
                  </button>

                  <button
                    className="w-full text-left py-2 text-red-400 hover:bg-red-800/20 rounded-lg"
                    onClick={logout}
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="px-5 py-2 rounded-xl bg-white/10 backdrop-blur-lg border border-white/20 hover:bg-white/20"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </motion.header>

      {/* 🔹 Hero Section */}
      <section className="pt-40 pb-32 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="text-5xl font-extrabold"
        >
          Discover Fashion in  
          <span className="text-blue-300"> Clarity</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 text-gray-300 max-w-xl mx-auto"
        >
          Experience a clean and modern shopping environment built with glassmorphism design.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.08 }}
          onClick={() => navigate("/products")}
          className="mt-8 px-10 py-3 rounded-xl bg-blue-600/30 backdrop-blur-lg border border-white/20 font-semibold"
        >
          Shop Now
        </motion.button>
      </section>

      {/* 🔹 Products */}
      <section className="py-20 px-6">
        <h3 className="text-3xl font-bold text-center mb-12 text-white/90">
          Featured Products
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-7xl mx-auto">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={product._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl overflow-hidden shadow-lg"
            >
              <img src={product.image} className="w-full h-60 object-cover" />

              <div className="p-5 text-center">
                <h4 className="text-xl font-semibold">{product.name}</h4>
                <p className="text-blue-300 text-2xl font-bold mt-2">₹{product.price}</p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="mt-4 px-6 py-2 bg-blue-600/30 border border-white/20 backdrop-blur-xl rounded-lg"
                  onClick={() => addToCart(product._id)}
                >
                  <ShoppingBagIcon className="inline w-4 h-4 mr-2" />
                  Add to Cart
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12">
          <button
            onClick={() => navigate("/products")}
            className="px-10 py-3 bg-white/10 border border-white/20 backdrop-blur-lg rounded-xl hover:bg-white/20"
          >
            View All Products
          </button>
        </div>
      </section>

      <footer className="py-6 text-gray-400 text-center bg-white/5 backdrop-blur-xl border-t border-white/10">
        © {new Date().getFullYear()} StyleStore — Glass Edition
      </footer>
    </div>
  );
}
