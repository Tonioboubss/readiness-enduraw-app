export function buildDailySnapshot({ scores, dimensions }) {
        const getScoreValue = (key) => {
          const score = scores.find((item) => item.score_key === key);
          return score ? Number(score.value_number) : null;
        };
      
        return {
          generated_at: new Date().toISOString(),
      
          scores: {
            readiness_score: getScoreValue("readiness_score"),
            body_awareness_score: getScoreValue("body_awareness_score"),
            perception_gap_score: getScoreValue("perception_gap_score"),
          },
      
          readiness_axes: {
            energy: dimensions?.energy ?? null,
            recovery: dimensions?.recovery ?? null,
            mental_availability: dimensions?.mental_availability ?? null,
            physical_aptitude: dimensions?.physical_aptitude ?? null,
            ambition: dimensions?.ambition ?? null,
            confidence: dimensions?.confidence ?? null,
          },
        };
      }