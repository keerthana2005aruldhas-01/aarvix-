/**
 * Map helpers using free, key-less services:
 *  - Search / reverse geocoding : OpenStreetMap Nominatim
 *  - Road routing               : OSRM public demo server
 * For production traffic, swap these for Google Maps / Mapbox / your own OSRM
 * (the public servers are rate-limited and meant for light use).
 */
import { calculateApproxDistanceKm } from '@aarvix/shared';

export type LatLngTuple = [number, number];

export interface Place {
  label: string; // short name shown in the input
  subtitle?: string; // rest of the address
  lat: number;
  lng: number;
  city?: string;
  state?: string;
}

export interface RouteResult {
  distanceKm: number;
  durationMin: number;
  coords: LatLngTuple[];
  isEstimate: boolean; // true when OSRM was unreachable and we fell back to a straight line
}

interface NominatimItem {
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  address?: Record<string, string>;
}

function toPlace(item: NominatimItem): Place {
  const a = item.address ?? {};
  const city = a.city || a.town || a.village || a.suburb || a.county || a.state_district || '';
  const parts = item.display_name.split(',').map((s) => s.trim());
  const label = item.name || parts[0] || item.display_name;
  return {
    label,
    subtitle: parts.slice(1, 4).join(', '),
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
    city,
    state: a.state || '',
  };
}

export async function searchPlaces(query: string, signal?: AbortSignal): Promise<Place[]> {
  const q = query.trim();
  if (q.length < 3) return [];
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=6&countrycodes=in&q=${encodeURIComponent(q)}`;
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error('Search failed');
  const data = (await res.json()) as NominatimItem[];
  return data.map(toPlace);
}

export async function reverseGeocode(lat: number, lng: number, signal?: AbortSignal): Promise<Place> {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&lat=${lat}&lon=${lng}`;
    const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
    if (!res.ok) throw new Error('reverse failed');
    const item = (await res.json()) as NominatimItem;
    if (!item.display_name) throw new Error('empty');
    const p = toPlace({ ...item, lat: String(lat), lon: String(lng) });
    return { ...p, lat, lng };
  } catch {
    return { label: `Pinned location (${lat.toFixed(4)}, ${lng.toFixed(4)})`, lat, lng };
  }
}

export async function getRoute(from: LatLngTuple, to: LatLngTuple, signal?: AbortSignal): Promise<RouteResult> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error('routing failed');
    const data = await res.json();
    const route = data?.routes?.[0];
    if (!route) throw new Error('no route');
    const coords: LatLngTuple[] = route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]);
    return {
      distanceKm: Math.max(1, Math.round(route.distance / 1000)),
      durationMin: Math.round(route.duration / 60),
      coords,
      isEstimate: false,
    };
  } catch (err) {
    if ((err as Error).name === 'AbortError') throw err;
    const km = Math.max(1, calculateApproxDistanceKm(from[0], from[1], to[0], to[1]));
    return { distanceKm: km, durationMin: Math.round((km / 35) * 60), coords: [from, to], isEstimate: true };
  }
}

export function getCurrentPosition(): Promise<LatLngTuple> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) return reject(new Error('Location is not supported on this device.'));
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve([pos.coords.latitude, pos.coords.longitude]),
      () => reject(new Error('Could not get your location. Please allow location access.')),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

/** Point at a given fraction (0..1) along a polyline, measured by segment count weight of real distance. */
export function pointAlongRoute(coords: LatLngTuple[], fraction: number): LatLngTuple {
  if (coords.length === 0) return [0, 0];
  if (coords.length === 1 || fraction <= 0) return coords[0];
  if (fraction >= 1) return coords[coords.length - 1];
  const seg: number[] = [];
  let total = 0;
  for (let i = 1; i < coords.length; i++) {
    const d = Math.hypot(coords[i][0] - coords[i - 1][0], coords[i][1] - coords[i - 1][1]);
    seg.push(d);
    total += d;
  }
  let target = total * fraction;
  for (let i = 0; i < seg.length; i++) {
    if (target <= seg[i]) {
      const t = seg[i] === 0 ? 0 : target / seg[i];
      return [
        coords[i][0] + (coords[i + 1][0] - coords[i][0]) * t,
        coords[i][1] + (coords[i + 1][1] - coords[i][1]) * t,
      ];
    }
    target -= seg[i];
  }
  return coords[coords.length - 1];
}

/** A short fake approach path so the driver visibly drives *to* the pickup point. */
export function buildApproachPath(pickup: LatLngTuple, steps = 40): LatLngTuple[] {
  const start: LatLngTuple = [pickup[0] + 0.018, pickup[1] - 0.022];
  const mid: LatLngTuple = [start[0], pickup[1]]; // an "L" shape looks road-like
  const path: LatLngTuple[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    path.push(t < 0.5
      ? [start[0], start[1] + (mid[1] - start[1]) * (t * 2)]
      : [mid[0] + (pickup[0] - mid[0]) * ((t - 0.5) * 2), mid[1]]);
  }
  return path;
}

/* ---------------- Recent places (localStorage) ---------------- */

const RECENT_KEY = 'aarvix_recent_places';

export function getRecentPlaces(): Place[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') as Place[];
  } catch {
    return [];
  }
}

export function saveRecentPlace(place: Place): void {
  try {
    const rest = getRecentPlaces().filter((p) => !(p.lat === place.lat && p.lng === place.lng));
    localStorage.setItem(RECENT_KEY, JSON.stringify([place, ...rest].slice(0, 6)));
  } catch {
    /* private mode */
  }
}
