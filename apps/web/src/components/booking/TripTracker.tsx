import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookingRecord,
  BookingStatus,
  CANCEL_REASONS,
  generateDemoDriver,
} from '@aarvix/shared';
import {
  CheckCircle2,
  Copy,
  FastForward,
  Headphones,
  Phone,
  Printer,
  Share2,
  ShieldCheck,
  Star,
  XCircle,
} from 'lucide-react';
import { Button } from '../ui/Button.js';
import { LatLngTuple, buildApproachPath, pointAlongRoute } from '../../services/mapService.js';
import { vehicleImage } from '../../lib/vehicleImages.js';

interface TripTrackerProps {
  booking: BookingRecord;
  route: LatLngTuple[];
  onPatch: (patch: Partial<BookingRecord>) => void;
  onVehicleMove: (pos: LatLngTuple | null) => void;
  onNewBooking: () => void;
}

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

const STEPS: { key: string; label: string; statuses: BookingStatus[] }[] = [
  { key: 'assigned', label: 'Driver assigned', statuses: ['driver_assigned'] },
  { key: 'pickup', label: 'Heading to pickup', statuses: ['heading_to_pickup'] },
  { key: 'loading', label: 'Loading', statuses: ['loading'] },
  { key: 'transit', label: 'On the way', statuses: ['in_transit', 'at_destination'] },
  { key: 'done', label: 'Delivered', statuses: ['delivered', 'completed'] },
];

const stepIndex = (s: BookingStatus) => STEPS.findIndex((st) => st.statuses.includes(s));

const NEXT: Partial<Record<BookingStatus, BookingStatus>> = {
  driver_assigned: 'heading_to_pickup',
  heading_to_pickup: 'loading',
  loading: 'in_transit',
  in_transit: 'at_destination',
  at_destination: 'delivered',
};

// Demo speeds. A real trip is driven by the driver app; these only simulate it.
const HEADING_MS = 14000;
const TRANSIT_MS = 26000;

export const TripTracker: React.FC<TripTrackerProps> = ({ booking, route, onPatch, onVehicleMove, onNewBooking }) => {
  const [progress, setProgress] = useState(0);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState(CANCEL_REASONS[0]);
  const [rating, setRating] = useState(0);
  const [tip, setTip] = useState(0);
  const [copied, setCopied] = useState(false);

  const patchRef = useRef(onPatch);
  const moveRef = useRef(onVehicleMove);
  patchRef.current = onPatch;
  moveRef.current = onVehicleMove;

  const pickupPt: LatLngTuple = useMemo(() => [booking.pickup.lat, booking.pickup.lng], [booking.pickup]);
  const dropPt: LatLngTuple = useMemo(() => [booking.destination.lat, booking.destination.lng], [booking.destination]);
  const approach = useMemo(() => buildApproachPath(pickupPt), [pickupPt]);
  const fullRoute = route.length > 1 ? route : [pickupPt, dropPt];

  const status = booking.status;
  const advance = () => {
    const next = NEXT[status];
    if (next) patchRef.current({ status: next });
  };

  // ---- trip simulation: one effect, driven by status ----
  useEffect(() => {
    setProgress(0);
    const timers: number[] = [];
    const animate = (path: LatLngTuple[], ms: number, done: () => void) => {
      const start = Date.now();
      const iv = window.setInterval(() => {
        const f = Math.min(1, (Date.now() - start) / ms);
        setProgress(f);
        moveRef.current(pointAlongRoute(path, f));
        if (f >= 1) {
          window.clearInterval(iv);
          done();
        }
      }, 250);
      timers.push(iv);
    };
    const later = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));

    switch (status) {
      case 'pending':
      case 'confirmed':
      case 'searching_driver':
        moveRef.current(null);
        later(3500, () => {
          const driver = generateDemoDriver(booking.id);
          patchRef.current({ driver, status: 'driver_assigned' });
        });
        break;
      case 'driver_assigned':
        moveRef.current(approach[0]);
        later(2000, () => patchRef.current({ status: 'heading_to_pickup' }));
        break;
      case 'heading_to_pickup':
        animate(approach, HEADING_MS, () => patchRef.current({ status: 'loading' }));
        break;
      case 'loading':
        moveRef.current(pickupPt);
        later(7000, () => patchRef.current({ status: 'in_transit' }));
        break;
      case 'in_transit':
        animate(fullRoute, TRANSIT_MS, () => patchRef.current({ status: 'at_destination' }));
        break;
      case 'at_destination':
        moveRef.current(dropPt);
        later(5000, () => patchRef.current({ status: 'delivered' }));
        break;
      default:
        moveRef.current(status === 'cancelled' ? null : dropPt);
    }

    return () => timers.forEach((t) => {
      window.clearTimeout(t);
      window.clearInterval(t);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, booking.id]);

  const driver = booking.driver;
  const eta = booking.etaMinutes ?? 8;
  const tripMin = Math.max(5, Math.round(((booking.distanceKm ?? 10) / 30) * 60));
  const etaLeft =
    status === 'heading_to_pickup'
      ? Math.max(1, Math.ceil(eta * (1 - progress)))
      : status === 'in_transit'
      ? Math.max(1, Math.ceil(tripMin * (1 - progress)))
      : status === 'driver_assigned'
      ? eta
      : 0;
  const kmLeft = Math.max(0, Math.round((booking.distanceKm ?? 0) * (1 - (status === 'in_transit' ? progress : 0))));
  const canCancel = ['pending', 'confirmed', 'searching_driver', 'driver_assigned', 'heading_to_pickup', 'loading'].includes(status);
  const fare = booking.fareBreakdown;
  const total = fare.totalFare + (booking.tip ?? 0);

  const shareTrip = async () => {
    const text = `Track my AARVIX Logistics trip ${booking.bookingNumber}: ${booking.pickup.city || booking.pickup.address} to ${booking.destination.city || booking.destination.address}. Vehicle ${driver?.vehicleNumber ?? ''}, driver ${driver?.name ?? ''}.`;
    try {
      if (navigator.share) await navigator.share({ title: 'My AARVIX trip', text });
      else {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* user dismissed */
    }
  };

  /* ---------------------------- views ---------------------------- */

  if (status === 'cancelled') {
    return (
      <div className="p-6 text-center space-y-4">
        <XCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-extrabold text-forest-950">Booking cancelled</h2>
        <p className="text-sm text-neutral-600">{booking.bookingNumber}{booking.cancelReason ? ` • ${booking.cancelReason}` : ''}</p>
        <Button onClick={onNewBooking} className="w-full">Book another truck</Button>
      </div>
    );
  }

  if (status === 'searching_driver' || status === 'confirmed' || status === 'pending') {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center space-y-4 py-6">
          <div className="relative w-24 h-24 mx-auto">
            <span className="absolute inset-0 rounded-full bg-forest-800/15 animate-ping" />
            <span className="absolute inset-3 rounded-full bg-forest-800/20 animate-ping [animation-delay:300ms]" />
            <img
              src={vehicleImage(booking.vehicleSpec.id)}
              alt=""
              className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-card"
            />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-forest-950">Finding a {booking.vehicleSpec.name}</h2>
            <p className="text-sm text-neutral-600 mt-1">Contacting verified drivers near {booking.pickup.city || 'your pickup'}…</p>
          </div>
          <p className="text-xs text-neutral-500">Booking {booking.bookingNumber}</p>
        </div>
        <CancelBlock
          show={showCancel}
          setShow={setShowCancel}
          reason={cancelReason}
          setReason={setCancelReason}
          onConfirm={() => onPatch({ status: 'cancelled', cancelReason })}
          free
        />
        <DemoNote />
      </div>
    );
  }

  if (status === 'delivered' || status === 'completed') {
    const done = status === 'completed';
    return (
      <div className="p-5 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-emerald-700" />
          </div>
          <h2 className="text-lg font-extrabold text-forest-950">Delivered successfully</h2>
          <p className="text-xs text-neutral-500">{booking.bookingNumber}</p>
        </div>

        {!done ? (
          <div className="rounded-2xl border border-warm-200 bg-white p-4 space-y-4">
            <p className="text-sm font-semibold text-neutral-900 text-center">How was {driver?.name ?? 'your driver'}?</p>
            <div className="flex justify-center gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star`}>
                  <Star className={`w-9 h-9 ${n <= rating ? 'fill-gold-400 text-gold-500' : 'text-warm-400'}`} />
                </button>
              ))}
            </div>
            <div>
              <p className="text-xs font-semibold text-neutral-600 mb-2 text-center">Add a tip for the driver (optional)</p>
              <div className="flex justify-center gap-2">
                {[0, 20, 50, 100].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTip(t)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold border ${
                      tip === t ? 'bg-forest-800 text-white border-forest-800' : 'bg-white text-neutral-700 border-warm-300 hover:border-forest-700'
                    }`}
                  >
                    {t === 0 ? 'No tip' : inr(t)}
                  </button>
                ))}
              </div>
            </div>
            <Button
              className="w-full"
              size="lg"
              disabled={rating === 0}
              onClick={() => onPatch({ rating, tip, status: 'completed' })}
            >
              Submit & get receipt
            </Button>
          </div>
        ) : (
          <div className="rounded-2xl border border-warm-200 bg-white p-4 space-y-2 text-sm">
            <p className="font-bold text-forest-950 mb-1">Receipt</p>
            <Line label="Base freight" value={inr(fare.baseFare)} />
            <Line label="Distance charge" value={inr(fare.distanceFare)} />
            {fare.loadingUnloadingCharge > 0 && <Line label="Helpers" value={inr(fare.loadingUnloadingCharge)} />}
            <Line label="Fuel surcharge" value={inr(fare.fuelSurcharge)} />
            {fare.tollEstimate > 0 && <Line label="Tolls (est.)" value={inr(fare.tollEstimate)} />}
            <Line label={`GST (${fare.gstPercentage}%)`} value={inr(fare.gstAmount)} />
            {!!fare.discount && <Line label={`Coupon ${booking.couponCode ?? ''}`} value={`-${inr(fare.discount)}`} accent />}
            {!!booking.tip && <Line label="Driver tip" value={inr(booking.tip)} />}
            <div className="flex justify-between pt-2 border-t border-warm-200 text-base font-extrabold text-forest-950">
              <span>Total</span>
              <span>{inr(total)}</span>
            </div>
            <p className="text-[11px] text-neutral-500">
              {booking.paymentMethod === 'online_advance' ? 'Advance paid online (demo); balance due at delivery.' : 'Pay the driver via UPI / cash on delivery.'}
            </p>
          </div>
        )}

        <div className="flex gap-2">
          {done && (
            <Button variant="outline" className="flex-1" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
              Print
            </Button>
          )}
          <Button variant={done ? 'primary' : 'ghost'} className="flex-1" onClick={onNewBooking}>
            Book another
          </Button>
        </div>
      </div>
    );
  }

  // driver_assigned / heading_to_pickup / loading / in_transit / at_destination
  const idx = stepIndex(status);
  const headline =
    status === 'driver_assigned'
      ? 'Driver assigned'
      : status === 'heading_to_pickup'
      ? `Driver arriving in ${etaLeft} min`
      : status === 'loading'
      ? 'Driver has arrived at pickup'
      : status === 'in_transit'
      ? `Arriving in ~${etaLeft} min • ${kmLeft} km left`
      : 'Reached the drop location';

  return (
    <div className="p-5 space-y-5">
      <div>
        <h2 className="text-lg font-extrabold text-forest-950">{headline}</h2>
        <div className="mt-3 h-1.5 rounded-full bg-warm-200 overflow-hidden">
          <div
            className="h-full bg-forest-800 transition-all duration-300"
            style={{ width: `${Math.min(100, ((idx + (status === 'in_transit' ? progress : status === 'heading_to_pickup' ? progress : 0)) / (STEPS.length - 1)) * 100)}%` }}
          />
        </div>
        <ol className="mt-2 grid grid-cols-5 gap-1 text-center">
          {STEPS.map((s, i) => (
            <li key={s.key} className={`text-[10px] leading-tight font-semibold ${i <= idx ? 'text-forest-800' : 'text-neutral-400'}`}>
              {s.label}
            </li>
          ))}
        </ol>
      </div>

      {driver && (
        <div className="rounded-2xl border border-warm-200 bg-white p-4 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-forest-800 text-gold-400 font-extrabold flex items-center justify-center">
              {driver.name.split(' ').map((p) => p[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-neutral-900 truncate">{driver.name}</p>
              <p className="text-xs text-neutral-500 flex items-center gap-1">
                <Star className="w-3 h-3 fill-gold-400 text-gold-500" /> {driver.rating} • {driver.trips.toLocaleString('en-IN')} trips
              </p>
            </div>
            <a
              href={`tel:+91${driver.phone}`}
              className="w-11 h-11 rounded-full bg-forest-50 text-forest-800 flex items-center justify-center hover:bg-forest-100"
              aria-label={`Call ${driver.name}`}
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-warm-200">
            <img src={vehicleImage(booking.vehicleSpec.id)} alt="" className="w-16 h-11 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-neutral-500 truncate">{booking.vehicleSpec.name}</p>
              <p className="font-mono font-extrabold text-neutral-900 tracking-wide">{driver.vehicleNumber}</p>
            </div>
          </div>
        </div>
      )}

      {/* OTP boxes */}
      {['driver_assigned', 'heading_to_pickup', 'loading'].includes(status) && (
        <OtpBox title="Pickup OTP" hint="Tell this to the driver when they arrive to start loading." code={booking.pickupOtp} />
      )}
      {['in_transit', 'at_destination'].includes(status) && (
        <OtpBox title="Delivery OTP" hint="Receiver shares this with the driver after checking the goods." code={booking.deliveryOtp} />
      )}

      {/* route recap */}
      <div className="rounded-2xl bg-warm-50 border border-warm-200 p-4 text-xs space-y-3">
        <div className="flex gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-forest-800 mt-1 shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-neutral-900 truncate">{booking.pickup.address}</p>
            <p className="text-neutral-500">Sender: {booking.pickup.contactPerson} • {booking.pickup.contactPhone}</p>
          </div>
        </div>
        <div className="flex gap-3">
          <span className="w-2.5 h-2.5 rounded-sm bg-gold-500 mt-1 shrink-0" />
          <div className="min-w-0">
            <p className="font-bold text-neutral-900 truncate">{booking.destination.address}</p>
            <p className="text-neutral-500">Receiver: {booking.destination.contactPerson} • {booking.destination.contactPhone}</p>
          </div>
        </div>
        <div className="flex justify-between pt-2 border-t border-warm-200 font-bold text-forest-900">
          <span>{booking.distanceKm} km • {booking.estimatedWeightKg.toLocaleString('en-IN')} kg</span>
          <span>{inr(fare.totalFare)}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button type="button" onClick={shareTrip} className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-warm-300 text-[11px] font-semibold text-neutral-700 hover:bg-warm-100">
          {copied ? <Copy className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied ? 'Copied' : 'Share trip'}
        </button>
        <Link to="/support" className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-warm-300 text-[11px] font-semibold text-neutral-700 hover:bg-warm-100">
          <Headphones className="w-4 h-4" /> Support
        </Link>
        <a href="tel:18001204249" className="flex flex-col items-center gap-1 py-2.5 rounded-xl border border-rose-200 text-[11px] font-semibold text-rose-700 hover:bg-rose-50">
          <ShieldCheck className="w-4 h-4" /> Safety / SOS
        </a>
      </div>

      {canCancel && (
        <CancelBlock
          show={showCancel}
          setShow={setShowCancel}
          reason={cancelReason}
          setReason={setCancelReason}
          onConfirm={() => onPatch({ status: 'cancelled', cancelReason })}
        />
      )}

      <div className="flex items-center justify-between gap-2">
        <DemoNote />
        {NEXT[status] && (
          <button type="button" onClick={advance} className="shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-forest-800 hover:underline">
            <FastForward className="w-3.5 h-3.5" /> Skip step
          </button>
        )}
      </div>
    </div>
  );
};

/* ------------------------- small pieces ------------------------- */

const Line: React.FC<{ label: string; value: string; accent?: boolean }> = ({ label, value, accent }) => (
  <div className={`flex justify-between ${accent ? 'text-emerald-700 font-semibold' : 'text-neutral-600'}`}>
    <span>{label}</span>
    <span className="font-mono">{value}</span>
  </div>
);

const OtpBox: React.FC<{ title: string; hint: string; code?: string }> = ({ title, hint, code }) => (
  <div className="rounded-2xl bg-forest-950 text-white p-4 flex items-center justify-between gap-4">
    <div className="min-w-0">
      <p className="text-sm font-bold text-gold-400">{title}</p>
      <p className="text-[11px] text-neutral-300 leading-snug mt-0.5">{hint}</p>
    </div>
    <div className="flex gap-1.5">
      {(code ?? '0000').split('').map((d, i) => (
        <span key={i} className="w-9 h-11 rounded-lg bg-forest-800 border border-gold-500/40 flex items-center justify-center text-xl font-black font-mono text-gold-400">
          {d}
        </span>
      ))}
    </div>
  </div>
);

const DemoNote: React.FC = () => (
  <p className="text-[10px] text-neutral-400 leading-snug">
    Demo mode: driver, tracking and timings are simulated until the driver app dispatch is connected.
  </p>
);

const CancelBlock: React.FC<{
  show: boolean;
  setShow: (v: boolean) => void;
  reason: string;
  setReason: (v: string) => void;
  onConfirm: () => void;
  free?: boolean;
}> = ({ show, setShow, reason, setReason, onConfirm, free }) => {
  if (!show) {
    return (
      <button type="button" onClick={() => setShow(true)} className="w-full text-sm font-semibold text-rose-600 hover:bg-rose-50 rounded-lg py-2.5">
        Cancel booking
      </button>
    );
  }
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-4 space-y-3">
      <p className="text-sm font-bold text-neutral-900">Why are you cancelling?</p>
      <div className="space-y-1.5">
        {CANCEL_REASONS.map((r) => (
          <label key={r} className="flex items-center gap-2 text-sm text-neutral-700 cursor-pointer">
            <input type="radio" name="cancel-reason" checked={reason === r} onChange={() => setReason(r)} className="text-rose-600 focus:ring-rose-500" />
            {r}
          </label>
        ))}
      </div>
      <p className="text-[11px] text-neutral-500">
        {free ? 'Free to cancel until a driver accepts. ' : ''}See our{' '}
        <Link to="/cancellation-refund" className="underline font-semibold">cancellation policy</Link>.
      </p>
      <div className="flex gap-2">
        <Button variant="ghost" size="sm" className="flex-1" onClick={() => setShow(false)}>Keep booking</Button>
        <Button variant="danger" size="sm" className="flex-1" onClick={onConfirm}>Confirm cancel</Button>
      </div>
    </div>
  );
};

export default TripTracker;
