export function calculatePerceptionGapAnalysis(
  perceptionAxes,
  sensorAxes
) {
  const axes = {};
  const absoluteGaps = [];

  Object.keys(perceptionAxes).forEach((axisKey) => {
    const perception = perceptionAxes[axisKey];
    const sensor = sensorAxes[axisKey];

    if (
      perception === null ||
      perception === undefined ||
      sensor === null ||
      sensor === undefined
    ) {
      axes[axisKey] = {
        perception,
        sensor,
        signed_gap: null,
        absolute_gap: null,
      };
      return;
    }

    const signedGap = Math.round(perception - sensor);
    const absoluteGap = Math.abs(signedGap);

    absoluteGaps.push(absoluteGap);

    axes[axisKey] = {
      perception,
      sensor,
      signed_gap: signedGap,
      absolute_gap: absoluteGap,
    };
  });

  if (absoluteGaps.length === 0) {
    return {
      global_absolute_gap: null,
      axes,
    };
  }

  const globalAbsoluteGap = Math.round(
    absoluteGaps.reduce((sum, value) => sum + value, 0) /
      absoluteGaps.length
  );

  return {
    global_absolute_gap: globalAbsoluteGap,
    axes,
  };
}