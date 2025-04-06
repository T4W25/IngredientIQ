import React from 'react';
import { Link } from 'react-router-dom';
import Button from './ui/button';

const Landing = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[600px] bg-cover bg-center flex items-center" 
           style={{
             backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
             url(/assets/images/hero-bg.jpg)`
           }}>
        <div className="max-w-7xl mx-auto px-4 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Turn Your Ingredients into Delicious Meals!</h1>
          <p className="text-xl mb-8">Smart recipe suggestions based on what’s in your kitchen.</p>
          <div className="space-x-4">
            <Link to="/auth">
              <Button variant="primary" className="text-lg px-8 py-3">Get Started</Button>
            </Link>
            <Link to="/about">
              <Button variant="outline" className="text-lg px-8 py-3 text-white border-white hover:bg-white hover:text-green-600">Learn More</Button>
            </Link>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {['Input Ingredients', 'Get Recipe Suggestions', 'Cook & Enjoy'].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl text-green-600">{index + 1}</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{step}</h3>
                <p className="text-gray-600">{step === 'Input Ingredients' ? 'Enter what you have in your fridge' : step === 'Get Recipe Suggestions' ? 'Receive personalized recipe recommendations' : 'Cook and share your experience'}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">Why Choose IngredientIQ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              ['Ingredient-Based Recipe Matching', 'Find recipes instantly using what’s in your fridge.'],
              ['Chef-Curated Recipes', 'Enjoy professional-grade meals from expert chefs.'],
              ['Sustainability-Focused', 'Reduce food waste and save money.'],
              ['Meal Planning & Nutrition', 'Organize your meals and eat healthier.']
            ].map(([title, description], index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">✅ {title}</h3>
                <p className="text-gray-600">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12">What Our Users Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {["Game changer for my meal planning!", "I love the chef-curated recipes!", "It helped me reduce food waste!"].map((testimonial, index) => (
              <div key={index} className="p-6 bg-green-100 rounded-lg shadow-md">
                <p className="text-gray-800 italic">“{testimonial}”</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-green-600  text-center">
        <h2 className="text-3xl text-white font-bold mb-4">Start Cooking Smarter Today!</h2>
        <p className="mb-6 text-white">Join thousands of users discovering smarter ways to cook.</p>
        <Link to="/auth">
          <Button variant="primary" className="text-lg px-8 py-3 text-green-600 bg-white hover:bg-gray-200">Sign Up for Free</Button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="py-8 bg-gray-900 text-white text-center">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-center space-x-6 mb-4">
            {['About', 'Features', 'Blog', 'Contact', 'Privacy Policy'].map((link, index) => (
              <Link key={index} to={`/${link.toLowerCase().replace(' ', '-')}`} className="hover:text-green-400">{link}</Link>
            ))}
          </div>
          <p>&copy; {new Date().getFullYear()} IngredientIQ. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
