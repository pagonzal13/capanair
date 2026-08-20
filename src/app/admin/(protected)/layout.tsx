import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { ADMIN_COOKIE_NAME, verifyAdminSessionToken } from "@/lib/auth";
import { adminLogout } from "../actions";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get(ADMIN_COOKIE_NAME)?.value;
  const isValid = await verifyAdminSessionToken(token);
  if (!isValid) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-navy-50">
      <header className="bg-navy-900 text-white">
        <div className="mx-auto max-w-5xl px-4 py-3 flex items-center justify-between flex-wrap gap-3">
          <span className="font-display font-semibold">Panel de administración · Capanair</span>
          <AdminNav logoutAction={adminLogout} />
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </div>
  );
}
