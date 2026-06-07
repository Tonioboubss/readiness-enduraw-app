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

export async function getCheckinByPseudoAndDate(pseudo, checkinDate) {
  if (!pseudo || !checkinDate) {
    console.log("GET CHECKIN CANCELLED: missing pseudo/date", {
      pseudo,
      checkinDate,
    });
    return null;
  }

  const normalizedPseudo = pseudo.trim().toLowerCase();

  console.log("GET CHECKIN QUERY:", {
    pseudo,
    normalizedPseudo,
    checkinDate,
  });

  const { data, error } = await supabase
    .from("daily_checkins")
    .select("id, pseudo, checkin_date, status, created_at")
    .eq("pseudo", normalizedPseudo)
    .eq("checkin_date", checkinDate)
    .maybeSingle();

  console.log("GET CHECKIN RESULT:", {
    data,
    error,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Crée ou récupère un check-in pour un pseudo et une date donnée.
 */
export async function createCheckinByPseudoAndDate(pseudo, checkinDate) {
  if (!pseudo || !checkinDate) {
    throw new Error("Missing pseudo or checkinDate");
  }

  const normalizedPseudo = pseudo.trim().toLowerCase();

  const existing = await getCheckinByPseudoAndDate(
    normalizedPseudo,
    checkinDate
  );

  if (existing) {
    return existing;
  }

  const { data, error } = await supabase
    .from("daily_checkins")
    .insert({
      pseudo: normalizedPseudo,
      checkin_date: checkinDate,
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
 * Valide définitivement un check-in pseudo/date.
 */
export async function completeCheckinByPseudoAndDate(pseudo, checkinDate) {
  const checkin = await createCheckinByPseudoAndDate(pseudo, checkinDate);

  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("daily_checkins")
    .update({
      status: "completed",
      completed_at: now,
      locked_at: now,
    })
    .eq("id", checkin.id)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}