import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout.js';
import { HomePage } from './pages/HomePage.js';
import { ServicesPage } from './pages/ServicesPage.js';
import { VehiclesPage } from './pages/VehiclesPage.js';
import { FareCalculatorPage } from './pages/FareCalculatorPage.js';
import { HowItWorksPage } from './pages/HowItWorksPage.js';
import { AboutPage } from './pages/AboutPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { FaqPage } from './pages/FaqPage.js';
import { LoginPage } from './pages/LoginPage.js';
import { RegisterPage } from './pages/RegisterPage.js';
import { TermsPage } from './pages/TermsPage.js';
import { PrivacyPage } from './pages/PrivacyPage.js';
import { CancellationRefundPage } from './pages/CancellationRefundPage.js';
import { SupportPage } from './pages/SupportPage.js';
import { BookingPage } from './pages/BookingPage.js';
import { TripsPage } from './pages/TripsPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { Truck } from 'lucide-react';
import { Button } from './components/ui/Button.js';

const NotFoundPage: React.FC = () => (
  <div className="py-24 text-center max-w-md mx-auto px-4 space-y-4">
    <div className="w-16 h-16 bg-forest-100 text-forest-800 rounded-2xl flex items-center justify-center mx-auto">
      <Truck className="w-8 h-8" />
    </div>
    <h1 className="text-2xl font-black text-forest-950">Lane Not Found (404)</h1>
    <p className="text-xs text-neutral-600">
      The logistics route or page you are attempting to navigate to does not exist or has been relocated.
    </p>
    <Link to="/">
      <Button variant="primary" size="md">
        Return to Home Station
      </Button>
    </Link>
  </div>
);

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="fare-calculator" element={<FareCalculatorPage />} />
          <Route path="book" element={<BookingPage />} />
          <Route path="trips" element={<TripsPage />} />
          <Route path="how-it-works" element={<HowItWorksPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faqs" element={<FaqPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="admin" element={<AdminDashboardPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="terms" element={<TermsPage />} />
          <Route path="privacy" element={<PrivacyPage />} />
          <Route path="cancellation-refund" element={<CancellationRefundPage />} />
          <Route path="support" element={<SupportPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
