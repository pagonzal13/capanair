"use client";

import { useState } from "react";
import { passengerPhotoUrl } from "@/lib/passengerPhoto";

// Icono pequeño y redondo con la foto del pasajero. Si no hay foto (o el
// archivo no existe todavía), cae a un círculo con la inicial del nombre.
export function PassengerAvatar({
  name,
  className = "h-10 w-10",
}: {
  name: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase() || "?";

  if (broken) {
    return (
      <div
        className={`shrink-0 rounded-full bg-navy-700 text-gold-300 font-display font-semibold flex items-center justify-center ${className}`}
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={passengerPhotoUrl(name)}
      alt=""
      onError={() => setBroken(true)}
      className={`shrink-0 rounded-full object-cover border border-navy-100 ${className}`}
    />
  );
}
