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

/**
 * Récupère le Daily Snapshot du jour.
 */
export async function getTodaySnapshot() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("daily_checkins")
    .select(`
      id,
      checkin_date,
      status,
      daily_snapshots (
        snapshot_json,
        created_at
      )
    `)
    .eq("user_id", user.id)
    .eq("checkin_date", today)
    .eq("status", "completed")
    .maybeSingle();

    if (error) {
      throw error;
    }
    
    console.log("GET TODAY SNAPSHOT RAW DATA:", JSON.stringify(data, null, 2));
    
    const snapshotRelation = data?.daily_snapshots;
    
    if (Array.isArray(snapshotRelation)) {
      return snapshotRelation[0]?.snapshot_json ?? null;
    }
    
    return snapshotRelation?.snapshot_json ?? null;
}

export async function getYesterdaySnapshot() {
  const snapshots = await getRecentSnapshots(10);

  console.log(
    "RAW RECENT SNAPSHOTS",
    JSON.stringify(snapshots, null, 2)
  );

  const completedWithSnapshot = snapshots.filter((item) => {
    const relation = item.daily_snapshots;

    const hasSnapshot = Array.isArray(relation)
      ? relation.length > 0
      : !!relation?.snapshot_json;

    return item.status === "completed" && hasSnapshot;
  });

  console.log(
    "COMPLETED SNAPSHOTS",
    JSON.stringify(completedWithSnapshot, null, 2)
  );

  if (completedWithSnapshot.length < 2) {
    return null;
  }

  const yesterdayRelation =
    completedWithSnapshot[1].daily_snapshots;

  if (Array.isArray(yesterdayRelation)) {
    return yesterdayRelation[0]?.snapshot_json ?? null;
  }

  return yesterdayRelation?.snapshot_json ?? null;
}