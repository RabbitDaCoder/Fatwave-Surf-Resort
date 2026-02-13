import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/rooms", label: "Rooms" },
    { path: "/dining", label: "Dining & Bar" },
    { path: "/events", label: "Events" },
    { path: "/about", label: "About" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav
      className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-300
      ${isScrolled || !isHome ? "bg-white shadow-md" : "bg-transparent"}
    `}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2">
            <span className="text-3xl">🌊</span>
            <span
              className={`
              font-accent text-2xl transition-colors
              ${isScrolled || !isHome ? "text-ocean" : "text-white"}
            `}
            >
              Fatwave
            </span>
          </NavLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => `
                  font-nav font-medium transition-colors relative
                  ${
                    isScrolled || !isHome
                      ? isActive
                        ? "text-ocean"
                        : "text-charcoal hover:text-ocean"
                      : isActive
                        ? "text-sunny"
                        : "text-white hover:text-sunny"
                  }
                  after:content-[''] after:absolute after:bottom-[-4px] after:left-0 
                  after:h-0.5 after:bg-sunset after:transition-all after:duration-300
                  ${isActive ? "after:w-full" : "after:w-0 hover:after:w-full"}
                `}
              >
                {link.label}
              </NavLink>
            ))}

            <NavLink to="/rooms" className="btn btn-primary">
              Book Now
            </NavLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`
              md:hidden p-2 rounded-lg transition-colors
              ${
                isScrolled || !isHome
                  ? "text-charcoal hover:bg-sand"
                  : "text-white hover:bg-white/10"
              }
            `}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`
        md:hidden absolute top-full left-0 right-0 bg-white shadow-lg transform transition-all duration-300 origin-top
        ${isOpen ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"}
      `}
      >
        <div className="container-custom py-4 space-y-2">
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) => `
                block px-4 py-3 rounded-lg font-nav font-medium transition-colors
                ${
                  isActive
                    ? "bg-ocean/10 text-ocean"
                    : "text-charcoal hover:bg-sand"
                }
              `}
            >
              {link.label}
            </NavLink>
          ))}
          <div className="pt-2 px-4">
            <NavLink to="/rooms" className="btn btn-primary w-full">
              Book Now
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
