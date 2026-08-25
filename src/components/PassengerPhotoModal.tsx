"use client";

import { useEffect, useState } from "react";
import { passengerPhotoUrl } from "@/lib/passengerPhoto";

// Modal tipo "foto de perfil" de WhatsApp: muestra la foto del pasajero en
// grande sobre un fondo oscuro. Se cierra con la cruz o pulsando fuera.
export function PassengerPhotoModal({ name, onClose }: { name: string; onClose: () => void }) {
  const [broken, setBroken] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-900/80 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>
      </button>

      <div
        className="flex flex-col items-center gap-4 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {broken ? (
          <div className="flex h-64 w-64 items-center justify-center rounded-full bg-navy-700 text-gold-300 font-display font-semibold text-7xl">
            {initial}
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={passengerPhotoUrl(name)}
            alt={name}
            onError={() => setBroken(true)}
            className="h-auto w-full max-h-[75vh] rounded-2xl object-contain shadow-2xl"
          />
        )}
        <p className="font-display font-semibold text-white text-lg text-center">{name}</p>
      </div>
    </div>
  );
}
