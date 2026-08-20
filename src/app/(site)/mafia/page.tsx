import { MafiaDiagram } from "@/components/MafiaDiagram";
import { getSupabaseAdmin } from "@/lib/supabase";
import { MafiaRoster } from "./MafiaRoster";

export const revalidate = 0;
export const metadata = { title: "La Mafia" };

export default async function MafiaPage() {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("passengers")
    .select("id, full_name, is_dead")
    .order("full_name");
  if (error) throw error;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <h1 className="font-display font-semibold text-2xl text-navy-800 mb-1">🎯 La Mafia 🎯</h1>
      <p className="text-navy-500 text-sm mb-6">
        Cuando acabe el fin de semana...sólo podrá quedar uno 🔪
      </p>

      <div className="bg-navy-800 text-white rounded-2xl shadow-card p-6 mb-6">
        <h2 className="font-display font-semibold text-xl mb-2">Cómo se juega</h2>
        <p className="text-white/80 text-sm leading-relaxed">
          El juego de La Mafia ya es un clásico de esta fiesta. Se jugará durante todo el fin de semana.
          Al llegar a la casa, pídele a 𝐏𝐚𝐮𝐥𝐢𝐬𝐡 tu papelito &ldquo;Top Secret&rdquo;. En él encontrarás escrito a quién tienes que 𝘮𝘢𝘵𝘢𝘳
          y con qué objeto.
        </p>

        <div className="bg-muted/30 rounded-lg p-4 mt-6 mb-6" style={{ borderWidth: 'thick' }}>
          <h3 className="text-lg font-semibold mb-4 text-center">Top Secret</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-1">
            <div className="flex flex-col items-center">
              <img 
                src="/top_secret_card_front.png" 
                alt="Cara frontal del papel Top Secret" 
                className="w-full max-w-48 sm:max-w-64 object-contain rounded-lg shadow-lg"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">Cara frontal</p>
            </div>
            
            <div className="flex flex-col items-center">
              <img 
                src="/top_secret_card_back.png" 
                alt="Cara trasera del papel Top Secret" 
                className="w-full max-w-48 sm:max-w-64 object-contain rounded-lg shadow-lg"
              />
              <p className="text-sm text-muted-foreground mt-2 text-center">Cara trasera</p>
            </div>
          </div>
        </div>

        <p className="text-white/80 text-sm leading-relaxed">
          Para 𝘮𝘢𝘵𝘢𝘳 a alguien, debes lograr que esa persona tome el objeto de tu propia mano. Cuando lo haga, 
          le dices discretamente que está 𝘮𝘶𝘦𝘳𝘵𝘰 y él o ella te entregará el que era su objetivo.
        </p>

        <div className="bg-muted/30 rounded-lg p-4 mt-6 mb-6" style={{ borderWidth: 'thick' }}>
          <h3 className="text-lg font-semibold mb-4 text-center">Nueva víctima</h3>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-1">
            <div className="flex flex-col items-center">
              <img 
                src="/nueva-victima.jpg" 
                alt="Acción de darle a la víctima el objeto para matarla" 
                className="w-full max-w-48 sm:max-w-64 object-contain rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>

        <p className="text-white/80 text-sm leading-relaxed">
          Así, el juego continua: 
          ahora tú debes ir a 𝘮𝘢𝘵𝘢𝘳 a la siguiente persona con el nuevo objeto que te haya tocado.
        </p>
      </div>

      <div className="mb-8">
        <MafiaDiagram />
      </div>

      <h2 className="font-display font-semibold text-lg text-navy-800 mb-3">
        Recuento de víctimas:
      </h2>
      <MafiaRoster initialPassengers={data ?? []} />
    </div>
  );
}
