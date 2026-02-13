import { NavLink } from "react-router-dom";
import { MapPin, Mail, Instagram, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-white">
      {/* Hero Text Section */}
      <div className="bg-ocean py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-white/90 font-body text-lg md:text-xl leading-relaxed mb-8">
            Find your own space at the Tropical Paradise that awaits you in surf
            town La Union. Head over to that beachfront of ambience for that
            priceless sunset view.
          </p>
          <div className="flex justify-center gap-6 text-white/80">
            <a
              href="https://instagram.com/fatwavesurfresort"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-sunny transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-body">@fatwavesurfresort</span>
            </a>
            <a
              href="https://instagram.com/lagula_desserts"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-sunny transition-colors"
            >
              <Instagram className="w-5 h-5" />
              <span className="font-body">@lagula_desserts</span>
            </a>
          </div>
          <div className="mt-6">
            <a
              href="https://facebook.com/FatwaveSurfResort"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white/80 hover:text-sunny transition-colors"
            >
              <Facebook className="w-5 h-5" />
              <span className="font-body">FatwaveSurfResort</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Brand & Navigation */}
          <div className="space-y-6">
            <NavLink to="/" className="flex items-center gap-2">
              <span className="text-3xl">🌊</span>
              <span className="font-accent text-2xl text-white">Fatwave</span>
            </NavLink>
            <div>
              <h4 className="font-heading font-bold text-lg mb-4">
                Navigation
              </h4>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-2">
                {[
                  { path: "/about", label: "About" },
                  { path: "/rooms", label: "Rooms" },
                  { path: "/dining", label: "Dining & Bar" },
                  { path: "/events", label: "Events" },
                  { path: "/contact", label: "Contact" },
                  { path: "/booking/lookup", label: "My Booking" },
                ].map((link) => (
                  <li key={link.path}>
                    <NavLink
                      to={link.path}
                      className="text-gray-400 hover:text-sunny transition-colors font-body"
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Contact Us */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Contact Us</h4>
            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-sunset shrink-0 mt-1" />
                <span className="text-gray-400 font-body">
                  MacArthur Highway, Brgy. Urbiztondo,
                  <br />
                  San Juan, La Union, Philippines
                </span>
              </div>
            </div>
          </div>

          {/* Email Contacts */}
          <div>
            <h4 className="font-heading font-bold text-lg mb-6">Email Us</h4>
            <div className="space-y-5">
              <div>
                <p className="text-gray-500 text-sm font-body mb-1">
                  Events and Collaborations
                </p>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sunset shrink-0" />
                  <a
                    href="mailto:reservations@fatwavesurf.com"
                    className="text-gray-400 hover:text-sunny transition-colors font-body text-sm"
                  >
                    reservations@fatwavesurf.com
                  </a>
                </div>
              </div>

              <div>
                <p className="text-gray-500 text-sm font-body mb-1">
                  Room Inquiries & Reservations
                </p>
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-sunset shrink-0" />
                  <a
                    href="mailto:reservations@fatwavesurf.com"
                    className="text-gray-400 hover:text-sunny transition-colors font-body text-sm"
                  >
                    reservations@fatwavesurf.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌊</span>
            <span className="font-accent text-lg text-white">
              Fatwave Surf Resort
            </span>
          </div>
          <p className="text-gray-500 text-sm font-body">
            © {currentYear} All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
