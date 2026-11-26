import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  PackageCheck,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  FileText,
  BadgePercent,
  LifeBuoy,
  ArrowRight,
  Truck,
  Wallet,
  Navigation,
  ClipboardCheck,
} from 'lucide-react';

import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';

type Role = 'shippers' | 'transporters' | 'drivers';

const workflowData = {
  shippers: {
    label: 'For Shippers & Businesses',
    heading: 'Move Your Cargo With Confidence',
    description:
      'A simple, transparent freight booking experience from quotation to final delivery.',
    steps: [
      {
        title: 'Create Your Shipment',
        desc: 'Enter pickup and delivery locations, cargo weight, shipment details and preferred vehicle type.',
        icon: <PackageCheck className="w-6 h-6" />,
        tag: 'Booking',
      },
      {
        title: 'Get Transparent Pricing',
        desc: 'Review your freight quotation with a clear breakdown of transportation charges, tolls and applicable taxes.',
        icon: <BadgePercent className="w-6 h-6" />,
        tag: 'Quotation',
      },
      {
        title: 'Vehicle Assignment',
        desc: 'A suitable vehicle and verified driver are assigned based on your shipment requirements.',
        icon: <Truck className="w-6 h-6" />,
        tag: 'Dispatch',
      },
      {
        title: 'Track & Confirm Delivery',
        desc: 'Monitor shipment progress and confirm successful delivery through OTP and digital proof of delivery.',
        icon: <ClipboardCheck className="w-6 h-6" />,
        tag: 'Delivery',
      },
    ],
    ctaTitle: 'Ready to Move Your Shipment?',
    ctaDesc: 'Get started with a freight quotation for your business.',
    buttonText: 'Calculate Freight Rate',
    buttonLink: '/fare-calculator',
    secondaryText: 'Create Business Account',
    secondaryLink: '/register?role=customer',
  },

  transporters: {
    label: 'For Fleet Owners & Transporters',
    heading: 'Turn Your Fleet Into Opportunities',
    description:
      'Connect your vehicles with business freight requirements through a structured fleet network.',
    steps: [
      {
        title: 'Register Your Fleet',
        desc: 'Create your transporter account and submit vehicle details, ownership information and fleet documents.',
        icon: <Building2 className="w-6 h-6" />,
        tag: 'Registration',
      },
      {
        title: 'Complete Verification',
        desc: 'Submit RC, fitness certificate, national permits and insurance documents for compliance review.',
        icon: <ShieldCheck className="w-6 h-6" />,
        tag: 'Verification',
      },
      {
        title: 'Receive Freight Requests',
        desc: 'Get relevant shipment opportunities based on vehicle category, availability and route requirements.',
        icon: <Navigation className="w-6 h-6" />,
        tag: 'Assignments',
      },
      {
        title: 'Complete Trips & Payments',
        desc: 'Finish assigned deliveries, submit digital delivery confirmation and proceed with settlement processing.',
        icon: <Wallet className="w-6 h-6" />,
        tag: 'Settlement',
      },
    ],
    ctaTitle: 'Grow Your Transport Business',
    ctaDesc: 'Register your fleet and explore freight opportunities with AARVIX.',
    buttonText: 'Register Your Fleet',
    buttonLink: '/register?role=transporter',
    secondaryText: 'Contact Our Team',
    secondaryLink: '/contact',
  },

  drivers: {
    label: 'For Commercial Drivers',
    heading: 'Every Journey Starts With Trust',
    description:
      'A structured journey for commercial drivers with verified assignments and operational support.',
    steps: [
      {
        title: 'Complete Driver Registration',
        desc: 'Submit your personal details, valid commercial driving licence and required identity documents.',
        icon: <Users className="w-6 h-6" />,
        tag: 'Registration',
      },
      {
        title: 'Verify Your Credentials',
        desc: 'Complete the required driver identity and licence verification process.',
        icon: <ShieldCheck className="w-6 h-6" />,
        tag: 'KYC',
      },
      {
        title: 'Receive Trip Details',
        desc: 'Review assigned trips, pickup points, delivery locations and important shipment instructions.',
        icon: <MapPin className="w-6 h-6" />,
        tag: 'Trip Assignment',
      },
      {
        title: 'Complete Delivery Safely',
        desc: 'Follow delivery instructions, confirm consignee handover and access available operational assistance.',
        icon: <LifeBuoy className="w-6 h-6" />,
        tag: 'Trip Completion',
      },
    ],
    ctaTitle: 'Ready to Join the AARVIX Network?',
    ctaDesc: 'Register as a commercial driver and begin your onboarding journey.',
    buttonText: 'Register as Driver',
    buttonLink: '/register?role=driver',
    secondaryText: 'Get Support',
    secondaryLink: '/contact',
  },
};

/* One calm page-wide backdrop. Change image / overlay here. */
const PAGE_BG_IMAGE = '/images/hero-highway-truck.jpg';
const PAGE_BG_OVERLAY = 0.9; // 0.8 = image more visible, 0.95 = almost plain

export const HowItWorksPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Role>('shippers');

  const activeWorkflow = workflowData[activeTab];

  const tabs = [
    {
      id: 'shippers' as Role,
      label: 'Businesses',
      icon: <PackageCheck className="w-5 h-5" />,
    },
    {
      id: 'transporters' as Role,
      label: 'Fleet Owners',
      icon: <Building2 className="w-5 h-5" />,
    },
    {
      id: 'drivers' as Role,
      label: 'Drivers',
      icon: <Users className="w-5 h-5" />,
    },
  ];

  return (
    <main className="relative isolate w-full bg-transparent">

      {/* PAGE BACKDROP (stays inside <main> only, so footer is never covered) */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url(${PAGE_BG_IMAGE})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg,
              rgba(243, 248, 228, ${PAGE_BG_OVERLAY}) 0%,
              rgba(236, 244, 214, ${PAGE_BG_OVERLAY}) 50%,
              rgba(243, 248, 228, ${PAGE_BG_OVERLAY}) 100%)`,
          }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-transparent py-16 sm:py-20 lg:py-24">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-gold-400/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10 text-center">
          <Badge variant="gold">HOW AARVIX WORKS</Badge>

          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-forest-950 leading-tight">
            Freight Movement,
            <br />
            <span className="text-gold-500">Made Simple.</span>
          </h1>

          <p className="mt-6 max-w-2xl mx-auto text-base sm:text-lg text-neutral-600 leading-relaxed">
            From the first booking request to successful delivery,
            discover how AARVIX connects businesses, fleet owners
            and commercial drivers through one coordinated platform.
          </p>

          <div className="flex flex-wrap justify-center gap-3 mt-9">
            <div className="inline-flex items-center gap-2 rounded-full bg-forest-50 px-4 py-2 text-sm font-semibold text-forest-900">
              <ShieldCheck className="w-4 h-4" />
              Verified Network
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-gold-50 px-4 py-2 text-sm font-semibold text-gold-700">
              <BadgePercent className="w-4 h-4" />
              Transparent Pricing
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-forest-50 px-4 py-2 text-sm font-semibold text-forest-900">
              <FileText className="w-4 h-4" />
              Digital Documentation
            </div>
          </div>
        </div>
      </section>

      {/* ROLE SELECTOR */}
      <section className="pb-10">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-7">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold-600">
              Choose Your Journey
            </p>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 mt-2">
              How Would You Like to Get Started?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-warm-50 border border-warm-200 rounded-2xl p-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center justify-center gap-3 px-5 py-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-forest-900 text-white shadow-lg'
                    : 'bg-transparent text-neutral-600 hover:bg-white hover:text-forest-900'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && (
                  <CheckCircle2 className="w-4 h-4 text-gold-400" />
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="py-12 sm:py-16 bg-transparent">
        <div className="max-w-6xl mx-auto px-6 lg:px-10">

          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="gold">{activeWorkflow.label}</Badge>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-forest-950 mt-5">
              {activeWorkflow.heading}
            </h2>

            <p className="text-sm sm:text-base text-neutral-600 mt-4 leading-relaxed">
              {activeWorkflow.description}
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">

            {/* Timeline connector */}
            <div className="absolute left-7 sm:left-10 top-10 bottom-10 w-0.5 bg-gradient-to-b from-gold-400 via-forest-300 to-gold-400" />

            <div className="space-y-6">
              {activeWorkflow.steps.map((step, index) => (
                <div
                  key={step.title}
                  className="relative flex gap-5 sm:gap-8 items-start"
                >

                  {/* Step number */}
                  <div className="relative z-10 shrink-0 w-14 h-14 sm:w-20 sm:h-20 rounded-2xl bg-forest-900 text-white flex flex-col items-center justify-center shadow-lg border-4 border-warm-50">
                    <span className="text-[10px] text-gold-400 font-bold tracking-wider">
                      STEP
                    </span>
                    <span className="text-xl sm:text-2xl font-black">
                      0{index + 1}
                    </span>
                  </div>

                  {/* Step content */}
                  <div className="flex-1 bg-white rounded-2xl border border-warm-200 p-5 sm:p-7 shadow-sm hover:shadow-lg hover:border-gold-300 transition-all duration-300">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-forest-50 text-forest-800">
                          {step.icon}
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-forest-950">
                          {step.title}
                        </h3>
                      </div>

                      <span className="w-fit text-[11px] font-bold uppercase tracking-wider text-gold-700 bg-gold-50 border border-gold-200 rounded-full px-3 py-1">
                        {step.tag}
                      </span>
                    </div>

                    <p className="text-sm text-neutral-600 leading-relaxed sm:pl-14">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Process completion note */}
          <div className="max-w-4xl mx-auto mt-10 rounded-xl border border-forest-200 bg-white p-5 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-forest-700 shrink-0" />
            <div>
              <h3 className="font-bold text-forest-950 text-sm">
                One Connected Logistics Experience
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 mt-1 leading-relaxed">
                Each stage is designed to improve coordination,
                documentation and visibility throughout the freight journey.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY AARVIX */}
      <section className="py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="gold">THE AARVIX ADVANTAGE</Badge>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-forest-950 mt-5">
              Built Around What Matters
            </h2>
            <p className="text-sm text-neutral-600 mt-4 leading-relaxed">
              A reliable freight experience depends on clear processes,
              verified participants and dependable support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <ShieldCheck className="w-7 h-7" />,
                title: 'Verified Operations',
                desc: 'Structured checks for vehicles, documents and driver credentials.',
              },
              {
                icon: <Wallet className="w-7 h-7" />,
                title: 'Pricing Clarity',
                desc: 'Freight charges presented with clear quotation details.',
              },
              {
                icon: <Clock className="w-7 h-7" />,
                title: 'Operational Support',
                desc: 'Assistance for coordination, shipment updates and delivery issues.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="group rounded-2xl border border-warm-200 bg-white p-7 hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center mb-5 group-hover:bg-forest-900 group-hover:text-white transition-colors">
                  {item.icon}
                </div>
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

      {/* FINAL CTA */}
      <section className="py-16 sm:py-20 bg-transparent">
        <div className="max-w-5xl mx-auto px-6 lg:px-10">
          <div className="rounded-3xl border border-warm-200 bg-warm-50 p-8 sm:p-12 text-center shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-gold-400/10 text-gold-400 flex items-center justify-center mx-auto mb-6">
              <Truck className="w-7 h-7" />
            </div>

            <Badge variant="gold">GET STARTED WITH AARVIX</Badge>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-black mt-5">
              Your Next Shipment Starts Here.
            </h2>

            <p className="text-sm sm:text-base text-black font-semibold mt-4 max-w-2xl mx-auto leading-relaxed">
              Whether you are moving cargo, managing a fleet or driving commercially, take the next step with AARVIX Transport.
            </p>

            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link to={activeWorkflow.buttonLink}>
                <Button variant="primary" size="lg">
                  {activeWorkflow.buttonText}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <Link to={activeWorkflow.secondaryLink}>
                <Button variant="outline" size="lg">
                  {activeWorkflow.secondaryText}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};