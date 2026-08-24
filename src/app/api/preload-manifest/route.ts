import fs from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { passengerPhotoUrl } from "@/lib/passengerPhoto";
import { getSupabaseAdmin } from "@/lib/supabase";

export const dynamic = "force-dynamic";

const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp|gif|svg)$/i;

function listPublicImages(): string[] {
  try {
    const publicDir = path.join(process.cwd(), "public");
    const entries = fs.readdirSync(publicDir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && IMAGE_EXTENSIONS.test(entry.name))
      .map((entry) => `/${entry.name}`);
  } catch {
    // Si por lo que sea no se puede leer /public en este entorno, seguimos
    // solo con las fotos de pasajeros (que se resuelven via Supabase).
    return [];
  }
}

export async function GET() {
  const supabase = getSupabaseAdmin();
  const { data } = await supabase.from("passengers").select("full_name");

  const passengerPhotos = (data ?? []).map((p) => passengerPhotoUrl(p.full_name));
  const staticImages = listPublicImages();

  return NextResponse.json({ images: [...staticImages, ...passengerPhotos] });
}
