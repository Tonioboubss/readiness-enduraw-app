export function calculateReadinessScore(answers) {
        const readinessKeys = [
          "energy",
          "recovery",
          "mental_availability",
          "physical_aptitude",
          "ambition",
          "confidence",
        ];
      
        const values = answers
          .filter((answer) => readinessKeys.includes(answer.signal_key))
          .map((answer) => Number(answer.value_number))
          .filter((value) => !Number.isNaN(value));
      
        if (values.length === 0) {
          return null;
        }
      
        const total = values.reduce((sum, value) => sum + value, 0);
      
        return Math.round(total / values.length);
      }