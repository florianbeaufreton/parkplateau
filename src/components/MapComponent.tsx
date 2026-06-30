import { useMemo, useEffect, useCallback } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap, useMapEvents } from 'react-leaflet';
import type { GeoJSONCollection, GeoJSONFeature } from '../types/parking';
import { getStatusFromProps, STATUS_COLORS } from '../utils/parkingLogic';
import type { PanneauProps } from '../utils/parkingLogic';

const PLATEAU_CENTER: [number, number] = [45.5225, -73.5818];
const DEFAULT_ZOOM = 15;

const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

function GeolocationButton() {
  const map = useMap();
  useMapEvents({
    locationfound(e) { map.flyTo(e.latlng, 17, { animate: true, duration: 1 }); },
  });
  return (
    <button
      onClick={() => map.locate()}
      className="absolute bottom-36 right-3 z-[999] w-11 h-11 bg-white rounded-2xl shadow-md flex items-center justify-center border border-slate-100 active:scale-95 transition-transform"
      aria-label="Ma position"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
        <circle cx="12" cy="12" r="9" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    </button>
  );
}

function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute bottom-52 right-3 z-[999] flex flex-col gap-1">
      <button onClick={() => map.zoomIn()} className="w-11 h-11 bg-white rounded-2xl shadow-md flex items-center justify-center border border-slate-100 text-slate-600 font-bold text-lg active:scale-95 transition-transform">+</button>
      <button onClick={() => map.zoomOut()} className="w-11 h-11 bg-white rounded-2xl shadow-md flex items-center justify-center border border-slate-100 text-slate-600 font-bold text-lg active:scale-95 transition-transform">−</button>
    </div>
  );
}

interface MarkersProps {
  features: GeoJSONFeature[];
  simulatedDate: Date;
  onCountChange: (libres: number, interdits: number) => void;
  onMarkerClick: (props: PanneauProps) => void;
}

function PanneauMarkers({ features, simulatedDate, onCountChange, onMarkerClick }: MarkersProps) {
  const { s3rMarkers, autreMarkers, libres, interdits } = useMemo(() => {
    let libres = 0;
    let interdits = 0;
    const s3r: Array<{ i: number; lat: number; lon: number; status: 'gratuit' | 'interdit' | 'inconnu'; props: PanneauProps }> = [];
    const autre: Array<{ i: number; lat: number; lon: number; desc: string }> = [];

    features.forEach((f, i) => {
      const type = f.properties['t'] as string;
      const coords = f.geometry.coordinates as [number, number];
      const lat = coords[1], lon = coords[0];

      if (type === 's3r') {
        const props = f.properties as unknown as PanneauProps;
        const status = getStatusFromProps(props, simulatedDate);
        if (status === 'gratuit') libres++;
        else interdits++;
        s3r.push({ i, lat, lon, status, props });
      } else {
        autre.push({ i: i + 100000, lat, lon, desc: f.properties['d'] as string });
      }
    });

    return { s3rMarkers: s3r, autreMarkers: autre, libres, interdits };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, simulatedDate.getHours(), simulatedDate.getDay()]);

  useEffect(() => {
    onCountChange(libres, interdits);
  }, [libres, interdits, onCountChange]);

  return (
    <>
      {/* Poteaux sans S3R — gris translucide, en dessous */}
      {autreMarkers.map(({ i, lat, lon, desc }) => (
        <CircleMarker
          key={i}
          center={[lat, lon]}
          radius={3}
          pathOptions={{
            color: '#94a3b8',
            fillColor: '#cbd5e1',
            fillOpacity: 0.5,
            weight: 1,
            opacity: 0.6,
          }}
          eventHandlers={{
            click: () => onMarkerClick({
              d: desc, hd: 0, hf: 0, jd: 0, jf: 6,
            }),
          }}
        />
      ))}

      {/* Poteaux S3R — rouges/verts, au-dessus */}
      {s3rMarkers.map(({ i, lat, lon, status, props }) => (
        <CircleMarker
          key={i}
          center={[lat, lon]}
          radius={5}
          pathOptions={{
            color: 'white',
            fillColor: STATUS_COLORS[status],
            fillOpacity: 0.92,
            weight: 1.5,
            opacity: 1,
          }}
          eventHandlers={{
            click: () => onMarkerClick(props),
          }}
        />
      ))}
    </>
  );
}

interface Props {
  geoData: GeoJSONCollection | null;
  simulatedDate: Date;
  onCountChange: (libres: number, interdits: number) => void;
  onMarkerClick: (props: PanneauProps) => void;
}

export default function MapComponent({ geoData, simulatedDate, onCountChange, onMarkerClick }: Props) {
  const handleMarkerClick = useCallback(onMarkerClick, [onMarkerClick]);

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={PLATEAU_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={false}
        preferCanvas={false}
      >
        <TileLayer attribution={TILE_ATTR} url={TILE_URL} />
        {geoData && (
          <PanneauMarkers
            features={geoData.features}
            simulatedDate={simulatedDate}
            onCountChange={onCountChange}
            onMarkerClick={handleMarkerClick}
          />
        )}
        <GeolocationButton />
        <ZoomControls />
      </MapContainer>
    </div>
  );
}
