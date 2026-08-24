import { ConfirmSubmitButton } from "@/components/admin/ConfirmSubmitButton";
import { ResettableForm } from "@/components/admin/ResettableForm";
import { getSupabaseAdmin } from "@/lib/supabase";
import {
  createCategory,
  deleteCategory,
  hideResults,
  publishResults,
  setVotingOpen,
  updateCategory,
} from "./actions";

export const revalidate = 0;
export const metadata = { title: "Admin · Capawards" };

const inputClass =
  "w-full rounded-lg border border-navy-200 px-3 py-2 text-sm text-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-500";

interface TallyRow {
  category_id: string;
  nominee_passenger_id: string;
  votes_count: number;
}

interface GroupVoteRow {
  category_id: string;
  nominee_passenger_ids: string[];
}

export default async function AdminCapawardsPage() {
  const supabase = getSupabaseAdmin();

  const [settingsRes, categoriesRes, passengersRes, tallyRes, groupVotesRes, ballotsRes, totalPassengersRes] =
    await Promise.all([
      supabase
        .from("app_settings")
        .select("capawards_voting_open, capawards_results_published")
        .single(),
      supabase
        .from("capawards_categories")
        .select("id, name, description, sort_order, is_multi_select")
        .order("sort_order"),
      supabase.from("passengers").select("id, full_name"),
      supabase.from("capawards_tally").select("*"),
      supabase.from("capawards_votes").select("category_id, nominee_passenger_ids").not("nominee_passenger_ids", "is", null),
      supabase.from("capawards_ballots").select("id", { count: "exact", head: true }),
      supabase.from("passengers").select("id", { count: "exact", head: true }),
    ]);

  if (settingsRes.error) throw settingsRes.error;
  if (categoriesRes.error) throw categoriesRes.error;
  if (passengersRes.error) throw passengersRes.error;
  if (tallyRes.error) throw tallyRes.error;
  if (groupVotesRes.error) throw groupVotesRes.error;

  const votingOpen = settingsRes.data.capawards_voting_open as boolean;
  const resultsPublished = settingsRes.data.capawards_results_published as boolean;
  const categories = categoriesRes.data ?? [];
  const nameById = new Map((passengersRes.data ?? []).map((p) => [p.id, p.full_name] as const));
  const tally = (tallyRes.data ?? []) as TallyRow[];
  const groupVotes = (groupVotesRes.data ?? []) as GroupVoteRow[];

  const topByCategory = new Map<string, { name: string; votes: number }[]>();
  for (const category of categories) {
    if (category.is_multi_select) {
      // Agrupa por la combinacion exacta de personas (orden-independiente):
      // el mismo grupo repetido por distintos votantes suma votos juntos.
      const counts = new Map<string, { ids: string[]; votes: number }>();
      for (const row of groupVotes) {
        if (row.category_id !== category.id) continue;
        const sortedIds = [...row.nominee_passenger_ids].sort();
        const key = sortedIds.join("|");
        const entry = counts.get(key);
        if (entry) {
          entry.votes += 1;
        } else {
          counts.set(key, { ids: sortedIds, votes: 1 });
        }
      }
      const rows = Array.from(counts.values())
        .sort((a, b) => b.votes - a.votes)
        .slice(0, 10)
        .map((entry) => ({
          name: entry.ids.map((id) => nameById.get(id) ?? "—").join(" + "),
          votes: entry.votes,
        }));
      topByCategory.set(category.id, rows);
    } else {
      const rows = tally
        .filter((t) => t.category_id === category.id)
        .sort((a, b) => b.votes_count - a.votes_count)
        .slice(0, 3)
        .map((t) => ({ name: nameById.get(t.nominee_passenger_id) ?? "—", votes: t.votes_count }));
      topByCategory.set(category.id, rows);
    }
  }

  return (
    <div>
      <h1 className="font-display font-semibold text-2xl text-navy-800 mb-1">Capawards</h1>
      <p className="text-navy-500 text-sm mb-6">
        {ballotsRes.count ?? 0} de {totalPassengersRes.count ?? 0} pasajeros han votado.
      </p>

      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-5 mb-8">
        <h2 className="font-display font-semibold text-navy-800 mb-3">Votaciones</h2>
        <p className="text-sm text-navy-600 mb-4">
          Estado actual:{" "}
          <span className={`font-semibold ${votingOpen ? "text-green-600" : "text-navy-500"}`}>
            {votingOpen ? "Abiertas" : "Cerradas"}
          </span>
        </p>
        <div className="flex flex-wrap gap-3">
          <form action={setVotingOpen}>
            <input type="hidden" name="open" value="true" />
            <button
              type="submit"
              disabled={votingOpen}
              className="rounded-full bg-green-600 text-white text-sm font-medium px-5 py-2.5 hover:bg-green-500 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              Abrir votaciones
            </button>
          </form>
          <form action={setVotingOpen}>
            <input type="hidden" name="open" value="false" />
            <button
              type="submit"
              disabled={!votingOpen}
              className="rounded-full bg-navy-700 text-white text-sm font-medium px-5 py-2.5 hover:bg-navy-600 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              Cerrar votaciones
            </button>
          </form>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-5 mb-8">
        <h2 className="font-display font-semibold text-navy-800 mb-2">Publicar resultados</h2>
        <p className="text-sm text-navy-500 mb-4">
          Publica solo los ganadores (top 1 de cada categoría) en la web abierta, en{" "}
          <code className="font-mono text-xs">/capawards</code>. Debes cerrar antes las
          votaciones. Las categorías de selección múltiple no publican ganador automático
          (usa su Top 10 de aquí abajo para anunciarlo tú en persona).{" "}
          {resultsPublished && (
            <span className="text-green-600 font-medium">Ya hay resultados publicados.</span>
          )}
        </p>
        {resultsPublished ? (
          <form action={hideResults}>
            <button
              type="submit"
              className="rounded-full bg-navy-700 text-white text-sm font-semibold px-5 py-2.5 hover:bg-navy-600 transition-colors"
            >
              Ocultar ganadores
            </button>
          </form>
        ) : (
          <form action={publishResults}>
            <button
              type="submit"
              disabled={votingOpen}
              className="rounded-full bg-gold-500 text-navy-900 text-sm font-semibold px-5 py-2.5 hover:bg-gold-400 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              Publicar resultados
            </button>
          </form>
        )}
      </div>

      <div className="bg-navy-100 rounded-2xl shadow-card border border-navy-100 p-5 mb-8">
        <h2 className="font-display font-semibold text-navy-800 mb-4">Nueva categoría</h2>
        <ResettableForm action={createCategory} className="grid sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-navy-500 mb-1">Nombre</label>
            <input type="text" name="name" required className={inputClass} />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-navy-500 mb-1">Descripción</label>
            <textarea name="description" rows={2} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-medium text-navy-500 mb-1">Orden</label>
            <input type="number" name="sort_order" defaultValue={0} className={inputClass} />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm text-navy-700">
              <input type="checkbox" name="is_multi_select" className="h-4 w-4 rounded border-navy-300" />
              Selección múltiple (votos en grupo)
            </label>
          </div>
          <div className="sm:col-span-2">
            <button
              type="submit"
              className="rounded-full bg-navy-700 text-white font-medium px-6 py-2.5 hover:bg-navy-600 transition-colors"
            >
              Añadir categoría
            </button>
          </div>
        </ResettableForm>
      </div>

      <div className="space-y-4">
        {categories.map((category) => (
          <div key={category.id} className="bg-white rounded-2xl shadow-card border border-navy-100 p-4">
            <form action={updateCategory} className="grid sm:grid-cols-2 gap-3 mb-4">
              <input type="hidden" name="id" value={category.id} />
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-navy-500 mb-1">Nombre</label>
                <input type="text" name="name" defaultValue={category.name} className={inputClass} />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-navy-500 mb-1">Descripción</label>
                <textarea
                  name="description"
                  rows={2}
                  defaultValue={category.description ?? ""}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-navy-500 mb-1">Orden</label>
                <input
                  type="number"
                  name="sort_order"
                  defaultValue={category.sort_order}
                  className={inputClass}
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center gap-2 text-sm text-navy-700">
                  <input
                    type="checkbox"
                    name="is_multi_select"
                    defaultChecked={category.is_multi_select}
                    className="h-4 w-4 rounded border-navy-300"
                  />
                  Selección múltiple (votos en grupo)
                </label>
              </div>
              <div className="sm:col-span-2 flex items-center gap-2">
                <button
                  type="submit"
                  className="rounded-full bg-navy-700 text-white text-sm font-medium px-5 py-2 hover:bg-navy-600 transition-colors"
                >
                  Guardar
                </button>
                <ConfirmSubmitButton
                  message={`¿Eliminar la categoría «${category.name}»? Se borrarán también sus votos.`}
                  formAction={deleteCategory}
                  className="rounded-full border border-red-200 text-red-600 text-sm font-medium px-5 py-2 hover:bg-red-50 transition-colors"
                >
                  Eliminar
                </ConfirmSubmitButton>
              </div>
            </form>

            <div className="border-t border-navy-100 pt-3">
              <p className="text-xs font-medium uppercase tracking-wide text-navy-400 mb-2">
                {category.is_multi_select ? "Top 10 grupos" : "Top 3 votos"}
              </p>
              {(topByCategory.get(category.id) ?? []).length === 0 ? (
                <p className="text-sm text-navy-400">Sin votos todavía.</p>
              ) : (
                <ol className="space-y-1">
                  {(topByCategory.get(category.id) ?? []).map((row, i) => (
                    <li key={i} className="flex items-center justify-between text-sm">
                      <span className="text-navy-700">
                        {i + 1}. {row.name}
                      </span>
                      <span className="font-mono text-navy-500">{row.votes} votos</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
