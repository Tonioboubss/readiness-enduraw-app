function randomBetween(min, max) {
        return Math.round(Math.random() * (max - min) + min);
      }
      
      export function generateMockSensorData() {
        return [
          {
            metric_key: "sleep_score",
            metric_label: "Sleep Score",
            value_number: randomBetween(60, 95),
          },
      
          {
            metric_key: "hrv",
            metric_label: "HRV",
            value_number: randomBetween(40, 90),
          },
      
          {
            metric_key: "resting_hr",
            metric_label: "Resting Heart Rate",
            value_number: randomBetween(42, 60),
          },
      
          {
            metric_key: "training_load",
            metric_label: "Training Load",
            value_number: randomBetween(30, 100),
          },
      
          {
            metric_key: "recovery_index",
            metric_label: "Recovery Index",
            value_number: randomBetween(50, 95),
          },
        ];
      }