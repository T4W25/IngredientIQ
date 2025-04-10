// src/components/Recipe/RecipeDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getRecipeById, addBookmark, removeBookmark } from '../../api/api';
import { FaClock, FaUtensils, FaUserFriends, FaBookmark, FaRegBookmark, FaCheck, FaTimes, FaUser, FaStar, FaCalendar  } from 'react-icons/fa';
import axios from 'axios';
import IngredientsList from './IngredientsList';
import InstructionSteps from './InstructionSteps';
import NutritionalInfo from './NutritionalInfo';
import DietaryRestrictions from './DietaryRestrictions';
import ChefProfile from './ChefProfile';
import ReviewSection from './ReviewSection';
import { toast } from 'react-toastify';

const RecipeDetail = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('recipe');

  useEffect(() => {
    fetchRecipe();
  }, [id]);

  const fetchRecipe = async () => {
    try {
      const response = await getRecipeById(id);
      setRecipe(response.data);
      setLoading(false);
    } catch (error) {
      toast.error('Failed to load recipe');
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to bookmark recipes');
        return;
      }

      if (isBookmarked) {
        await removeBookmark(token, id);
        setIsBookmarked(false);
        toast.success('Recipe removed from bookmarks');
      } else {
        await addBookmark(token, id);
        setIsBookmarked(true);
        toast.success('Recipe added to bookmarks');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      {/* Recipe Header */}
      <RecipeHeader recipe={recipe} onBookmark={handleBookmark} isBookmarked={isBookmarked} />

      {/* Navigation Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['recipe', 'chef', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  ${activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm capitalize
                `}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="mt-6">
          {activeTab === 'recipe' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Description</h2>
                  <p className="text-gray-600">{recipe.description}</p>
                </section>

                <IngredientsList ingredients={recipe.ingredients} servings={recipe.servings} />
                <InstructionSteps instructions={recipe.instructions} />
              </div>

              <div className="space-y-8">
                <NutritionalInfo info={recipe.nutritionalInfo} />
                <DietaryRestrictions restrictions={recipe.dietaryRestrictions} />
              </div>
            </div>
          )}

          {activeTab === 'chef' && <ChefProfile author={recipe.authorId} />}
          
          {activeTab === 'reviews' && <ReviewSection recipeId={id} />}
        </div>
      </div>
    </motion.div>
  );
};

export default RecipeDetail;


// src/components/Recipe/RecipeHeader.jsx
const RecipeHeader = ({ recipe, onBookmark, isBookmarked }) => {
  return (
    <div className="relative">
      <div className="h-96 w-full overflow-hidden">
        <img
          src={recipe.mainImage}
          alt={recipe.title}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-end pb-8">
          <div className="text-white w-full">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl font-bold mb-4"
            >
              {recipe.title}
            </motion.h1>
            
            <div className="flex items-center space-x-6 mb-4">
              <div className="flex items-center">
                <FaClock className="mr-2" />
                <span>{recipe.totalTime} mins</span>
              </div>
              <div className="flex items-center">
                <FaUtensils className="mr-2" />
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
              <div className="flex items-center">
                <FaUserFriends className="mr-2" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onBookmark}
              className="bg-primary-500 hover:bg-primary-600 text-white px-4 py-2 rounded-full flex items-center"
            >
              {isBookmarked ? <FaBookmark className="mr-2" /> : <FaRegBookmark className="mr-2" />}
              {isBookmarked ? 'Bookmarked' : 'Bookmark Recipe'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

// src/components/Recipe/IngredientsList.jsx

const IngredientsList = ({ ingredients, servings }) => {
  const [currentServings, setCurrentServings] = useState(servings);

  const adjustQuantity = (quantity) => {
    const ratio = currentServings / servings;
    return (parseFloat(quantity) * ratio).toFixed(1);
  };

  return (
    <section className="bg-white rounded-2xl shadow-custom p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
      
      <div className="mb-6">
        <label className="text-sm text-gray-600 mb-2 block">Adjust servings:</label>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setCurrentServings(Math.max(1, currentServings - 1))}
            className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200"
          >
            -
          </button>
          <span className="font-medium">{currentServings}</span>
          <button
            onClick={() => setCurrentServings(currentServings + 1)}
            className="p-2 rounded-full bg-primary-100 text-primary-600 hover:bg-primary-200"
          >
            +
          </button>
        </div>
      </div>

      <ul className="space-y-3">
        {ingredients.map((ingredient, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
          >
            <span className="text-gray-800">{ingredient.name}</span>
            <span className="text-gray-600">
              {adjustQuantity(ingredient.quantity)} {ingredient.unit}
            </span>
          </motion.li>
        ))}
      </ul>
    </section>
  );
};


// src/components/Recipe/InstructionSteps.jsx
const InstructionSteps = ({ instructions }) => {
  const [completedSteps, setCompletedSteps] = useState(new Set());

  const toggleStep = (stepNumber) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(stepNumber)) {
      newCompleted.delete(stepNumber);
    } else {
      newCompleted.add(stepNumber);
    }
    setCompletedSteps(newCompleted);
  };

  return (
    <section className="bg-white rounded-2xl shadow-custom p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Instructions</h2>
      
      <div className="space-y-6">
        {instructions.map((instruction, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex space-x-4 ${completedSteps.has(instruction.step) ? 'opacity-50' : ''}`}
          >
            <button
              onClick={() => toggleStep(instruction.step)}
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-1 
                ${completedSteps.has(instruction.step)
                  ? 'bg-primary-500 text-white'
                  : 'border-2 border-gray-300 hover:border-primary-500'
                }`}
            >
              {completedSteps.has(instruction.step) ? (
                <FaCheck className="w-4 h-4" />
              ) : (
                instruction.step
              )}
            </button>
            
            <div className="space-y-3">
              <p className="text-gray-800">{instruction.text}</p>
              {instruction.image && (
                <img
                  src={instruction.image}
                  alt={`Step ${instruction.step}`}
                  className="rounded-lg w-full max-w-md"
                />
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// src/components/Recipe/NutritionalInfo.jsx

const NutritionalInfo = ({ info }) => {
  const nutrients = [
    { label: 'Calories', value: info.calories, unit: 'kcal' },
    { label: 'Protein', value: info.protein, unit: 'g' },
    { label: 'Carbs', value: info.carbs, unit: 'g' },
    { label: 'Fat', value: info.fat, unit: 'g' },
    { label: 'Sugar', value: info.sugar, unit: 'g' },
    { label: 'Fiber', value: info.fiber, unit: 'g' },
    { label: 'Sodium', value: info.sodium, unit: 'mg' },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-custom p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Nutrition Facts</h2>
      
      <div className="space-y-3">
        {nutrients.map((nutrient, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-2 border-b border-gray-100"
          >
            <span className="text-gray-600">{nutrient.label}</span>
            <span className="font-medium text-gray-800">
              {nutrient.value} {nutrient.unit}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// src/components/Recipe/DietaryRestrictions.jsx

const DietaryRestrictions = ({ restrictions }) => {
  const dietaryItems = [
    { key: 'isVegetarian', label: 'Vegetarian' },
    { key: 'isVegan', label: 'Vegan' },
    { key: 'isGlutenFree', label: 'Gluten Free' },
    { key: 'isDairyFree', label: 'Dairy Free' },
    { key: 'isNutFree', label: 'Nut Free' },
    { key: 'isKeto', label: 'Keto' },
    { key: 'isPaleo', label: 'Paleo' },
    { key: 'isLowCarb', label: 'Low Carb' },
    { key: 'suitableForChildren', label: 'Kid Friendly' },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-custom p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Dietary Information</h2>
      
      <div className="grid grid-cols-1 gap-3">
        {dietaryItems.map((item, index) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-center justify-between p-2 rounded-lg
              ${restrictions[item.key] ? 'bg-primary-50' : 'bg-gray-50'}`}
          >
            <span className="text-gray-700">{item.label}</span>
            {restrictions[item.key] ? (
              <FaCheck className="text-primary-500 w-5 h-5" />
            ) : (
              <FaTimes className="text-gray-400 w-5 h-5" />
            )}
          </motion.div>
        ))}
      </div>
    </section>
  );
};

// src/components/Recipe/ChefProfile.jsx


const ChefProfile = ({ author }) => {
  const [chefDetails, setChefDetails] = useState(null);
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChefDetails();
  }, [author]);

  const fetchChefDetails = async () => {
    try {
      // Fetch chef details and recent recipes
      const [profileRes, recipesRes] = await Promise.all([
        axios.get(`/api/users/${author._id}`),
        axios.get(`/api/recipes/author/${author._id}?limit=3`)
      ]);

      setChefDetails(profileRes.data);
      setRecentRecipes(recipesRes.data);
    } catch (error) {
      console.error('Error fetching chef details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Chef Profile Card */}
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <div className="flex items-center space-x-6">
          <div className="relative w-24 h-24">
            <img
              src={chefDetails?.profilePicture || '/default-avatar.png'}
              alt={chefDetails?.username}
              className="rounded-full w-full h-full object-cover"
            />
            <div className="absolute -bottom-2 -right-2 bg-primary-500 text-white p-2 rounded-full">
              <FaUtensils className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900">{chefDetails?.username}</h2>
            <p className="text-gray-600 mt-1">{chefDetails?.bio || 'No bio available'}</p>
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center">
                <FaCalendar className="w-4 h-4 mr-1" />
                Joined {new Date(chefDetails?.createdAt).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <FaUtensils className="w-4 h-4 mr-1" />
                {recentRecipes.length} Recipes
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Recipes */}
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Recipes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentRecipes.map((recipe, index) => (
            <motion.div
              key={recipe._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative rounded-lg overflow-hidden"
            >
              <img
                src={recipe.mainImage}
                alt={recipe.title}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-4 text-white">
                  <h4 className="font-medium">{recipe.title}</h4>
                  <p className="text-sm opacity-75">{recipe.cuisine}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// src/components/Recipe/ReviewSection.jsx

const ReviewSection = ({ recipeId }) => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 0, comment: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [recipeId]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`/api/reviews/recipe/${recipeId}`);
      setReviews(response.data.reviews);
    } catch (error) {
      toast.error('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Please login to submit a review');
        return;
      }

      await axios.post(
        `/api/reviews/recipe/${recipeId}`,
        newReview,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      await fetchReviews();
      setNewReview({ rating: 0, comment: '' });
      toast.success('Review submitted successfully');
    } catch (error) {
      toast.error('Failed to submit review');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ rating, onRatingChange, interactive = false }) => (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          whileHover={interactive ? { scale: 1.2 } : {}}
          whileTap={interactive ? { scale: 0.9 } : {}}
          onClick={() => interactive && onRatingChange(star)}
          className={`${interactive ? 'cursor-pointer' : ''} ${
            star <= rating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          <FaStar className="w-5 h-5" />
        </motion.button>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Review Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-custom p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <StarRating
              rating={newReview.rating}
              onRatingChange={(rating) => setNewReview({ ...newReview, rating })}
              interactive
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows="4"
              placeholder="Share your experience with this recipe..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </motion.div>

      {/* Reviews List */}
      <div className="bg-white rounded-2xl shadow-custom p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">Reviews</h3>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-8">No reviews yet. Be the first to review!</p>
        ) : (
          <AnimatePresence>
            <div className="space-y-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-gray-100 last:border-0 pb-6 last:pb-0"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <img
                        src={review.userId.profilePicture || '/default-avatar.png'}
                        alt={review.userId.username}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{review.userId.username}</p>
                        <StarRating rating={review.rating} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <FaClock className="w-4 h-4 mr-1" />
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};
