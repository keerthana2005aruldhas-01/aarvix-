
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  PhoneCall,
  Truck,
  Calculator,
  ShieldCheck,
  User
} from 'lucide-react';
import { BRAND } from '@aarvix/shared';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'About', path: '/about' },
    { label: 'How It Works', path: '/how-it-works' },
     { label: 'Vehicles', path: '/vehicles' },
    { label: 'My Trips', path: '/trips' },
   { label: 'Services', path: '/services' },
   { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="relative z-50 w-full bg-white/95 backdrop-blur-md border-b border-warm-200 shadow-sm">

      {/* Top Emergency & Operations Ticker */}
      <div className="bg-forest-950 text-white text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-gold-400 font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              VERIFIED PAN-INDIA LORRY NETWORK
            </span>

            <span className="hidden md:inline text-forest-700">|</span>

            <span className="hidden md:inline text-neutral-300">
              National Permit Trucks • Instant Digital POD
            </span>
          </div>

          <div className="flex items-center gap-4 text-neutral-300">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 text-gold-400 hover:text-white font-bold transition-colors text-[11px]"
            >
              <span>Admin Control Tower</span>
              <span className="text-[9px] px-1 bg-gold-500/20 text-gold-300 rounded border border-gold-500/40">
                2FA
              </span>
            </Link>

            <span className="text-forest-700">|</span>

            <a
              href="tel:1800227849"
              className="flex items-center gap-1.5 hover:text-gold-400 transition-colors"
            >
              <PhoneCall className="w-3 h-3 text-gold-400" />
              <span className="font-medium">
                24/7 Helpline: {BRAND.supportPhone}
              </span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between min-h-[90px] py-2">

          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center shrink-0">
            <img
              src="/logo.png"
              alt="Aarvix Logistics"
              className="block h-[80px] w-auto max-w-[180px] object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'text-forest-800 bg-forest-50 font-semibold shadow-sm'
                    : 'text-neutral-700 hover:text-forest-800 hover:bg-neutral-100/70'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-neutral-700 hover:text-forest-900 hover:bg-neutral-100 border border-warm-300 rounded-lg transition-colors"
            >
              <User className="w-3.5 h-3.5 text-neutral-500" />
              Login
            </Link>

            <Link
              to="/book"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-forest-800 hover:bg-forest-900 border border-forest-700 rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Truck className="w-4 h-4 text-gold-400" />
              <span>Book a Truck</span>
            </Link>
          </div>

          {/* Mobile Menu Buttons */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/fare-calculator"
              className="p-2 text-forest-800 hover:bg-forest-50 rounded-lg"
              title="Fare Calculator"
            >
              <Calculator className="w-5 h-5" />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-neutral-700 hover:text-forest-800 hover:bg-neutral-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-warm-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">

          <div className="space-y-1">
            {navLinks.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-lg text-base font-medium ${
                  isActive(item.path)
                    ? 'text-forest-800 bg-forest-50 font-semibold'
                    : 'text-neutral-700 hover:bg-neutral-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-warm-200 space-y-2">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-neutral-800 border border-warm-300 rounded-lg bg-neutral-50 hover:bg-neutral-100"
            >
              <User className="w-4 h-4 text-neutral-600" />
              Login
            </Link>

            <Link
              to="/book"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-forest-800 rounded-lg shadow-sm hover:bg-forest-900"
            >
              <Truck className="w-4 h-4 text-gold-400" />
              Book a Truck
            </Link>
          </div>
        </div>
      )}

    </header>
  );
};
