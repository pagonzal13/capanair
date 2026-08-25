"use client";

import { useMemo, useState } from "react";
import { LoyaltyBadge } from "./LoyaltyBadge";
import { PassengerAvatar } from "./PassengerAvatar";
import { PassengerPhotoModal } from "./PassengerPhotoModal";

export interface PassengerListItem {
  id: string;
  full_name: string;
  seat_code: string | null;
  editions_attended: number;
  badges: string[];
}

export function PassengerList({ passengers }: { passengers: PassengerListItem[] }) {
  const [query, setQuery] = useState("");
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return passengers;
    return passengers.filter(
      (p) =>
        p.full_name.toLowerCase().includes(q) ||
        (p.seat_code ?? "").toLowerCase().includes(q)
    );
  }, [passengers, query]);

  return (
    <div>
      <div className="relative mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="🔍 Buscar pasajero o puerta de embarque"
          className="w-full rounded-xl border border-navy-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
        />
      </div>

      <ul className="divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white shadow-card overflow-hidden">
        {filtered.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => setSelectedName(p.full_name)}
                aria-label={`Ver foto de ${p.full_name}`}
                className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-gold-500"
              >
                <PassengerAvatar name={p.full_name} className="h-10 w-10" />
              </button>
              <div className="min-w-0">
                <div className="font-medium text-navy-800 truncate">{p.full_name}</div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <LoyaltyBadge editionsAttended={p.editions_attended} />
                  {p.badges.map((badge) => (
                    <span
                      key={badge}
                      className="inline-flex items-center rounded-full bg-white text-navy-500 border border-navy-200 px-2.5 py-1 text-xs font-medium"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            {p.seat_code && (
              <div className="shrink-0 text-right">
                <div className="text-[10px] uppercase tracking-wide text-navy-400">Puerta</div>
                <div className="font-mono font-semibold text-navy-800 text-lg leading-none">
                  {p.seat_code}
                </div>
              </div>
            )}
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-4 py-8 text-center text-sm text-navy-400">
            No se ha encontrado ningún pasajero.
          </li>
        )}
      </ul>

      {selectedName && (
        <PassengerPhotoModal name={selectedName} onClose={() => setSelectedName(null)} />
      )}
    </div>
  );
}
