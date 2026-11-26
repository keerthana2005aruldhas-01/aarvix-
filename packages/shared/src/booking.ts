import { VEHICLE_CATALOG } from './data';
import { calculateTransparentFare } from './pricing';
import type { DriverInfo, FareBreakdown, VehicleSpec } from './types';

/* ------------------------------------------------------------------ */
/* Load size presets (the "what size is my load?" picker)              */
/* ------------------------------------------------------------------ */

export interface LoadSize {
  id: string;
  label: string;
  hint: string;
  weightKg: number;
  lengthFt: number;
  widthFt: number;
  heightFt: number;
}

export const LOAD_SIZES: readonly LoadSize[] = [
  { id: 'parcel', label: 'Few boxes', hint: 'Bags, cartons, small parcels', weightKg: 80, lengthFt: 3, widthFt: 2, heightFt: 2 },
  { id: 'light', label: 'Light load', hint: 'Appliances, a sofa, shop goods', weightKg: 400, lengthFt: 5, widthFt: 4, heightFt: 4 },
  { id: 'medium', label: 'Medium load', hint: '1 BHK shifting, bulk stock', weightKg: 1200, lengthFt: 8, widthFt: 5, heightFt: 5 },
  { id: 'large', label: 'Large load', hint: '2-3 BHK, factory stock', weightKg: 3500, lengthFt: 12, widthFt: 6, heightFt: 6 },
  { id: 'heavy', label: 'Heavy load', hint: 'Machinery, construction material', weightKg: 9000, lengthFt: 17, widthFt: 7, heightFt: 7 },
  { id: 'custom', label: 'Custom', hint: 'Enter exact weight & size', weightKg: 1000, lengthFt: 8, widthFt: 5, heightFt: 5 },
];

export interface LoadProfile {
  weightKg: number;
  lengthFt: number;
  widthFt: number;
  heightFt: number;
}

export interface VehicleFit {
  fits: boolean;
  reason?: string;
}

/** Does this vehicle legally/physically carry the load? */
export function checkVehicleFit(vehicle: VehicleSpec, load: LoadProfile): VehicleFit {
  if (load.weightKg > vehicle.payloadKg) {
    return { fits: false, reason: `Max ${vehicle.payloadKg.toLocaleString('en-IN')} kg` };
  }
  const { lengthFt, widthFt, heightFt } = vehicle.dimensions;
  if (load.lengthFt > lengthFt || load.widthFt > widthFt || load.heightFt > heightFt) {
    return { fits: false, reason: `Hold is ${lengthFt}x${widthFt}x${heightFt} ft` };
  }
  return { fits: true };
}

/** Cheapest vehicle that fits (by base fare), used for the "Best match" tag. */
export function recommendVehicleId(load: LoadProfile): string | null {
  const fitting = VEHICLE_CATALOG.filter((v) => checkVehicleFit(v, load).fits);
  if (fitting.length === 0) return null;
  return [...fitting].sort((a, b) => a.baseFare + a.perKmRate * 10 - (b.baseFare + b.perKmRate * 10))[0].id;
}

/* ------------------------------------------------------------------ */
/* Coupons & quotes                                                    */
/* ------------------------------------------------------------------ */

export interface Coupon {
  code: string;
  description: string;
  type: 'flat' | 'percent';
  value: number;
  maxDiscount?: number;
  minFare?: number;
}

export const COUPONS: readonly Coupon[] = [
  { code: 'WELCOME100', description: 'Flat ₹100 off your first booking', type: 'flat', value: 100, minFare: 500 },
  { code: 'AARVIX10', description: '10% off, up to ₹400', type: 'percent', value: 10, maxDiscount: 400, minFare: 1000 },
  { code: 'LOCAL50', description: 'Flat ₹50 off city trips', type: 'flat', value: 50, minFare: 300 },
];

export function findCoupon(code: string): Coupon | undefined {
  const normalized = code.trim().toUpperCase();
  return COUPONS.find((c) => c.code === normalized);
}

export function couponDiscount(coupon: Coupon | undefined, fareBeforeDiscount: number): number {
  if (!coupon) return 0;
  if (coupon.minFare && fareBeforeDiscount < coupon.minFare) return 0;
  const raw = coupon.type === 'flat' ? coupon.value : Math.round((fareBeforeDiscount * coupon.value) / 100);
  return Math.min(raw, coupon.maxDiscount ?? raw, fareBeforeDiscount);
}

export interface Quote {
  vehicle: VehicleSpec;
  fare: FareBreakdown;
  /** Minutes for the driver to reach the pickup point */
  pickupEtaMin: number;
  /** Minutes on the road from pickup to drop */
  tripMin: number;
}

export function estimateTripMinutes(distanceKm: number, vehicle: VehicleSpec): number {
  const avgSpeed = distanceKm <= 40 ? 22 : vehicle.tonnage >= 15 ? 38 : 45; // city traffic vs highway
  return Math.max(10, Math.round((distanceKm / avgSpeed) * 60));
}

/** Deterministic pseudo-ETA so the UI does not flicker on re-render. */
export function pickupEtaMinutes(vehicleId: string, seedKm: number): number {
  let hash = 0;
  for (let i = 0; i < vehicleId.length; i++) hash = (hash * 31 + vehicleId.charCodeAt(i)) % 997;
  const base = 4 + (hash % 9); // 4-12 min
  return base + Math.min(10, Math.floor(seedKm / 250)); // far trips -> slightly longer
}

export function buildQuote(
  vehicle: VehicleSpec,
  distanceKm: number,
  helpersCount: number,
  coupon?: Coupon
): Quote {
  const fare = calculateTransparentFare(vehicle.id, distanceKm, helpersCount);
  const discount = couponDiscount(coupon, fare.totalFare);
  return {
    vehicle,
    fare: { ...fare, discount, totalFare: fare.totalFare - discount },
    pickupEtaMin: pickupEtaMinutes(vehicle.id, distanceKm),
    tripMin: estimateTripMinutes(distanceKm, vehicle),
  };
}

/* ------------------------------------------------------------------ */
/* Demo driver generator (until real driver app dispatch is wired)     */
/* ------------------------------------------------------------------ */

const DRIVER_NAMES = ['Murugan K', 'Rajesh Kumar', 'Selvam P', 'Imran Sheikh', 'Gopal Reddy', 'Manikandan S', 'Suresh Babu', 'Venkatesh R'];
const STATE_CODES = ['KA 01', 'KA 05', 'TN 09', 'TN 22', 'KA 53', 'AP 39'];

export function generateDemoDriver(seed: string): DriverInfo {
  let hash = 7;
  for (let i = 0; i < seed.length; i++) hash = (hash * 33 + seed.charCodeAt(i)) % 100003;
  const letters = String.fromCharCode(65 + (hash % 26)) + String.fromCharCode(65 + ((hash >> 3) % 26));
  return {
    name: DRIVER_NAMES[hash % DRIVER_NAMES.length],
    phone: `9${String(800000000 + (hash * 7919) % 99999999).slice(0, 9)}`,
    rating: Math.round((4.3 + (hash % 7) / 10) * 10) / 10,
    trips: 180 + (hash % 1400),
    vehicleNumber: `${STATE_CODES[hash % STATE_CODES.length]} ${letters} ${1000 + (hash % 9000)}`,
  };
}

export const CANCEL_REASONS: readonly string[] = [
  'Changed my plan',
  'Booked by mistake',
  'Driver is taking too long',
  'Found another vehicle',
  'Wrong pickup / drop location',
];
