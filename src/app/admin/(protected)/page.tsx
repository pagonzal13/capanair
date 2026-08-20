import Link from "next/link";
import { getSupabaseAdmin } from "@/lib/supabase";

export const revalidate = 0;
export const metadata = { title: "Admin · Resumen" };

export default async function AdminDashboardPage() {
  const supabase = getSupabaseAdmin();

  const [passengers, dead, events, categories, ballots, settings] = await Promise.all([
    supabase.from("passengers").select("id", { count: "exact", head: true }),
    supabase.from("passengers").select("id", { count: "exact", head: true }).eq("is_dead", true),
    supabase.from("schedule_events").select("id", { count: "exact", head: true }),
    supabase.from("capawards_categories").select("id", { count: "exact", head: true }),
    supabase.from("capawards_ballots").select("id", { count: "exact", head: true }),
    supabase.from("app_settings").select("capawards_voting_open, capawards_results_published").single(),
  ]);

  const cards = [
    { label: "Pasajeros", value: passengers.count ?? 0, href: "/admin/pasajeros" },
    { label: "Eliminados en La Mafia", value: dead.count ?? 0, href: "/admin/mafia" },
    { label: "Actividades en el horario", value: events.count ?? 0, href: "/admin/horario" },
    { label: "Categorías Capawards", value: categories.count ?? 0, href: "/admin/capawards" },
    { label: "Votos recibidos", value: ballots.count ?? 0, href: "/admin/capawards" },
  ];

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-navy-800 mb-1">Resumen</h1>
      <p className="text-navy-500 text-sm mb-6">Estado general de Capanair para esta edición.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="bg-white rounded-2xl shadow-card border border-navy-100 p-5 hover:-translate-y-0.5 transition-transform"
          >
            <div className="text-3xl font-display font-bold text-navy-800">{c.value}</div>
            <div className="text-navy-500 text-sm mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-5">
        <h2 className="font-display font-semibold text-navy-800 mb-2">Estado de Capawards</h2>
        <p className="text-sm text-navy-600">
          Votaciones:{" "}
          <span className="font-medium">
            {settings.data?.capawards_voting_open ? "Abiertas" : "Cerradas"}
          </span>{" "}
          · Resultados públicos:{" "}
          <span className="font-medium">
            {settings.data?.capawards_results_published ? "Publicados" : "No publicados"}
          </span>
        </p>
        <Link href="/admin/capawards" className="text-sm text-gold-600 font-medium hover:underline mt-2 inline-block">
          Gestionar Capawards →
        </Link>
      </div>
    </div>
  );
}
