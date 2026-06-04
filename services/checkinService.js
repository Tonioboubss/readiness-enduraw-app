import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

/**
 * Retourne le check-in du jour
 */
export async function getTodayCheckin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", user.id)
    .eq("checkin_date", today)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Crée le check-in du jour
 */
export async function createTodayCheckin() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const today = new Date().toISOString().split("T")[0];

  const existing = await getTodayCheckin();

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("daily_checkins")
    .insert({
      user_id: user.id,
      checkin_date: today,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Valide définitivement un check-in
 */
export async function completeCheckin(checkinId) {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("daily_checkins")
    .update({
      status: "completed",
      completed_at: now,
      locked_at: now,
    })
    .eq("id", checkinId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}