import React, { useState } from "react";
import axios from "axios";

const AddItems = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(""); 
  const [description, setDescription] = useState("");

  
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
    });

  
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const base64 = await toBase64(file);
    setImage(base64);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    console.log(name, price, category, image, description );
    
    try {
      const response = await axios.post("http://localhost:3000/api/additem", {
        name,
        price,
        category,
        image, 
        description,
      });

      if (response.status === 200) {
        alert("✅ Item added successfully!");
        setName("");
        setPrice("");
        setCategory("");
        setImage("");
        setDescription("");
      } else {
        alert("❌ Something went wrong while adding item.");
      }
    } catch (error) {
      console.error(error);
      alert("⚠️ Error adding item. Check server or fields.");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-leniar-to-br from-pink-100 to-blue-100">
      <form
        onSubmit={handleAddItem}
        className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-lg space-y-5"
      >
        <h2 className="text-3xl font-semibold text-center text-pink-600">
          Add New Item
        </h2>

        <input
          type="text"
          placeholder="Item Name"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <input
          type="number"
          placeholder="Price"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Category"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          required
        />

        
        {image && (
          <img
            src={image}
            alt="Preview"
            className="w-32 h-32 object-cover mx-auto rounded-lg border"
          />
        )}

        <textarea
          placeholder="Description"
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-pink-400 outline-none"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>

        <button
          type="submit"
          className="w-full bg-pink-600 text-white py-3 rounded-lg font-medium hover:bg-pink-700 transition"
        >
          Add Item
        </button>
      </form>
    </div>
  );
};

export default AddItems;
