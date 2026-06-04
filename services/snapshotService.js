import { supabase } from "./supabase";

export async function saveDailySnapshot(checkinId, snapshotJson) {
  const { data, error } = await supabase
    .from("daily_snapshots")
    .upsert(
      {
        checkin_id: checkinId,
        snapshot_json: snapshotJson,
      },
      {
        onConflict: "checkin_id",
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getDailySnapshot(checkinId) {
  const { data, error } = await supabase
    .from("daily_snapshots")
    .select("*")
    .eq("checkin_id", checkinId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}