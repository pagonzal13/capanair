import { adminLogin } from "./actions";

export const metadata = { title: "Admin · Login" };

export default function AdminLoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const hasError = searchParams.error === "1";

  return (
    <main className="min-h-screen flex items-center justify-center bg-navy-900 px-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-card p-8">
        <h1 className="text-lg font-display font-semibold text-navy-800 text-center mb-1">
          Panel de administración
        </h1>
        <p className="text-sm text-navy-500 text-center mb-6">Acceso exclusivo del organizador.</p>
        <form action={adminLogin} className="space-y-4">
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-navy-700 mb-1">
              Contraseña de administrador
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
              Contraseña incorrecta.
            </p>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-navy-700 text-white font-medium py-2.5 hover:bg-navy-600 transition-colors"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}
