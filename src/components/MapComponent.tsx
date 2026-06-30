import { useMemo, useEffect } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap, useMapEvents } from 'react-leaflet';
import type { GeoJSONCollection, GeoJSONFeature } from '../types/parking';
import { getStatusFromProps, STATUS_COLORS } from '../utils/parkingLogic';
import type { PanneauProps } from '../utils/parkingLogic';

const PLATEAU_CENTER: [number, number] = [45.5225, -73.5818];
const DEFAULT_ZOOM = 15;

// Carto Positron — fond clair très élégant, gratuit, sans clé API
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>';

function GeolocationButton() {
  const map = useMap();

  useMapEvents({
    locationfound(e) {
      map.flyTo(e.latlng, 17, { animate: true, duration: 1 });
    },
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
      <button
        onClick={() => map.zoomIn()}
        className="w-11 h-11 bg-white rounded-2xl shadow-md flex items-center justify-center border border-slate-100 text-slate-600 font-bold text-lg active:scale-95 transition-transform"
        aria-label="Zoom +"
      >+</button>
      <button
        onClick={() => map.zoomOut()}
        className="w-11 h-11 bg-white rounded-2xl shadow-md flex items-center justify-center border border-slate-100 text-slate-600 font-bold text-lg active:scale-95 transition-transform"
        aria-label="Zoom -"
      >−</button>
    </div>
  );
}

interface MarkersProps {
  features: GeoJSONFeature[];
  simulatedDate: Date;
  onCountChange: (libres: number, interdits: number) => void;
}

function PanneauMarkers({ features, simulatedDate, onCountChange }: MarkersProps) {
  const markers = useMemo(() => {
    let libres = 0;
    let interdits = 0;

    const result = features.map((f, i) => {
      const props = f.properties as unknown as PanneauProps;
      const status = getStatusFromProps(props, simulatedDate);
      if (status === 'gratuit') libres++;
      else interdits++;
      const coords = f.geometry.coordinates as [number, number];
      return { i, lat: coords[1], lon: coords[0], status, desc: props.d };
    });

    return { result, libres, interdits };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, simulatedDate.getHours(), simulatedDate.getDay()]);

  useEffect(() => {
    onCountChange(markers.libres, markers.interdits);
  }, [markers.libres, markers.interdits, onCountChange]);

  return (
    <>
      {markers.result.map(({ i, lat, lon, status, desc }) => (
        <CircleMarker
          key={i}
          center={[lat, lon]}
          radius={4}
          pathOptions={{
            color: STATUS_COLORS[status],
            fillColor: STATUS_COLORS[status],
            fillOpacity: 0.8,
            weight: 1.5,
            opacity: 1,
          }}
        >
          <Popup maxWidth={220}>
            <div style={{ padding: '2px 0' }}>
              <div style={{
                fontWeight: 700,
                fontSize: 13,
                color: status === 'interdit' ? '#dc2626' : '#16a34a',
                marginBottom: 4,
              }}>
                {status === 'interdit' ? '❌ Interdit sans vignette' : '✅ Stationnement libre'}
              </div>
              <div style={{ fontSize: 11, color: '#64748b', fontFamily: 'monospace' }}>{desc}</div>
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

interface Props {
  geoData: GeoJSONCollection | null;
  simulatedDate: Date;
  onCountChange: (libres: number, interdits: number) => void;
}

export default function MapComponent({ geoData, simulatedDate, onCountChange }: Props) {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={PLATEAU_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={false}
        preferCanvas={true}
      >
        <TileLayer attribution={TILE_ATTR} url={TILE_URL} />
        {geoData && (
          <PanneauMarkers
            features={geoData.features}
            simulatedDate={simulatedDate}
            onCountChange={onCountChange}
          />
        )}
        <GeolocationButton />
        <ZoomControls />
      </MapContainer>
    </div>
  );
}
