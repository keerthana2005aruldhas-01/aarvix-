import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Clock, FileText } from 'lucide-react';
import { BRAND } from '@aarvix/shared';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-white border-t border-forest-800">
      {/* Upper features ribbon */}
      <div className="border-b border-forest-900 bg-forest-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-forest-800/80 rounded-xl border border-forest-700/60 text-gold-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">100% Verified Lorries</h4>
              <p className="text-xs text-neutral-300 mt-1">
                Every vehicle has audited RC, fitness, active national permits and insured drivers.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-forest-800/80 rounded-xl border border-forest-700/60 text-gold-400 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Guaranteed Loading Windows</h4>
              <p className="text-xs text-neutral-300 mt-1">
                Committed placement SLAs with live GPS telemetry and dedicated operations dispatch.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-3 bg-forest-800/80 rounded-xl border border-forest-700/60 text-gold-400 shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white tracking-wide">Digital POD & Transparent Invoices</h4>
              <p className="text-xs text-neutral-300 mt-1">
                Instant consignment notes, e-way bill compliance and secure photographic delivery proofs.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center mb-4">
              <Link
                to="/"
                className="inline-flex items-center cursor-pointer bg-white rounded-xl px-3 py-1.5"
                aria-label="Go to Home"
              >
                <img
                  src="/logo.png"
                  alt="AARVIX TRANSPORT"
                  className="h-16 w-auto object-contain"
                />
              </Link>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed max-w-sm">
              India&apos;s modern road logistics infrastructure platform. Connecting high-growth
              enterprises, SMEs, and manufacturing hubs with verified fleet owners and skilled
              heavy-haul drivers across 500+ commercial corridors.
            </p>

            <div className="space-y-2 pt-2 text-xs text-neutral-300">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold-400" />
                <span>{BRAND.supportPhone} (24x7 Control Room)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold-400" />
                <span>{BRAND.supportEmail}</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-gold-400 shrink-0 mt-0.5" />
                <span>{BRAND.corporateAddress}</span>
              </div>
            </div>
          </div>

          {/* Logistics Services */}
          <div>
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li><Link to="/services" className="hover:text-white transition-colors">Full Truck Load (FTL)</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Part Truck Load (PTL)</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Inter-City Container Freight</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Dedicated Enterprise Fleet</Link></li>
              <li><Link to="/services" className="hover:text-white transition-colors">Over-Dimensional Cargo (ODC)</Link></li>
              <li><Link to="/fare-calculator" className="hover:text-white transition-colors">Live Rate Estimator</Link></li>
            </ul>
          </div>

          {/* Fleets & Drivers */}
          <div>
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-4">
              Fleet & Partners
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li><Link to="/vehicles" className="hover:text-white transition-colors">Fleet Specs & Tonnage</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">For Fleet Owners / Transporters</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">For Commercial Drivers</Link></li>
              <li><Link to="/register" className="hover:text-white transition-colors">Onboard Vehicles</Link></li>
              <li><Link to="/faqs" className="hover:text-white transition-colors">Transporter FAQs</Link></li>
            </ul>
          </div>

          {/* Company & Compliance */}
          <div>
            <h4 className="text-xs font-bold text-gold-400 uppercase tracking-widest mb-4">
              Legal & Support
            </h4>
            <ul className="space-y-2.5 text-xs text-neutral-300">
              <li><Link to="/about" className="hover:text-white transition-colors">About AARVIX</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Hubs</Link></li>
              <li><Link to="/support" className="hover:text-white transition-colors">Help Center & Grievances</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/cancellation-refund" className="hover:text-white transition-colors">Cancellation & Refunds</Link></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Legal bar */}
      <div className="border-t border-forest-900 bg-forest-950 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-400 gap-3">
          <p>
            &copy; 2026 AARVIX TRANSPORT. All rights reserved. Registered Indian Goods Transport Agency (GTA).
          </p>
          <div className="flex items-center gap-4">
            <span className="text-[11px] text-neutral-400">
              GST Reverse Charge (GTA) Compliant
            </span>
            <span className="text-gold-400 font-medium text-xs">
              RC & Permit Verified Transport Network
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};