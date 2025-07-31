import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar glassy">
      <h1 className="navbar-title neon-text">AI Stock Dashboard</h1>
      <div className="navbar-links">
        <Link className="neon-link" to="/">Overview</Link>
        <Link className="neon-link" to="/watchlist">Watchlist</Link>
        <Link className="neon-link" to="/portfolio">Portfolio</Link>
      </div>
    </nav>
  );
}

export default Navbar;
