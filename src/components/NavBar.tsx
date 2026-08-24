"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useTransition } from "react";
import { Logo, Wordmark } from "./Logo";

const LINKS = [
  { href: "/", label: "Inicio" },
  { href: "/pasajeros", label: "Pasajeros" },
  { href: "/capawards", label: "Capawards" },
  { href: "/mafia", label: "La Mafia" },
];

function Spinner({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
      aria-hidden
    />
  );
}

function NavLink({
  href,
  label,
  isActive,
  mobile,
  onNavigate,
}: {
  href: string;
  label: string;
  isActive: boolean;
  mobile?: boolean;
  onNavigate?: () => void;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [clicked, setClicked] = useState(false);

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    // Deja que el navegador gestione clic con modificadores (nueva pestaña, etc.)
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    setClicked(true);
    onNavigate?.();
    startTransition(() => {
      router.push(href);
    });
  }

  const showSpinner = clicked && isPending;
  const className = mobile
    ? `inline-flex items-center gap-2 rounded-lg px-4 py-3 text-base font-medium transition-colors ${
        isActive ? "bg-gold-500 text-navy-900" : "text-white/85 hover:bg-white/10"
      }`
    : `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
        isActive ? "bg-gold-500 text-navy-900" : "text-white/85 hover:bg-white/10 hover:text-white"
      }`;

  return (
    <a href={href} onClick={handleClick} className={className}>
      {label}
      {showSpinner && <Spinner className="h-3 w-3" />}
    </a>
  );
}

export function NavBar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  function isLinkActive(href: string) {
    return href === "/" ? pathname === "/" : pathname.startsWith(href);
  }

  return (
    <header className="sticky top-0 z-50 bg-navy-800 text-white shadow-md">
      <div className="mx-auto max-w-5xl px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
            <Logo className="h-9 w-9" />
            <Wordmark className="text-lg" />
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {LINKS.map((link) => (
              <NavLink key={link.href} href={link.href} label={link.label} isActive={isLinkActive(link.href)} />
            ))}
          </nav>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-white hover:bg-white/10"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>

        {open && (
          <nav className="md:hidden pb-4 flex flex-col gap-1">
            {LINKS.map((link) => (
              <NavLink
                key={link.href}
                href={link.href}
                label={link.label}
                isActive={isLinkActive(link.href)}
                mobile
                onNavigate={() => setOpen(false)}
              />
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
