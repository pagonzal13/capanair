export function MafiaDiagram() {
  return (
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <div className="flex flex-col items-center">
        <img 
          src="/mafia-instrucciones.jpg" 
          alt="Instrucciones del juego paso por paso" 
          className="w-full max-w-56 sm:max-w-74 object-contain rounded-lg shadow-lg"
        />
      </div>
    </div>
  );
}
