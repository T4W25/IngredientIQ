// IngredientsSection Component
const IngredientsSection = ({ formData, setFormData, errors }) => {
    const addIngredient = () => {
      setFormData(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { name: "", quantity: "", unit: "" }]
      }));
    };
  
    const removeIngredient = (index) => {
      if (formData.ingredients.length > 1) {
        setFormData(prev => ({
          ...prev,
          ingredients: prev.ingredients.filter((_, i) => i !== index)
        }));
      }
    };
  
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-primary-800">Ingredients</h2>
          <button
            type="button"
            onClick={addIngredient}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white 
              rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            Add Ingredient
          </button>
        </div>
  
        {errors.ingredients && (
          <p className="text-sm text-red-500">{errors.ingredients}</p>
        )}
  
        <div className="space-y-4">
          {formData.ingredients.map((ingredient, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-4 items-center"
            >
              <div className="flex-1">
                <input
                  type="text"
                  value={ingredient.name}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index].name = e.target.value;
                    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                  }}
                  placeholder="Ingredient name"
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 
                    focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="w-24">
                <input
                  type="number"
                  value={ingredient.quantity}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index].quantity = e.target.value;
                    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                  }}
                  placeholder="Amount"
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 
                    focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="w-32">
                <input
                  type="text"
                  value={ingredient.unit}
                  onChange={(e) => {
                    const newIngredients = [...formData.ingredients];
                    newIngredients[index].unit = e.target.value;
                    setFormData(prev => ({ ...prev, ingredients: newIngredients }));
                  }}
                  placeholder="Unit"
                  className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                    focus:outline-none focus:ring-2 focus:ring-primary-500 
                    focus:border-transparent transition-all duration-200"
                />
              </div>
              <button
                type="button"
                onClick={() => removeIngredient(index)}
                className="p-2 text-gray-400 hover:text-red-500 
                  transition-colors duration-200"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };
  
export default IngredientsSection;
 