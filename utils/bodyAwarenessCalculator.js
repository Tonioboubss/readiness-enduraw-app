export function calculateBodyAwarenessScore(
  perceptionGapAnalysis
) {
  const absoluteGap =
    perceptionGapAnalysis?.global_absolute_gap;

  if (
    absoluteGap === null ||
    absoluteGap === undefined
  ) {
    return null;
  }

  return Math.max(
    0,
    Math.min(
      100,
      Math.round(100 - absoluteGap)
    )
  );
}