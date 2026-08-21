import { Logo, Wordmark } from "@/components/Logo";
import { login } from "./actions";

export const metadata = {
  title: "Login",
};

export default function AccesoPage({
  searchParams,
}: {
  searchParams: { error?: string; redirect?: string };
}) {
  const hasError = searchParams.error === "1";
  const redirectTo = searchParams.redirect ?? "/";

  return (
    <main className="min-h-screen flex items-center justify-center bg-navy-800 px-4 py-10">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center gap-2 mb-6">
          <Logo className="h-20 w-20" />
          <Wordmark className="text-2xl text-white" />
        </div>
        <div className="bg-white rounded-2xl shadow-card p-6">
          <h1 className="text-xl font-display font-semibold text-navy-800 text-center mb-1">
            Bienvenido/a a bordo
          </h1>
          <p className="text-sm text-navy-500 text-center mb-6">
            Introduce la contraseña de embarque para acceder a Capanair
          </p>
          <form action={login} className="space-y-4">
            <input type="hidden" name="redirect" value={redirectTo} />
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-navy-700 mb-1">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoFocus
                autoComplete="off"
                className="w-full rounded-lg border border-navy-200 px-3 py-2.5 text-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>
            {hasError && (
              <p className="text-sm text-red-600" role="alert">
                Contraseña incorrecta. Inténtalo de nuevo.
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-lg bg-navy-700 text-white font-medium py-2.5 hover:bg-navy-600 transition-colors"
            >
              Embarcar ✈
            </button>
          </form>
        </div>
        <p className="text-center text-xs text-navy-300 mt-6">Capafest · Edición Viajes 2026</p>
      </div>
    </main>
  );
}
