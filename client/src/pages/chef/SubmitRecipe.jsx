import React, { useState } from "react";
import { createRecipe } from "../../api/api";

const SubmitRecipe = ({ onRecipeSubmitted }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    ingredients: [""],
    instructions: "",
    imageUrl: "",
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleIngredientChange = (index, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = value;
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const addIngredientField = () => {
    setFormData({ ...formData, ingredients: [...formData.ingredients, ""] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createRecipe(token, formData);
      alert("Recipe submitted successfully!");
      setFormData({
        title: "",
        description: "",
        ingredients: [""],
        instructions: "",
        imageUrl: "",
      });
      if (onRecipeSubmitted) onRecipeSubmitted();
    } catch (err) {
      console.error("Error submitting recipe:", err);
      alert("Failed to submit recipe.");
    }
  };

  return (
    <div className="submit-recipe">
      <h2>Submit a New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Recipe Title"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Short Description"
        />
        <h4>Ingredients:</h4>
        {formData.ingredients.map((ing, idx) => (
          <input
            key={idx}
            type="text"
            value={ing}
            onChange={(e) => handleIngredientChange(idx, e.target.value)}
            placeholder={`Ingredient ${idx + 1}`}
            required
          />
        ))}
        <button type="button" onClick={addIngredientField}>+ Add Ingredient</button>
        <textarea
          name="instructions"
          value={formData.instructions}
          onChange={handleChange}
          placeholder="Cooking Instructions"
        />
        <input
          type="text"
          name="imageUrl"
          value={formData.imageUrl}
          onChange={handleChange}
          placeholder="Image URL"
        />
        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default SubmitRecipe;