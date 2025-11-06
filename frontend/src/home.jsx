import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">

      <nav className="bg-white shadow-md py-4 px-8 flex justify-between items-center">
        <div className="text-2xl font-bold text-pink-600">
          Dress<span className="text-gray-800">Shop</span>
        </div>
        <ul className="flex space-x-6 text-gray-700 font-medium">
          <li>
            <Link to="/cart" className="hover:text-pink-600 transition">
              Cart
            </Link>
          </li>
          <li>
            <Link to="/order" className="hover:text-pink-600 transition">
              Order
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-pink-600 transition">
              About us
            </Link>
          </li>
          <li>
            <Link to="/profile" className="hover:text-pink-600 transition">
              profile
            </Link>
          </li>
          <li>
            <Link
              to="/register"
              className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition"
            >
              Sign In
            </Link>
          </li>
        </ul>
      </nav>


      <header className="flex flex-col md:flex-row items-center justify-between grow px-8 md:px-20 py-16">
        <div className="max-w-lg">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Discover Your Perfect Style
          </h1>
          <p className="text-gray-600 mb-6">
            Explore our latest collection of dresses designed for every
            occasion. Look beautiful, feel confident, and shop your favorite
            styles today!
          </p>
          <Link
            to="/shop"
            className="bg-pink-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-pink-700 transition"
          >
            Shop Now
          </Link>
        </div>
        <div className="mt-10 md:mt-0">
          <img
            src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab"
            alt="Fashion"
            className="rounded-2xl shadow-lg w-full md:w-[400px] object-cover"
          />
        </div>
      </header>


      <section className="bg-white py-16 px-8 md:px-20">
        <h2 className="text-3xl font-semibold text-center mb-10 text-gray-800">
          Featured Dresses
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-gray-100 rounded-xl shadow hover:shadow-lg transition p-4"
            >
              <img
                src={`https://source.unsplash.com/400x500/?dress,fashion,${item}`}
                alt="Dress"
                className="rounded-xl mb-4 object-cover w-full h-[400px]"
              />
              <h3 className="text-lg font-medium text-gray-800">
                Elegant Dress {item}
              </h3>
              <p className="text-pink-600 font-semibold mt-2">$49.99</p>
              <button className="mt-3 bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white text-center py-6 mt-auto">
        <p>&copy; {new Date().getFullYear()} DressShop. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
