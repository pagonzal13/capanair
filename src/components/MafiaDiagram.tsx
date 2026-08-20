function PersonIcon({ className = "", dead = false }: { className?: string; dead?: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none">
      <circle cx="24" cy="15" r="8" stroke="currentColor" strokeWidth="2.5" />
      <path
        d="M8 42c0-9.4 7.2-16 16-16s16 6.6 16 16"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {dead && (
        <path
          d="M11 11 37 37 M37 11 11 37"
          stroke="#DC2626"
          strokeWidth="3"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

function ObjectIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none">
      <rect
        x="4"
        y="4"
        width="24"
        height="24"
        rx="4"
        stroke="currentColor"
        strokeWidth="2.5"
        transform="rotate(45 16 16)"
      />
    </svg>
  );
}

function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none">
      <path
        d="M4 12h15M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Panel({
  step,
  title,
  children,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-2 flex-1">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-gold-300 text-sm font-mono font-bold">
        {step}
      </div>
      <div className="flex items-center justify-center gap-2 text-navy-700 h-16">{children}</div>
      <p className="text-xs sm:text-sm font-medium text-navy-700 max-w-[10rem]">{title}</p>
    </div>
  );
}

export function MafiaDiagram() {
  return (
    <div className="rounded-2xl border border-navy-200 bg-white shadow-card p-6">
      <p className="text-center text-[10px] uppercase tracking-[0.2em] text-navy-400 font-mono mb-4">
        Instrucciones de seguridad · La Mafia
      </p>
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <Panel step={1} title="Entrega tu objeto a tu objetivo">
          <PersonIcon className="h-12 w-12" />
          <ObjectIcon className="h-6 w-6 text-gold-500" />
        </Panel>

        <Arrow className="h-5 w-5 text-navy-300 rotate-90 sm:rotate-0 shrink-0" />

        <Panel step={2} title="Tu objetivo queda eliminado">
          <PersonIcon className="h-12 w-12 text-navy-300" dead />
        </Panel>

        <Arrow className="h-5 w-5 text-navy-300 rotate-90 sm:rotate-0 shrink-0" />

        <Panel step={3} title="Recibes su objetivo y su objeto: el juego continúa">
          <PersonIcon className="h-12 w-12" />
          <ObjectIcon className="h-6 w-6 text-gold-500" />
        </Panel>
      </div>
    </div>
  );
}
