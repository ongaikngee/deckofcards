import { Link } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

import Collapse from "bootstrap/js/dist/collapse"

function Navbar() {
  const { user } = useAuth();

  const closeNavbar = () => {
    const nav = document.getElementById("navbarNav");
    if (nav) {
      const bsCollapse = Collapse.getInstance(nav) || new Collapse(nav, { toggle: false });
      bsCollapse.hide();
    }
  };

  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-dark" data-bs-theme="dark">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Deck of Cards
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            {!user && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/about" onClick={closeNavbar}>
                    About
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/contact" onClick={closeNavbar}>
                    Contact
                  </Link>
                </li>
              </>
            )}
            {user && (
              <div className="d-flex flex-column flex-sm-row align-items-start align-items-md-center gap-2">
                <li>
                  <Link className="nav-link" to="/" onClick={closeNavbar}>
                    Deck of Cards
                  </Link>
                </li>
                <li>
                  <Link className="nav-link" to="/studpoker" onClick={closeNavbar}>
                    Stud Poker
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/user" onClick={closeNavbar}>
                    <div className="border border-danger rounded-circle text-warning p-2">{user}</div>
                  </Link>
                </li>
              </div>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
