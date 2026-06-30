import { useMemo } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import type { GeoJSONCollection, GeoJSONFeature } from '../types/parking';
import { getStatusFromProps, STATUS_COLORS } from '../utils/parkingLogic';
import type { PanneauProps } from '../utils/parkingLogic';

const PLATEAU_CENTER: [number, number] = [45.5225, -73.5818];
const DEFAULT_ZOOM = 15;

function GeolocationButton() {
  const map = useMap();
  return (
    <button
      onClick={() => map.locate({ setView: true, maxZoom: 17 })}
      className="absolute bottom-36 right-4 z-[999] w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-xl border border-slate-200 active:scale-95 transition-transform"
      aria-label="Ma position"
    >
      📍
    </button>
  );
}

interface MarkersProps {
  features: GeoJSONFeature[];
  simulatedDate: Date;
}

function PanneauMarkers({ features, simulatedDate }: MarkersProps) {
  // Re-calcule les couleurs quand la date change
  const markers = useMemo(() => {
    return features.map((f, i) => {
      const props = f.properties as unknown as PanneauProps;
      const status = getStatusFromProps(props, simulatedDate);
      const coords = f.geometry.coordinates as [number, number]; // [lon, lat]
      return { i, lat: coords[1], lon: coords[0], status, desc: props.d };
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [features, simulatedDate.getHours(), simulatedDate.getDay()]);

  return (
    <>
      {markers.map(({ i, lat, lon, status, desc }) => (
        <CircleMarker
          key={i}
          center={[lat, lon]}
          radius={5}
          pathOptions={{
            color: STATUS_COLORS[status],
            fillColor: STATUS_COLORS[status],
            fillOpacity: 0.85,
            weight: 1,
            opacity: 0.9,
          }}
        >
          <Popup>
            <div className="text-sm font-semibold">
              {status === 'interdit' ? '❌ Interdit sans vignette' : '✅ Stationnement libre'}
            </div>
            <div className="text-xs text-gray-500 mt-1">{desc}</div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}

interface Props {
  geoData: GeoJSONCollection | null;
  simulatedDate: Date;
  onFeatureClick?: () => void;
}

export default function MapComponent({ geoData, simulatedDate }: Props) {
  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={PLATEAU_CENTER}
        zoom={DEFAULT_ZOOM}
        className="w-full h-full"
        zoomControl={false}
        preferCanvas={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {geoData && (
          <PanneauMarkers features={geoData.features} simulatedDate={simulatedDate} />
        )}
        <GeolocationButton />
      </MapContainer>
    </div>
  );
}
