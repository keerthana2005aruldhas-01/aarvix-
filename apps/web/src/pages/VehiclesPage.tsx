import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Truck,
  Check,
  ArrowRight,
  ShieldCheck,
  Layers,
  Gauge,
} from 'lucide-react';

import { VEHICLE_CATALOG, VehicleCategory } from '@aarvix/shared';
import { Card } from '../components/ui/Card.js';
import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';
import { PageBackdrop } from '../components/ui/PageBackdrop.js';


// Local Vehicle Images
const getVehicleImage = (name: string) => {
  const vehicle = name.toLowerCase().replace(/[_-]/g, ' ');

  if (vehicle.includes('3 wheeler')) {
    return '/images/mini.jpeg';
  }

  if (vehicle.includes('pickup')) {
    return '/images/pickup-truck.jpeg';
  }

  if (vehicle.includes('mini')) {
    return '/images/mini-truck.jpeg';
  }

  if (vehicle.includes('tata 407') || vehicle.includes('407')) {
    return '/images/tata407.jpeg';
  }

  if (vehicle.includes('14 ft') || vehicle.includes('14 feet')) {
    return '/images/14-feet.jpeg';
  }

  if (vehicle.includes('17 ft') || vehicle.includes('17 feet')) {
    return '/images/17-feet.jpeg';
  }

  if (vehicle.includes('32 ft') || vehicle.includes('32 feet')) {
    return '/images/32-feet.jpeg';
  }

  if (vehicle.includes('28 ton') || vehicle.includes('28 tonne')) {
    return '/images/28ton.jpeg';
  }

  if (vehicle.includes('multi axle') || vehicle.includes('multi axile')) {
    return '/images/multi-axile.jpeg';
  }

  if (vehicle.includes('heavy')) {
    return '/images/truck-heavy.jpg';
  }

  return '/images/truck-heavy.jpg';
};


export const VehiclesPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Fleet Types' },
    { id: 'mini_truck', label: 'Mini Trucks (1T - 1.5T)' },
    { id: 'light_commercial', label: 'Light LCV (2.5T)' },
    { id: 'intermediate', label: 'Intermediate (4T - 6T)' },
    { id: 'medium_heavy', label: 'Medium Heavy (8T - 10T)' },
    { id: 'trailer_container', label: 'Containers & Trailers (15T - 28T)' },
  ];

  const filteredVehicles =
    selectedCategory === 'all'
      ? VEHICLE_CATALOG
      : VEHICLE_CATALOG.filter((v) => {
          if (selectedCategory === 'trailer_container') {
            return (
              v.category === 'trailer_container' ||
              v.category === 'heavy_hauler'
            );
          }

          return v.category === (selectedCategory as VehicleCategory);
        });

  return (
    <PageBackdrop>
      <div className="py-12 space-y-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge variant="gold">
            National Permit & Commercial Fleet
          </Badge>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-forest-950 tracking-tight">
            Vehicle Specifications & Fleet Catalog
          </h1>

          <p className="text-sm text-neutral-600 leading-relaxed">
            Detailed technical dimensions, payload tolerances, and transparent
            base tariffs for each audited commercial vehicle class in the AARVIX
            network.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-forest-800 text-white shadow-sm'
                  : 'bg-white text-neutral-700 border border-warm-200 hover:bg-neutral-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          {filteredVehicles.map((truck) => (
            <Card
              key={truck.id}
              variant="default"
              className="w-full min-w-0 flex flex-col justify-between hover:shadow-card hover:border-forest-600 transition-all group"
            >
              <div>

                {/* Vehicle Image */}
                <div className="w-full h-48 mb-4 rounded-xl bg-warm-50 border border-warm-200 overflow-hidden">
                  <img
                    src={getVehicleImage(truck.name)}
                    alt={`${truck.name} vehicle`}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/images/truck-heavy.jpg';
                    }}
                  />
                </div>

                {/* Top Meta */}
                <div className="flex items-center justify-between mb-4">
                  <span className="p-3 bg-forest-50 text-forest-800 rounded-xl group-hover:bg-forest-800 group-hover:text-gold-400 transition-colors">
                    <Truck className="w-6 h-6" />
                  </span>

                  <div className="flex items-center gap-1.5">
                    <Badge variant="forest">
                      {truck.tonnage} Tonne
                    </Badge>

                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-warm-200 text-neutral-700">
                      {truck.bodyType.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Vehicle Name */}
                <h3 className="text-lg font-bold text-forest-950 mb-1">
                  {truck.name}
                </h3>

                <p className="text-xs text-neutral-600 leading-relaxed mb-4">
                  {truck.description}
                </p>

                {/* Technical Specifications */}
                <div className="bg-warm-100/70 p-3.5 rounded-xl border border-warm-200/80 space-y-2.5 text-xs">

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <Gauge className="w-3.5 h-3.5 text-forest-700" />
                      Payload Capacity:
                    </span>

                    <span className="font-bold text-neutral-900">
                      {truck.payloadKg.toLocaleString()} kg
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-forest-700" />
                      Cargo Deck Dimensions:
                    </span>

                    <span className="font-bold text-neutral-900">
                      {truck.dimensions.lengthFt}L × {truck.dimensions.widthFt}W × {truck.dimensions.heightFt}H ft
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-neutral-500 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                      Permit Class:
                    </span>

                    <span className="font-semibold text-neutral-800">
                      {truck.tonnage > 6
                        ? 'All-India National Permit'
                        : 'State / Interstate Carrier'}
                    </span>
                  </div>
                </div>

                {/* Recommended Consignments */}
                <div className="mt-4 pt-3 border-t border-warm-200">
                  <span className="text-[11px] font-bold text-forest-900 uppercase tracking-wider block mb-2">
                    Recommended Consignments:
                  </span>

                  <ul className="space-y-1 text-xs text-neutral-600">
                    {truck.popularUses.map((use, idx) => (
                      <li key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5 text-gold-600 shrink-0" />
                        <span>{use}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Bottom Tariff and CTA */}
              <div className="mt-6 pt-4 border-t border-warm-200 flex items-center justify-between gap-3">

                <div>
                  <span className="text-[10px] text-neutral-400 uppercase tracking-wider block font-bold">
                    Standard Tariff
                  </span>

                  <div className="flex items-baseline gap-1">
                    <span className="text-lg font-black text-forest-900">
                      ₹{truck.baseFare.toLocaleString()}
                    </span>

                    <span className="text-xs text-neutral-500 font-medium">
                      + ₹{truck.perKmRate}/km
                    </span>
                  </div>
                </div>

                <Link to={`/fare-calculator?vehicle=${truck.id}`}>
                  <Button
                    variant="primary"
                    size="sm"
                    rightIcon={
                      <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                    }
                  >
                    Calculate Fare
                  </Button>
                </Link>

              </div>
            </Card>
          ))}

        </div>
      </div>
    </PageBackdrop>
  );
};