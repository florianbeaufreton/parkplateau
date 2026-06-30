interface Props {
  simulatedDate: Date;
  isLive: boolean;
}

const JOURS_FR = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export default function Legend({ simulatedDate, isLive }: Props) {
  const heure = `${simulatedDate.getHours()}h${String(simulatedDate.getMinutes()).padStart(2, '0')}`;
  const jour = JOURS_FR[simulatedDate.getDay()];

  return (
    <div className="absolute top-4 left-4 right-4 z-[999] pointer-events-none">
      <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-md px-4 py-2.5 flex items-center justify-between">
        {/* Logo / Titre */}
        <div>
          <p className="text-xs font-bold text-slate-800 leading-none">🅿 ParkPlateau</p>
          <p className="text-[10px] text-slate-400 leading-none mt-0.5">Le Plateau-Mont-Royal</p>
        </div>

        {/* Heure simulée */}
        <div className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
          isLive ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
        }`}>
          {isLive ? '🟢 En direct' : `⏱ ${jour} ${heure}`}
        </div>
      </div>

      {/* Légende couleurs */}
      <div className="flex gap-2 mt-2 justify-center">
        <span className="bg-white/90 backdrop-blur-sm text-[10px] font-medium text-slate-600 rounded-full px-2.5 py-1 shadow-sm flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" /> Gratuit
        </span>
        <span className="bg-white/90 backdrop-blur-sm text-[10px] font-medium text-slate-600 rounded-full px-2.5 py-1 shadow-sm flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block" /> Interdit (vignette)
        </span>
        <span className="bg-white/90 backdrop-blur-sm text-[10px] font-medium text-slate-600 rounded-full px-2.5 py-1 shadow-sm flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" /> Inconnu
        </span>
      </div>
    </div>
  );
}
