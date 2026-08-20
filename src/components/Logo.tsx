// Logotipo 
// eslint-disable-next-line @next/next/no-img-element
export function Logo({ className = "h-10 w-10" }: { className?: string }) {
  return <img src="/logo-removebg.png" alt="Capanair" className={`${className} object-contain`} />;
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display font-bold tracking-wide ${className}`}>
      CAPAN<span className="text-gold-500">AIR</span>
    </span>
  );
}
