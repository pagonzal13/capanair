"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

function refresh() {
  revalidatePath("/admin/pasajeros");
  revalidatePath("/pasajeros");
  revalidatePath("/mafia");
  revalidatePath("/admin");
}

export async function createPassenger(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("passengers").insert({
    full_name: String(formData.get("full_name") ?? "").trim(),
    seat_code: String(formData.get("seat_code") ?? "").trim() || null,
    editions_attended: Number(formData.get("editions_attended") ?? 1) || 1,
  });
  if (error) throw error;
  refresh();
}

export async function updatePassenger(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabase
    .from("passengers")
    .update({
      full_name: String(formData.get("full_name") ?? "").trim(),
      seat_code: String(formData.get("seat_code") ?? "").trim() || null,
      editions_attended: Number(formData.get("editions_attended") ?? 1) || 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
  refresh();
}

export async function deletePassenger(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("passengers").delete().eq("id", id);
  if (error) throw error;
  refresh();
}
