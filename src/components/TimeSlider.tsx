interface Props {
  simulatedHour: number;
  simulatedDay: number;
  onHourChange: (h: number) => void;
  onDayChange: (d: number) => void;
}

const JOURS = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default function TimeSlider({ simulatedHour, simulatedDay, onHourChange, onDayChange }: Props) {
  const padH = (h: number) => `${h}h00`;

  return (
    <div className="bg-white rounded-2xl shadow-md px-4 py-3 mx-3 mb-2">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Simuler une heure</span>
        <span className="text-sm font-bold text-slate-800">{padH(simulatedHour)}</span>
      </div>

      {/* Slider heures */}
      <input
        type="range"
        min={0}
        max={23}
        value={simulatedHour}
        onChange={e => onHourChange(Number(e.target.value))}
        className="w-full h-2 rounded-full accent-emerald-500 cursor-pointer"
      />

      {/* Selector jours */}
      <div className="flex gap-1 mt-3 justify-between">
        {JOURS.map((j, idx) => (
          <button
            key={j}
            onClick={() => onDayChange(idx)}
            className={`flex-1 text-xs py-1 rounded-lg font-medium transition-colors ${
              simulatedDay === idx
                ? 'bg-emerald-500 text-white'
                : 'bg-slate-100 text-slate-600 active:bg-slate-200'
            }`}
          >
            {j}
          </button>
        ))}
      </div>
    </div>
  );
}
