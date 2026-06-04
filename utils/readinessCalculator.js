export function calculateReadinessScore(
        dimensions
      ) {
        const values = Object.values(
          dimensions
        ).filter(
          (v) => v !== null && !Number.isNaN(v)
        );
      
        if (values.length === 0) {
          return null;
        }
      
        return Math.round(
          values.reduce((a, b) => a + b, 0) /
          values.length
        );
      }