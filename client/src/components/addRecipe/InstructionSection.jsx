 // InstructionsSection Component
 const InstructionsSection = ({ formData, setFormData, errors }) => {
    const addInstruction = () => {
      setFormData(prev => ({
        ...prev,
        instructions: [
          ...prev.instructions,
          { step: prev.instructions.length + 1, text: "", image: "" }
        ]
      }));
    };
  
    const removeInstruction = (index) => {
      if (formData.instructions.length > 1) {
        const newInstructions = formData.instructions
          .filter((_, i) => i !== index)
          .map((inst, i) => ({ ...inst, step: i + 1 }));
        setFormData(prev => ({ ...prev, instructions: newInstructions }));
      }
    };
  
    const handleImageUpload = (index, e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newInstructions = [...formData.instructions];
          newInstructions[index].image = reader.result;
          setFormData(prev => ({ ...prev, instructions: newInstructions }));
        };
        reader.readAsDataURL(file);
      }
    };
  
    return (
      <div className="bg-white rounded-2xl shadow-2xl p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-primary-800">Instructions</h2>
          <button
            type="button"
            onClick={addInstruction}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white 
              rounded-lg hover:bg-primary-700 transition-colors duration-200"
          >
            <PlusIcon className="w-5 h-5" />
            Add Step
          </button>
        </div>
  
        {errors.instructions && (
          <p className="text-sm text-red-500">{errors.instructions}</p>
        )}
  
        <div className="space-y-6">
          {formData.instructions.map((instruction, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 border-2 border-gray-200 rounded-xl space-y-4"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-primary-800">
                  Step {instruction.step}
                </h3>
                <button
                  type="button"
                  onClick={() => removeInstruction(index)}
                  className="p-2 text-gray-400 hover:text-red-500 
                    transition-colors duration-200"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
  
              <textarea
                value={instruction.text}
                onChange={(e) => {
                  const newInstructions = [...formData.instructions];
                  newInstructions[index].text = e.target.value;
                  setFormData(prev => ({ ...prev, instructions: newInstructions }));
                }}
                placeholder="Describe this step..."
                rows={3}
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200
                  focus:outline-none focus:ring-2 focus:ring-primary-500 
                  focus:border-transparent transition-all duration-200"
              />
  
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Step Image (optional)
                </label>
                {instruction.image ? (
                  <div className="relative">
                    <img
                      src={instruction.image}
                      alt={`Step ${instruction.step}`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newInstructions = [...formData.instructions];
                        newInstructions[index].image = "";
                        setFormData(prev => ({ 
                          ...prev, 
                          instructions: newInstructions 
                        }));
                      }}
                      className="absolute top-2 right-2 bg-white rounded-full p-1 
                        shadow-lg hover:bg-red-500 hover:text-white 
                        transition-colors duration-200"
                    >
                      <XMarkIcon className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 
                    border-gray-200 border-dashed rounded-lg hover:border-primary-500 
                    transition-colors duration-200">
                    <div className="space-y-1 text-center">
                      <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md 
                          font-medium text-primary-600 hover:text-primary-700">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(index, e)}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  };

export default InstructionsSection;