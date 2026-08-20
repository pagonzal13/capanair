import { getSupabaseAdmin } from "@/lib/supabase";
import type { Passenger } from "@/lib/types";
import { setPassengerDead } from "./actions";

export const revalidate = 0;
export const metadata = { title: "Admin · La Mafia" };

export default async function AdminMafiaPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("passengers")
    .select("id, full_name, is_dead")
    .order("full_name");
  if (error) throw error;
  const passengers = (data ?? []) as Pick<Passenger, "id" | "full_name" | "is_dead">[];

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-navy-800 mb-1">La Mafia</h1>
      <p className="text-navy-500 text-sm mb-6">
        Marca aquí quién va muriendo. Se publica al instante en{" "}
        <code className="font-mono text-xs">/mafia</code>.
      </p>

      <ul className="divide-y divide-navy-100 rounded-2xl border border-navy-100 bg-white shadow-card overflow-hidden">
        {passengers.map((p) => (
          <li key={p.id} className="flex items-center justify-between gap-3 px-4 py-3">
            <span className={p.is_dead ? "line-through text-navy-400" : "text-navy-800 font-medium"}>
              {p.full_name}
            </span>
            <form action={setPassengerDead}>
              <input type="hidden" name="id" value={p.id} />
              <input type="hidden" name="dead" value={(!p.is_dead).toString()} />
              <button
                type="submit"
                className={`rounded-full text-sm font-medium px-4 py-1.5 transition-colors ${
                  p.is_dead
                    ? "border border-navy-200 text-navy-600 hover:bg-navy-50"
                    : "bg-red-600 text-white hover:bg-red-500"
                }`}
              >
                {p.is_dead ? "Revivir" : "Marcar eliminado/a"}
              </button>
            </form>
          </li>
        ))}
      </ul>
    </div>
  );
}
