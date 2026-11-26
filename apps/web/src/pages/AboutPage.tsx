import React from 'react';
import { Link } from 'react-router-dom';
import { PageBackdrop } from '../components/ui/PageBackdrop.js';
import {
  Target,
  Award,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Truck,
  Clock,
  FileCheck,
  MapPin,
  ArrowRight,
  Globe2,
} from 'lucide-react';

import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';
import { BRAND } from '@aarvix/shared';

export const AboutPage: React.FC = () => {
  const principles = [
    {
      title: 'Spot Price Transparency',
      desc: 'Official tariff calculators prevent arbitrary rate manipulation and provide clear freight pricing.',
    },
    {
      title: 'Mandatory Driver KYC',
      desc: 'Commercial driving licences and required credentials are verified before vehicle assignment.',
    },
    {
      title: 'Photographic POD',
      desc: 'Geo-tagged, time-stamped proof of delivery supports transparent consignment completion.',
    },
    {
      title: '24x7 Control Tower',
      desc: 'Logistics coordinators assist with dispatch operations, breakdowns and delivery coordination.',
    },
  ];

  const values = [
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: 'Verified Fleet',
      desc: 'Vehicle documentation and compliance checks before dispatch.',
    },
    {
      icon: <Clock className="w-7 h-7" />,
      title: 'Reliable Operations',
      desc: 'Dedicated operational support for freight movement.',
    },
    {
      icon: <FileCheck className="w-7 h-7" />,
      title: 'Digital Documentation',
      desc: 'Digital consignment records and proof of delivery.',
    },
  ];

  return (
    <PageBackdrop>
      <div className="w-full bg-transparent">

        {/* 1. HERO BANNER - LEFT CONTENT / RIGHT LORRY */}
        <section className="relative bg-transparent overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 py-14 lg:py-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">

              {/* LEFT SIDE CONTENT */}
              <div className="space-y-6 order-2 lg:order-1">
                <Badge variant="gold">ABOUT AARVIX TRANSPORT</Badge>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-forest-950">
                  Connecting India
                  <br />
                  Through Reliable
                  <br />
                  <span className="text-gold-400">Logistics.</span>
                </h1>

                <p className="text-base sm:text-lg text-neutral-600 leading-relaxed max-w-xl">
                  Building a dependable road freight ecosystem through verified
                  fleet operations, transparent pricing and technology-driven
                  logistics coordination across India.
                </p>

                <div className="flex flex-wrap gap-4 pt-2">
                  <Link to="/contact">
                    <Button variant="primary" size="lg">
                      Connect With Us
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>

                  <Link to="/services">
                    <Button variant="outline" size="lg">
                      Explore Services
                    </Button>
                  </Link>
                </div>

                {/* TRUST POINTS */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-warm-200">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />
                    <span className="text-xs font-semibold text-forest-950">
                      Verified Fleet
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-gold-500 shrink-0" />
                    <span className="text-xs font-semibold text-forest-950">
                      Transparent Pricing
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-gold-500 shrink-0" />
                    <span className="text-xs font-semibold text-forest-950">
                      Reliable Support
                    </span>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE LORRY IMAGE */}
              <div className="relative order-1 lg:order-2">
                <div className="absolute -top-5 -right-5 w-32 h-32 bg-gold-400/15 rounded-full blur-2xl" />

                <div className="relative rounded-2xl overflow-hidden shadow-xl border border-warm-200">
                  <img
                    src="https://i.pinimg.com/1200x/71/06/11/71061128e694dea077547a21c80f622f.jpg"
                    alt="AARVIX logistics freight truck on highway"
                    className="w-full h-[300px] sm:h-[420px] lg:h-[500px] object-cover"
                  />
                </div>

                {/* IMAGE BOTTOM LABEL */}
                <div className="absolute bottom-5 left-5 right-5 sm:left-8 sm:right-8 bg-forest-950/90 backdrop-blur-sm rounded-xl p-4 text-white">
                  <div className="flex items-center gap-3">
                    <div className="bg-gold-400/20 p-3 rounded-lg">
                      <Truck className="w-7 h-7 text-gold-400" />
                    </div>
                    <div>
                      <p className="font-bold text-base">AARVIX Logistics</p>
                      <p className="text-xs text-neutral-300">
                        Reliable Freight. Trusted Delivery.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* 2. TRUSTED NETWORK */}
        <section className="py-12 sm:py-16 border-b border-warm-200">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-forest-950 max-w-md">
                  Built for businesses that depend on reliable transportation
                </h2>
                <div className="w-14 h-1 bg-gold-400 mt-4 rounded-full" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  'Manufacturing',
                  'Industrial Supply',
                  'Fleet Partners',
                  'Enterprise Freight',
                ].map((item) => (
                  <div
                    key={item}
                    className="bg-warm-50 border border-warm-200 rounded-xl p-4 text-center flex items-center justify-center min-h-[75px]"
                  >
                    <span className="text-xs sm:text-sm font-bold text-forest-900">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. WHO WE ARE */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

            <div className="bg-warm-50 p-7 sm:p-10 rounded-2xl">
              <Badge variant="gold">WHO WE ARE</Badge>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-950 mt-5 leading-tight">
                Providing Reliable and Transparent Freight Transportation
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed mt-5">
                AARVIX TRANSPORT is focused on modernizing India's highway road
                freight ecosystem. We connect consignors with verified fleet
                operators through structured logistics coordination.
              </p>

              <div className="space-y-4 mt-7">
                {[
                  'Verified vehicle and fleet documentation',
                  'Transparent freight pricing approach',
                  'Digital consignment and delivery records',
                  'Dedicated logistics coordination',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-neutral-800">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link to="/contact" className="inline-block mt-8">
                <Button variant="primary" size="md">
                  Know More <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=85"
                alt="Logistics warehouse and freight operations"
                loading="lazy"
                className="w-full h-[350px] sm:h-[470px] object-cover rounded-2xl shadow-xl"
              />

              <div className="absolute -bottom-5 -left-3 sm:-left-6 bg-white rounded-xl shadow-xl p-5 border border-warm-200">
                <div className="flex items-center gap-3">
                  <div className="bg-forest-50 p-3 rounded-lg">
                    <Truck className="w-7 h-7 text-forest-800" />
                  </div>
                  <div>
                    <p className="font-extrabold text-forest-950 text-lg">
                      AARVIX
                    </p>
                    <p className="text-xs text-neutral-500">
                      Transport Operations
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 4. PAN INDIA NETWORK */}
        <section className="py-16 sm:py-24 bg-white/40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 lg:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&w=1200&q=85"
                alt="Freight logistics and transportation network"
                loading="lazy"
                className="w-full h-[300px] sm:h-[400px] object-cover rounded-2xl"
              />
              <div className="absolute inset-0 rounded-2xl bg-forest-950/10" />
              <div className="absolute bottom-5 left-5 right-5 bg-forest-950/90 text-white p-5 rounded-xl">
                <div className="flex items-center gap-3">
                  <Globe2 className="w-8 h-8 text-gold-400" />
                  <div>
                    <p className="font-bold">Pan-India Freight Backbone</p>
                    <p className="text-xs text-neutral-300">
                      Connecting businesses through road logistics
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Badge variant="gold">OUR NETWORK</Badge>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-950 mt-5">
                We Connect Businesses Across India
              </h2>

              <p className="text-sm text-neutral-600 leading-relaxed mt-5">
                Our logistics operations are designed to support freight
                movement across India's major industrial and commercial
                corridors through verified fleet partners and dedicated
                operational coordination.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-white p-5 rounded-xl border border-warm-200">
                  <Truck className="w-6 h-6 text-forest-800 mb-3" />
                  <h3 className="text-2xl font-extrabold text-forest-950">
                    Pan-India
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Freight Network
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-warm-200">
                  <Clock className="w-6 h-6 text-gold-600 mb-3" />
                  <h3 className="text-2xl font-extrabold text-forest-950">
                    24x7
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Operations Support
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-warm-200">
                  <ShieldCheck className="w-6 h-6 text-forest-800 mb-3" />
                  <h3 className="text-2xl font-extrabold text-forest-950">
                    Verified
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Fleet Compliance
                  </p>
                </div>

                <div className="bg-white p-5 rounded-xl border border-warm-200">
                  <FileCheck className="w-6 h-6 text-gold-600 mb-3" />
                  <h3 className="text-2xl font-extrabold text-forest-950">
                    Digital
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    POD Documentation
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* 5. MISSION, VISION AND VALUES */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">

            <div className="text-center max-w-3xl mx-auto mb-12">
              <Badge variant="gold">OUR PURPOSE</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-950 mt-5">
                Driving Progress Through Better Logistics
              </h2>
              <p className="text-sm text-neutral-600 mt-4 leading-relaxed">
                Our approach is built around transparency, safety, operational
                reliability and respect for every participant in the freight
                transportation ecosystem.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">

              <div className="p-7 sm:p-8 border border-warm-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 rounded-xl bg-forest-50 text-forest-800 mb-5">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-forest-950 mb-3">
                  Our Mission
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Eliminate operational opacity, middlemen price inflation and
                  transit uncertainty by connecting verified consignors
                  directly with compliant fleet operators.
                </p>
              </div>

              <div className="p-7 sm:p-8 border border-warm-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 rounded-xl bg-gold-50 text-gold-700 mb-5">
                  <Compass className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-forest-950 mb-3">
                  National Vision
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Build a safer and more transparent highway transport grid in
                  India, enabling faster business operations while protecting
                  the dignity and safety of highway drivers.
                </p>
              </div>

              <div className="p-7 sm:p-8 border border-warm-200 rounded-2xl shadow-sm hover:shadow-lg transition-shadow">
                <div className="inline-flex p-4 rounded-xl bg-forest-50 text-forest-800 mb-5">
                  <Award className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-forest-950 mb-3">
                  Compliance Guarantee
                </h3>
                <p className="text-sm text-neutral-600 leading-relaxed">
                  Every dispatched vehicle is subject to required RC, National
                  Permit, Fitness and Insurance verification processes.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* 6. DARK OPERATING PRINCIPLES */}
        <section className="py-16 sm:py-24">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="relative overflow-hidden rounded-3xl bg-forest-950 text-white p-8 sm:p-12 lg:p-16">

              <div className="absolute top-0 right-0 w-80 h-80 bg-gold-400/10 rounded-full blur-3xl" />

              <div className="relative z-10">
                <Badge variant="gold">OPERATING PRINCIPLES</Badge>

                <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-5 max-w-3xl">
                  Built on Integrity,
                  <br />
                  Verified by Code
                </h2>

                <p className="text-sm sm:text-base text-neutral-300 mt-5 max-w-3xl leading-relaxed">
                  We reject unpredictable price hikes, hidden gate detention
                  fees and lost paper proof-of-delivery receipts. Our
                  operations focus on transparent processes and accountable
                  logistics coordination.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
                  {principles.map((item) => (
                    <div
                      key={item.title}
                      className="bg-forest-900/80 border border-forest-700 rounded-xl p-6"
                    >
                      <CheckCircle2 className="w-6 h-6 text-gold-400 mb-4" />
                      <h3 className="font-bold text-white text-base mb-3">
                        {item.title}
                      </h3>
                      <p className="text-xs text-neutral-300 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 7. OUR CORE VALUES */}
        <section className="py-16 sm:py-20 bg-white/40">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">

            <div className="text-center max-w-2xl mx-auto mb-12">
              <Badge variant="gold">WHAT WE STAND FOR</Badge>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-950 mt-5">
                The Values Behind Every Journey
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {values.map((item) => (
                <div
                  key={item.title}
                  className="bg-white p-8 rounded-2xl border border-warm-200 hover:shadow-lg transition-shadow"
                >
                  <div className="text-gold-600 mb-5">{item.icon}</div>
                  <h3 className="text-lg font-bold text-forest-950 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* 8. REGISTERED CORPORATE ENTITY */}
        <section className="py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-6 lg:px-10">
            <div className="bg-white border border-warm-200 rounded-2xl p-8 sm:p-10 shadow-sm flex flex-col md:flex-row items-center justify-between gap-7">

              <div className="max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-forest-50 p-3 rounded-xl">
                    <Building2Icon />
                  </div>
                  <Badge variant="gold">CORPORATE INFORMATION</Badge>
                </div>

                <h2 className="text-xl sm:text-2xl font-extrabold text-forest-950">
                  Registered Corporate Entity
                </h2>

                <p className="text-sm text-neutral-600 mt-3 leading-relaxed">
                  AARVIX TRANSPORT operates as a Goods Transport Agency (GTA)
                  under applicable Indian taxation and carriage laws.
                </p>

                <p className="text-xs text-neutral-500 mt-3">
                  HQ: {BRAND.corporateAddress}
                </p>

                <p className="text-xs text-neutral-500 mt-1">
                  Support: {BRAND.supportEmail}
                </p>
              </div>

              <Link to="/contact" className="shrink-0">
                <Button variant="primary" size="lg">
                  Connect With Our Leadership
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

            </div>
          </div>
        </section>

        {/* 9. FINAL CONTACT BANNER */}
        <section className="relative py-20 sm:py-28 mb-16 overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1800&q=85"
            alt="Freight trucks on the road"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
          />

          <div className="absolute inset-0 bg-forest-950/85" />

          <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
            <Badge variant="gold">LET'S MOVE FORWARD</Badge>

            <h2 className="text-3xl sm:text-5xl font-extrabold mt-5">
              Ready to Move Your Business Forward?
            </h2>

            <p className="text-sm sm:text-base text-neutral-200 mt-5 max-w-2xl mx-auto leading-relaxed">
              Connect with the AARVIX logistics team for freight enquiries,
              fleet coordination and transportation support.
            </p>

            <Link to="/contact" className="inline-block mt-8">
              <Button variant="primary" size="lg">
                Contact AARVIX Today
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </section>

      </div>
    </PageBackdrop>
  );
};

const Building2Icon: React.FC = () => (
  <MapPin className="w-6 h-6 text-forest-800" />
);