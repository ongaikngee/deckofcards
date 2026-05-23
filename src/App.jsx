import './App.css'
import Navbar from './components/NavBar'
import { useState } from 'react';

import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { CurrentGame } from './pages/CurrentGame';

function App() {
  const [games, setGames] = useState([]);

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Home games={games} setGames={setGames} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/game/:deckId" element={<CurrentGame games={games} setGames={setGames} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
