
import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from '../components/layout/Navbar.js';
import { Footer } from '../components/layout/Footer.js';

export const RootLayout: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-[#1A2418] font-sans">
      <Navbar />

      <main className="flex-1 bg-transparent">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};
