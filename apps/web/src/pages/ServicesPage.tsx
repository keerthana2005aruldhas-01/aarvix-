import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { PageBackdrop } from '../components/ui/PageBackdrop.js';
import {
  Truck,
  Box,
  Layers,
  ThermometerSnowflake,
  ShieldAlert,
  Repeat,
  CheckCircle2,
  ArrowRight,
  Calculator,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';

export const ServicesPage: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      id: 'ftl',
      title: 'Full Truck Load (FTL) Freight',
      badge: 'High Capacity',
      icon: Truck,
      image: '/images/fullloadtruck.jpeg',
      description:
        'Dedicated point-to-point lorry booking for full industrial consignments. Zero transshipment, direct route transit, and exclusive vehicle sealing.',
      capabilities: [
        'Dedicated vehicle assigned exclusively to your cargo',
        'Direct non-stop transit between loading dock and destination',
        'Payload coverage from 1 Tonne up to 35 Tonnes',
        'GPS telematics tracking with scheduled loading appointments',
      ],
      popularFor: 'Industrial manufacturing, FMCG primary distribution, steel & bulk commodities.',
    },
    {
      id: 'ptl',
      title: 'Part Truck Load (PTL) Express',
      badge: 'Cost Efficient',
      icon: Box,
      description:
        'Consolidated freight transport for consignments between 200 kg and 3,000 kg. Pay only for the space and tonnage your cargo occupies.',
      capabilities: [
        'Hub-and-spoke scheduled network across 500+ commercial lanes',
        'Volumetric and gross weight transparent tariffs',
        'Automated barcode piece-level tracking',
        'Palletized cargo handling to prevent transit friction',
      ],
      popularFor: 'SME wholesale dispatches, e-commerce stock transfers, retail merchandise.',
    },
    {
      id: 'container',
      title: 'Inter-City Container Logistics',
      badge: 'Weatherproof',
      icon: Layers,
      description:
        '32ft and 24ft closed high-cube containers engineered for maximum volumetric capacity and high-value cargo security with tamper-evident digital seals.',
      capabilities: [
        'Corrugated high-tensile steel container bodies',
        'Zero rainwater leakage guarantee for sensitive merchandise',
        'High-cube volumetric capacity up to 3,400 cu ft',
        'Strict seal-recording protocol at origin and receiving bay',
      ],
      popularFor: 'Consumer electronics, high-fashion garments, pharmaceuticals, packaged food.',
    },
    {
      id: 'dedicated',
      title: 'Dedicated Contract Fleets',
      badge: 'Enterprise SLA',
      icon: Repeat,
      description:
        'Custom fleet deployment dedicated to your enterprise supply chain with guaranteed uptime, customized body fabrication, and assigned driver rosters.',
      capabilities: [
        'Monthly & annual dedicated truck retention contracts',
        'Customized corporate branding / vehicle vinyl wrapping',
        'On-site logistics coordinator at your fulfillment centers',
        'Guaranteed replacement vehicle within 3 hours during breakdown',
      ],
      popularFor: 'Modern retail distribution, daily FMCG milk-runs, 3PL logistics operations.',
    },
    {
      id: 'cold_chain',
      title: 'Cold Chain & Temperature Controlled',
      badge: 'Precision Ambient',
      icon: ThermometerSnowflake,
      description:
        'Reefer vehicles calibrated for temperature-sensitive cargo with continuous temperature data logging from -25°C to +25°C.',
      capabilities: [
        'Multi-temperature multi-compartment refrigerated trucks',
        'IoT temperature probes sending real-time thermal alerts',
        'Pre-cooling protocols verified prior to cargo loading',
        'Pharma and perishable food compliant carriage guidelines',
      ],
      popularFor: 'Dairy, vaccine distribution, fresh horticulture produce, frozen poultry.',
    },
    {
      id: 'odc',
      title: 'Over-Dimensional Cargo (ODC)',
      badge: 'Specialized',
      icon: ShieldAlert,
      description:
        'Turnkey heavy-haul project logistics for cargo exceeding standard truck dimensions, requiring hydraulic multi-axle trailers and route route-feasibility surveys.',
      capabilities: [
        'Low-bed and semi-low bed hydraulic pullers and multi-axle modular trailers',
        'Civil engineering route feasibility and overpass clearance surveys',
        'Dedicated pilot escort vehicles and highway police liaison',
        'Project cargo insurance and specialized heavy lashings',
      ],
      popularFor: 'Wind turbine blades, industrial boilers, heavy mining excavators, transformers.',
    },
  ];

  const scrollServices = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'right' ? 380 : -380,
        behavior: 'smooth',
      });
    }
  };

  return (
    <PageBackdrop>
      <div className="py-12 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge variant="forest">Comprehensive Transport Solutions</Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight">
            Pan-India Road Logistics Services
          </h1>

          <p className="text-base text-neutral-600 leading-relaxed">
            From single pallet express movement to 100-truck industrial contracts, AARVIX provides
            the physical fleet and verified compliance infrastructure required by modern businesses.
          </p>
        </div>

        {/* Services Heading and Scroll Buttons */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-forest-950">
              Our Services
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Explore our complete logistics solutions
            </p>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollServices('left')}
              aria-label="Scroll services left"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-forest-200 text-forest-800 hover:bg-forest-800 hover:text-white transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => scrollServices('right')}
              aria-label="Scroll services right"
              className="w-10 h-10 flex items-center justify-center rounded-full border border-forest-200 text-forest-800 hover:bg-forest-800 hover:text-white transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Services Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-6 scrollbar-hide"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {services.map((svc) => (
            <div
              key={svc.id}
              className="flex-shrink-0 w-[88%] sm:w-[65%] lg:w-[calc(33.333%-16px)] snap-start"
            >
              <Card
                variant="default"
                className="h-full min-h-[560px] flex flex-col justify-between hover:shadow-elevated hover:border-forest-700 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="p-3 bg-forest-50 text-forest-800 rounded-xl group-hover:bg-forest-800 group-hover:text-gold-400 transition-colors">
                      <svc.icon className="w-6 h-6" />
                    </span>

                    <Badge variant="gold">{svc.badge}</Badge>
                  </div>

                  <h3 className="text-xl font-bold text-forest-950 mb-3">
                    {svc.title}
                  </h3>

                  <p className="text-sm text-neutral-600 leading-relaxed mb-5">
                    {svc.description}
                  </p>

                  <div className="space-y-3 pt-4 border-t border-warm-200">
                    <h4 className="text-xs font-bold text-forest-900 uppercase tracking-wider">
                      Service Capabilities:
                    </h4>

                    <ul className="space-y-2 text-xs text-neutral-700">
                      {svc.capabilities.map((cap, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 mt-6 border-t border-warm-200 space-y-4">
                  <p className="text-xs text-neutral-500 italic leading-relaxed">
                    <span className="font-semibold text-forest-900 not-italic">
                      Popular for:
                    </span>{' '}
                    {svc.popularFor}
                  </p>

                  <Link
                    to={`/fare-calculator?service=${svc.id}`}
                    className="block"
                  >
                    <Button
                      variant="outline"
                      size="sm"
                      rightIcon={<ArrowRight className="w-4 h-4" />}
                    >
                      Check Rates
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="flex justify-center items-center gap-2 text-xs text-neutral-500">
          <ChevronLeft className="w-4 h-4" />
          <span>Scroll horizontally to explore all 6 services</span>
          <ChevronRight className="w-4 h-4" />
        </div>

        {/* SLA Commitment Banner */}
        <div className="bg-forest-900 rounded-2xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-forest-700">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Need an Enterprise Rate Contract?
            </h3>

            <p className="text-xs text-neutral-300 leading-relaxed">
              We provide contracted fixed freight tariffs across your high-volume manufacturing lanes
              with guaranteed vehicle placement windows and 30-day corporate billing credit.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link to="/contact">
              <Button variant="secondary" size="md">
                Request Corporate RFP
              </Button>
            </Link>

            <Link to="/fare-calculator">
              <Button
                variant="outline"
                size="md"
                className="border-white/30 text-white hover:bg-white/10"
              >
                <Calculator className="w-4 h-4 mr-1 text-gold-400" />
                Spot Estimator
              </Button>
            </Link>
          </div>
        </div>

      </div>
    </PageBackdrop>
  );
};