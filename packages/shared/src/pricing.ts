import { VEHICLE_CATALOG } from './data';
import type { FareBreakdown } from './types';

const EARTH_RADIUS_KM = 6371;
const FUEL_SURCHARGE_RATE = 0.06;
const GST_PERCENTAGE = 5;
const HELPER_RATE = 450;

export function calculateApproxDistanceKm(
  fromLat: number,
  fromLng: number,
  toLat: number,
  toLng: number
): number {
  const coordinates = [fromLat, fromLng, toLat, toLng];
  if (!coordinates.every(Number.isFinite)) {
    throw new RangeError('Coordinates must be finite numbers.');
  }

  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDelta = toRadians(toLat - fromLat);
  const longitudeDelta = toRadians(toLng - fromLng);
  const haversine =
    Math.sin(latitudeDelta / 2) ** 2 +
    Math.cos(toRadians(fromLat)) *
      Math.cos(toRadians(toLat)) *
      Math.sin(longitudeDelta / 2) ** 2;
  const directDistance = 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(haversine));
  return Math.round(directDistance * 1.2);
}

export function calculateTransparentFare(
  vehicleId: string,
  distanceKm: number,
  helpersCount: number
): FareBreakdown {
  if (!Number.isFinite(distanceKm) || distanceKm < 0) {
    throw new RangeError('Distance must be a non-negative finite number.');
  }
  if (!Number.isInteger(helpersCount) || helpersCount < 0) {
    throw new RangeError('Helper count must be a non-negative integer.');
  }

  const vehicle = VEHICLE_CATALOG.find((item) => item.id === vehicleId);
  if (!vehicle) {
    throw new RangeError(`Unknown vehicle ID: ${vehicleId}`);
  }

  const baseFare = vehicle.baseFare;
  const distanceFare = Math.round(Math.max(0, distanceKm - vehicle.baseKm) * vehicle.perKmRate);
  const loadingUnloadingCharge = helpersCount * HELPER_RATE;
  const fuelSurcharge = Math.round(
    (baseFare + distanceFare + loadingUnloadingCharge) * FUEL_SURCHARGE_RATE
  );
  const subtotal = baseFare + distanceFare + loadingUnloadingCharge + fuelSurcharge;
  const gstAmount = Math.round((subtotal * GST_PERCENTAGE) / 100);
  const tollEstimate = distanceKm > 40 ? Math.round((distanceKm * 2.2) / 10) * 10 : 0;

  return {
    distanceKm,
    estimatedHours: Math.round((distanceKm / 40) * 2) / 2,
    baseFare,
    distanceFare,
    loadingUnloadingCharge,
    fuelSurcharge,
    subtotal,
    gstAmount,
    gstPercentage: GST_PERCENTAGE,
    tollEstimate,
    totalFare: subtotal + gstAmount + tollEstimate,
    isReverseChargeGST: false,
  };
}
