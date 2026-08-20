import type { LoyaltyTier } from "./types";

export function getLoyaltyTier(editionsAttended: number): LoyaltyTier {
  if (editionsAttended >= 8) return "Platino";
  if (editionsAttended >= 5) return "Oro";
  if (editionsAttended >= 3) return "Plata";
  return "Clasica";
}

export const LOYALTY_TIER_LABELS: Record<LoyaltyTier, string> = {
  Clasica: "Capanair Club Clásica",
  Plata: "Capanair Club Plata",
  Oro: "Capanair Club Oro",
  Platino: "Capanair Club Platino",
};

export const LOYALTY_TIER_STYLES: Record<LoyaltyTier, string> = {
  Clasica: "bg-navy-100 text-navy-700 border border-navy-200",
  Plata: "bg-slate-200 text-slate-700 border border-slate-300",
  Oro: "bg-gold-100 text-gold-800 border border-gold-300",
  Platino: "bg-navy-800 text-gold-200 border border-gold-500",
};

export const DAY_LABELS: Record<string, string> = {
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};
