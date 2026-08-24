"use client";

import { useEffect, useRef } from "react";
import { Logo, Wordmark } from "@/components/Logo";

// Tope de espera: si alguna imagen tarda mucho o falla en cargar, no
// queremos dejar a nadie atascado en esta pantalla.
const MAX_WAIT_MS = 9000;

function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

export function LoadingScreen({ redirectTo }: { redirectTo: string }) {
  const startedRef = useRef(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    async function run() {
      try {
        const res = await fetch("/api/preload-manifest", { cache: "no-store" });
        const data = (await res.json()) as { images: string[] };
        const preloads = (data.images ?? []).map(preloadImage);
        await Promise.race([
          Promise.all(preloads),
          new Promise((resolve) => setTimeout(resolve, MAX_WAIT_MS)),
        ]);
      } catch {
        // Si falla la precarga, seguimos igualmente a la web: es solo una
        // optimizacion, no debe bloquear el acceso.
      } finally {
        window.location.href = redirectTo;
      }
    }

    run();
  }, [redirectTo]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-navy-800 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <Logo className="h-20 w-20" />
          <Wordmark className="text-2xl text-white" />
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6 text-center">
          <div
            className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-navy-200 border-t-navy-700"
            aria-hidden
          />
          <p className="text-sm text-navy-600 leading-relaxed">
            Espera unos segundos, por favor. Estamos preparando la web para que descubras todo lo
            que se viene en tu próximo vuelo con Capanair.
          </p>
        </div>
      </div>
    </main>
  );
}
