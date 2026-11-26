import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Truck,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Calculator,
  CheckCircle2,
  PhoneCall,
  PackageCheck,
  Layers,
  Clock,
  FileText,
  AlertCircle,
  Building,
  Home,
  HardHat,
  ShoppingBag,
  Sparkles,
} from 'lucide-react';
import { MAJOR_HUBS, BRAND, GOODS_CATEGORIES_INFO, GoodsCategory } from '@aarvix/shared';
import { Button } from '../components/ui/Button.js';
import { Badge } from '../components/ui/Badge.js';

interface VehicleCategoryCard {
  id: string;
  name: string;
  category: string;
  capacityLabel: string;
  capacityType: 'verified' | 'range';
  image: string;
  fallbackImage: string;
  typicalUses: string[];
  vehicleId: string;
  baseFare: number;
}

const VEHICLE_CATEGORIES: VehicleCategoryCard[] = [
  {
    id: 'mini_truck',
    name: 'Mini Truck',
    category: 'Tata Ace / Compact Lorry',
    capacityLabel: '1.0 Tonne (850 kg payload)',
    capacityType: 'verified',
    image: '/images/mini.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80',
    typicalUses: ['City express deliveries', 'FMCG retail replenishment', 'Boxes & appliances'],
    vehicleId: 'tata_ace',
    baseFare: 450,
  },
  {
    id: 'pickup',
    name: 'Pickup Truck',
    category: 'Mahindra Bolero / Open Cargo',
    capacityLabel: '1.5 Tonne (1,300 kg payload)',
    capacityType: 'verified',
    image: '/images/pickup-truck.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1559297434-fae8a1916a79?auto=format&fit=crop&w=800&q=80',
    typicalUses: ['Agri-produce', 'Plywood & fittings', 'Suburban wholesale distribution'],
    vehicleId: 'bolero_maxi',
    baseFare: 650,
  },
  {
    id: 'scv',
    name: 'Small Commercial Vehicle',
    category: 'Tata 407 / Light Commercial (LCV)',
    capacityLabel: '2.5 Tonne (2,500 kg payload)',
    capacityType: 'verified',
    image: '/images/small-commercial.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=800&q=80',
    typicalUses: ['Industrial hardware', 'Electrical cables', 'Mid-scale regional dispatch'],
    vehicleId: 'tata_407',
    baseFare: 1100,
  },
  {
    id: 'truck_14ft',
    name: '14-Foot Truck',
    category: 'Eicher Pro Closed Container',
    capacityLabel: '4.0 Tonne (4,000 kg payload)',
    capacityType: 'verified',
    image: '/images/14-foot.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80',
    typicalUses: ['E-commerce hub transfers', 'Packaged FMCG', 'Consumer durables'],
    vehicleId: 'eicher_14ft',
    baseFare: 1800,
  },
  {
    id: 'truck_17ft',
    name: '17-Foot Truck',
    category: 'Eicher Pro High-Side Platform',
    capacityLabel: '6.0 Tonne (6,000 kg payload)',
    capacityType: 'verified',
    image: '/images/17-foot.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=800&q=80',
    typicalUses: ['Auto components', 'Sheet metal & fabrication', 'Palletized industrial goods'],
    vehicleId: 'eicher_17ft',
    baseFare: 2600,
  },
  {
    id: 'heavy_truck',
    name: 'Heavy Truck',
    category: 'Multi-Axle & Container Haulers',
    capacityLabel: '8.0 – 28.0 Tonnes (Illustrative Range)',
    capacityType: 'range',
    image: '/images/heavy-truck.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1591768793355-74d04bb6608f?auto=format&fit=crop&w=800&q=80',
    typicalUses: ['Full truckload (FTL)', 'Heavy machinery & steel', 'Interstate container freight'],
    vehicleId: 'tata_22ft',
    baseFare: 4800,
  },
];

const SERVICES_DATA = [
  {
    id: 'household',
    title: 'Household Shifting',
    desc: 'Safe residential and apartment relocation with closed container trucks and careful cargo handling.',
    image: '/images/household.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=800&q=80',
    icon: Home,
    badge: 'Residential & Relocation',
  },
  {
    id: 'business',
    title: 'Business Deliveries',
    desc: 'Scheduled warehouse-to-store, distributor replenishment, and recurring B2B corridor deliveries.',
    image: '/images/business.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    icon: Building,
    badge: 'B2B & Distribution',
  },
  {
    id: 'construction',
    title: 'Construction Materials',
    desc: 'Heavy-payload transport for cement bags, structural steel, plumbing pipes, bricks, and site supplies.',
    image: '/images/service-construction.jpg',
    fallbackImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=800&q=80',
    icon: HardHat,
    badge: 'Industrial & Building',
  },
  {
    id: 'commercial',
    title: 'Commercial Goods',
    desc: 'Full and part truckloads for packaged retail goods, textiles, machinery assemblies, and dry FMCG.',
    image: '/images/commercialgoods.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=800&q=80',
    icon: ShoppingBag,
    badge: 'Commercial Freight',
  },
  {
    id: 'fleet',
    title: 'Fleet Transport',
    desc: 'Dedicated enterprise fleet deployment with contracted multi-axle lorries and dedicated dispatch.',
    image: '/images/fleettransport.jpeg',
    fallbackImage: 'https://images.unsplash.com/photo-1616401784845-180882ba9ba8?auto=format&fit=crop&w=800&q=80',
    icon: Layers,
    badge: 'Enterprise Fleet',
  },
];

/* One calm page-wide backdrop. Change image / overlay here. */
const PAGE_BG_IMAGE = '/images/hero-highway-truck.jpg';
const PAGE_BG_OVERLAY = 0.9; // 0.8 = image more visible, 0.95 = almost plain

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // Quick booking panel state
  const [pickupCity, setPickupCity] = useState('Bengaluru');
  const [deliveryCity, setDeliveryCity] = useState('Chennai');
  const [goodsCategory, setGoodsCategory] = useState<GoodsCategory>('fmcg_packaged');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleEstimateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pickupCity === deliveryCity) {
      setValidationError('Pickup and delivery locations must be different freight hubs.');
      return;
    }
    setValidationError(null);
    navigate(
      `/book?from=${encodeURIComponent(pickupCity)}&to=${encodeURIComponent(deliveryCity)}&goods=${encodeURIComponent(goodsCategory)}`
    );
  };

  return (
    <div className="relative isolate w-full">

      {/* PAGE BACKDROP (stays inside this page only, does not affect layout/alignment) */}
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

      <div className="flex flex-col space-y-16 md:space-y-24 pb-16">

      {/* 2. HERO SECTION */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center bg-[#1A2418] text-white overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1800&q=85"
            alt="Logistics truck on highway"
            className="w-full h-full object-cover object-center brightness-[0.45]"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>

        
            

        {/* Hero Content */}
        <div className="relative z-30 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24 w-full">
          <div className="max-w-2xl space-y-6">

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900/90 border border-gold-400/40 text-gold-300 text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4 text-gold-400" />
              <span>Pan-India Commercial Freight Network</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              Reliable Transport. <br />
              <span className="text-gold-400">Simplified.</span>
            </h1>

            <p className="text-base sm:text-lg text-white leading-relaxed max-w-xl drop-shadow-md">
              Book verified commercial lorries, from city mini-trucks to 28-tonne trailers, with
              transparent spot freight tariffs and confirmed loading windows across India.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a href="#quick-booking">
                <Button
                  variant="secondary"
                  size="lg"
                  rightIcon={<ArrowRight className="w-4 h-4 text-neutral-900" />}
                >
                  Book a Truck
                </Button>
              </a>

              <Link to="/vehicles">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/40 text-white hover:bg-white/10 hover:border-white"
                  leftIcon={<Truck className="w-4 h-4 text-gold-400" />}
                >
                  Explore Vehicles
                </Button>
              </Link>
            </div>

            {/* Verified Highlights */}
            <div className="pt-6 border-t border-white/15 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-400">Fleet Coverage</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">Mini to 28T</div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-400">Compliance</div>
                <div className="text-base sm:text-lg font-bold text-gold-400 mt-0.5">100% RC Audited</div>
              </div>

              <div>
                <div className="text-xs uppercase tracking-wider text-neutral-400">Handover Proof</div>
                <div className="text-base sm:text-lg font-bold text-white mt-0.5">Digital POD</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. QUICK BOOKING PANEL */}
      <section id="quick-booking" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 lg:-mt-16 relative z-20 w-full">
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-elevated border border-warm-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-6 border-b border-warm-200 mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="p-2 bg-forest-50 text-forest-800 rounded-lg">
                  <Calculator className="w-5 h-5 text-forest-800" />
                </span>
                <h2 className="text-xl font-bold text-forest-950">Quick Booking & Fare Estimator</h2>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                Enter your consignment route and cargo type to receive a transparent freight estimate.
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-forest-50 text-forest-800 text-xs font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Live Highway Tariffs
            </div>
          </div>

          <form onSubmit={handleEstimateSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Pickup location */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Pickup Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-forest-700 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={pickupCity}
                    onChange={(e) => {
                      setPickupCity(e.target.value);
                      setValidationError(null);
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-warm-50 border border-warm-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 font-medium cursor-pointer"
                  >
                    {MAJOR_HUBS.map((hub) => (
                      <option key={hub.city} value={hub.city}>
                        {hub.city}, {hub.state} ({hub.hubCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Delivery location */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Delivery Location
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-gold-600 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={deliveryCity}
                    onChange={(e) => {
                      setDeliveryCity(e.target.value);
                      setValidationError(null);
                    }}
                    className="w-full pl-10 pr-4 py-3 bg-warm-50 border border-warm-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 font-medium cursor-pointer"
                  >
                    {MAJOR_HUBS.map((hub) => (
                      <option key={hub.city} value={hub.city}>
                        {hub.city}, {hub.state} ({hub.hubCode})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Goods type */}
              <div>
                <label className="block text-xs font-bold text-neutral-700 uppercase tracking-wider mb-2">
                  Goods Type
                </label>
                <div className="relative">
                  <Truck className="w-4 h-4 text-forest-700 absolute left-3.5 top-3.5 pointer-events-none" />
                  <select
                    value={goodsCategory}
                    onChange={(e) => setGoodsCategory(e.target.value as GoodsCategory)}
                    className="w-full pl-10 pr-4 py-3 bg-warm-50 border border-warm-300 rounded-xl text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-forest-600 font-medium cursor-pointer"
                  >
                    {Object.entries(GOODS_CATEGORIES_INFO).map(([key, info]) => (
                      <option key={key} value={key}>
                        {info.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Validation warning if applicable */}
            {validationError && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-lg text-xs font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
              <p className="text-xs text-neutral-500">
                Itemized estimates include base freight, distance tariff, and NHAI toll estimates.
              </p>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full sm:w-auto px-8"
                rightIcon={<ArrowRight className="w-4 h-4 text-gold-400" />}
              >
                Get Fare Estimate
              </Button>
            </div>
          </form>
        </div>
      </section>

      {/* 4. TRUST HIGHLIGHTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-card hover:border-forest-600 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center mb-4 group-hover:bg-forest-800 group-hover:text-gold-400 transition-colors">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-forest-950 mb-1.5">Verified Transport Partners</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Every transport vehicle and commercial driver undergoes rigorous RC, fitness, and national permit verification.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-card hover:border-forest-600 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center mb-4 group-hover:bg-gold-500 group-hover:text-forest-950 transition-colors">
              <Calculator className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-forest-950 mb-1.5">Transparent Pricing</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Clear itemized tariffs with no hidden surge fees, transparent highway toll estimates, and GST compliance.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-card hover:border-forest-600 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center mb-4 group-hover:bg-forest-800 group-hover:text-gold-400 transition-colors">
              <Clock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-forest-950 mb-1.5">Trip Updates</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Stay informed with milestone status alerts from warehouse dock loading to highway transit and arrival.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-warm-200 shadow-card hover:border-forest-600 transition-all group">
            <div className="w-12 h-12 rounded-xl bg-gold-50 text-gold-700 flex items-center justify-center mb-4 group-hover:bg-gold-500 group-hover:text-forest-950 transition-colors">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-forest-950 mb-1.5">Delivery Confirmation</h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Secure consignee OTP verification paired with instant digital proof-of-delivery (POD) documentation.
            </p>
          </div>
        </div>
      </section>

      {/* 5. VEHICLE CATEGORIES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <Badge variant="gold" className="mb-2">
              Verified Vehicle Fleet
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950">
              Commercial Vehicle Categories
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              Select the appropriate commercial vehicle tailored to your cargo dimensions and payload requirements.
            </p>
          </div>
          <Link
            to="/vehicles"
            className="mt-4 md:mt-0 text-sm font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1 group"
          >
            <span>View All Specifications</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VEHICLE_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className="bg-white rounded-2xl border border-warm-200 overflow-hidden shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Truck photograph */}
                <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={cat.image}
                    alt={`${cat.name} commercial lorry for goods transport`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = cat.fallbackImage;
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm ${
                        cat.capacityType === 'verified'
                          ? 'bg-forest-800 text-white'
                          : 'bg-gold-500 text-forest-950'
                      }`}
                    >
                      {cat.capacityType === 'verified' ? 'Verified Spec' : 'Illustrative Range'}
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-5">
                  <div className="text-xs font-semibold text-forest-700 uppercase tracking-wider mb-1">
                    {cat.category}
                  </div>
                  <h3 className="font-bold text-lg text-neutral-900">{cat.name}</h3>

                  <div className="mt-2.5 py-2 px-3 bg-warm-50 rounded-lg border border-warm-200/80">
                    <span className="text-[11px] text-neutral-500 block uppercase tracking-wide">Capacity</span>
                    <span className="text-xs font-bold text-forest-900">{cat.capacityLabel}</span>
                  </div>

                  <div className="mt-3.5 space-y-1.5">
                    <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide block">
                      Typical Uses
                    </span>
                    <ul className="text-xs text-neutral-700 space-y-1">
                      {cat.typicalUses.map((use, idx) => (
                        <li key={idx} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                          <span>{use}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Card action footer */}
              <div className="p-5 pt-0 border-t border-warm-100 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] text-neutral-400 block uppercase">Base Freight</span>
                  <span className="font-extrabold text-forest-800 text-sm">
                    ₹{cat.baseFare.toLocaleString()}
                  </span>
                </div>
                <Link to={`/book?vehicle=${cat.vehicleId}`}>
                  <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Book This Lorry
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section className="bg-warm-100 py-16 px-4 sm:px-6 lg:px-8 border-y border-warm-200">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <Badge variant="gold" className="mb-2">
              Simple 4-Step Process
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950">
              How AARVIX Transport Operates
            </h2>
            <p className="text-sm text-neutral-600 mt-2">
              A transparent, streamlined workflow designed for reliable freight dispatch.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Select Route & Truck',
                desc: 'Enter your pickup and delivery hubs, cargo category, and choose an eligible commercial vehicle.',
                icon: MapPin,
              },
              {
                step: '02',
                title: 'Instant Fair Quotation',
                desc: 'Receive transparent pricing with distance calculations, toll charges, and GST details.',
                icon: Calculator,
              },
              {
                step: '03',
                title: 'Verified Partner Match',
                desc: 'Consignment allocated to an audited transport fleet and background-verified commercial driver.',
                icon: ShieldCheck,
              },
              {
                step: '04',
                title: 'OTP Handover & Digital POD',
                desc: 'Safe delivery confirmed via consignee OTP with immediate photographic digital proof of delivery.',
                icon: PackageCheck,
              },
            ].map((item) => (
              <div
                key={item.step}
                className="bg-white p-6 rounded-2xl border border-warm-200 shadow-subtle hover:border-forest-600 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-gold-500 font-mono tracking-tight">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center">
                      <item.icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-base text-forest-950 mb-2">{item.title}</h3>
                  <p className="text-xs text-neutral-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <Badge variant="forest" className="mb-2">
              Tailored Logistics
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950">
              Specialized Freight Services
            </h2>
            <p className="text-sm text-neutral-600 mt-1 max-w-xl">
              Comprehensive road transportation services structured for diverse commercial and residential needs.
            </p>
          </div>
          <Link
            to="/services"
            className="mt-4 md:mt-0 text-sm font-bold text-forest-800 hover:text-forest-950 flex items-center gap-1 group"
          >
            <span>Explore All Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES_DATA.map((srv) => (
            <div
              key={srv.id}
              className="bg-white rounded-2xl border border-warm-200 overflow-hidden shadow-card hover:shadow-elevated transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-44 w-full overflow-hidden bg-neutral-100">
                  <img
                    src={srv.image}
                    alt={`${srv.title} transportation service`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = srv.fallbackImage;
                    }}
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-forest-950/80 text-white backdrop-blur-xs">
                      {srv.badge}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-md bg-forest-50 text-forest-800">
                      <srv.icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-base text-forest-950">{srv.title}</h3>
                  </div>
                  <p className="text-xs text-neutral-600 leading-relaxed">{srv.desc}</p>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link to="/services">
                  <Button variant="outline" size="sm" className="w-full" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. WHY CHOOSE US */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="bg-forest-950 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden border border-forest-800">
          <div className="max-w-2xl mb-10">
            <Badge variant="gold" className="mb-2">
              Why AARVIX
            </Badge>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Built on Trust and Compliance
            </h2>
            <p className="text-sm text-neutral-300 mt-2">
              Focused on clear operations and vetted transport partners across Indian corridors.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-forest-900/70 p-6 rounded-2xl border border-forest-800">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1.5">Audited Vehicles Only</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Active commercial registration (RC), vehicle fitness, and national permits checked before every load.
              </p>
            </div>

            <div className="bg-forest-900/70 p-6 rounded-2xl border border-forest-800">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center mb-3">
                <Calculator className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1.5">Zero Hidden Charges</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Transparent spot rates based on official highway tariffs, with clear toll and GST classification.
              </p>
            </div>

            <div className="bg-forest-900/70 p-6 rounded-2xl border border-forest-800">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center mb-3">
                <Clock className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1.5">Milestone Tracking</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Clear dispatch milestones so you always know when your cargo is loaded, in transit, and delivered.
              </p>
            </div>

            <div className="bg-forest-900/70 p-6 rounded-2xl border border-forest-800">
              <div className="w-10 h-10 rounded-xl bg-forest-800 text-gold-400 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-sm text-white mb-1.5">Digital Documentation</h4>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Electronic consignment notes, consignee OTP verification, and instant photographic proof of delivery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="relative rounded-3xl overflow-hidden bg-forest-900 text-white border border-forest-700 shadow-elevated">
          {/* Subtle truck photograph watermark */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/truck-14ft.jpg"
              alt="Cargo transport lorry background"
              className="w-full h-full object-cover object-center filter brightness-[0.25] contrast-125"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  'https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-950 via-forest-950/90 to-forest-900/80" />
          </div>

          <div className="relative z-10 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
            <div className="max-w-xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 border border-gold-400/30 text-gold-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                Verified Lorry Dispatch
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Ready to Dispatch Your Consignment?
              </h2>
              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Connect your business to verified commercial trucks with transparent highway tariffs
                and guaranteed loading windows.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto shrink-0">
              <Link to="/book" className="w-full sm:w-auto">
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                  rightIcon={<ArrowRight className="w-4 h-4 text-forest-950" />}
                >
                  Book a Truck Now
                </Button>
              </Link>
              <a href={`tel:${BRAND.supportPhone.replace(/[^0-9+]/g, '')}`} className="w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                  leftIcon={<PhoneCall className="w-4 h-4 text-gold-400" />}
                >
                  Call Dispatch
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      </div>
    </div>
  );
};

export default HomePage;