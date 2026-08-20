"use client";

import { useEffect, useRef, useState } from "react";

interface PassengerStatus {
  id: string;
  full_name: string;
  is_dead: boolean;
}

const STORAGE_KEY = "capafest_mafia_notified_deaths";
const POLL_INTERVAL_MS = 20000;

export function MafiaRoster({ initialPassengers }: { initialPassengers: PassengerStatus[] }) {
  const [passengers, setPassengers] = useState(initialPassengers);
  const [modalNames, setModalNames] = useState<string[]>([]);
  const notifiedRef = useRef<Set<string>>(new Set());

  function checkForNewDeaths(list: PassengerStatus[]) {
    const newlyDead = list.filter((p) => p.is_dead && !notifiedRef.current.has(p.id));
    if (newlyDead.length === 0) return;

    const updated = new Set(notifiedRef.current);
    newlyDead.forEach((p) => updated.add(p.id));
    notifiedRef.current = updated;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(updated)));
    } catch {
      // localStorage no disponible: seguimos igualmente, solo perdemos persistencia
    }
    setModalNames((prev) => [...prev, ...newlyDead.map((p) => p.full_name)]);
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      notifiedRef.current = new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      notifiedRef.current = new Set();
    }
    checkForNewDeaths(initialPassengers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/mafia/status", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { passengers: PassengerStatus[] };
        setPassengers(data.passengers ?? []);
        checkForNewDeaths(data.passengers ?? []);
      } catch {
        // Error de red puntual: se reintenta en el siguiente ciclo
      }
    }, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sorted = [...passengers].sort((a, b) => a.full_name.localeCompare(b.full_name, "es"));

  return (
    <div>
      <ul className="divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white shadow-card overflow-hidden">
        {sorted.map((p) => (
          <li
            key={p.id}
            className={`flex items-center justify-between gap-3 px-4 py-3 ${p.is_dead ? "bg-navy-50" : ""}`}
          >
            <span className={p.is_dead ? "line-through text-navy-400" : "text-navy-800 font-medium"}>
              {p.full_name}
            </span>
            {p.is_dead && (
              <span className="inline-flex items-center gap-1 shrink-0 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-full px-2.5 py-1">
                💀 Eliminado/a
              </span>
            )}
          </li>
        ))}
      </ul>

      {modalNames.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy-900/60 px-4">
          <div className="bg-white rounded-2xl shadow-card max-w-sm w-full p-6 text-center">
            <p className="text-4xl mb-3">💀</p>
            <h2 className="font-display font-semibold text-xl text-navy-800 mb-3">
              {modalNames.length === 1 ? "Nueva víctima" : "Nuevas víctimas"}
            </h2>
            <ul className="text-navy-700 font-medium space-y-1 mb-6">
              {modalNames.map((name, i) => (
                <li key={`${name}-${i}`}>{name}</li>
              ))}
            </ul>
            <button
              onClick={() => setModalNames([])}
              className="rounded-full bg-navy-700 text-white font-medium px-6 py-2.5 hover:bg-navy-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
