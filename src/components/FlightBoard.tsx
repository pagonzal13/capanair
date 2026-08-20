import { DAY_LABELS } from "@/lib/loyalty";
import type { ScheduleDay, ScheduleEvent } from "@/lib/types";

function formatTime(time: string) {
  return time.slice(0, 5);
}

export function FlightBoard({ events }: { events: ScheduleEvent[] }) {
  const days: ScheduleDay[] = ["viernes", "sabado", "domingo"];
  const grouped = days
    .map((day) => ({
      day,
      items: events
        .filter((event) => event.day === day)
        .sort((a, b) => a.sort_order - b.sort_order || a.event_time.localeCompare(b.event_time)),
    }))
    .filter((group) => group.items.length > 0);

  if (grouped.length === 0) {
    return (
      <p className="text-center text-navy-400 py-10">
        El horario se publicará próximamente. ¡Mantente atento a la pantalla!
      </p>
    );
  }

  return (
    <div className="space-y-8">
      {grouped.map((group) => (
        <div
          key={group.day}
          className="flight-board rounded-xl overflow-hidden border border-navy-600 shadow-card bg-navy-900"
        >
          <div className="bg-navy-700 px-4 py-2.5 flex items-center justify-between">
            <h3 className="font-mono text-gold-300 tracking-[0.2em] text-sm uppercase">
              {DAY_LABELS[group.day]}
            </h3>
            <span className="font-mono text-[10px] text-white/50 uppercase hidden sm:inline">
              Panel de vuelos Capanair
            </span>
          </div>
          <table className="w-full text-sm font-mono text-white">
            <thead>
              <tr className="text-gold-400/80 text-xs uppercase border-b border-white/10">
                <th className="text-left px-4 py-2 font-medium">Hora</th>
                <th className="text-left px-4 py-2 font-medium">Actividad</th>
                <th className="text-left px-4 py-2 font-medium hidden sm:table-cell">Lugar</th>
              </tr>
            </thead>
            <tbody>
              {group.items.map((event) => (
                <tr key={event.id} className="border-b border-white/5 last:border-0 align-top">
                  <td className="px-4 py-3 text-gold-300 whitespace-nowrap">
                    {formatTime(event.event_time)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium">
                      {event.icon && (
                        <span className="mr-1.5" aria-hidden>
                          {event.icon}
                        </span>
                      )}
                      {event.activity}
                    </div>
                    {event.description && (
                      <div className="text-white/50 text-xs mt-0.5 font-sans">
                        {event.description}
                      </div>
                    )}
                    {event.location && (
                      <div className="sm:hidden text-gold-200/70 text-xs mt-1">
                        📍 {event.location}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 hidden sm:table-cell text-white/70">
                    {event.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}
