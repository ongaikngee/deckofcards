import "./App.css";
import Navbar from "./components/NavBar";
import { useState } from "react";

import { Routes, Route } from "react-router-dom";

import ProtectedRoute from "./features/auth/ProtectedRoute";

import Games from "./pages/Games";
import About from "./pages/About";
import Contact from "./pages/Contact";
import User from "./pages/User";
import LoginPage from "./pages/LoginPage";

import UserMain from "./features/users/UserMain";
import Settings from "./features/users/Settings";
import Chips from "./features/users/Chips";

import { CurrentGame } from "./features/games/CurrentGame";

function App() {
  const [games, setGames] = useState([]);

  return (
    <>
      <Navbar />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={<ProtectedRoute><Games games={games} setGames={setGames} /></ProtectedRoute>}
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/user" element={<User />}>
            <Route index element={<ProtectedRoute><UserMain /></ProtectedRoute>} />
            <Route path="/user/chips" element={<ProtectedRoute><Chips /></ProtectedRoute>} />
            <Route path="/user/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
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
