export function buildDailySnapshot({ answers, scores }) {
        const getAnswerValue = (key) => {
          const answer = answers.find((item) => item.signal_key === key);
          return answer ? Number(answer.value_number) : null;
        };
      
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
            energy: getAnswerValue("energy"),
            recovery: getAnswerValue("recovery"),
            mental_availability: getAnswerValue("mental_availability"),
            physical_aptitude: getAnswerValue("physical_aptitude"),
            ambition: getAnswerValue("ambition"),
            confidence: getAnswerValue("confidence"),
          },
        };
      }