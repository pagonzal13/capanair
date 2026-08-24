import { PassengerList } from "@/components/PassengerList";
import { getSupabaseAdmin } from "@/lib/supabase";
import type { Passenger } from "@/lib/types";

export const revalidate = 0;
export const metadata = { title: "Pasajeros" };

export default async function PasajerosPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("passengers")
    .select("id, full_name, seat_code, editions_attended, badges")
    .order("full_name");

  if (error) throw error;
  const passengers = (data ?? []) as Pick<
    Passenger,
    "id" | "full_name" | "seat_code" | "editions_attended" | "badges"
  >[];

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display font-semibold text-2xl text-navy-800 mb-1">👤 Pasajeros</h1>
      <p className="text-navy-500 text-sm mb-6">
        Todo el pasaje y la tripulación de esta edición
      </p>

      <div className="bg-navy-800 text-white rounded-2xl shadow-card p-6 mb-4">
        <h2 className="font-display font-semibold text-xl mb-2">Check-in</h2>

        <p className="text-white/80 text-sm leading-relaxed">
          Al llegar, pasa por el mostrador de Check-in para recoger tu billete y extras del viaje.
        </p>

        <div className="bg-muted/30 border-gold-50 rounded-lg p-2 mt-4 mb-1" style={{ borderWidth: 'thick' }}>          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-1 mt-1 mb-1">
            <img 
              src="/check-in.jpg" 
              alt="Mostrador de Check-in" 
              className="w-full max-w-56 sm:max-w-74 object-contain rounded-lg shadow-lg"
            />
          </div>
        </div>

      </div>

      <PassengerList passengers={passengers} />
    </div>
  );
}
