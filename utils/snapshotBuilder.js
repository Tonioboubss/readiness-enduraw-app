export function buildDailySnapshot({
  scores,
  dimensions,
  sensorAxes,
  perceptionGapAnalysis,
}) {
  const getScoreValue = (key) => {
    const score = scores.find((item) => item.score_key === key);
    return score ? Number(score.value_number) : null;
  };

  const readinessScore = getScoreValue("readiness_score");
  const sensorReadinessScore = getScoreValue("sensor_readiness_score");

  const globalGap =
    readinessScore !== null && sensorReadinessScore !== null
      ? readinessScore - sensorReadinessScore
      : null;

  const absoluteGap =
    perceptionGapAnalysis?.global_absolute_gap ?? null;

  return {
    generated_at: new Date().toISOString(),

    scores: {
      readiness_score: readinessScore,
      sensor_readiness_score: sensorReadinessScore,
      global_gap: globalGap,
      absolute_gap: absoluteGap,
      body_awareness_score: getScoreValue("body_awareness_score"),
    },

    readiness_axes: {
      energy: dimensions?.energy ?? null,
      recovery: dimensions?.recovery ?? null,
      mental_availability: dimensions?.mental_availability ?? null,
      physical_aptitude: dimensions?.physical_aptitude ?? null,
      ambition: dimensions?.ambition ?? null,
      confidence: dimensions?.confidence ?? null,
    },

    sensor_axes: {
      energy: sensorAxes?.energy ?? null,
      recovery: sensorAxes?.recovery ?? null,
      mental_availability: sensorAxes?.mental_availability ?? null,
      physical_aptitude: sensorAxes?.physical_aptitude ?? null,
      ambition: sensorAxes?.ambition ?? null,
      confidence: sensorAxes?.confidence ?? null,
    },

    perception_gap: {
      axes: perceptionGapAnalysis?.axes ?? {},
    },
  };
}