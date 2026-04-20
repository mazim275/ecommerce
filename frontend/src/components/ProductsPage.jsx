import React, { useEffect, useState } from "react";
import axios from "axios";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
 const user = JSON.parse(localStorage.getItem("loggedInUser"));
 // assuming user stored on login

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("Error fetching products:", err));
  }, []);

  const handleAddToCart = async (productId) => {
    if (!user) {
      alert("Please log in first!");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/addtocart", {
        userId: user._id,
        productId,
      });
      alert("✅ " + res.data.message);
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Failed to add to cart");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
        All Products
      </h1>

      {products.length === 0 ? (
        <p className="text-center text-gray-600 text-lg">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((p) => (
            <div
              key={p._id}
              className="bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              <img src={p.image} alt={p.name} className="h-56 w-full object-cover" />
              <div className="p-5">
                <h2 className="text-xl font-semibold text-gray-800">{p.name}</h2>
                <p className="text-gray-600 capitalize mt-1">{p.category}</p>
                <p className="text-gray-800 font-bold text-lg mt-3">₹{p.price}</p>
                <button
                  onClick={() => handleAddToCart(p._id)}
                  className="mt-4 w-full bg-indigo-600 text-white py-2 rounded-xl font-medium hover:bg-indigo-700 transition duration-300 shadow-md"
                >
                  Add to Cart 🛒
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
