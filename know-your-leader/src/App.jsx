// App.jsx

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './Components/Header/Header';
import Home from './Components/Home/Home';
import About from './Components/About/About';
import Contact from './Components/Contact/Contact';
import BottomNavBar from './Components/BottomNavBar/BottomNavBar'; // Import the BottomNavBar component

const App = () => {
  return (
    <Router>
      <div>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Add more routes for other sections */}
        </Routes>
        <BottomNavBar />
      </div>
    </Router>
  );
};

export default App;
