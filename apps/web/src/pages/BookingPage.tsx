import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  AlertCircle,
  ArrowLeftRight,
  Boxes,
  CalendarClock,
  CheckCircle2,
  ChevronDown,
  Container,
  Factory,
  Info,
  Loader2,
  Minus,
  Package,
  Pencil,
  Plus,
  SlidersHorizontal,
  Sofa,
  Tag,
  X,
} from 'lucide-react';
import {
  BookingRecord,
  COUPONS,
  Coupon,
  GOODS_CATEGORIES_INFO,
  GoodsCategory,
  LOAD_SIZES,
  LocationPoint,
  MAJOR_HUBS,
  VEHICLE_CATALOG,
  buildQuote,
  checkVehicleFit,
  findCoupon,
  recommendVehicleId,
} from '@aarvix/shared';
import { Button } from '../components/ui/Button.js';
import { MapView, PinKind } from '../components/booking/MapView.js';
import { LocationInput } from '../components/booking/LocationInput.js';
import { TripTracker } from '../components/booking/TripTracker.js';
import { bookingService } from '../services/bookingService.js';
import {
  LatLngTuple,
  Place,
  RouteResult,
  getCurrentPosition,
  getRoute,
  reverseGeocode,
  saveRecentPlace,
} from '../services/mapService.js';
import { vehicleImage } from '../lib/vehicleImages.js';

type Stage = 'route' | 'options' | 'trip';

const SORTED_VEHICLES = [...VEHICLE_CATALOG].sort((a, b) => a.tonnage - b.tonnage);
const SIZE_ICONS: Record<string, React.ReactNode> = {
  parcel: <Package className="w-5 h-5" />,
  light: <Sofa className="w-5 h-5" />,
  medium: <Boxes className="w-5 h-5" />,
  large: <Container className="w-5 h-5" />,
  heavy: <Factory className="w-5 h-5" />,
  custom: <SlidersHorizontal className="w-5 h-5" />,
};

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;
const timeLabel = (d: Date) => d.toLocaleTimeString('en-IN', { hour: 'numeric', minute: '2-digit' });
const toLocalInput = (d: Date) => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
};
const validPhone = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/\D/g, ''));
const fullAddress = (p: Place) => [p.label, p.subtitle].filter(Boolean).join(', ');

const hubToPlace = (city: string | null): Place | null => {
  const hub = MAJOR_HUBS.find((h) => h.city === city);
  return hub ? { label: hub.city, subtitle: hub.state, lat: hub.lat, lng: hub.lng, city: hub.city, state: hub.state } : null;
};

const placeFromPoint = (pt: LocationPoint): Place => ({
  label: pt.address,
  lat: pt.lat,
  lng: pt.lng,
  city: pt.city,
  state: pt.state,
});

const useIsDesktop = () => {
  const [v, setV] = useState(() => typeof window !== 'undefined' && window.matchMedia('(min-width: 1024px)').matches);
  useEffect(() => {
    const m = window.matchMedia('(min-width: 1024px)');
    const h = () => setV(m.matches);
    m.addEventListener('change', h);
    return () => m.removeEventListener('change', h);
  }, []);
  return v;
};

export const BookingPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const isDesktop = useIsDesktop();

  /* ---------- route ---------- */
  const [pickup, setPickup] = useState<Place | null>(() => hubToPlace(searchParams.get('from')));
  const [drop, setDrop] = useState<Place | null>(() => hubToPlace(searchParams.get('to')));
  const [route, setRoute] = useState<RouteResult | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [pickMode, setPickMode] = useState<PinKind | null>(null);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState('');
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [stage, setStage] = useState<Stage>('route');

  /* ---------- load & vehicle ---------- */
  const [loadSizeId, setLoadSizeId] = useState('medium');
  const [customWeight, setCustomWeight] = useState(1000);
  const [customL, setCustomL] = useState(8);
  const [customW, setCustomW] = useState(5);
  const [customH, setCustomH] = useState(5);
  const [goodsCategory, setGoodsCategory] = useState<GoodsCategory>(() => {
    const g = searchParams.get('goods') ?? '';
    return g in GOODS_CATEGORIES_INFO ? (g as GoodsCategory) : 'fmcg_packaged';
  });
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(searchParams.get('vehicle'));

  /* ---------- extras ---------- */
  const [helpers, setHelpers] = useState(0);
  const [scheduleMode, setScheduleMode] = useState<'now' | 'later'>('now');
  const [scheduledAt, setScheduledAt] = useState('');
  const [couponInput, setCouponInput] = useState('');
  const [coupon, setCoupon] = useState<Coupon | undefined>();
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'cash_at_delivery' | 'online_advance'>('cash_at_delivery');
  const [showFare, setShowFare] = useState(false);
  const [notes, setNotes] = useState('');

  const profile = useMemo(() => bookingService.getProfile(), []);
  const [senderName, setSenderName] = useState(profile.name);
  const [senderPhone, setSenderPhone] = useState(profile.phone);
  const [receiverName, setReceiverName] = useState('');
  const [receiverPhone, setReceiverPhone] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  /* ---------- booking ---------- */
  const [booking, setBooking] = useState<BookingRecord | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [vehiclePos, setVehiclePos] = useState<LatLngTuple | null>(null);

  // resume a running trip after refresh
  useEffect(() => {
    const active = bookingService.getActiveBooking();
    if (active) {
      setBooking(active);
      setPickup(placeFromPoint(active.pickup));
      setDrop(placeFromPoint(active.destination));
      setStage('trip');
    }
  }, []);

  // fetch road route whenever both points are set
  useEffect(() => {
    if (!pickup || !drop) {
      setRoute(null);
      return;
    }
    const ctrl = new AbortController();
    setRouteLoading(true);
    getRoute([pickup.lat, pickup.lng], [drop.lat, drop.lng], ctrl.signal)
      .then((r) => setRoute(r))
      .catch(() => undefined)
      .finally(() => {
        if (!ctrl.signal.aborted) setRouteLoading(false);
      });
    return () => ctrl.abort();
  }, [pickup, drop]);

  // as soon as pickup + drop are chosen, jump to vehicle options (Rapido-style)
  useEffect(() => {
    if (stage === 'route' && autoAdvance && pickup && drop && route && !routeLoading) setStage('options');
  }, [stage, autoAdvance, pickup, drop, route, routeLoading]);

  const distanceKm = route?.distanceKm ?? 0;

  const load = useMemo(() => {
    if (loadSizeId === 'custom') {
      return { weightKg: customWeight || 0, lengthFt: customL || 0, widthFt: customW || 0, heightFt: customH || 0 };
    }
    const s = LOAD_SIZES.find((x) => x.id === loadSizeId) ?? LOAD_SIZES[2];
    return { weightKg: s.weightKg, lengthFt: s.lengthFt, widthFt: s.widthFt, heightFt: s.heightFt };
  }, [loadSizeId, customWeight, customL, customW, customH]);

  const recommendedId = useMemo(() => recommendVehicleId(load), [load]);

  // keep the selection valid for the current load
  useEffect(() => {
    const current = SORTED_VEHICLES.find((v) => v.id === selectedVehicleId);
    if (!current || !checkVehicleFit(current, load).fits) setSelectedVehicleId(recommendedId);
  }, [load, recommendedId, selectedVehicleId]);

  const quotes = useMemo(
    () => SORTED_VEHICLES.map((v) => buildQuote(v, Math.max(1, distanceKm), helpers, coupon)),
    [distanceKm, helpers, coupon]
  );
  const selectedQuote = quotes.find((q) => q.vehicle.id === selectedVehicleId) ?? null;

  const baseTime = scheduleMode === 'later' && scheduledAt ? new Date(scheduledAt) : new Date();

  /* ---------- handlers ---------- */
  const selectPlace = (kind: PinKind, place: Place) => {
    saveRecentPlace(place);
    setAutoAdvance(true);
    setLocError('');
    if (kind === 'pickup') setPickup(place);
    else setDrop(place);
  };

  const clearPlace = (kind: PinKind) => {
    if (kind === 'pickup') setPickup(null);
    else setDrop(null);
  };

  const applyMapPoint = useCallback(async (kind: PinKind, lat: number, lng: number) => {
    setPickMode(null);
    const place = await reverseGeocode(lat, lng);
    saveRecentPlace(place);
    setAutoAdvance(true);
    if (kind === 'pickup') setPickup(place);
    else setDrop(place);
  }, []);

  const useCurrentLocation = async () => {
    setLocating(true);
    setLocError('');
    try {
      const [lat, lng] = await getCurrentPosition();
      await applyMapPoint('pickup', lat, lng);
    } catch (e) {
      setLocError((e as Error).message);
    } finally {
      setLocating(false);
    }
  };

  const swap = () => {
    setPickup(drop);
    setDrop(pickup);
  };

  const editRoute = () => {
    setAutoAdvance(false);
    setStage('route');
  };

  const applyCoupon = (code: string) => {
    const c = findCoupon(code);
    if (!c) {
      setCoupon(undefined);
      setCouponMsg({ ok: false, text: 'Invalid coupon code.' });
      return;
    }
    const base = selectedQuote ? selectedQuote.fare.totalFare + (selectedQuote.fare.discount ?? 0) : 0;
    if (c.minFare && base < c.minFare) {
      setCoupon(undefined);
      setCouponMsg({ ok: false, text: `Valid on fares of ${inr(c.minFare)} or more.` });
      return;
    }
    setCoupon(c);
    setCouponInput(c.code);
    setCouponMsg({ ok: true, text: `${c.code} applied — ${c.description}` });
  };

  const removeCoupon = () => {
    setCoupon(undefined);
    setCouponInput('');
    setCouponMsg(null);
  };

  const validateBooking = (): boolean => {
    const err: Record<string, string> = {};
    if (!pickup || !drop) err.route = 'Please choose pickup and drop locations.';
    if (!selectedQuote) err.vehicle = 'No vehicle can carry this load. Reduce the size or contact our enterprise desk.';
    if (load.weightKg <= 0) err.weight = 'Enter the approximate weight of your goods.';
    if (!senderName.trim()) err.senderName = 'Enter sender name.';
    if (!validPhone(senderPhone)) err.senderPhone = 'Enter a valid 10-digit mobile number.';
    if (!receiverName.trim()) err.receiverName = 'Enter receiver name.';
    if (!validPhone(receiverPhone)) err.receiverPhone = 'Enter a valid 10-digit mobile number.';
    if (scheduleMode === 'later') {
      if (!scheduledAt || new Date(scheduledAt).getTime() < Date.now() + 15 * 60 * 1000) {
        err.schedule = 'Choose a pickup time at least 15 minutes from now.';
      }
    }
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const handleBook = async () => {
    if (submitting || !validateBooking() || !pickup || !drop || !selectedQuote) return;
    setSubmitting(true);
    try {
      const pickupPoint: LocationPoint = {
        address: fullAddress(pickup),
        city: pickup.city || pickup.label,
        state: pickup.state || '',
        lat: pickup.lat,
        lng: pickup.lng,
        contactPerson: senderName.trim(),
        contactPhone: senderPhone.replace(/\D/g, ''),
      };
      const dropPoint: LocationPoint = {
        address: fullAddress(drop),
        city: drop.city || drop.label,
        state: drop.state || '',
        lat: drop.lat,
        lng: drop.lng,
        contactPerson: receiverName.trim(),
        contactPhone: receiverPhone.replace(/\D/g, ''),
      };
      bookingService.saveProfile({ name: senderName.trim(), phone: senderPhone.replace(/\D/g, '') });
      const record = await bookingService.submitBooking({
        pickup: pickupPoint,
        destination: dropPoint,
        vehicleSpec: selectedQuote.vehicle,
        goodsCategory,
        estimatedWeightKg: load.weightKg,
        cargoDimensions: { lengthFt: load.lengthFt, widthFt: load.widthFt, heightFt: load.heightFt },
        loadSizeId,
        specialInstructions: notes,
        helpersCount: helpers,
        fareBreakdown: selectedQuote.fare,
        paymentMethod,
        customerName: senderName.trim(),
        customerPhone: senderPhone.replace(/\D/g, ''),
        scheduledAt: scheduleMode === 'later' ? new Date(scheduledAt).toISOString() : undefined,
        couponCode: coupon?.code,
        distanceKm,
        etaMinutes: selectedQuote.pickupEtaMin,
      });
      setBooking(record);
      setStage('trip');
    } catch {
      setErrors({ submit: 'Could not create the booking. Please try again or call dispatch.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handlePatch = useCallback(
    (patch: Partial<BookingRecord>) => {
      if (!booking) return;
      const updated = bookingService.updateBooking(booking.id, patch);
      if (updated) setBooking(updated);
    },
    [booking]
  );

  const startNew = () => {
    setBooking(null);
    setVehiclePos(null);
    setPickup(null);
    setDrop(null);
    setRoute(null);
    setCoupon(undefined);
    setCouponInput('');
    setCouponMsg(null);
    setHelpers(0);
    setScheduleMode('now');
    setReceiverName('');
    setReceiverPhone('');
    setErrors({});
    setAutoAdvance(true);
    setStage('route');
  };

  const mapPadding = isDesktop
    ? { top: 80, right: 80, bottom: 80, left: 520 }
    : { top: 40, right: 40, bottom: 40, left: 40 };

  /* ---------------------------- render ---------------------------- */
  return (
    <div className="relative flex flex-col lg:block lg:h-[calc(100vh-118px)] lg:min-h-[680px]">
      {/* MAP */}
      <div className="relative isolate h-[300px] sm:h-[360px] lg:h-full lg:absolute lg:inset-0">
        <MapView
          pickup={pickup}
          drop={drop}
          route={route?.coords}
          vehicle={stage === 'trip' ? vehiclePos : null}
          pickMode={pickMode}
          onMapPick={applyMapPoint}
          onPinDrag={stage === 'trip' ? undefined : applyMapPoint}
          fitPadding={mapPadding}
        />
        {pickMode && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[500] flex items-center gap-3 bg-forest-950 text-white text-sm font-semibold px-4 py-2.5 rounded-full shadow-elevated">
            Tap on the map to set {pickMode === 'pickup' ? 'pickup' : 'drop'}
            <button type="button" onClick={() => setPickMode(null)} aria-label="Cancel" className="text-gold-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* PANEL */}
      <aside className="relative z-10 -mt-5 lg:mt-0 lg:absolute lg:top-4 lg:left-4 lg:bottom-4 lg:w-[460px] flex flex-col bg-white rounded-t-3xl lg:rounded-2xl border border-warm-200 shadow-elevated lg:overflow-hidden">
        {stage === 'trip' && booking ? (
          <div className="flex-1 lg:overflow-y-auto">
            <TripTracker
              booking={booking}
              route={route?.coords ?? []}
              onPatch={handlePatch}
              onVehicleMove={setVehiclePos}
              onNewBooking={startNew}
            />
          </div>
        ) : stage === 'route' ? (
          <RouteStage
            pickup={pickup}
            drop={drop}
            route={route}
            routeLoading={routeLoading}
            locating={locating}
            locError={locError}
            errorText={errors.route}
            onSelect={selectPlace}
            onClear={clearPlace}
            onPickOnMap={setPickMode}
            onUseCurrent={useCurrentLocation}
            onSwap={swap}
            onContinue={() => {
              setAutoAdvance(true);
              setStage('options');
            }}
          />
        ) : (
          <>
            <div className="flex-1 lg:overflow-y-auto">
              {/* route recap */}
              <div className="p-4 border-b border-warm-200 bg-warm-50/70">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0 space-y-1.5 text-sm">
                    <p className="flex items-center gap-2 font-semibold text-neutral-900 truncate">
                      <span className="w-2.5 h-2.5 rounded-full bg-forest-800 shrink-0" />
                      <span className="truncate">{pickup?.label}</span>
                    </p>
                    <p className="flex items-center gap-2 font-semibold text-neutral-900 truncate">
                      <span className="w-2.5 h-2.5 rounded-sm bg-gold-500 shrink-0" />
                      <span className="truncate">{drop?.label}</span>
                    </p>
                  </div>
                  <button type="button" onClick={editRoute} className="shrink-0 inline-flex items-center gap-1 text-xs font-bold text-forest-800 hover:underline">
                    <Pencil className="w-3.5 h-3.5" /> Edit
                  </button>
                </div>
                <p className="mt-2 text-xs text-neutral-600">
                  <span className="font-bold text-forest-900">{distanceKm} km</span> • about{' '}
                  {route ? Math.floor(route.durationMin / 60) > 0 ? `${Math.floor(route.durationMin / 60)} h ${route.durationMin % 60} min` : `${route.durationMin} min` : '—'} drive
                  {route?.isEstimate && ' (estimated)'}
                </p>
              </div>

              {/* load size */}
              <section className="p-4 space-y-3">
                <h3 className="text-sm font-extrabold text-forest-950">What are you sending?</h3>
                <div className="grid grid-cols-3 gap-2">
                  {LOAD_SIZES.map((s) => {
                    const on = loadSizeId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setLoadSizeId(s.id)}
                        title={s.hint}
                        className={`flex flex-col items-center gap-1 rounded-xl border px-2 py-2.5 text-center transition-colors ${
                          on ? 'border-forest-800 bg-forest-50 ring-2 ring-forest-700 text-forest-900' : 'border-warm-300 text-neutral-700 hover:border-forest-600'
                        }`}
                      >
                        {SIZE_ICONS[s.id]}
                        <span className="text-xs font-bold leading-tight">{s.label}</span>
                        <span className="text-[10px] text-neutral-500 leading-tight">
                          {s.id === 'custom' ? 'your numbers' : `up to ${s.weightKg >= 1000 ? `${s.weightKg / 1000} T` : `${s.weightKg} kg`}`}
                        </span>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-neutral-500">
                  {LOAD_SIZES.find((s) => s.id === loadSizeId)?.hint}
                  {loadSizeId !== 'custom' && ` • ~${load.lengthFt}×${load.widthFt}×${load.heightFt} ft`}
                </p>

                {loadSizeId === 'custom' && (
                  <div className="grid grid-cols-4 gap-2">
                    <NumField label="Weight (kg)" value={customWeight} onChange={setCustomWeight} error={errors.weight} />
                    <NumField label="Length ft" value={customL} onChange={setCustomL} />
                    <NumField label="Width ft" value={customW} onChange={setCustomW} />
                    <NumField label="Height ft" value={customH} onChange={setCustomH} />
                  </div>
                )}

                <select
                  value={goodsCategory}
                  onChange={(e) => setGoodsCategory(e.target.value as GoodsCategory)}
                  aria-label="Type of goods"
                  className="w-full px-3 py-2.5 bg-white border border-warm-300 rounded-lg text-sm font-medium text-neutral-900 focus:outline-none focus:ring-2 focus:ring-forest-600"
                >
                  {Object.entries(GOODS_CATEGORIES_INFO).map(([k, info]) => (
                    <option key={k} value={k}>
                      {info.label}
                    </option>
                  ))}
                </select>
              </section>

              {/* vehicles */}
              <section className="px-4 pb-4 space-y-2.5">
                <h3 className="text-sm font-extrabold text-forest-950">Choose your vehicle</h3>
                {!recommendedId && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" /> No single vehicle can carry this load. Reduce the size or contact the enterprise desk for multi-truck movement.
                  </div>
                )}
                {quotes.map((q) => {
                  const fit = checkVehicleFit(q.vehicle, load);
                  const on = selectedVehicleId === q.vehicle.id;
                  const dropBy = new Date(baseTime.getTime() + (q.pickupEtaMin + q.tripMin) * 60000);
                  return (
                    <button
                      key={q.vehicle.id}
                      type="button"
                      disabled={!fit.fits}
                      onClick={() => setSelectedVehicleId(q.vehicle.id)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-2xl border text-left transition-colors ${
                        on ? 'border-forest-800 bg-forest-50/60 ring-2 ring-forest-700' : 'border-warm-200 bg-white hover:border-forest-600'
                      } ${!fit.fits ? 'opacity-50 cursor-not-allowed hover:border-warm-200' : ''}`}
                    >
                      <img src={vehicleImage(q.vehicle.id)} alt="" className="w-[76px] h-[56px] rounded-lg object-cover bg-neutral-100 shrink-0" loading="lazy" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-sm font-bold text-neutral-900 leading-tight">{q.vehicle.name}</span>
                          {recommendedId === q.vehicle.id && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gold-100 text-gold-800">Best match</span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 mt-0.5">
                          {fit.fits
                            ? `${q.pickupEtaMin} min away • ${q.vehicle.payloadKg.toLocaleString('en-IN')} kg • ${q.vehicle.dimensions.lengthFt}×${q.vehicle.dimensions.widthFt}×${q.vehicle.dimensions.heightFt} ft`
                            : `Too small — ${fit.reason}`}
                        </p>
                        {fit.fits && <p className="text-[11px] text-neutral-500">Drop by {timeLabel(dropBy)}</p>}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-base font-extrabold text-forest-950">{inr(q.fare.totalFare)}</p>
                        {!!q.fare.discount && <p className="text-[10px] font-semibold text-emerald-700">-{inr(q.fare.discount)} off</p>}
                      </div>
                    </button>
                  );
                })}
                {errors.vehicle && <p className="text-xs text-rose-600 font-medium">{errors.vehicle}</p>}
              </section>

              {/* extras */}
              <section className="px-4 pb-4 space-y-4 border-t border-warm-200 pt-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-neutral-900">Loading / unloading helpers</p>
                    <p className="text-xs text-neutral-500">{inr(450)} per helper</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button type="button" onClick={() => setHelpers((h) => Math.max(0, h - 1))} className="w-8 h-8 rounded-full border border-warm-300 flex items-center justify-center hover:bg-warm-100" aria-label="Fewer helpers">
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-4 text-center font-bold">{helpers}</span>
                    <button type="button" onClick={() => setHelpers((h) => Math.min(4, h + 1))} className="w-8 h-8 rounded-full border border-warm-300 flex items-center justify-center hover:bg-warm-100" aria-label="More helpers">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <CalendarClock className="w-4 h-4 text-forest-800" /> When do you need it?
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {(['now', 'later'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => {
                          setScheduleMode(m);
                          if (m === 'later' && !scheduledAt) setScheduledAt(toLocalInput(new Date(Date.now() + 2 * 3600 * 1000)));
                        }}
                        className={`py-2 rounded-lg text-sm font-semibold border ${
                          scheduleMode === m ? 'bg-forest-800 text-white border-forest-800' : 'bg-white text-neutral-700 border-warm-300 hover:border-forest-600'
                        }`}
                      >
                        {m === 'now' ? 'Now' : 'Schedule later'}
                      </button>
                    ))}
                  </div>
                  {scheduleMode === 'later' && (
                    <input
                      type="datetime-local"
                      value={scheduledAt}
                      min={toLocalInput(new Date())}
                      onChange={(e) => setScheduledAt(e.target.value)}
                      className="w-full px-3 py-2.5 border border-warm-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  )}
                  {errors.schedule && <p className="text-xs text-rose-600 font-medium">{errors.schedule}</p>}
                </div>

                {/* coupon */}
                <div className="space-y-2">
                  <p className="text-sm font-bold text-neutral-900 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-forest-800" /> Coupon
                  </p>
                  {coupon ? (
                    <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold rounded-lg px-3 py-2">
                      <span>{couponMsg?.text}</span>
                      <button type="button" onClick={removeCoupon} aria-label="Remove coupon"><X className="w-4 h-4" /></button>
                    </div>
                  ) : (
                    <>
                      <div className="flex gap-2">
                        <input
                          value={couponInput}
                          onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                          placeholder="Enter code"
                          className="flex-1 min-w-0 px-3 py-2 border border-warm-300 rounded-lg text-sm uppercase focus:outline-none focus:ring-2 focus:ring-forest-600"
                        />
                        <Button size="sm" variant="outline" onClick={() => applyCoupon(couponInput)} disabled={!couponInput.trim()}>
                          Apply
                        </Button>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {COUPONS.map((c) => (
                          <button key={c.code} type="button" onClick={() => applyCoupon(c.code)} className="px-2.5 py-1 rounded-full border border-dashed border-forest-600 text-[11px] font-bold text-forest-800 hover:bg-forest-50" title={c.description}>
                            {c.code}
                          </button>
                        ))}
                      </div>
                      {couponMsg && !couponMsg.ok && <p className="text-xs text-rose-600 font-medium">{couponMsg.text}</p>}
                    </>
                  )}
                </div>
              </section>

              {/* contacts */}
              <section className="px-4 pb-4 space-y-3 border-t border-warm-200 pt-4">
                <h3 className="text-sm font-extrabold text-forest-950">Contact details</h3>
                <div className="grid grid-cols-2 gap-2">
                  <TextField label="Sender name" value={senderName} onChange={setSenderName} error={errors.senderName} />
                  <TextField label="Sender mobile" value={senderPhone} onChange={setSenderPhone} error={errors.senderPhone} inputMode="numeric" />
                  <TextField label="Receiver name" value={receiverName} onChange={setReceiverName} error={errors.receiverName} />
                  <TextField label="Receiver mobile" value={receiverPhone} onChange={setReceiverPhone} error={errors.receiverPhone} inputMode="numeric" />
                </div>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Note for driver (floor, landmark, fragile items…)"
                  className="w-full px-3 py-2 border border-warm-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600"
                />
              </section>

              {/* payment */}
              <section className="px-4 pb-4 space-y-2 border-t border-warm-200 pt-4">
                <h3 className="text-sm font-extrabold text-forest-950">Payment</h3>
                {([
                  ['cash_at_delivery', 'Pay after delivery', 'Cash / UPI to the driver once the goods are delivered.'],
                  ['online_advance', 'Pay 20% advance online', 'Demo only — payment gateway is simulated.'],
                ] as const).map(([val, title, desc]) => (
                  <label key={val} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer ${paymentMethod === val ? 'border-forest-800 bg-forest-50/50 ring-2 ring-forest-700' : 'border-warm-200 hover:border-forest-600'}`}>
                    <input type="radio" name="payment" checked={paymentMethod === val} onChange={() => setPaymentMethod(val)} className="mt-1 text-forest-800 focus:ring-forest-700" />
                    <span>
                      <span className="block text-sm font-bold text-neutral-900">{title}</span>
                      <span className="block text-xs text-neutral-500">{desc}</span>
                    </span>
                  </label>
                ))}
              </section>

              {/* fare details */}
              {selectedQuote && (
                <section className="px-4 pb-6">
                  <button type="button" onClick={() => setShowFare((v) => !v)} className="w-full flex items-center justify-between text-sm font-bold text-forest-900 py-2">
                    Fare details
                    <ChevronDown className={`w-4 h-4 transition-transform ${showFare ? 'rotate-180' : ''}`} />
                  </button>
                  {showFare && (
                    <div className="rounded-xl bg-warm-50 border border-warm-200 p-3 text-xs space-y-1.5 text-neutral-700">
                      <FareLine label={`Base fare (first ${selectedQuote.vehicle.baseKm} km)`} value={inr(selectedQuote.fare.baseFare)} />
                      <FareLine label={`Distance (${Math.max(0, distanceKm - selectedQuote.vehicle.baseKm)} km × ₹${selectedQuote.vehicle.perKmRate})`} value={inr(selectedQuote.fare.distanceFare)} />
                      {selectedQuote.fare.loadingUnloadingCharge > 0 && <FareLine label={`Helpers (${helpers})`} value={inr(selectedQuote.fare.loadingUnloadingCharge)} />}
                      <FareLine label="Fuel surcharge (6%)" value={inr(selectedQuote.fare.fuelSurcharge)} />
                      {selectedQuote.fare.tollEstimate > 0 && <FareLine label="Highway tolls (estimate)" value={inr(selectedQuote.fare.tollEstimate)} />}
                      <FareLine label={`GST (${selectedQuote.fare.gstPercentage}%)`} value={inr(selectedQuote.fare.gstAmount)} />
                      {!!selectedQuote.fare.discount && <FareLine label="Coupon discount" value={`-${inr(selectedQuote.fare.discount)}`} green />}
                      <div className="flex justify-between pt-2 border-t border-warm-300 text-sm font-extrabold text-forest-950">
                        <span>Total</span>
                        <span>{inr(selectedQuote.fare.totalFare)}</span>
                      </div>
                      <p className="flex gap-1.5 text-[11px] text-neutral-500 pt-1"><Info className="w-3.5 h-3.5 shrink-0" /> No surge pricing. Final amount may change only if the actual route or tolls differ.</p>
                    </div>
                  )}
                </section>
              )}
            </div>

            {/* sticky book bar */}
            <div className="sticky bottom-0 border-t border-warm-200 bg-white p-4 space-y-2">
              {errors.submit && <p className="text-xs text-rose-600 font-medium">{errors.submit}</p>}
              {Object.keys(errors).some((k) => k !== 'submit' && k !== 'vehicle') && (
                <p className="text-xs text-rose-600 font-medium">Please fix the highlighted details above.</p>
              )}
              <Button
                size="lg"
                className="w-full"
                disabled={!selectedQuote || routeLoading}
                isLoading={submitting}
                onClick={handleBook}
              >
                {selectedQuote ? `Book ${selectedQuote.vehicle.name.split(' (')[0]} • ${inr(selectedQuote.fare.totalFare)}` : 'Select a vehicle'}
              </Button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
};

/* ------------------------- sub components ------------------------- */

interface RouteStageProps {
  pickup: Place | null;
  drop: Place | null;
  route: RouteResult | null;
  routeLoading: boolean;
  locating: boolean;
  locError: string;
  errorText?: string;
  onSelect: (kind: PinKind, p: Place) => void;
  onClear: (kind: PinKind) => void;
  onPickOnMap: (kind: PinKind) => void;
  onUseCurrent: () => void;
  onSwap: () => void;
  onContinue: () => void;
}

const RouteStage: React.FC<RouteStageProps> = ({
  pickup, drop, route, routeLoading, locating, locError, errorText,
  onSelect, onClear, onPickOnMap, onUseCurrent, onSwap, onContinue,
}) => (
  <div className="p-5 space-y-4">
    <div>
      <h1 className="text-xl font-extrabold text-forest-950">Book a truck</h1>
      <p className="text-sm text-neutral-600 mt-0.5">Pick your locations — vehicles and prices appear instantly.</p>
    </div>

    <div className="relative space-y-2">
      <LocationInput
        kind="pickup"
        value={pickup}
        onSelect={(p) => onSelect('pickup', p)}
        onClear={() => onClear('pickup')}
        onPickOnMap={() => onPickOnMap('pickup')}
        onUseCurrent={onUseCurrent}
        isLocating={locating}
      />
      <LocationInput
        kind="drop"
        value={drop}
        onSelect={(p) => onSelect('drop', p)}
        onClear={() => onClear('drop')}
        onPickOnMap={() => onPickOnMap('drop')}
      />
      <button
        type="button"
        onClick={onSwap}
        title="Swap pickup and drop"
        aria-label="Swap pickup and drop"
        className="absolute right-12 top-1/2 -translate-y-1/2 z-[5] w-9 h-9 rounded-full bg-white border border-warm-300 shadow-subtle flex items-center justify-center text-forest-800 hover:bg-forest-50"
      >
        <ArrowLeftRight className="w-4 h-4 rotate-90" />
      </button>
    </div>

    {locError && <p className="text-xs text-rose-600 font-medium">{locError}</p>}
    {errorText && <p className="text-xs text-rose-600 font-medium">{errorText}</p>}

    {pickup && drop && (
      <div className="rounded-xl bg-forest-950 text-white p-4 flex items-center justify-between">
        {routeLoading || !route ? (
          <span className="flex items-center gap-2 text-sm"><Loader2 className="w-4 h-4 animate-spin" /> Finding the best route…</span>
        ) : (
          <>
            <div>
              <p className="text-[11px] text-neutral-300">Road distance</p>
              <p className="text-lg font-extrabold text-gold-400">{route.distanceKm} km</p>
            </div>
            <div className="text-right">
              <p className="text-[11px] text-neutral-300">Drive time</p>
              <p className="text-sm font-bold">{route.durationMin >= 60 ? `${Math.floor(route.durationMin / 60)} h ${route.durationMin % 60} min` : `${route.durationMin} min`}</p>
            </div>
          </>
        )}
      </div>
    )}
    {route?.isEstimate && (
      <p className="text-[11px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
        Live routing is unavailable right now, so distance is a straight-line estimate × 1.2.
      </p>
    )}

    <Button size="lg" className="w-full" disabled={!pickup || !drop || routeLoading || !route} onClick={onContinue} leftIcon={<CheckCircle2 className="w-4 h-4 text-gold-400" />}>
      See vehicles & prices
    </Button>
    <p className="text-[11px] text-neutral-400 text-center">Tip: drag the A / B pins on the map to fine-tune the exact spot.</p>
  </div>
);

const NumField: React.FC<{ label: string; value: number; onChange: (n: number) => void; error?: string }> = ({ label, value, onChange, error }) => (
  <label className="block">
    <span className="block text-[10px] font-semibold text-neutral-600 mb-1">{label}</span>
    <input
      type="number"
      min={1}
      value={value || ''}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`w-full px-2 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-forest-600 ${error ? 'border-rose-400' : 'border-warm-300'}`}
    />
  </label>
);

const TextField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  inputMode?: 'numeric' | 'text';
}> = ({ label, value, onChange, error, inputMode }) => (
  <label className="block">
    <span className="block text-[11px] font-semibold text-neutral-600 mb-1">{label}</span>
    <input
      value={value}
      inputMode={inputMode}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 ${error ? 'border-rose-400 focus:ring-rose-200' : 'border-warm-300 focus:ring-forest-600'}`}
    />
    {error && <span className="block text-[11px] text-rose-600 mt-0.5">{error}</span>}
  </label>
);

const FareLine: React.FC<{ label: string; value: string; green?: boolean }> = ({ label, value, green }) => (
  <div className={`flex justify-between gap-3 ${green ? 'text-emerald-700 font-semibold' : ''}`}>
    <span>{label}</span>
    <span className="font-mono shrink-0">{value}</span>
  </div>
);

export default BookingPage;
