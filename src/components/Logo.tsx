// Logotipo placeholder de Capanair (aerolinea ficticia de Capafest).
// Sustituye este componente por el logo real cuando lo tengas: por ejemplo,
// colocando el fichero en /public/logo.svg (o .png) y cambiando este
// componente por un <Image src="/logo.svg" ... />. Mientras tanto, este SVG
// generado a partir de la paleta navy/dorado mantiene el aspecto de
// aerolinea en toda la web.

export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="Logotipo Capanair"
    >
      <circle cx="32" cy="32" r="31" fill="#0B2545" stroke="#C9A24B" strokeWidth="1.5" />
      <path
        d="M32 12c1.4 0 2.6 1.4 3.4 3.7L38 24h9.5c1.4 0 2.5 1 2.5 2.3 0 1.2-1 2.2-2.3 2.4L38.6 30.8l2.6 9.4c.3 1.1-.5 2.1-1.6 1.9l-6.4-1.4-1.2 3.7c-.2.7-.9 1.1-1.6.9l-.4-.1a1.4 1.4 0 0 1-1-1.7l1-4-1-4-1 4a1.4 1.4 0 0 1-1 1.7l-.4.1a1.4 1.4 0 0 1-1.6-.9l-1.2-3.7-6.4 1.4c-1.1.2-1.9-.8-1.6-1.9l2.6-9.4-11.1-2.1A2.4 2.4 0 0 1 14 26.3c0-1.3 1.1-2.3 2.5-2.3H26l2.6-8.3c.8-2.3 2-3.7 3.4-3.7Z"
        fill="#F4E7C8"
      />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-wide ${className}`}>
      CAPAN<span className="text-gold-500">AIR</span>
    </span>
  );
}
