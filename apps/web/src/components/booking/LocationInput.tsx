import React, { useEffect, useRef, useState } from 'react';
import { Crosshair, Clock, Loader2, MapPin, MapPinned, X, Building2 } from 'lucide-react';
import { MAJOR_HUBS } from '@aarvix/shared';
import { Place, getRecentPlaces, searchPlaces } from '../../services/mapService.js';

interface LocationInputProps {
  kind: 'pickup' | 'drop';
  value: Place | null;
  onSelect: (place: Place) => void;
  onClear: () => void;
  onPickOnMap: () => void;
  onUseCurrent?: () => void;
  isLocating?: boolean;
  error?: string;
}

const hubPlaces: Place[] = MAJOR_HUBS.map((h) => ({
  label: h.city,
  subtitle: h.state,
  lat: h.lat,
  lng: h.lng,
  city: h.city,
  state: h.state,
}));

export const LocationInput: React.FC<LocationInputProps> = ({
  kind,
  value,
  onSelect,
  onClear,
  onPickOnMap,
  onUseCurrent,
  isLocating,
  error,
}) => {
  const [text, setText] = useState(value ? [value.label, value.subtitle].filter(Boolean).join(', ') : '');
  const [open, setOpen] = useState(false);
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState('');
  const wrapRef = useRef<HTMLDivElement>(null);
  const typingRef = useRef(false);

  // sync text when the value changes from outside (swap, map pin, current location)
  useEffect(() => {
    if (typingRef.current) return;
    setText(value ? [value.label, value.subtitle].filter(Boolean).join(', ') : '');
  }, [value]);

  // debounced search
  useEffect(() => {
    if (!open || text.trim().length < 3 || !typingRef.current) {
      setResults([]);
      return;
    }
    const ctrl = new AbortController();
    setLoading(true);
    setSearchError('');
    const t = setTimeout(async () => {
      try {
        setResults(await searchPlaces(text, ctrl.signal));
      } catch (e) {
        if ((e as Error).name !== 'AbortError') setSearchError('Could not search right now. Pick a city below or drop a pin on the map.');
      } finally {
        if (!ctrl.signal.aborted) setLoading(false);
      }
    }, 450);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [text, open]);

  // close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, []);

  const choose = (p: Place) => {
    typingRef.current = false;
    setText([p.label, p.subtitle].filter(Boolean).join(', '));
    setOpen(false);
    onSelect(p);
  };

  const isPickup = kind === 'pickup';
  const showSuggestions = text.trim().length < 3;
  const recents = showSuggestions ? getRecentPlaces() : [];

  return (
    <div ref={wrapRef} className="relative">
      <div
        className={`flex items-center gap-3 rounded-xl border bg-white px-3 py-2.5 transition-shadow focus-within:ring-2 ${
          error ? 'border-rose-400 focus-within:ring-rose-200' : 'border-warm-300 focus-within:ring-forest-200 focus-within:border-forest-700'
        }`}
      >
        <span
          className={`w-3 h-3 shrink-0 ${isPickup ? 'rounded-full bg-forest-800' : 'rounded-sm bg-gold-500'}`}
          aria-hidden
        />
        <input
          value={text}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            typingRef.current = true;
            setText(e.target.value);
            setOpen(true);
          }}
          placeholder={isPickup ? 'Pickup location' : 'Where to deliver?'}
          aria-label={isPickup ? 'Pickup location' : 'Drop location'}
          className="flex-1 min-w-0 bg-transparent text-sm font-medium text-neutral-900 placeholder-neutral-400 focus:outline-none"
        />
        {loading && <Loader2 className="w-4 h-4 animate-spin text-neutral-400 shrink-0" />}
        {text && !loading && (
          <button
            type="button"
            onClick={() => {
              typingRef.current = true;
              setText('');
              setResults([]);
              onClear();
              setOpen(true);
            }}
            className="text-neutral-400 hover:text-neutral-700 shrink-0"
            aria-label="Clear location"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>}

      {open && (
        <div className="absolute z-[1200] left-0 right-0 mt-1.5 bg-white border border-warm-200 rounded-xl shadow-elevated max-h-80 overflow-y-auto">
          {/* quick actions */}
          <div className="p-1.5 border-b border-warm-200">
            {isPickup && onUseCurrent && (
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  typingRef.current = false;
                  onUseCurrent();
                }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-forest-50"
              >
                {isLocating ? <Loader2 className="w-4 h-4 animate-spin text-forest-800" /> : <Crosshair className="w-4 h-4 text-forest-800" />}
                <span className="text-sm font-semibold text-forest-900">Use my current location</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                typingRef.current = false;
                onPickOnMap();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-forest-50"
            >
              <MapPinned className="w-4 h-4 text-forest-800" />
              <span className="text-sm font-semibold text-forest-900">Choose on map</span>
            </button>
          </div>

          {searchError && <p className="px-4 py-3 text-xs text-amber-700 bg-amber-50">{searchError}</p>}

          {!showSuggestions &&
            results.map((p, i) => (
              <button
                key={`${p.lat}-${p.lng}-${i}`}
                type="button"
                onClick={() => choose(p)}
                className="w-full flex items-start gap-3 px-4 py-2.5 text-left hover:bg-warm-100"
              >
                <MapPin className="w-4 h-4 mt-0.5 text-neutral-400 shrink-0" />
                <span className="min-w-0">
                  <span className="block text-sm font-semibold text-neutral-900 truncate">{p.label}</span>
                  <span className="block text-xs text-neutral-500 truncate">{p.subtitle}</span>
                </span>
              </button>
            ))}
          {!showSuggestions && !loading && !searchError && results.length === 0 && text.trim().length >= 3 && (
            <p className="px-4 py-3 text-xs text-neutral-500">No places found. Try a landmark or area name, or choose on map.</p>
          )}

          {showSuggestions && (
            <>
              {recents.length > 0 && (
                <div className="py-1.5">
                  <p className="px-4 pt-1 pb-1 text-xs font-semibold text-neutral-500">Recent</p>
                  {recents.map((p, i) => (
                    <button
                      key={`r-${i}`}
                      type="button"
                      onClick={() => choose(p)}
                      className="w-full flex items-start gap-3 px-4 py-2 text-left hover:bg-warm-100"
                    >
                      <Clock className="w-4 h-4 mt-0.5 text-neutral-400 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-sm font-medium text-neutral-900 truncate">{p.label}</span>
                        <span className="block text-xs text-neutral-500 truncate">{p.subtitle}</span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className="py-1.5 border-t border-warm-200">
                <p className="px-4 pt-1 pb-1 text-xs font-semibold text-neutral-500">Popular cities</p>
                <div className="flex flex-wrap gap-1.5 px-3 pb-2">
                  {hubPlaces.map((h) => (
                    <button
                      key={h.label}
                      type="button"
                      onClick={() => choose(h)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-warm-300 text-xs font-medium text-neutral-700 hover:border-forest-700 hover:bg-forest-50"
                    >
                      <Building2 className="w-3 h-3 text-neutral-400" />
                      {h.label}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationInput;
