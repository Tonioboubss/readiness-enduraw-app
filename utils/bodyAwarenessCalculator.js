export function calculateBodyAwarenessScore(history) {
        const perceptionScores = [];
      
        history.forEach((checkin) => {
          const score = checkin.score_results?.find(
            (s) => s.score_key === "perception_gap_score"
          );
      
          if (
            score &&
            score.value_number !== null &&
            score.value_number !== undefined
          ) {
            perceptionScores.push(
              Number(score.value_number)
            );
          }
        });
      
        if (perceptionScores.length === 0) {
          return null;
        }
      
        const average =
          perceptionScores.reduce(
            (sum, value) => sum + value,
            0
          ) / perceptionScores.length;
      
        return Math.round(average);
      }