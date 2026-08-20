import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { ResettableForm } from "@/components/admin/ResettableForm";
import { DAY_LABELS } from "@/lib/loyalty";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { ScheduleDay, ScheduleEvent } from "@/lib/types";
import { createScheduleEvent, deleteScheduleEvent, updateScheduleEvent } from "./actions";

export const revalidate = 0;
export const metadata = { title: "Admin · Horario" };

const inputClass =
  "w-full rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-500";
const DAYS: ScheduleDay[] = ["viernes", "sabado", "domingo"];

export default async function AdminHorarioPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("schedule_events")
    .select("*")
    .order("day")
    .order("event_time");
  if (error) throw error;
  const events = (data ?? []) as ScheduleEvent[];

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-navy-800 mb-1">Horario</h1>
      <p className="text-navy-500 text-sm mb-6">
        Gestiona el panel de salidas y llegadas que ven los pasajeros en la web.
      </p>

      <div className="bg-navy-100 rounded-2xl shadow-card border border-navy-100 p-5 mb-8">
        <h2 className="font-display font-semibold text-navy-800 mb-4">Añadir actividad</h2>
        <ResettableForm action={createScheduleEvent} className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-navy-500 mb-1">Día</label>
            <select name="day" required defaultValue="viernes" className={inputClass}>
              {DAYS.map((d) => (
                <option key={d} value={d}>
                  {DAY_LABELS[d]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-500 mb-1">Hora</label>
            <input type="time" name="event_time" required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-navy-500 mb-1">Actividad</label>
            <input type="text" name="activity" required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-navy-500 mb-1">Descripción</label>
            <textarea name="description" rows={2} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-500 mb-1">Localización</label>
            <input type="text" name="location" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-500 mb-1">Icono (emoji)</label>
            <input type="text" name="icon" maxLength={4} placeholder="🎉" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-500 mb-1">Orden</label>
            <input type="number" name="sort_order" defaultValue={0} className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-navy-700 text-white font-medium px-6 py-2.5 hover:bg-navy-600 transition-colors"
            >
              Añadir
            </button>
          </div>
        </ResettableForm>
      </div>

      <div className="space-y-8">
        {DAYS.map((day) => {
          const dayEvents = events.filter((e) => e.day === day);
          if (dayEvents.length === 0) return null;
          return (
            <div key={day}>
              <h3 className="font-mono text-xs uppercase tracking-widest text-navy-400 mb-2">
                {DAY_LABELS[day]}
              </h3>
              <div className="space-y-3">
                {dayEvents.map((event) => (
                  <form
                    key={event.id}
                    action={updateScheduleEvent}
                    className="bg-white rounded-2xl shadow-card border border-navy-100 p-4 grid sm:grid-cols-2 gap-3"
                  >
                    <input type="hidden" name="id" value={event.id} />
                    <div>
                      <label className="block text-xs font-medium text-navy-500 mb-1">Día</label>
                      <select name="day" defaultValue={event.day} className={inputClass}>
                        {DAYS.map((d) => (
                          <option key={d} value={d}>
                            {DAY_LABELS[d]}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-500 mb-1">Hora</label>
                      <input
                        type="time"
                        name="event_time"
                        defaultValue={event.event_time.slice(0, 5)}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-navy-500 mb-1">
                        Actividad
                      </label>
                      <input
                        type="text"
                        name="activity"
                        defaultValue={event.activity}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-medium text-navy-500 mb-1">
                        Descripción
                      </label>
                      <textarea
                        name="description"
                        rows={2}
                        defaultValue={event.description ?? ""}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-500 mb-1">
                        Localización
                      </label>
                      <input
                        type="text"
                        name="location"
                        defaultValue={event.location ?? ""}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-500 mb-1">
                        Icono (emoji)
                      </label>
                      <input
                        type="text"
                        name="icon"
                        maxLength={4}
                        defaultValue={event.icon ?? ""}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-navy-500 mb-1">Orden</label>
                      <input
                        type="number"
                        name="sort_order"
                        defaultValue={event.sort_order}
                        className={inputClass}
                      />
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2">
                      <button
                        type="submit"
                        className="rounded-full bg-navy-700 text-white text-sm font-medium px-5 py-2 hover:bg-navy-600 transition-colors"
                      >
                        Guardar
                      </button>
                      <ConfirmSubmitButton
                        message={`¿Eliminar «${event.activity}»?`}
                        formAction={deleteScheduleEvent}
                        className="rounded-full border border-red-200 text-red-600 text-sm font-medium px-5 py-2 hover:bg-red-50 transition-colors"
                      >
                        Eliminar
                      </ConfirmSubmitButton>
                    </div>
                  </form>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
