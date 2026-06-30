import { useState, useEffect, useCallback } from 'react';
import MapComponent from './components/MapComponent';
import BottomSheet from './components/BottomSheet';
import Legend from './components/Legend';
import { useGeoJSON } from './hooks/useGeoJSON';

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

  const simulatedDate = buildDate(simulatedDay, simulatedHour);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0">
        <MapComponent
          geoData={geoData}
          simulatedDate={simulatedDate}
        />
      </div>

      <Legend simulatedDate={simulatedDate} isLive={isLive} />

      {loading && (
        <div className="absolute inset-0 flex items-center justify-center z-[1000] pointer-events-none">
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg px-6 py-5 text-center">
            <div className="text-3xl mb-2 animate-bounce">🗺</div>
            <p className="text-sm font-semibold text-slate-700">Chargement des panneaux…</p>
            <p className="text-xs text-slate-400 mt-1">3 889 zones vignette • Plateau-Mont-Royal</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <div className="absolute top-24 left-4 right-4 z-[1000]">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">
            ⚠️ Données non disponibles : {error}
          </div>
        </div>
      )}

      <BottomSheet
        simulatedHour={simulatedHour}
        simulatedDay={simulatedDay}
        isLive={isLive}
        onHourChange={handleHourChange}
        onDayChange={handleDayChange}
        onResetLive={handleResetLive}
      />
    </div>
  );
}
