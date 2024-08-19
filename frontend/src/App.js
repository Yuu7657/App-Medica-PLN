import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Notes from './components/Notes';
import History from './components/History';
import Navbar from './components/Navbar';
import './App.css';

const App = () => {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
