import { supabase } from "./supabase";
import { getTodayCheckin } from "./checkinService";

/**
 * Sauvegarde plusieurs réponses.
 */
export async function saveAnswers(checkinId, answers) {
  const payload = answers.map((answer) => ({
    checkin_id: checkinId,

    signal_key: answer.signal_key,
    signal_label: answer.signal_label || null,

    screen: answer.screen || null,
    category: answer.category || null,

    value_number: answer.value_number ?? null,
    value_text: answer.value_text ?? null,
    value_json: answer.value_json ?? null,
  }));

  const { data, error } = await supabase
    .from("checkin_answers")
    .upsert(payload, {
      onConflict: "checkin_id,signal_key",
    })
    .select();

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Récupère toutes les réponses d'un check-in.
 */
export async function getAnswers(checkinId) {
  const { data, error } = await supabase
    .from("checkin_answers")
    .select("*")
    .eq("checkin_id", checkinId)
    .order("signal_key");

  if (error) {
    throw error;
  }

  return data;
}

export async function getTodayAnswers() {
  const checkin = await getTodayCheckin();

  if (!checkin) {
    return [];
  }

  const { data, error } = await supabase
    .from("checkin_answers")
    .select("*")
    .eq("checkin_id", checkin.id);

  if (error) {
    throw error;
  }

  return data || [];
}

export async function getAnswersByPseudoAndDate(pseudo, checkinDate) {
  const { getCheckinByPseudoAndDate } = await import("./checkinService");

  const checkin = await getCheckinByPseudoAndDate(pseudo, checkinDate);

  console.log("GET ANSWERS PSEUDO DATE:", {
    pseudo,
    checkinDate,
    checkin,
  });

  if (!checkin) return [];

  const answers = await getAnswers(checkin.id);

  console.log("ANSWERS FOUND:", answers);

  return answers;
}