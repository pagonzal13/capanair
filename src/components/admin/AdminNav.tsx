"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ADMIN_LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/horario", label: "Horario" },
  { href: "/admin/capawards", label: "Capawards" },
  { href: "/admin/mafia", label: "La Mafia" },
  { href: "/admin/pasajeros", label: "Pasajeros" },
];

export function AdminNav({ logoutAction }: { logoutAction: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex items-center gap-1.5 text-sm flex-wrap">
      {ADMIN_LINKS.map((link) => {
        const isActive = link.href === "/admin" ? pathname === "/admin" : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-full font-medium border transition-colors ${
              isActive
                ? "bg-white text-navy-900 border-white"
                : "bg-transparent text-white border-white/30 hover:border-white/60"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
      <form action={logoutAction}>
        <button
          type="submit"
          className="px-3 py-1.5 rounded-full font-medium border border-red-600 bg-red-600 text-white hover:bg-red-500 transition-colors"
        >
          Salir
        </button>
      </form>
    </nav>
  );
}
