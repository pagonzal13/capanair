"use client";

import { useMemo, useState } from "react";
import { submitCapawardsBallot } from "./actions";

interface Person {
  id: string;
  full_name: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
}

type Step =
  | { name: "intro" }
  | { name: "identity" }
  | { name: "category"; index: number }
  | { name: "review" }
  | { name: "submitting" }
  | { name: "done" }
  | { name: "error"; message: string };

export function CapawardsVotingFlow({
  categories,
  eligibleVoters,
  allPassengers,
}: {
  categories: Category[];
  eligibleVoters: Person[];
  allPassengers: Person[];
}) {
  const [step, setStep] = useState<Step>({ name: "intro" });
  const [voterId, setVoterId] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, string>>({});

  const voter = useMemo(
    () => allPassengers.find((p) => p.id === voterId) ?? null,
    [allPassengers, voterId]
  );

  const nomineesFor = useMemo(
    () => allPassengers.filter((p) => p.id !== voterId),
    [allPassengers, voterId]
  );

  function goToCategory(index: number) {
    if (index < 0) {
      setStep({ name: "identity" });
    } else if (index >= categories.length) {
      setStep({ name: "review" });
    } else {
      setStep({ name: "category", index });
    }
  }

  async function handleSubmit() {
    if (!voterId) return;
    setStep({ name: "submitting" });
    const result = await submitCapawardsBallot(
      voterId,
      categories.map((c) => ({ category_id: c.id, nominee_passenger_id: votes[c.id] }))
    );

    if (result.ok) {
      setStep({ name: "done" });
      return;
    }

    const messages: Record<string, string> = {
      ALREADY_VOTED: "Este pasajero ya ha enviado su voto anteriormente.",
      VOTING_CLOSED: "Las votaciones se han cerrado justo ahora. ¡Gracias por intentarlo!",
      SELF_VOTE: "No puedes votarte a ti mismo/a en alguna categoría.",
      UNKNOWN: "Algo ha ido mal al enviar tu voto. Inténtalo de nuevo.",
    };
    setStep({ name: "error", message: messages[result.error] ?? messages.UNKNOWN });
  }

  if (step.name === "intro") {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-6 sm:p-8 text-center">
        <h1 className="font-display font-semibold text-2xl text-navy-800 mb-4">Capawards 🏆</h1>
        <p className="text-navy-600 text-sm sm:text-base leading-relaxed mb-6">
          ¡Bienvenido/a una nueva edición de los Capawards! Desde aquí podrás votar a los
          personajes más destacados de esta edición (o al menos del primer día, como siempre; sí,
          ya sabemos que eso es un problema, pero mañana todo el mundo estará ya con otras cosas).
          Vota en cada categoría a quien consideres que merece el honor.
        </p>
        <button
          onClick={() => setStep({ name: "identity" })}
          className="rounded-full bg-navy-700 text-white font-medium px-8 py-3 hover:bg-navy-600 transition-colors"
        >
          Comenzar
        </button>
      </div>
    );
  }

  if (step.name === "identity") {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-6 sm:p-8">
        <h2 className="font-display font-semibold text-lg text-navy-800 mb-1">
          Selecciona el pasajero
        </h2>
        <p className="text-navy-500 text-sm mb-5">
          Haz click sobre tu nombre en la lista para empezar la votación
        </p>
        {eligibleVoters.length === 0 ? (
          <p className="text-navy-500 text-sm">
            Todos los pasajeros ya han emitido su voto. ¡Gracias por participar!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {eligibleVoters.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setVoterId(p.id);
                  setVotes({});
                  goToCategory(0);
                }}
                className="text-left rounded-xl border border-navy-200 px-4 py-3 hover:border-gold-500 hover:bg-gold-50 transition-colors"
              >
                {p.full_name}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step.name === "category") {
    const category = categories[step.index];
    const selected = votes[category.id];
    return (
      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-6 sm:p-8">
        <p className="text-xs font-medium uppercase tracking-wide text-gold-600 mb-1">
          Categoría {step.index + 1} de {categories.length}
        </p>
        <h2 className="font-display font-semibold text-xl text-navy-800 mb-1">{category.name}</h2>
        {category.description && (
          <p className="text-navy-500 text-sm mb-5">{category.description}</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-h-96 overflow-y-auto pr-1">
          {nomineesFor.map((p) => (
            <button
              key={p.id}
              onClick={() => setVotes((v) => ({ ...v, [category.id]: p.id }))}
              className={`text-left rounded-xl border px-4 py-3 transition-colors ${
                selected === p.id
                  ? "border-gold-500 bg-gold-50 ring-1 ring-gold-500"
                  : "border-navy-200 hover:border-gold-400"
              }`}
            >
              {p.full_name}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => goToCategory(step.index - 1)}
            className="rounded-full px-5 py-2.5 text-navy-600 font-medium hover:bg-navy-50 transition-colors"
          >
            Atrás
          </button>
          <button
            onClick={() => goToCategory(step.index + 1)}
            disabled={!selected}
            className="rounded-full bg-navy-700 text-white font-medium px-6 py-2.5 hover:bg-navy-600 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Siguiente
          </button>
        </div>
      </div>
    );
  }

  if (step.name === "review") {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-6 sm:p-8">
        <h2 className="font-display font-semibold text-xl text-navy-800 mb-1">
          Revisa tu voto, <span className="font-medium text-navy-700">{voter?.full_name}</span>.
        </h2>
        <p className="text-navy-500 text-sm mb-5"> 
          Toca una categoría para cambiar tu elección.
        </p>

        <ul className="divide-y divide-navy-100 rounded-xl border border-navy-100 overflow-hidden mb-6">
          {categories.map((c, i) => {
            const nomineeId = votes[c.id];
            const nominee = allPassengers.find((p) => p.id === nomineeId);
            return (
              <li key={c.id}>
                <button
                  onClick={() => goToCategory(i)}
                  className="w-full flex items-center justify-between gap-3 px-4 py-3 text-left hover:bg-navy-50 transition-colors"
                >
                  <span className="text-navy-600 text-sm">{c.name}</span>
                  <span className="font-medium text-navy-800">{nominee?.full_name ?? "—"}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => goToCategory(categories.length - 1)}
            className="rounded-full px-5 py-2.5 text-navy-600 font-medium hover:bg-navy-50 transition-colors"
          >
            Atrás
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-full bg-gold-500 text-navy-900 font-semibold px-6 py-2.5 hover:bg-gold-400 transition-colors"
          >
            Votar!
          </button>
        </div>
      </div>
    );
  }

  if (step.name === "submitting") {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-8 text-center text-navy-500">
        Enviando tu voto…
      </div>
    );
  }

  if (step.name === "done") {
    return (
      <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-8 text-center">
        <p className="text-4xl mb-3">🎉</p>
        <h2 className="font-display font-semibold text-xl text-navy-800 mb-1">
          ¡Voto enviado!
        </h2>
        <p className="text-navy-500 text-sm">
          Gracias por participar, {voter?.full_name}. Los resultados se anunciarán en persona.
        </p>
      </div>
    );
  }

  // error
  return (
    <div className="bg-white rounded-2xl shadow-card border border-navy-100 p-8 text-center">
      <p className="text-4xl mb-3">⚠️</p>
      <h2 className="font-display font-semibold text-xl text-navy-800 mb-1">
        No hemos podido enviar tu voto
      </h2>
      <p className="text-navy-500 text-sm">{step.message}</p>
    </div>
  );
}
