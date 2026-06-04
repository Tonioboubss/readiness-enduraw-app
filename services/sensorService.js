import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

export async function saveSensorObservations(observations) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const today = new Date().toISOString().split("T")[0];

  const payload = observations.map((obs) => ({
    user_id: user.id,

    observation_date: today,

    source: "mock",

    metric_key: obs.metric_key,
    metric_label: obs.metric_label,

    value_number: obs.value_number,
  }));

  const { data, error } = await supabase
    .from("sensor_observations")
    .upsert(payload, {
      onConflict:
        "user_id,observation_date,source,metric_key",
    })
    .select();

  if (error) {
    throw error;
  }

  return data;
}

export async function getTodaySensorObservations() {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("No authenticated user");
  }

  const today = new Date().toISOString().split("T")[0];

  const { data, error } = await supabase
    .from("sensor_observations")
    .select("*")
    .eq("user_id", user.id)
    .eq("observation_date", today);

  if (error) {
    throw error;
  }

  return data;
}