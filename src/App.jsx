import "./App.css";
import Navbar from "./components/NavBar";
import { useState } from "react";

import { Routes, Route } from "react-router-dom";

import Games from "./pages/Games";
import About from "./pages/About";
import Contact from "./pages/Contact";
import User from "./pages/User";

import UserMain from "./features/users/UserMain";
import Settings from "./features/users/Settings";
import Chips from "./features/users/Chips";

import { CurrentGame } from "./features/games/CurrentGame";

function App() {
  const [games, setGames] = useState([]);

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <Routes>
          <Route
            path="/"
            element={<Games games={games} setGames={setGames} />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/user" element={<User />}>
            <Route index element={<UserMain />} />
            <Route path="/user/chips" element={<Chips />} />
            <Route path="/user/settings" element={<Settings />} />
          </Route>
          <Route
            path="/game/:deckId"
            element={<CurrentGame games={games} setGames={setGames} />}
          />
        </Routes>
      </div>
    </>
  );
}

export default App;
