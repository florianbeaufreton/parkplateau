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
    <div className={`absolute bottom-0 left-0 right-0 z-[999] transition-all duration-300 ease-out ${expanded ? 'h-[72vh]' : 'h-auto'}`}>
      {/* Drag handle */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex flex-col items-center pt-2 pb-1 bg-transparent touch-none"
        aria-label={expanded ? 'Réduire' : 'Agrandir'}
      >
        <div className={`w-9 h-1 rounded-full transition-colors ${expanded ? 'bg-slate-400' : 'bg-slate-300'}`} />
      </button>

      <div className="bg-slate-50/98 backdrop-blur-xl rounded-t-3xl shadow-[0_-8px_32px_rgba(0,0,0,0.08)] overflow-hidden border-t border-white/80">

        {/* Tabs */}
        <div className="flex gap-1.5 px-3 pt-2.5 pb-2">
          <button
            onClick={() => setTab('carte')}
            className={`flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all ${
              tab === 'carte'
                ? 'bg-white shadow-sm text-slate-800'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            🗺 Carte
          </button>
          <button
            onClick={() => setTab('panneau')}
            className={`flex-1 py-2 rounded-xl text-[13px] font-semibold transition-all ${
              tab === 'panneau'
                ? 'bg-white shadow-sm text-slate-800'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            🪧 Panneau
          </button>
        </div>

        {/* Contenu */}
        <div className={`overflow-y-auto overscroll-contain ${expanded ? 'max-h-[calc(72vh-72px)]' : ''}`}>
          {tab === 'carte' && (
            <div className="pb-2">
              <TimeSlider
                simulatedHour={simulatedHour}
                simulatedDay={simulatedDay}
                onHourChange={onHourChange}
                onDayChange={onDayChange}
              />
              {!isLive ? (
                <div className="px-3 pb-1">
                  <button
                    onClick={onResetLive}
                    className="w-full py-2.5 bg-emerald-500 text-white rounded-xl text-sm font-semibold shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-white/80 animate-pulse" />
                    Revenir en temps réel
                  </button>
                </div>
              ) : (
                <p className="text-center text-[11px] text-slate-400 pb-3">
                  Déplace le curseur pour simuler une heure d'arrivée
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
