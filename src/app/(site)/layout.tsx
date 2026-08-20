import { NavBar } from "@/components/NavBar";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      <main className="flex-1">{children}</main>
      <footer className="bg-navy-900 text-white/60 text-center text-xs py-6 px-4">
        Capanair · Capafest, Edición Viajes 2026
      </footer>
    </div>
  );
}
