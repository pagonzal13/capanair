"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

function refresh() {
  revalidatePath("/admin/capawards");
  revalidatePath("/capawards");
  revalidatePath("/admin");
}

export async function setVotingOpen(formData: FormData) {
  const open = formData.get("open") === "true";
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("app_settings")
    .update({ capawards_voting_open: open, updated_at: new Date().toISOString() })
    .eq("id", true);
  if (error) throw error;
  refresh();
}

export async function createCategory(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("capawards_categories").insert({
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
    is_multi_select: formData.get("is_multi_select") === "on",
  });
  if (error) throw error;
  refresh();
}

export async function updateCategory(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabase
    .from("capawards_categories")
    .update({
      name: String(formData.get("name") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || null,
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
      is_multi_select: formData.get("is_multi_select") === "on",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
  refresh();
}

export async function deleteCategory(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("capawards_categories").delete().eq("id", id);
  if (error) throw error;
  refresh();
}

export async function publishResults() {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.rpc("publish_capawards_results");
  if (error) throw error;
  refresh();
}

// Revierte la publicación: vuelve a ocultar los ganadores en la web
// abierta. No toca los votos ni el ganador calculado de cada categoría,
// solo el indicador que decide si se muestran públicamente.
export async function hideResults() {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase
    .from("app_settings")
    .update({ capawards_results_published: false, updated_at: new Date().toISOString() })
    .eq("id", true);
  if (error) throw error;
  refresh();
}
