import { Link } from "react-router-dom";
import "./Navbar.css"; // optional if you want separate styles

function Navbar() {
  return (
    <nav className="navbar">
      <h1 className="navbar-title">AI Stock Dashboard</h1>
      <div className="navbar-links">
        <Link to="/">Overview</Link>
        <Link to="/watchlist">Watchlist</Link>
        <Link to="/portfolio">Portfolio</Link>
      </div>
    </nav>
  );
}

export default Navbar;
