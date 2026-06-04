import { supabase } from "./supabase";

export async function saveScore(checkinId, score) {
  const { data, error } = await supabase
    .from("score_results")
    .upsert(
      {
        checkin_id: checkinId,
        score_key: score.score_key,
        score_label: score.score_label || null,
        value_number: score.value_number ?? null,
        value_json: score.value_json ?? null,
        score_version: score.score_version || "v1",
      },
      {
        onConflict: "checkin_id,score_key",
      }
    )
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function getScores(checkinId) {
  const { data, error } = await supabase
    .from("score_results")
    .select("*")
    .eq("checkin_id", checkinId)
    .order("score_key");

  if (error) {
    throw error;
  }

  return data;
}