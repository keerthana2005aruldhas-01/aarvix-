import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Calculator,
  MapPin,
  Truck,
  Users,
  Info,
  Clock,
  ArrowRight,
  FileSpreadsheet,
} from 'lucide-react';
import {
  VEHICLE_CATALOG,
  MAJOR_HUBS,
  calculateApproxDistanceKm,
  calculateTransparentFare,
} from '@aarvix/shared';
import { Button } from '../components/ui/Button.js';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';

export const FareCalculatorPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const initialFrom = searchParams.get('from') || 'Bengaluru';
  const initialTo = searchParams.get('to') || 'Chennai';
  const initialVehicle = searchParams.get('vehicle') || VEHICLE_CATALOG[0].id;

  const [fromCity, setFromCity] = useState(initialFrom);
  const [toCity, setToCity] = useState(initialTo);
  const [selectedVehicleId, setSelectedVehicleId] = useState(initialVehicle);
  const [helpersCount, setHelpersCount] = useState<number>(0);
  const [customDistanceKm, setCustomDistanceKm] = useState<number | null>(null);

  // Compute origin and destination coordinates
  const fromHub = MAJOR_HUBS.find((h) => h.city === fromCity) || MAJOR_HUBS[0];
  const toHub = MAJOR_HUBS.find((h) => h.city === toCity) || MAJOR_HUBS[1];

  // Calculate distance
  const computedDistance = useMemo(() => {
    if (customDistanceKm !== null) return customDistanceKm;
    if (fromCity === toCity) return 25; // Intra-city local run
    return calculateApproxDistanceKm(fromHub.lat, fromHub.lng, toHub.lat, toHub.lng);
  }, [fromHub, toHub, fromCity, toCity, customDistanceKm]);

  // Compute transparent breakdown
  const fare = useMemo(() => {
    return calculateTransparentFare(selectedVehicleId, computedDistance, helpersCount);
  }, [selectedVehicleId, computedDistance, helpersCount]);

  const selectedVehicle =
    VEHICLE_CATALOG.find((v) => v.id === selectedVehicleId) || VEHICLE_CATALOG[0];

  return (
    <div className="py-12 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Page Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <Badge variant="gold">Zero Hidden Charges</Badge>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight">
          Transparent Freight Rate Calculator
        </h1>
        <p className="text-sm text-neutral-600 leading-relaxed">
          Estimate precise door-to-door transport costs across India with real-time tariff breakdown
          including fuel, national highway tolls, and Goods Transport Agency (GTA) GST.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Card */}
        <div className="lg:col-span-7 space-y-6">
          <Card variant="default">
            <h2 className="text-lg font-bold text-forest-950 mb-6 flex items-center gap-2 pb-3 border-b border-warm-200">
              <Calculator className="w-5 h-5 text-forest-800" />
              Consignment Route & Fleet Selection
            </h2>

            <div className="space-y-5">
              {/* Route Origin & Destination */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Origin (Loading Hub)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-forest-800 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={fromCity}
                      onChange={(e) => {
                        setFromCity(e.target.value);
                        setCustomDistanceKm(null);
                      }}
                      className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-warm-300 rounded-lg text-sm text-neutral-900 font-medium focus:ring-2 focus:ring-forest-600"
                    >
                      {MAJOR_HUBS.map((hub) => (
                        <option key={hub.city} value={hub.city}>
                          {hub.city}, {hub.state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                    Destination (Receiving Bay)
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-gold-600 absolute left-3 top-3 pointer-events-none" />
                    <select
                      value={toCity}
                      onChange={(e) => {
                        setToCity(e.target.value);
                        setCustomDistanceKm(null);
                      }}
                      className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-warm-300 rounded-lg text-sm text-neutral-900 font-medium focus:ring-2 focus:ring-forest-600"
                    >
                      {MAJOR_HUBS.map((hub) => (
                        <option key={hub.city} value={hub.city}>
                          {hub.city}, {hub.state}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Vehicle Class Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Truck Capacity & Body Type
                </label>
                <div className="relative">
                  <Truck className="w-4 h-4 text-forest-800 absolute left-3 top-3 pointer-events-none" />
                  <select
                    value={selectedVehicleId}
                    onChange={(e) => setSelectedVehicleId(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 border border-warm-300 rounded-lg text-sm text-neutral-900 font-medium focus:ring-2 focus:ring-forest-600"
                  >
                    {VEHICLE_CATALOG.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} — {v.tonnage}T ({v.payloadKg} kg payload) • {v.bodyType.replace('_', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Labor & Helper Selection */}
              <div>
                <label className="block text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-1.5">
                  Loading / Unloading Labor Assistance
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[0, 1, 2, 4].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setHelpersCount(count)}
                      className={`py-2 px-3 text-xs font-semibold rounded-lg border transition-all flex items-center justify-center gap-1.5 ${
                        helpersCount === count
                          ? 'bg-forest-800 text-white border-forest-800'
                          : 'bg-white text-neutral-700 border-warm-300 hover:bg-neutral-50'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      {count === 0 ? 'No Helpers' : `${count} ${count === 1 ? 'Helper' : 'Helpers'}`}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-neutral-500 mt-1.5">
                  Standardized helper rates: ₹450 per verified loader for palletized/crate cargo.
                </p>
              </div>

              {/* Distance Override Slider for Custom Pin-to-Pin Runs */}
              <div className="pt-2">
                <div className="flex items-center justify-between text-xs font-semibold text-neutral-700 mb-1">
                  <span>Calculated Highway Route Distance</span>
                  <span className="text-forest-800 font-bold">{computedDistance} km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="2200"
                  step="5"
                  value={computedDistance}
                  onChange={(e) => setCustomDistanceKm(Number(e.target.value))}
                  className="w-full accent-forest-800 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
                  <span>5 km (Intra-City)</span>
                  <span>500 km (Regional)</span>
                  <span>1200 km (Inter-State)</span>
                  <span>2200 km (Trans-National)</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Vehicle Highlights Box */}
          <Card variant="bordered" className="bg-warm-50">
            <div className="flex items-start gap-4">
              <span className="p-3 bg-forest-100 text-forest-800 rounded-xl shrink-0">
                <Truck className="w-6 h-6" />
              </span>
              <div className="space-y-1">
                <h3 className="font-bold text-sm text-neutral-900">{selectedVehicle.name}</h3>
                <p className="text-xs text-neutral-600 leading-relaxed">{selectedVehicle.description}</p>
                <div className="flex flex-wrap gap-2 pt-2 text-[11px] text-neutral-700">
                  <span className="bg-white px-2 py-0.5 rounded border border-warm-300">
                    Max Payload: <strong>{selectedVehicle.payloadKg} kg</strong>
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-warm-300">
                    Dimensions:{' '}
                    <strong>
                      {selectedVehicle.dimensions.lengthFt}×{selectedVehicle.dimensions.widthFt}×
                      {selectedVehicle.dimensions.heightFt} ft
                    </strong>
                  </span>
                  <span className="bg-white px-2 py-0.5 rounded border border-warm-300">
                    Body: <strong>{selectedVehicle.bodyType.replace('_', ' ')}</strong>
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Output: Itemized Invoice Breakdown Card */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="bg-forest-950 text-white rounded-2xl p-6 sm:p-7 shadow-elevated border border-forest-800 relative">
            <div className="flex items-center justify-between pb-4 border-b border-forest-800">
              <div>
                <span className="text-xs text-gold-400 font-bold uppercase tracking-widest block">
                  Official Spot Quotation
                </span>
                <h3 className="text-lg font-extrabold text-white">Estimated Freight Cost</h3>
              </div>
              <FileSpreadsheet className="w-6 h-6 text-gold-400" />
            </div>

            {/* Total Callout */}
            <div className="py-6 border-b border-forest-800 flex items-baseline justify-between">
              <div>
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">
                  ₹{fare.totalFare.toLocaleString()}
                </span>
                <span className="text-xs text-neutral-400 block mt-0.5">All-inclusive door-to-door</span>
              </div>
              <Badge variant="gold" className="text-xs">
                <Clock className="w-3.5 h-3.5" />
                ~{fare.estimatedHours} hrs transit
              </Badge>
            </div>

            {/* Transparent Itemized Breakdown */}
            <div className="py-5 space-y-3 text-xs border-b border-forest-800">
              <div className="flex justify-between text-neutral-300">
                <span>
                  Base Freight (incl. first {selectedVehicle.baseKm} km)
                </span>
                <span className="font-semibold text-white font-mono">₹{fare.baseFare.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-neutral-300">
                <span>
                  Distance Rate ({Math.max(0, computedDistance - selectedVehicle.baseKm)} km @ ₹
                  {selectedVehicle.perKmRate}/km)
                </span>
                <span className="font-semibold text-white font-mono">
                  ₹{fare.distanceFare.toLocaleString()}
                </span>
              </div>

              {fare.loadingUnloadingCharge > 0 && (
                <div className="flex justify-between text-neutral-300">
                  <span>Loading & Unloading Labor ({helpersCount} Helpers)</span>
                  <span className="font-semibold text-white font-mono">
                    ₹{fare.loadingUnloadingCharge.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-neutral-300">
                <span>Dynamic Fuel Surcharge Index (6%)</span>
                <span className="font-semibold text-white font-mono">
                  ₹{fare.fuelSurcharge.toLocaleString()}
                </span>
              </div>

              {fare.tollEstimate > 0 && (
                <div className="flex justify-between text-neutral-300">
                  <span>National Highway Tolls & Fastag Estimate</span>
                  <span className="font-semibold text-white font-mono">
                    ₹{fare.tollEstimate.toLocaleString()}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-gold-300 pt-2 border-t border-forest-900 font-medium">
                <span>Goods Transport Agency GST ({fare.gstPercentage}%)</span>
                <span className="font-semibold text-gold-300 font-mono">
                  ₹{fare.gstAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Compliance Note */}
            <div className="pt-4 space-y-3">
              <div className="flex items-start gap-2 text-[11px] text-neutral-300">
                <Info className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
                <span>
                  Rates comply with standard GST Reverse Charge Mechanism (RCM) provisions for
                  registered corporate consignors.
                </span>
              </div>

              <Link to={`/book?from=${encodeURIComponent(fromCity)}&to=${encodeURIComponent(toCity)}&vehicle=${encodeURIComponent(selectedVehicleId)}`}>
                <Button
                  variant="secondary"
                  size="lg"
                  className="w-full font-bold"
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Proceed to Book Lorry
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
