export function calculatePerceptionGapScore(
        answers,
        observations
      ) {
        const getAnswer = (key) => {
          const item = answers.find(
            (a) => a.signal_key === key
          );
      
          return item
            ? Number(item.value_number)
            : null;
        };
      
        const getObservation = (key) => {
          const item = observations.find(
            (o) => o.metric_key === key
          );
      
          return item
            ? Number(item.value_number)
            : null;
        };
      
        const comparisons = [
          [
            getAnswer("energy"),
            getObservation("recovery_index"),
          ],
      
          [
            getAnswer("recovery"),
            getObservation("sleep_score"),
          ],
      
          [
            getAnswer("physical_aptitude"),
            getObservation("training_load"),
          ],
        ];
      
        const valid = comparisons.filter(
          ([a, b]) => a !== null && b !== null
        );
      
        if (valid.length === 0) {
          return null;
        }
      
        const meanGap =
          valid.reduce(
            (sum, [a, b]) => sum + Math.abs(a - b),
            0
          ) / valid.length;
      
        return Math.round(
          Math.max(0, 100 - meanGap)
        );
      }