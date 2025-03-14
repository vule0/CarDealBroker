import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header'
import Footer from './components/Footer'
import About from './pages/AboutPage';
import LandingPage from './pages/LandingPage';
function App() {

  return (
    <>
     <Router>
      {/* <Header /> */}
      <Routes>
      <Route path="/" element={<LandingPage />} />
        {/* <Route path="/about" element={<About/>} /> */}
        {/* <Route path="/lease" element={<h1>Lease Your Car</h1>} />
        <Route path="/sell" element={<h1>Sell Your Car</h1>} /> */}
      </Routes>
      <Footer/>
    </Router>
    </>
  )
}

export default App
