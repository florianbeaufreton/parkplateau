import { useState } from 'react';
import { isPanneauActif } from '../utils/parkingLogic';
import type { PanneauProps } from '../utils/parkingLogic';

const JOURS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];

export default function PanneauDecoder() {
  const [heureDeb, setHeureDeb] = useState(9);
  const [heureFin, setHeureFin] = useState(23);
  const [jourDeb, setJourDeb] = useState(1);
  const [jourFin, setJourFin] = useState(6);
  const [heureTest, setHeureTest] = useState(new Date().getHours());
  const [jourTest, setJourTest] = useState(new Date().getDay());

  const panneau: PanneauProps = { d: '', hd: heureDeb, hf: heureFin, jd: jourDeb, jf: jourFin };
  const testDate = new Date();
  testDate.setHours(heureTest, 0, 0, 0);

  // Pour le test de jour, on simule via getDay() override
  const testDateWithDay = new Date(testDate);
  const diff = jourTest - testDateWithDay.getDay();
  testDateWithDay.setDate(testDateWithDay.getDate() + diff);
  const estInterdit = isPanneauActif(panneau, testDateWithDay);

  return (
    <div className="bg-white rounded-2xl shadow-md mx-3 mb-3 p-4">
      <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
        🪧 Simulateur de panneau
      </h2>

      {/* Panneau stylisé */}
      <div className="bg-slate-800 text-white rounded-xl p-3 mb-4 text-center font-mono text-sm leading-relaxed">
        <div className="text-red-400 font-bold text-base">🅿 INTERDIT</div>
        <div className="mt-1">{heureDeb}h00 – {heureFin}h00</div>
        <div className="text-slate-400 text-xs">
          {JOURS[jourDeb].substring(0,3).toUpperCase()} → {JOURS[jourFin].substring(0,3).toUpperCase()}
        </div>
        <div className="text-yellow-300 text-xs mt-1.5 border-t border-slate-600 pt-1.5">
          SAUF VIGNETTE ✦ S3R
        </div>
      </div>

      {/* Paramètres du panneau */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="text-xs text-slate-500 block mb-1">Heure début</label>
          <input type="number" min={0} max={23} value={heureDeb}
            onChange={e => setHeureDeb(Number(e.target.value))}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center font-medium" />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Heure fin</label>
          <input type="number" min={0} max={24} value={heureFin}
            onChange={e => setHeureFin(Number(e.target.value))}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center font-medium" />
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Jour début</label>
          <select value={jourDeb} onChange={e => setJourDeb(Number(e.target.value))}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm">
            {JOURS.map((j, i) => <option key={j} value={i}>{j}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs text-slate-500 block mb-1">Jour fin</label>
          <select value={jourFin} onChange={e => setJourFin(Number(e.target.value))}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm">
            {JOURS.map((j, i) => <option key={j} value={i}>{j}</option>)}
          </select>
        </div>
      </div>

      {/* Test horaire */}
      <div className="border-t border-slate-100 pt-3 mb-3">
        <p className="text-xs font-semibold text-slate-500 mb-2">Tester pour :</p>
        <div className="flex gap-2">
          <select value={jourTest} onChange={e => setJourTest(Number(e.target.value))}
            className="flex-1 border border-slate-200 rounded-lg px-2 py-1.5 text-sm">
            {JOURS.map((j, i) => <option key={j} value={i}>{j}</option>)}
          </select>
          <div className="flex items-center gap-1">
            <input type="number" min={0} max={23} value={heureTest}
              onChange={e => setHeureTest(Number(e.target.value))}
              className="w-16 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-center font-medium" />
            <span className="text-xs text-slate-400">h</span>
          </div>
        </div>
      </div>

      {/* Verdict */}
      <div className={`rounded-xl p-3.5 text-center font-bold text-sm transition-colors ${
        estInterdit
          ? 'bg-red-50 text-red-700 border border-red-200'
          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
      }`}>
        {estInterdit
          ? '❌ Interdit sans vignette à cette heure'
          : '✅ Stationnement autorisé pour tous'}
      </div>
    </div>
  );
}
