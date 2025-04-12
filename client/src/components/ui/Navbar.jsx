// src/components/navigation/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HomeIcon, MagnifyingGlassIcon, BookOpenIcon, 
  BookmarkIcon, CalendarIcon, UserCircleIcon,
  Bars3Icon, XMarkIcon
} from '@heroicons/react/24/outline';
import Logo from '/logo_ingredientiq.png';

const NavLink = ({ to, icon: Icon, text, isActive }) => (
  <Link to={to} className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
    ${isActive 
      ? 'bg-green-600 text-white' 
      : 'text-white hover:bg-green-600/50'}`}>
    <Icon className="w-5 h-5" />
    <span className="hidden md:block">{text}</span>
  </Link>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/auth";
  };

  const navLinks = [
    { to: "/home", icon: HomeIcon, text: "Home" },
    { to: "/search", icon: MagnifyingGlassIcon, text: "Search" },
    { to: "/recipes", icon: BookOpenIcon, text: "Recipes" },
    { to: "/bookmarks", icon: BookmarkIcon, text: "Bookmarks" },
    { to: "/mealplans", icon: CalendarIcon, text: "Meal Plans" },
    { to: "/profile", icon: UserCircleIcon, text: "Profile" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed w-full z-50 transition-all duration-300
        ${isScrolled 
          ? 'bg-green-700/95 backdrop-blur-sm shadow-lg' 
          : 'bg-green-700'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center space-x-2">
            <img 
              src={Logo} 
              alt="Logo" 
              className="h-8 w-8"
            />
            <span className="text-white font-bold text-xl">
              Ingredient IQ
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                {...link}
                isActive={location.pathname === link.to}
              />
            ))}
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-500 text-white rounded-lg
                hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-white 
              hover:bg-green-600/50 transition-colors"
          >
            {isMobileMenuOpen 
              ? <XMarkIcon className="h-6 w-6" />
              : <Bars3Icon className="h-6 w-6" />
            }
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 space-y-2"
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                {...link}
                isActive={location.pathname === link.to}
              />
            ))}
            <button
              onClick={handleLogout}
              className="w-full mt-4 px-4 py-2 bg-red-500 text-white 
                rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              Logout
            </button>
          </motion.nav>
        )}
      </div>
    </motion.header>
  );
};

export default Navbar;