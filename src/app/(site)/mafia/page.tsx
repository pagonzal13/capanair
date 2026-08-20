import { MafiaDiagram } from "@/components/MafiaDiagram";
import { getSupabaseAdmin } from "@/lib/supabase";
import { MafiaRoster } from "./MafiaRoster";

export const revalidate = 0;
export const metadata = { title: "La Mafia" };

export default async function MafiaPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("passengers")
    .select("id, full_name, is_dead")
    .order("full_name");
  if (error) throw error;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display font-semibold text-2xl text-navy-800 mb-1">La Mafia 🔪</h1>
      <p className="text-navy-500 text-sm mb-6">
        El juego de fiesta que se juega durante todo el fin de semana.
      </p>

      <div className="bg-navy-800 text-white rounded-2xl shadow-card p-6 mb-6">
        <h2 className="font-display font-semibold text-lg mb-2">Cómo se juega</h2>
        <p className="text-white/80 text-sm leading-relaxed">
          Al llegar, los participantes reciben un papel con la indicación «Alto secreto» en el
          que figuran un objetivo y un objeto. Para «matar» a alguien: haz que te coja el objeto
          de tu mano; entonces habrá muerto y te dará su objetivo, que pasa a ser ahora tu próximo
          objetivo (con su correspondiente objeto); el juego continúa.
        </p>
      </div>

      <div className="mb-8">
        <MafiaDiagram />
      </div>

      <h2 className="font-display font-semibold text-lg text-navy-800 mb-3">
        Pasajeros en juego
      </h2>
      <MafiaRoster initialPassengers={data ?? []} />
    </div>
  );
}
