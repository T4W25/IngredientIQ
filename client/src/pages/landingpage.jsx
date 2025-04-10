import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../Components/ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative min-h-[600px] bg-cover bg-center flex items-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
            url(/hero.jpeg)`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Turn Your Ingredients into
            <span className="text-primary-300"> Delicious Meals!</span>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl mb-8"
          >
            Smart recipe suggestions based on what's in your kitchen.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-x-4"
          >
            <Link to="/auth">
              <Button variant="primary" className="text-lg px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white">
                Get Started
              </Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-primary-600">
                Learn More
              </Button>
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary-800">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Input Ingredients', 'Get Recipe Suggestions', 'Cook & Enjoy'].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-primary-600">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 text-primary-700">{step}</h3>
                <p className="text-gray-600">
                  {step === 'Input Ingredients' 
                    ? 'Enter what you have in your fridge' 
                    : step === 'Get Recipe Suggestions' 
                    ? 'Receive personalized recipe recommendations' 
                    : 'Cook and share your experience'}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-primary-800">Why Choose IngredientIQ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              ['Ingredient-Based Recipe Matching', 'Find recipes instantly using what`s in your fridge.'],
              ['Chef-Curated Recipes', 'Enjoy professional-grade meals from expert chefs.'],
              ['Sustainability-Focused', 'Reduce food waste and save money.'],
              ['Meal Planning & Nutrition', 'Organize your meals and eat healthier.']
            ].map(([title, description], index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-white rounded-lg shadow-custom hover:shadow-lg transition-shadow duration-300"
              >
                <h3 className="text-xl font-semibold mb-2 text-primary-700">✅ {title}</h3>
                <p className="text-gray-600">{description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-primary-800">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "Game changer for my meal planning!",
              "I love the chef-curated recipes!",
              "It helped me reduce food waste!"
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-6 bg-primary-100 rounded-lg shadow-custom"
              >
                <p className="text-primary-800 italic">"{testimonial}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-7xl mx-auto px-4"
        >
          <h2 className="text-3xl text-white font-bold mb-4">Start Cooking Smarter Today!</h2>
          <p className="mb-6 text-white">Join thousands of users discovering smarter ways to cook.</p>
          <Link to="/moderator/dashboard">
            <Button variant="primary" className="text-lg px-8 py-3 bg-white text-primary-600 hover:bg-gray-100">
              Sign Up for Free
            </Button>
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-6 mb-4">
            {['About', 'Features', 'Blog', 'Contact', 'Privacy Policy'].map((link, index) => (
              <Link
                key={index}
                to={`/${link.toLowerCase().replace(' ', '-')}`}
                className="hover:text-primary-400 transition-colors duration-200"
              >
                {link}
              </Link>
            ))}
          </div>
          <p className="text-center">&copy; {new Date().getFullYear()} IngredientIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;