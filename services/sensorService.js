import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

export async function saveSensorObservations(
  observations,
  pseudo = null,
  checkinDate = null
) {
  if (!Array.isArray(observations)) {
    throw new Error("saveSensorObservations requires an observations array.");
  }

  const normalizedPseudo = pseudo?.trim().toLowerCase() ?? null;
  const observationDate =
    checkinDate || new Date().toISOString().split("T")[0];

  const payload = observations.map((obs) => ({
    pseudo: normalizedPseudo,
    observation_date: observationDate,
    source: "mock",
    metric_key: obs.metric_key,
    metric_label: obs.metric_label,
    value_number: obs.value_number,
  }));

  const { data, error } = await supabase
    .from("sensor_observations")
    .upsert(payload, {
      onConflict: "pseudo,observation_date,source,metric_key",
    })
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function getSensorObservationsByDate(checkinDate, pseudo = null) {
  let query = supabase
    .from("sensor_observations")
    .select("*")
    .eq("observation_date", checkinDate);

  if (pseudo) {
    query = query.eq("pseudo", pseudo.trim().toLowerCase());
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data || [];
}