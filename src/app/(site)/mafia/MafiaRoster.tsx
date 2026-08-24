"use client";

import { useEffect, useRef, useState } from "react";
import { passengerPhotoUrl } from "@/lib/passengerPhoto";

interface PassengerStatus {
  id: string;
  full_name: string;
  is_dead: boolean;
}

function MafiaCard({ passenger }: { passenger: PassengerStatus }) {
  const [broken, setBroken] = useState(false);
  const photoSrc = passenger.is_dead ? "/mafia-victim-placeholder.jpg" : passengerPhotoUrl(passenger.full_name);

  return (
    <div
      className={`relative aspect-square rounded-2xl overflow-hidden border shadow-card ${
        passenger.is_dead ? "border-red-700" : "border-emerald-600"
      }`}
    >
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photoSrc}
          alt=""
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
      )}
      <div className={`absolute inset-0 ${passenger.is_dead ? "bg-red-600/70" : "bg-emerald-700/60"}`} />
      <div className="relative z-10 flex h-full flex-col items-center justify-end p-2 text-center">
        <span
          className={`font-display font-bold text-white ${passenger.is_dead ? "line-through" : ""}`}
        >
          {passenger.full_name}
        </span>
        {passenger.is_dead ? (
          <span className="text-xs font-medium text-white/90">🔴 Eliminado/a</span>
        ) : (
          <span className="text-xs font-medium text-white/90">🟢 Jugando</span>
        )}
      </div>
    </div>
  );
}

const STORAGE_KEY = "capafest_mafia_notified_deaths";
const POLL_INTERVAL_MS = 20000;

export function MafiaRoster({ initialPassengers }: { initialPassengers: PassengerStatus[] }) {
  const [passengers, setPassengers] = useState(initialPassengers);
  const [modalNames, setModalNames] = useState<string[]>([]);
  const notifiedRef = useRef<Set<string>>(new Set());

  function persistNotified(set: Set<string>) {
    notifiedRef.current = set;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(set)));
    } catch {
      // localStorage no disponible: seguimos igualmente, solo perdemos persistencia
    }
  }

  function syncWithState(list: PassengerStatus[]) {
    const updated = new Set(notifiedRef.current);

    // Si alguien ha revivido, lo quitamos de notificados para que, si vuelve
    // a morir, se avise de nuevo como novedad.
    for (const p of list) {
      if (!p.is_dead && updated.has(p.id)) {
        updated.delete(p.id);
      }
    }

    const newlyDead = list.filter((p) => p.is_dead && !updated.has(p.id));
    newlyDead.forEach((p) => updated.add(p.id));

    persistNotified(updated);

    if (newlyDead.length > 0) {
      setModalNames((prev) => [...prev, ...newlyDead.map((p) => p.full_name)]);
    }
  }

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      notifiedRef.current = new Set(raw ? (JSON.parse(raw) as string[]) : []);
    } catch {
      notifiedRef.current = new Set();
    }
    syncWithState(initialPassengers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/mafia/status", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { passengers: PassengerStatus[] };
        setPassengers(data.passengers ?? []);
        syncWithState(data.passengers ?? []);
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
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sorted.map((p) => (
          <MafiaCard key={p.id} passenger={p} />
        ))}
      </div>

      {modalNames.length > 0 && (
        <div className="mafia-modal-backdrop fixed inset-0 z-50 flex items-center justify-center bg-navy-900/70 px-4">
          <div className="mafia-modal-card bg-white rounded-2xl shadow-card max-w-sm w-full p-6 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/mafia-victim-placeholder-1.png"
              alt=""
              className="w-32 h-32 mx-auto mb-4 drop-shadow-lg"
            />
            <h2 className="font-display font-semibold text-2xl text-navy-800 mb-3">
              ⚠️NOVEDADES⚠️
            </h2>
            <p className="font-display font-semibold text-navy-700 mb-3">
              {modalNames.length === 1 ? "Ha muerto:" : "Han muerto:"}
            </p>
            <ul className="text-navy-300 font-medium text-lg space-y-1 mb-6 max-h-36 overflow-y-auto">
              {modalNames.map((name, i) => (
                <li key={`${name}-${i}`}>{name}</li>
              ))}
            </ul>
            <button
              onClick={() => setModalNames([])}
              className="rounded-full bg-red-500 text-white font-medium px-6 py-2.5 hover:bg-navy-600 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
