import {
        READINESS_DIMENSIONS,
        SIGNAL_WEIGHTS,
      } from "../constants/readinessModel";
      
      function getAnswerValue(answers, signalKey) {
        const answer = answers.find(
          (a) => a.signal_key === signalKey
        );
      
        if (!answer) {
          return null;
        }
      
        const value = Number(answer.value_number);
      
        return Number.isNaN(value)
          ? null
          : value;
      }
      
      export function calculateReadinessDimensions(
        answers
      ) {
        const dimensions = {};
      
        Object.entries(
          READINESS_DIMENSIONS
        ).forEach(
          ([dimensionKey, dimensionConfig]) => {
      
            let weightedSum = 0;
            let totalWeight = 0;
      
            Object.entries(
              dimensionConfig.signals
            ).forEach(
              ([signalKey, weightLabel]) => {
      
                const value =
                  getAnswerValue(
                    answers,
                    signalKey
                  );
      
                if (value === null) {
                  return;
                }
      
                const weight =
                  SIGNAL_WEIGHTS[
                    weightLabel
                  ];
      
                weightedSum +=
                  value * weight;
      
                totalWeight +=
                  weight;
              }
            );
      
            dimensions[dimensionKey] =
              totalWeight > 0
                ? Math.round(
                    weightedSum /
                    totalWeight
                  )
                : null;
          }
        );
      
        return dimensions;
      }