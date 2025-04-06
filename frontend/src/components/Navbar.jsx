import React, { useEffect, useState } from "react";
import { FaBarsStaggered, FaXmark } from "react-icons/fa6";
import { Link } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsSticky(true);
      } else {
        setIsSticky(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { link: "Home", path: "/" },
    { link: "Home", path: "/" },
    { link: "Home", path: "/" },
    { link: "Home", path: "/" },
    // { link: "Login", path: "/login" },
    // { link: "Sign Up", path: "/register" },
  ];

  return (
    <header className={`navbar-header ${isSticky ? "sticky" : ""}`}>
      <nav className="navbar-container">
        <div className="navbar-inner">
        <Link to="/" className="logo">
            ClipTalk
          </Link>
          {/* nav items for large screen */}
          <ul className="navbar-links">
            {navItems.map(({ link, path }) => (
              <Link
                key={path}
                to={path}
                className="navbar-link"
              >
                {link}
              </Link>
            ))}
          </ul>

          {/* menu button for mobile */}
          <div className="navbar-menu-icon">
            <button onClick={toggleMenu} className="menu-toggle">
              {isMenuOpen ? (
                <FaXmark className="menu-icon" />
              ) : (
                <FaBarsStaggered className="menu-icon" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${isMenuOpen ? "active" : ""}`}>
          {navItems.map(({ link, path }) => (
            <Link
              key={path}
              to={path}
              className="mobile-link"
              onClick={() => setIsMenuOpen(false)}
            >
              {link}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
