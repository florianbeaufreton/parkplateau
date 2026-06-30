import { useRef, useEffect } from 'react';

interface Props {
  simulatedHour: number;
  simulatedDay: number;
  onHourChange: (h: number) => void;
  onDayChange: (d: number) => void;
}

const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

const PERIODS = [
  { label: 'Nuit', range: [0, 7], emoji: '🌙' },
  { label: 'Matin', range: [7, 12], emoji: '☀️' },
  { label: 'Après-midi', range: [12, 18], emoji: '🌤' },
  { label: 'Soir', range: [18, 24], emoji: '🌆' },
];

function getPeriod(h: number) {
  return PERIODS.find(p => h >= p.range[0] && h < p.range[1]) ?? PERIODS[0];
}

export default function TimeSlider({ simulatedHour, simulatedDay, onHourChange, onDayChange }: Props) {
  const sliderRef = useRef<HTMLInputElement>(null);

  // Met à jour la variable CSS pour la track colorée
  useEffect(() => {
    if (sliderRef.current) {
      const pct = (simulatedHour / 23) * 100;
      sliderRef.current.style.setProperty('--val', `${pct}%`);
    }
  }, [simulatedHour]);

  const period = getPeriod(simulatedHour);
  const pad = (h: number) => `${h}h00`;

  return (
    <div className="bg-white rounded-2xl shadow-sm mx-3 mb-2 px-4 py-3 border border-slate-100">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-base leading-none">{period.emoji}</span>
          <div>
            <p className="text-xs font-bold text-slate-700 leading-none">{period.label}</p>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">Simuler une heure</p>
          </div>
        </div>
        <div className="bg-slate-100 px-2.5 py-1 rounded-lg">
          <span className="text-sm font-bold text-slate-800 tabular-nums">{pad(simulatedHour)}</span>
        </div>
      </div>

      {/* Slider */}
      <input
        ref={sliderRef}
        type="range"
        min={0}
        max={23}
        step={1}
        value={simulatedHour}
        onChange={e => onHourChange(Number(e.target.value))}
        className="w-full cursor-pointer"
        style={{ '--val': `${(simulatedHour / 23) * 100}%` } as React.CSSProperties}
      />

      {/* Marqueurs heures */}
      <div className="flex justify-between mt-1 px-0.5">
        {['0h', '6h', '12h', '18h', '23h'].map(h => (
          <span key={h} className="text-[9px] text-slate-300 font-medium">{h}</span>
        ))}
      </div>

      {/* Sélecteur jours */}
      <div className="flex gap-1 mt-3">
        {JOURS.map((j, idx) => (
          <button
            key={j}
            onClick={() => onDayChange(idx)}
            className={`flex-1 text-[11px] py-1.5 rounded-lg font-semibold transition-all ${
              simulatedDay === idx
                ? 'bg-emerald-500 text-white shadow-sm scale-105'
                : 'bg-slate-100 text-slate-500 active:bg-slate-200'
            }`}
          >
            {j}
          </button>
        ))}
      </div>
    </div>
  );
}
