import React, { useState } from 'react';

export default function AddFood() {
  const [foodData, setFoodData] = useState({
    name: '',
    category: '',
    price: '',
    description: '',
    img: ''
  });

  const handleChange = (e) => {
    setFoodData({ ...foodData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/food/addFood", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(foodData)
      });
      const result = await response.json();
      if (result.success) {
        alert("Food item added successfully");
      } else {
        alert("Failed to add food item");
      }
    } catch (error) {
      console.error("Error posting food data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" value={foodData.name} onChange={handleChange} required />
      <input type="text" name="category" placeholder="Category" value={foodData.category} onChange={handleChange} required />
      <input type="number" name="price" placeholder="Price" value={foodData.price} onChange={handleChange} required />
      <textarea name="description" placeholder="Description" value={foodData.description} onChange={handleChange} required />
      <input type="text" name="img" placeholder="Image URL" value={foodData.img} onChange={handleChange} required />
      <button type="submit">Add Food</button>
    </form>
  );
}