interface Props {
  simulatedDate: Date;
  isLive: boolean;
  countLibres: number;
  countInterdits: number;
}

const JOURS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default function Legend({ simulatedDate, isLive, countLibres, countInterdits }: Props) {
  const heure = `${simulatedDate.getHours()}h${String(simulatedDate.getMinutes()).padStart(2, '0')}`;
  const jour = JOURS_FR[simulatedDate.getDay()];
  const total = countLibres + countInterdits;
  const pctLibre = total > 0 ? Math.round((countLibres / total) * 100) : 0;

  return (
    <div className="absolute top-3 left-3 right-3 z-[999] pointer-events-none">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-lg px-4 py-2.5 flex items-center justify-between border border-white/60">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm">P</div>
          <div>
            <p className="text-xs font-bold text-slate-800 leading-none">ParkPlateau</p>
            <p className="text-[10px] text-slate-400 leading-none mt-0.5">Le Plateau-Mont-Royal</p>
          </div>
        </div>
        <div className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
          isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
          {isLive ? 'En direct' : `${jour} ${heure}`}
        </div>
      </div>

      {/* Stats + légende */}
      {total > 0 && (
        <div className="mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-sm px-3 py-2 border border-white/60">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">Zones vignette libres</span>
            <span className="text-[11px] font-bold text-slate-700">{countLibres} / {total}</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-emerald-400 rounded-full transition-all duration-500" style={{ width: `${pctLibre}%` }} />
          </div>
          <div className="flex gap-3 flex-wrap">
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" /> Libre maintenant
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500 inline-block" /> Vignette requise
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-slate-300 inline-block" /> Autre restriction
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
