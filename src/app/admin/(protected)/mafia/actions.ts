"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

export async function setPassengerDead(formData: FormData) {
  const id = String(formData.get("id"));
  const dead = formData.get("dead") === "true";
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("passengers")
    .update({
      is_dead: dead,
      died_at: dead ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/mafia");
  revalidatePath("/mafia");
  revalidatePath("/admin");
}
