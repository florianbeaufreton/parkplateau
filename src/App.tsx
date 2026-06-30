import { useState, useEffect, useCallback } from 'react';
import MapComponent from './components/MapComponent';
import BottomSheet from './components/BottomSheet';
import Legend from './components/Legend';
import PanneauSheet from './components/PanneauSheet';
import { useGeoJSON } from './hooks/useGeoJSON';
import type { PanneauProps } from './utils/parkingLogic';

function buildDate(day: number, hour: number): Date {
  const d = new Date();
  const diff = day - d.getDay();
  d.setDate(d.getDate() + diff);
  d.setHours(hour, 0, 0, 0);
  return d;
}

export default function App() {
  const { data: geoData, loading, error } = useGeoJSON();

  const now = new Date();
  const [simulatedDay, setSimulatedDay] = useState(now.getDay());
  const [simulatedHour, setSimulatedHour] = useState(now.getHours());
  const [isLive, setIsLive] = useState(true);
  const [countLibres, setCountLibres] = useState(0);
  const [countInterdits, setCountInterdits] = useState(0);

  // Sheet panneau
  const [selectedPanneau, setSelectedPanneau] = useState<PanneauProps | null>(null);

  useEffect(() => {
    if (!isLive) return;
    const timer = setInterval(() => {
      const n = new Date();
      setSimulatedDay(n.getDay());
      setSimulatedHour(n.getHours());
    }, 60_000);
    return () => clearInterval(timer);
  }, [isLive]);

  const handleHourChange = useCallback((h: number) => {
    setSimulatedHour(h);
    setIsLive(false);
  }, []);

  const handleDayChange = useCallback((d: number) => {
    setSimulatedDay(d);
    setIsLive(false);
  }, []);

  const handleResetLive = useCallback(() => {
    const n = new Date();
    setSimulatedDay(n.getDay());
    setSimulatedHour(n.getHours());
    setIsLive(true);
  }, []);

  const handleCountChange = useCallback((libres: number, interdits: number) => {
    setCountLibres(libres);
    setCountInterdits(interdits);
  }, []);

  const handleMarkerClick = useCallback((props: PanneauProps) => {
    setSelectedPanneau(props);
  }, []);

  const handleSheetClose = useCallback(() => {
    setSelectedPanneau(null);
  }, []);

  const simulatedDate = buildDate(simulatedDay, simulatedHour);

  return (
    <div className="relative w-full h-full overflow-hidden bg-slate-100">
      {/* Carte plein écran */}
      <div className="absolute inset-0">
        <MapComponent
          geoData={geoData}
          simulatedDate={simulatedDate}
          onCountChange={handleCountChange}
          onMarkerClick={handleMarkerClick}
        />
      </div>

      {/* Header */}
      <Legend
        simulatedDate={simulatedDate}
        isLive={isLive}
        countLibres={countLibres}
        countInterdits={countInterdits}
      />

      {/* Chargement */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-[1000] bg-slate-50/80 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-xl px-8 py-6 text-center max-w-xs w-full mx-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <div className="text-2xl animate-bounce">🗺</div>
            </div>
            <p className="text-sm font-bold text-slate-800">Chargement des panneaux…</p>
            <p className="text-xs text-slate-400 mt-1 mb-4">3 889 zones vignette · Plateau-Mont-Royal</p>
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full animate-pulse w-3/4" />
            </div>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="absolute top-28 left-3 right-3 z-[1000]">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-800 flex items-start gap-2">
            <span className="text-base leading-none mt-0.5">⚠️</span>
            <span>Données indisponibles : {error}</span>
          </div>
        </div>
      )}

      {/* Bottom sheet contrôles */}
      {!selectedPanneau && (
        <BottomSheet
          simulatedHour={simulatedHour}
          simulatedDay={simulatedDay}
          isLive={isLive}
          onHourChange={handleHourChange}
          onDayChange={handleDayChange}
          onResetLive={handleResetLive}
        />
      )}

      {/* Sheet panneau — iOS style */}
      {selectedPanneau && (
        <PanneauSheet
          panneau={selectedPanneau}
          simulatedDate={simulatedDate}
          onClose={handleSheetClose}
        />
      )}
    </div>
  );
}
