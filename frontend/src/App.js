import React from 'react';
import Welcome from './components/Welcome';
import About from './components/About'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import './App.css';


function App() {
  return (
    <div className="App">
      <Navbar />
      <Welcome />
      <Footer />
    </div>
  );
}

export default App;
