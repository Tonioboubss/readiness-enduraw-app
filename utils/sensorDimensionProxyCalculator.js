function getMetric(observations, key) {
        const item = observations.find((obs) => obs.metric_key === key);
        return item ? Number(item.value_number) : null;
      }
      
      function clamp(value) {
        if (value === null || Number.isNaN(value)) return null;
        return Math.max(0, Math.min(100, Math.round(value)));
      }
      
      function normalize(value, min, max, invert = false) {
        if (value === null || Number.isNaN(value)) return null;
      
        const normalized = ((value - min) / (max - min)) * 100;
        const score = invert ? 100 - normalized : normalized;
      
        return clamp(score);
      }
      
      function average(values) {
        const valid = values.filter((v) => v !== null && !Number.isNaN(v));
      
        if (valid.length === 0) return null;
      
        return Math.round(valid.reduce((sum, v) => sum + v, 0) / valid.length);
      }
      
      export function calculateSensorDimensionProxies(observations) {
        const sleepScore = getMetric(observations, "sleep_score");
        const recoveryIndex = getMetric(observations, "recovery_index");
        const hrv = getMetric(observations, "hrv");
        const restingHr = getMetric(observations, "resting_hr");
        const trainingLoad = getMetric(observations, "training_load");
      
        const hrvScore = normalize(hrv, 40, 90);
        const restingHrScore = normalize(restingHr, 42, 60, true);
        const trainingFreshnessScore = normalize(trainingLoad, 30, 100, true);
      
        return {
          energy: average([recoveryIndex, hrvScore, restingHrScore]),
          recovery: average([sleepScore, recoveryIndex, hrvScore, restingHrScore]),
          mental_availability: average([sleepScore, recoveryIndex, restingHrScore]),
          physical_aptitude: average([
            recoveryIndex,
            hrvScore,
            trainingFreshnessScore,
          ]),
          ambition: average([recoveryIndex, sleepScore, hrvScore]),
          confidence: average([recoveryIndex, sleepScore, hrvScore]),
        };
      }