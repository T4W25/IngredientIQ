// src/pages/home/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../../Components/navbar";
import RecipeCard from "../../Components/recipe/RecipeCard";
import sampleRecipes from "../../assets/sampleRecipes";
import { 
  ChevronRightIcon, 
  SparklesIcon,
  MagnifyingGlassIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="pt-60 pb-16 px-4 bg-gradient-to-br from-green-50 to-white"
      >
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-green-800 mb-6"
          >
            Discover Recipes.
            <br />
            Plan Meals.
            <br />
            Get Inspired.
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto"
          >
            Your personalized ingredient discovery and recipe planner.
            Transform your cooking experience with smart recommendations.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/recipes">
              <button className="px-8 py-4 bg-green-600 text-white rounded-xl
                font-semibold text-lg hover:bg-green-700 transition-colors
                duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl
                transform hover:-translate-y-1">
                Explore Recipes
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/search">
              <button className="px-8 py-4 bg-white text-green-600 rounded-xl
                font-semibold text-lg hover:bg-green-50 transition-colors
                duration-300 border-2 border-green-600 flex items-center gap-2
                shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                Start Searching
                <MagnifyingGlassIcon className="w-5 h-5" />
              </button>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Recipes Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <SparklesIcon className="w-8 h-8 text-yellow-400" />
              Featured Recipes
            </h2>
            <Link to="/recipes" 
              className="text-green-600 hover:text-green-700 
                font-semibold flex items-center gap-1"
            >
              View All
              <ChevronRightIcon className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 
            xl:grid-cols-4 gap-6">
            {sampleRecipes.map((recipe) => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <RecipeCard recipe={recipe} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 
          md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Ingredient IQ</h3>
            <p className="text-gray-400">
              Your smart cooking companion for discovering recipes 
              and planning meals.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Connect With Us</h4>
            <div className="flex space-x-4">
              {/* Add your social media icons/links here */}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t 
          border-gray-700 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Ingredient IQ. 
            All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;