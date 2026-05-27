import './App.css'
import Navbar from './components/NavBar'
import { useState } from 'react';

import { Routes, Route } from 'react-router-dom';
import { Games } from './pages/Games';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { CurrentGame } from './features/games/CurrentGame';

function App() {
  const [games, setGames] = useState([]);

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          <Route path="/" element={<Games games={games} setGames={setGames} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/game/:deckId" element={<CurrentGame games={games} setGames={setGames} />} />
        </Routes>
      </div>
    </>
  )
}

export default App
