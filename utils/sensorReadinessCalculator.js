export function calculateSensorReadinessScore(sensorAxes) {
        const values = Object.values(sensorAxes || {}).filter(
          (value) =>
            value !== null &&
            value !== undefined &&
            !Number.isNaN(Number(value))
        );
      
        if (values.length === 0) {
          return null;
        }
      
        const total = values.reduce(
          (sum, value) => sum + Number(value),
          0
        );
      
        return Math.round(total / values.length);
      }