import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
// @ts-ignore - Vite handles CSS imports
import 'leaflet/dist/leaflet.css';
import type { LatLngTuple, Place } from '../../services/mapService.js';

export type PinKind = 'pickup' | 'drop';

interface MapViewProps {
  pickup: Place | null;
  drop: Place | null;
  route?: LatLngTuple[];
  /** Live vehicle position (shown as a truck marker) */
  vehicle?: LatLngTuple | null;
  /** When set, tapping the map places that pin */
  pickMode?: PinKind | null;
  onMapPick?: (kind: PinKind, lat: number, lng: number) => void;
  onPinDrag?: (kind: PinKind, lat: number, lng: number) => void;
  /** Extra padding (px) so the route is not hidden behind the side panel / bottom sheet */
  fitPadding?: { top: number; right: number; bottom: number; left: number };
  className?: string;
}

const pinIcon = (color: string, letter: string) =>
  L.divIcon({
    className: '',
    iconSize: [34, 44],
    iconAnchor: [17, 42],
    html: `<div style="position:relative;width:34px;height:44px">
      <div style="width:34px;height:34px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:3px solid #fff;box-shadow:0 3px 8px rgba(0,0,0,.35)"></div>
      <div style="position:absolute;top:0;left:0;width:34px;height:34px;display:flex;align-items:center;justify-content:center;color:#fff;font:800 13px Inter,sans-serif">${letter}</div>
    </div>`,
  });

const truckIcon = L.divIcon({
  className: '',
  iconSize: [44, 44],
  iconAnchor: [22, 22],
  html: `<div style="width:44px;height:44px;border-radius:50%;background:#fff;border:3px solid #3C5410;box-shadow:0 4px 12px rgba(0,0,0,.35);display:flex;align-items:center;justify-content:center;font-size:22px">🚚</div>`,
});

export const MapView: React.FC<MapViewProps> = ({
  pickup,
  drop,
  route,
  vehicle,
  pickMode,
  onMapPick,
  onPinDrag,
  fitPadding = { top: 60, right: 60, bottom: 60, left: 60 },
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const pickupMarker = useRef<L.Marker | null>(null);
  const dropMarker = useRef<L.Marker | null>(null);
  const routeLine = useRef<L.Polyline | null>(null);
  const routeCasing = useRef<L.Polyline | null>(null);
  const vehicleMarker = useRef<L.Marker | null>(null);

  // keep latest callbacks without re-binding map events
  const pickModeRef = useRef(pickMode);
  const onMapPickRef = useRef(onMapPick);
  const onPinDragRef = useRef(onPinDrag);
  pickModeRef.current = pickMode;
  onMapPickRef.current = onMapPick;
  onPinDragRef.current = onPinDrag;

  // init map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, { zoomControl: false, attributionControl: true }).setView(
      [12.9716, 77.5946],
      11
    );
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map);

    map.on('click', (e: L.LeafletMouseEvent) => {
      if (pickModeRef.current && onMapPickRef.current) {
        onMapPickRef.current(pickModeRef.current, e.latlng.lat, e.latlng.lng);
      }
    });

    const ro = new ResizeObserver(() => map.invalidateSize());
    ro.observe(containerRef.current);
    mapRef.current = map;

    return () => {
      ro.disconnect();
      map.remove();
      mapRef.current = null;
      pickupMarker.current = dropMarker.current = routeLine.current = routeCasing.current = vehicleMarker.current = null;
    };
  }, []);

  // cursor hint while picking on map
  useEffect(() => {
    if (containerRef.current) containerRef.current.style.cursor = pickMode ? 'crosshair' : '';
  }, [pickMode]);

  // markers
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const sync = (
      ref: React.MutableRefObject<L.Marker | null>,
      place: Place | null,
      kind: PinKind,
      color: string,
      letter: string
    ) => {
      if (!place) {
        ref.current?.remove();
        ref.current = null;
        return;
      }
      if (!ref.current) {
        const m = L.marker([place.lat, place.lng], { icon: pinIcon(color, letter), draggable: true }).addTo(map);
        m.on('dragend', () => {
          const { lat, lng } = m.getLatLng();
          onPinDragRef.current?.(kind, lat, lng);
        });
        ref.current = m;
      } else {
        ref.current.setLatLng([place.lat, place.lng]);
      }
    };

    sync(pickupMarker, pickup, 'pickup', '#3C5410', 'A');
    sync(dropMarker, drop, 'drop', '#7FB01A', 'B');
  }, [pickup, drop]);

  // route polyline
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    routeLine.current?.remove();
    routeCasing.current?.remove();
    routeLine.current = routeCasing.current = null;
    if (route && route.length > 1) {
      routeCasing.current = L.polyline(route, { color: '#ffffff', weight: 9, opacity: 0.9 }).addTo(map);
      routeLine.current = L.polyline(route, { color: '#3C5410', weight: 5, opacity: 0.95 }).addTo(map);
    }
  }, [route]);

  // fit view
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const pts: LatLngTuple[] = [];
    if (route && route.length > 1) pts.push(...route);
    else {
      if (pickup) pts.push([pickup.lat, pickup.lng]);
      if (drop) pts.push([drop.lat, drop.lng]);
    }
    if (pts.length === 0) return;
    if (pts.length === 1) {
      map.setView(pts[0], 15, { animate: true });
      return;
    }
    map.fitBounds(L.latLngBounds(pts), {
      paddingTopLeft: [fitPadding.left, fitPadding.top],
      paddingBottomRight: [fitPadding.right, fitPadding.bottom],
      animate: true,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickup, drop, route]);

  // live vehicle marker
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (!vehicle) {
      vehicleMarker.current?.remove();
      vehicleMarker.current = null;
      return;
    }
    if (!vehicleMarker.current) {
      vehicleMarker.current = L.marker(vehicle, { icon: truckIcon, zIndexOffset: 1000 }).addTo(map);
    } else {
      vehicleMarker.current.setLatLng(vehicle);
    }
  }, [vehicle]);

  return <div ref={containerRef} className={`w-full h-full bg-warm-200 ${className}`} />;
};

export default MapView;
