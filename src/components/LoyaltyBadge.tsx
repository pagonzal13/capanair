import { getLoyaltyTier, LOYALTY_TIER_LABELS, LOYALTY_TIER_STYLES } from "@/lib/loyalty";

export function LoyaltyBadge({ editionsAttended }: { editionsAttended: number }) {
  const tier = getLoyaltyTier(editionsAttended);
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${LOYALTY_TIER_STYLES[tier]}`}
    >
      {LOYALTY_TIER_LABELS[tier]}
    </span>
  );
}
