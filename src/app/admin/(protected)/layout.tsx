import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth";
import { adminLogout } from "../actions";

const ADMIN_LINKS = [
  { href: "/admin", label: "Resumen" },
  { href: "/admin/horario", label: "Horario" },
  { href: "/admin/capawards", label: "Capawards" },
  { href: "/admin/mafia", label: "La Mafia" },
  { href: "/admin/pasajeros", label: "Pasajeros" },
];

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const isValid = await verifyAdminSessionToken(token);
  if (!isValid) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <header className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <span className="font-display font-semibold">Panel de administración · Capanair</span>
          <nav className="flex items-center gap-1 text-sm flex-wrap">
            {ADMIN_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <form action={adminLogout}>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-full hover:bg-white/10 text-red-300 transition-colors"
              >
                Salir
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
