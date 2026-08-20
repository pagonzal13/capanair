import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { ResettableForm } from "@/components/admin/ResettableForm";
import { LoyaltyBadge } from "@/components/LoyaltyBadge";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Passenger } from "@/lib/types";
import { createPassenger, deletePassenger, updatePassenger } from "./actions";

export const revalidate = 0;
export const metadata = { title: "Admin · Pasajeros" };

const inputClass =
  "w-full rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-500";

export default async function AdminPasajerosPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("passengers").select("*").order("full_name");
  if (error) throw error;
  const passengers = (data ?? []) as Passenger[];

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-navy-800 mb-1">Pasajeros</h1>
      <p className="text-navy-500 text-sm mb-6">
        Alta, edición y baja de invitados. El nivel Capanair Club se calcula automáticamente a
        partir de las ediciones a las que han venido.
      </p>

      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-5 mb-8">
        <h2 className="font-display font-semibold text-navy-800 mb-4">Añadir pasajero</h2>
        <ResettableForm action={createPassenger} className="grid sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-navy-500 mb-1">Nombre</label>
            <input type="text" name="full_name" required className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-500 mb-1">Habitación</label>
            <input type="text" name="seat_code" placeholder="p. ej. 2A" className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-500 mb-1">Ediciones</label>
            <input
              type="number"
              name="editions_attended"
              min={0}
              defaultValue={1}
              className={inputClass}
            />
          </div>
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-navy-500 mb-1">
              Etiquetas (separadas por comas, opcional)
            </label>
            <input type="text" name="badges" placeholder="Organización, DJ" className={inputClass} />
          </div>
          <div className="sm:col-span-3">
            <button
              type="submit"
              className="rounded-full bg-navy-700 text-white font-medium px-6 py-2.5 hover:bg-navy-600 transition-colors"
            >
              Añadir
            </button>
          </div>
        </ResettableForm>
      </div>

      <div className="space-y-3">
        {passengers.map((p) => (
          <form
            key={p.id}
            action={updatePassenger}
            className="bg-white rounded-2xl shadow-card border border-navy-100 p-4 grid sm:grid-cols-3 gap-3 items-end"
          >
            <input type="hidden" name="id" value={p.id} />
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-navy-500 mb-1">Nombre</label>
              <input type="text" name="full_name" defaultValue={p.full_name} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-500 mb-1">Habitación</label>
              <input type="text" name="seat_code" defaultValue={p.seat_code ?? ""} className={inputClass} />
            </div>
            <div>
              <label className="block text-xs font-medium text-navy-500 mb-1">Ediciones</label>
              <input
                type="number"
                name="editions_attended"
                min={0}
                defaultValue={p.editions_attended}
                className={inputClass}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-navy-500 mb-1">
                Etiquetas (separadas por comas)
              </label>
              <input
                type="text"
                name="badges"
                defaultValue={p.badges.join(", ")}
                className={inputClass}
              />
            </div>
            <div className="flex items-center">
              <LoyaltyBadge editionsAttended={p.editions_attended} />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="rounded-full bg-navy-700 text-white text-sm font-medium px-5 py-2 hover:bg-navy-600 transition-colors"
              >
                Guardar
              </button>
              <ConfirmSubmitButton
                message={`¿Eliminar a ${p.full_name}? Solo es posible si no tiene votos asociados.`}
                formAction={deletePassenger}
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
}
