import { useState } from 'react';
import TimeSlider from './TimeSlider';
import PanneauDecoder from './PanneauDecoder';

type Tab = 'carte' | 'panneau';

interface Props {
  simulatedHour: number;
  simulatedDay: number;
  isLive: boolean;
  onHourChange: (h: number) => void;
  onDayChange: (d: number) => void;
  onResetLive: () => void;
}

export default function BottomSheet({
  simulatedHour, simulatedDay, isLive,
  onHourChange, onDayChange, onResetLive,
}: Props) {
  const [tab, setTab] = useState<Tab>('carte');
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`absolute bottom-0 left-0 right-0 z-[999] transition-all duration-300 ${expanded ? 'h-[70vh]' : 'h-auto'}`}>
      {/* Drag handle */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex justify-center pt-2 pb-1 bg-transparent"
        aria-label={expanded ? 'Réduire' : 'Agrandir'}
      >
        <div className="w-10 h-1 bg-slate-300 rounded-full" />
      </button>

      <div className="bg-slate-50 rounded-t-3xl shadow-[0_-4px_24px_rgba(0,0,0,0.10)] overflow-hidden">
        {/* Tabs */}
        <div className="flex gap-1 px-3 pt-3 pb-2">
          <button
            onClick={() => setTab('carte')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === 'carte' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'
            }`}
          >
            🗺 Carte
          </button>
          <button
            onClick={() => setTab('panneau')}
            className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors ${
              tab === 'panneau' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'
            }`}
          >
            🪧 Panneau
          </button>
        </div>

        {/* Contenu des tabs */}
        <div className={`overflow-y-auto ${expanded ? 'max-h-[calc(70vh-80px)]' : ''}`}>
          {tab === 'carte' && (
            <div>
              <TimeSlider
                simulatedHour={simulatedHour}
                simulatedDay={simulatedDay}
                onHourChange={onHourChange}
                onDayChange={onDayChange}
              />
              {!isLive && (
                <div className="px-3 pb-3">
                  <button
                    onClick={onResetLive}
                    className="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold active:scale-95 transition-transform"
                  >
                    🟢 Revenir en temps réel
                  </button>
                </div>
              )}
              {isLive && (
                <p className="text-center text-xs text-slate-400 pb-3">
                  Déplace le curseur pour simuler une heure
                </p>
              )}
            </div>
          )}
          {tab === 'panneau' && <PanneauDecoder />}
        </div>
      </div>
    </div>
  );
}
