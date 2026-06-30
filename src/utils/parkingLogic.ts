import type { StatusParking } from '../types/parking';

export interface PanneauProps {
  d: string;   // description raw
  hd: number;  // heure début
  hf: number;  // heure fin
  jd: number;  // jour début (0=Dim, 6=Sam)
  jf: number;  // jour fin
}

/**
 * Retourne true si le panneau S3R est actif (interdit sans vignette) à la date donnée.
 */
export function isPanneauActif(p: PanneauProps, date: Date): boolean {
  const jour = date.getDay();
  const heure = date.getHours() + date.getMinutes() / 60;

  // Cas "EN TOUT TEMPS" : hd=0, hf=24
  const heuresOK = heure >= p.hd && heure < p.hf;

  // Gestion plage de jours qui wrappe (ex: Ven→Lun = 5→1)
  const joursOK =
    p.jd <= p.jf
      ? jour >= p.jd && jour <= p.jf
      : jour >= p.jd || jour <= p.jf;

  return joursOK && heuresOK;
}

export function getStatusFromProps(props: PanneauProps, date: Date): StatusParking {
  return isPanneauActif(props, date) ? 'interdit' : 'gratuit';
}

export const STATUS_COLORS: Record<StatusParking, string> = {
  gratuit: '#22c55e',
  interdit: '#ef4444',
  inconnu: '#94a3b8',
};
