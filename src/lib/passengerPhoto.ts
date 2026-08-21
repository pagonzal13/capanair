// Convencion para las fotos de pasajeros: un fichero .jpg cuadrado (1:1)
// en /public/pasajeros/, nombrado exactamente igual que el full_name del
// pasajero (mayusculas/minusculas incluidas, importa en el despliegue).
// Si el fichero no existe, cada componente que la usa cae a un estado sin
// foto (iniciales o color liso) mediante el evento onError de la imagen.
export function passengerPhotoUrl(fullName: string): string {
  return `/pasajeros/${encodeURIComponent(fullName)}.jpg`;
}
