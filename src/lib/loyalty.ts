import type { LoyaltyTier } from "./types";

export function getLoyaltyTier(editionsAttended: number): LoyaltyTier {
  if (editionsAttended >= 8) return "Platino";
  if (editionsAttended >= 5) return "Oro";
  if (editionsAttended >= 3) return "Plata";
  return "Clasica";
}

export const LOYALTY_TIER_LABELS: Record<LoyaltyTier, string> = {
  Clasica: "Capanair Classic",
  Plata: "Capanair Plata",
  Oro: "Capanair Oro",
  Platino: "Capanair Platino",
};

export const LOYALTY_TIER_STYLES: Record<LoyaltyTier, string> = {
  Clasica: "bg-grey-100 text-grey-400 border border-grey-400",
  Plata: "bg-slate-400 text-slate-100 border border-slate-500",
  Oro: "bg-gold-100 text-gold-500 border border-gold-300",
  Platino: "bg-navy-700 text-gold-400 border border-gold-200",
};

export const DAY_LABELS: Record<string, string> = {
  viernes: "Viernes",
  sabado: "Sábado",
  domingo: "Domingo",
};
