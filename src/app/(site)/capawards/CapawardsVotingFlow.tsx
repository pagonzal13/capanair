"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { passengerPhotoUrl } from "@/lib/passengerPhoto";
import { submitCapawardsBallot } from "./actions";

interface Person {
  id: string;
  full_name: string;
}

interface Category {
  id: string;
  name: string;
  description: string | null;
  is_multi_select: boolean;
}

function IdentityCard({
  person,
  canVote,
  onSelect,
}: {
  person: Person;
  canVote: boolean;
  onSelect: () => void;
}) {
  const [broken, setBroken] = useState(false);

  return (
    <button
      type="button"
      disabled={!canVote}
      onClick={onSelect}
      className={`group relative aspect-square rounded-2xl overflow-hidden border shadow-card transition-colors ${
        canVote ? "border-navy-200 hover:border-gold-500" : "border-navy-200 cursor-not-allowed"
      }`}
    >
      {!broken && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={passengerPhotoUrl(person.full_name)}
          alt=""
          onError={() => setBroken(true)}
          className="absolute inset-0 h-full w-full object-cover opacity-80"
        />
      )}
      <div
        className={`absolute inset-0 transition-colors ${
          canVote ? "bg-navy-900/50 group-hover:bg-gold-600/40" : "bg-grey-100/70"
        }`}
      />
      <div className="relative z-10 flex h-full items-center justify-center p-2 text-center">
        <span className={`font-display font-semibold ${canVote ? "text-white" : "text-white/70"}`}>
          {person.full_name}
        </span>
      </div>
    </button>
  );
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
  // Un array de ids por categoria: 1 elemento en categorias normales,
  // 1 o mas en categorias de seleccion multiple.
  const [votes, setVotes] = useState<Record<string, string[]>>({});

  const voter = useMemo(
    () => allPassengers.find((p) => p.id === voterId) ?? null,
    [allPassengers, voterId]
  );

  const nomineesFor = useMemo(
    () => allPassengers.filter((p) => p.id !== voterId),
    [allPassengers, voterId]
  );

  const eligibleIds = useMemo(
    () => new Set(eligibleVoters.map((p) => p.id)),
    [eligibleVoters]
  );

  const topRef = useRef<HTMLDivElement>(null);
  const nextButtonRef = useRef<HTMLButtonElement>(null);

  // Al entrar en una categoría o en la revisión, sube el scroll para que se
  // lea desde el principio.
  useEffect(() => {
    if (step.name === "category" || step.name === "review") {
      topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  function selectSingleNominee(categoryId: string, personId: string) {
    setVotes((v) => ({ ...v, [categoryId]: [personId] }));
    scrollToNextButton();
  }

  function toggleGroupNominee(categoryId: string, personId: string) {
    setVotes((v) => {
      const current = v[categoryId] ?? [];
      const next = current.includes(personId)
        ? current.filter((id) => id !== personId)
        : [...current, personId];
      return { ...v, [categoryId]: next };
    });
    scrollToNextButton();
  }

  function scrollToNextButton() {
    // Baja el scroll hasta el botón "Siguiente" para que quede a mano en
    // cuanto se habilita.
    requestAnimationFrame(() => {
      nextButtonRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }

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
      categories.map((c) =>
        c.is_multi_select
          ? { category_id: c.id, nominee_passenger_ids: votes[c.id] ?? [] }
          : { category_id: c.id, nominee_passenger_id: (votes[c.id] ?? [])[0] }
      )
    );

    if (result.ok) {
      setStep({ name: "done" });
      return;
    }

    const messages: Record<string, string> = {
      ALREADY_VOTED: "Este pasajero ya ha enviado su voto anteriormente.",
      VOTING_CLOSED: "Las votaciones se han cerrado justo ahora. ¡Gracias por intentarlo!",
      SELF_VOTE: "No puedes votarte a ti mismo/a en alguna categoría.",
      EMPTY_GROUP: "Falta seleccionar a alguien en alguna categoría.",
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
          📩 Selecciona el pasajero que va a votar
        </h2>
        <p className="text-navy-500 text-sm mb-5">
          Haz click sobre 𝐭𝐮 𝐧𝐨𝐦𝐛𝐫𝐞 en la lista para empezar
        </p>
        {eligibleVoters.length === 0 ? (
          <p className="text-navy-500 text-sm">
            Todos los pasajeros ya han emitido su voto. ¡Gracias por participar!
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {allPassengers.map((p) => (
              <IdentityCard
                key={p.id}
                person={p}
                canVote={eligibleIds.has(p.id)}
                onSelect={() => {
                  setVoterId(p.id);
                  setVotes({});
                  goToCategory(0);
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (step.name === "category") {
    const category = categories[step.index];
    const selected = votes[category.id] ?? [];
    return (
      <div
        ref={topRef}
        className="scroll-mt-24 bg-white rounded-2xl shadow-card border border-navy-100 p-6 sm:p-8"
      >
        <p className="text-xs font-medium uppercase tracking-wide text-gold-600 mb-1">
          Categoría {step.index + 1} de {categories.length}
        </p>
        <h2 className="font-display font-semibold text-xl text-navy-800 mb-1">{category.name}</h2>
        {category.description && (
          <p className="text-navy-500 text-sm mb-2">{category.description}</p>
        )}
        {category.is_multi_select && (
          <p className="text-gold-600 text-xs font-medium mb-3">
            Puedes marcar a varias personas si tienen un disfraz en grupo.
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6 max-h-96 overflow-y-auto pr-1">
          {nomineesFor.map((p) => {
            const isSelected = selected.includes(p.id);
            return (
              <button
                key={p.id}
                onClick={() =>
                  category.is_multi_select
                    ? toggleGroupNominee(category.id, p.id)
                    : selectSingleNominee(category.id, p.id)
                }
                className={`text-left rounded-xl border px-4 py-3 transition-colors ${
                  isSelected
                    ? "border-gold-500 bg-gold-50 ring-1 ring-gold-500"
                    : "border-navy-200 hover:border-gold-400"
                }`}
              >
                {category.is_multi_select && (
                  <span
                    className={`inline-block mr-2 h-4 w-4 rounded border align-middle ${
                      isSelected ? "bg-gold-500 border-gold-500" : "border-navy-300"
                    }`}
                    aria-hidden
                  />
                )}
                {p.full_name}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => goToCategory(step.index - 1)}
            className="rounded-full px-5 py-2.5 text-navy-600 font-medium hover:bg-navy-50 transition-colors"
          >
            Atrás
          </button>
          <button
            ref={nextButtonRef}
            onClick={() => goToCategory(step.index + 1)}
            disabled={selected.length === 0}
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
      <div
        ref={topRef}
        className="scroll-mt-24 bg-white rounded-2xl shadow-card border border-navy-100 p-6 sm:p-8"
      >
        <h2 className="font-display font-semibold text-xl text-navy-800 mb-1">
          Revisa antes de votar, <span className="font-medium text-gold-700">{voter?.full_name}</span>.
        </h2>
        <p className="text-navy-500 text-sm mb-5"> 
          Toca una categoría para cambiar tu elección.
        </p>

        <ul className="divide-y divide-navy-100 rounded-xl border border-navy-100 overflow-hidden mb-6">
          {categories.map((c, i) => {
            const nomineeIds = votes[c.id] ?? [];
            const names = nomineeIds
              .map((id) => allPassengers.find((p) => p.id === id)?.full_name)
              .filter(Boolean);
            return (
              <li key={c.id}>
                <button
                  onClick={() => goToCategory(i)}
                  className="w-full items-center justify-between gap-3 px-2 py-3 text-left hover:bg-navy-50 transition-colors"
                >
                  <div className="text-navy-600 text-sm shrink-0">{c.name}:</div>
                  <div className="font-medium text-navy-800 text-right">
                    {names.length > 0 ? names.join(" & ") : "—"}
                  </div>
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
          Gracias por participar, {voter?.full_name}. Los resultados se anunciarán en la ceremonia.
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
