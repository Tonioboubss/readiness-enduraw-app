import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

/**
 * Récupère les derniers check-ins de l'utilisateur.
 */
export async function getRecentCheckins(limit = 30) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("daily_checkins")
    .select("*")
    .eq("user_id", user.id)
    .order("checkin_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Récupère les snapshots des derniers check-ins.
 */
export async function getRecentSnapshots(limit = 30) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(`
      id,
      checkin_date,
      status,
      daily_snapshots (
        id,
        snapshot_json,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("checkin_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Récupère les scores des derniers check-ins.
 */
export async function getRecentScores(limit = 30) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(`
      id,
      checkin_date,
      score_results (
        score_key,
        score_label,
        value_number,
        score_version,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .order("checkin_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Historique complet pour Body History.
 */
export async function getBodyHistory(limit = 30) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(`
      id,
      checkin_date,
      status,
      completed_at,
      score_results (
        score_key,
        score_label,
        value_number,
        score_version
      ),
      daily_snapshots (
        snapshot_json,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .eq("status", "completed")
    .order("checkin_date", { ascending: false })
    .limit(limit);

  if (error) {
    throw error;
  }

  return data;
}