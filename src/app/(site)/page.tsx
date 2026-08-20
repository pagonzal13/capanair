import { FlightBoard } from "@/components/FlightBoard";
import { Logo, Wordmark } from "@/components/Logo";
import { EVENT_INFO } from "@/lib/eventInfo";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { ScheduleEvent } from "@/lib/types";

export const revalidate = 0;

async function getScheduleEvents(): Promise<ScheduleEvent[]> {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("schedule_events")
    .select("*")
    .order("day")
    .order("event_time");

  if (error) throw error;
  return (data ?? []) as ScheduleEvent[];
}

export default async function HomePage() {
  const events = await getScheduleEvents();

  return (
    <div>
      <section className="bg-navy-800 text-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20 flex flex-col items-center text-center gap-5">
          <Logo className="h-16 w-16" />
          <Wordmark className="text-3xl sm:text-4xl" />
          <p className="uppercase tracking-[0.3em] text-gold-300 text-xs sm:text-sm">
            Tarjeta de embarque · {EVENT_INFO.title}
          </p>
          <p className="max-w-xl text-white/80 text-sm sm:text-base">{EVENT_INFO.description}</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 -mt-8 sm:-mt-10 pb-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <InfoCard icon="🗓️" label="Fechas" value={EVENT_INFO.dateRange} />
          <InfoCard
            icon="📍"
            label="Lugar"
            value={EVENT_INFO.venueName}
            sub={EVENT_INFO.venueAddress}
            href={EVENT_INFO.mapsUrl || undefined}
          />
          <InfoCard
            icon="✉️"
            label="Contacto"
            value={EVENT_INFO.contactName}
            sub={`${EVENT_INFO.contactPhone} · ${EVENT_INFO.contactEmail}`}
          />
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-10">
        <h2 className="font-display font-semibold text-xl text-navy-800 mb-1">
          Panel de salidas y llegadas
        </h2>
        <p className="text-navy-500 text-sm mb-6">
          Todas las actividades del fin de semana, vuelo a vuelo.
        </p>
        <FlightBoard events={events} />
      </section>
    </div>
  );
}

function InfoCard({
  icon,
  label,
  value,
  sub,
  href,
}: {
  icon: string;
  label: string;
  value: string;
  sub?: string;
  href?: string;
}) {
  const content = (
    <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-5 h-full">
      <div className="flex items-center gap-2 text-navy-400 text-xs font-medium uppercase tracking-wide mb-2">
        <span aria-hidden>{icon}</span>
        {label}
      </div>
      <div className="font-display font-semibold text-navy-800">{value}</div>
      {sub && <div className="text-navy-500 text-sm mt-0.5">{sub}</div>}
    </div>
  );

  if (href) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block hover:-translate-y-0.5 transition-transform">
        {content}
      </a>
    );
  }

  return content;
}
