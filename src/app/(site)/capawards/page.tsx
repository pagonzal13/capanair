import { cookies } from "next/headers";
import { CAPAWARDS_VOTED_COOKIE_NAME } from "@/lib/auth";
import { getSupabaseAdmin } from "@/lib/supabase";
import { CapawardsVotingFlow } from "./CapawardsVotingFlow";

export const revalidate = 0;
export const metadata = { title: "Capawards" };

function PageShell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-2xl px-4 py-10">{children}</div>;
}

function MessageCard({ emoji, title, children }: { emoji: string; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-8 text-center">
      <p className="text-4xl mb-3">{emoji}</p>
      <h1 className="font-display font-semibold text-xl text-navy-800 mb-1">{title}</h1>
      <p className="text-navy-500 text-sm">{children}</p>
    </div>
  );
}

export default async function CapawardsPage() {
  const supabase = getSupabaseAdmin();

  const { data: settingsRow, error: settingsError } = await supabase
    .from("app_settings")
    .select("capawards_voting_open, capawards_results_published")
    .single();
  if (settingsError) throw settingsError;

  const votingOpen = settingsRow.capawards_voting_open as boolean;
  const resultsPublished = settingsRow.capawards_results_published as boolean;

  if (!votingOpen) {
    if (resultsPublished) {
      const { data: categories, error } = await supabase
        .from("capawards_categories")
        .select("id, name, description, winner_passenger_id, passengers:winner_passenger_id (full_name)")
        .order("sort_order");
      if (error) throw error;

      return (
        <PageShell>
          <h1 className="font-display font-semibold text-2xl text-navy-800 mb-1">
          ✨ Galardonados ✨
          </h1>
          <p className="text-navy-500 text-sm mb-6">Estos han sido los personajes más destacados de esta edición</p>
          <ul className="space-y-3">
            {(categories ?? []).map((c) => {
              const winnerName = (c as unknown as { passengers: { full_name: string } | null }).passengers
                ?.full_name;
              return (
                <li
                  key={c.id}
                  className="bg-white rounded-2xl shadow-card border border-navy-100 p-5 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-xs uppercase tracking-wide text-navy-400 font-medium">{c.name}</div>
                    <div className="font-display font-semibold text-navy-800 text-lg">
                      {winnerName ?? "Sin ganador"}
                    </div>
                  </div>
                  <span className="text-3xl" aria-hidden>
                    🏆
                  </span>
                </li>
              );
            })}
          </ul>
        </PageShell>
      );
    }

    return (
      <PageShell>
        <MessageCard emoji="✈️" title="Las votaciones no están abiertas">
          Siga disfrutando del vuelo y vuelva más tarde.
        </MessageCard>
      </PageShell>
    );
  }

  const deviceVoted = cookies().get(CAPAWARDS_VOTED_COOKIE_NAME)?.value === "1";
  if (deviceVoted) {
    return (
      <PageShell>
        <MessageCard emoji="✅" title="Ya has votado desde este dispositivo">
          Gracias por participar en los Capawards de esta edición.
        </MessageCard>
      </PageShell>
    );
  }

  const [{ data: categories, error: catError }, { data: allPassengers, error: passError }, { data: ballots, error: ballotError }] =
    await Promise.all([
      supabase.from("capawards_categories").select("id, name, description").order("sort_order"),
      supabase.from("passengers").select("id, full_name").order("full_name"),
      supabase.from("capawards_ballots").select("voter_passenger_id"),
    ]);
  if (catError) throw catError;
  if (passError) throw passError;
  if (ballotError) throw ballotError;

  if (!categories || categories.length === 0) {
    return (
      <PageShell>
        <MessageCard emoji="🗳️" title="Aún no hay categorías">
          Vuelve más tarde, la tripulación está preparando las categorías de este año.
        </MessageCard>
      </PageShell>
    );
  }

  const votedIds = new Set((ballots ?? []).map((b) => b.voter_passenger_id));
  const eligibleVoters = (allPassengers ?? []).filter((p) => !votedIds.has(p.id));

  return (
    <PageShell>
      <CapawardsVotingFlow
        categories={categories}
        eligibleVoters={eligibleVoters}
        allPassengers={allPassengers ?? []}
      />
    </PageShell>
  );
}
