"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseAdmin } from "@/lib/supabase";

function refresh() {
  revalidatePath("/admin/horario");
  revalidatePath("/");
}

export async function createScheduleEvent(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from("schedule_events").insert({
    day: String(formData.get("day")),
    event_time: String(formData.get("event_time")),
    activity: String(formData.get("activity") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim() || null,
    location: String(formData.get("location") ?? "").trim() || null,
    icon: String(formData.get("icon") ?? "").trim() || null,
    sort_order: Number(formData.get("sort_order") ?? 0) || 0,
  });
  if (error) throw error;
  refresh();
}

export async function updateScheduleEvent(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabase
    .from("schedule_events")
    .update({
      day: String(formData.get("day")),
      event_time: String(formData.get("event_time")),
      activity: String(formData.get("activity") ?? "").trim(),
      description: String(formData.get("description") ?? "").trim() || null,
      location: String(formData.get("location") ?? "").trim() || null,
      icon: String(formData.get("icon") ?? "").trim() || null,
      sort_order: Number(formData.get("sort_order") ?? 0) || 0,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw error;
  refresh();
}

export async function deleteScheduleEvent(formData: FormData) {
  const supabase = getSupabaseAdmin();
  const id = String(formData.get("id"));
  const { error } = await supabase.from("schedule_events").delete().eq("id", id);
  if (error) throw error;
  refresh();
}
