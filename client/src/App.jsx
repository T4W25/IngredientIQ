import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Auth from './components/authorization/Auth';
import Home from './pages/home/Home'; // You can create this now

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Auth />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
};

export default App;
