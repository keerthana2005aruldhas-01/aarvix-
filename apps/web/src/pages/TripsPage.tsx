import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookingStatus } from '@aarvix/shared';
import { ArrowRight, History, MapPin, Truck } from 'lucide-react';
import { Badge } from '../components/ui/Badge.js';
import { Button } from '../components/ui/Button.js';
import { PageBackdrop } from '../components/ui/PageBackdrop.js';
import { bookingService } from '../services/bookingService.js';
import { vehicleImage } from '../lib/vehicleImages.js';


const statusMeta = (s: BookingStatus): { label: string; variant: 'success' | 'danger' | 'warning' | 'forest' } => {
  if (s === 'completed' || s === 'delivered') return { label: 'Delivered', variant: 'success' };
  if (s === 'cancelled') return { label: 'Cancelled', variant: 'danger' };
  if (s === 'in_transit' || s === 'at_destination') return { label: 'On the way', variant: 'forest' };
  return { label: 'In progress', variant: 'warning' };
};

export const TripsPage: React.FC = () => {
  const [bookings] = useState(() => bookingService.getStoredBookings());

  return (
    <PageBackdrop>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 pb-20">
        <div className="flex items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-forest-950 flex items-center gap-2">
              <History className="w-7 h-7 text-forest-800" /> My Trips
            </h1>
            <p className="text-sm text-neutral-600 mt-1">Your recent bookings on this device.</p>
          </div>
          <Link to="/book">
            <Button leftIcon={<Truck className="w-4 h-4 text-gold-400" />}>New booking</Button>
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white border border-warm-200 rounded-2xl p-10 text-center space-y-3">
            <Truck className="w-10 h-10 text-forest-700 mx-auto" />
            <p className="font-bold text-forest-950">No trips yet</p>
            <p className="text-sm text-neutral-600">Book your first truck in under a minute.</p>
            <Link to="/book">
              <Button>Book a truck</Button>
            </Link>
          </div>
        ) : (
          <ul className="space-y-3">
            {bookings.map((b) => {
              const meta = statusMeta(b.status);
              const live = !['completed', 'delivered', 'cancelled'].includes(b.status);
              return (
                <li key={b.id} className="bg-white border border-warm-200 rounded-2xl p-4 flex gap-4 shadow-subtle">
                  <img src={vehicleImage(b.vehicleSpec.id)} alt="" className="w-20 h-16 rounded-lg object-cover shrink-0 hidden sm:block" loading="lazy" />
                  <div className="flex-1 min-w-0 space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-mono font-bold text-neutral-500">{b.bookingNumber}</span>
                      <Badge variant={meta.variant} size="sm">{meta.label}</Badge>
                    </div>
                    <p className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900 min-w-0">
                      <MapPin className="w-3.5 h-3.5 text-forest-800 shrink-0" />
                      <span className="truncate">{b.pickup.city || b.pickup.address}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                      <span className="truncate">{b.destination.city || b.destination.address}</span>
                    </p>
                    <p className="text-xs text-neutral-500">
                      {b.vehicleSpec.name} • {new Date(b.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="font-extrabold text-forest-950">₹{(b.fareBreakdown.totalFare + (b.tip ?? 0)).toLocaleString('en-IN')}</span>
                      {live ? (
                        <Link to="/book" className="text-xs font-bold text-forest-800 hover:underline">Track trip</Link>
                      ) : (
                        <Link
                          to={`/book?from=${encodeURIComponent(b.pickup.city)}&to=${encodeURIComponent(b.destination.city)}&vehicle=${encodeURIComponent(b.vehicleSpec.id)}`}
                          className="text-xs font-bold text-forest-800 hover:underline"
                        >
                          Book again
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </PageBackdrop>
  );
};

export default TripsPage;