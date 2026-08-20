import { PassengerList } from "@/components/PassengerList";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Passenger } from "@/lib/types";

export const revalidate = 0;
export const metadata = { title: "Pasajeros" };

export default async function PasajerosPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("passengers")
    .select("id, full_name, seat_code, editions_attended")
    .order("full_name");

  if (error) throw error;
  const passengers = (data ?? []) as Pick<
    Passenger,
    "id" | "full_name" | "seat_code" | "editions_attended"
  >[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display font-semibold text-2xl text-navy-800 mb-1">Pasajeros</h1>
      <p className="text-navy-500 text-sm mb-6">
        Toda la tripulación de esta edición: su nivel Capanair Club y su habitación asignada.
      </p>
      <PassengerList passengers={passengers} />
    </div>
  );
}
