export const SIGNAL_WEIGHTS = {
        "+": 1,
        "++": 2,
        "+++": 3,
      };
      
      export const READINESS_MODEL_VERSION = "v1";
      
      export const READINESS_DIMENSIONS = {
        energy: {
          label: "Energy",
          signals: {
            energy: "+++",
            wake_quality: "++",
            recovery_sensation: "++",
            willingness_to_go_out: "++",
            natural_posture: "+",
            projection_session: "+",
            hormonal: "+++",
          },
        },
      
        recovery: {
          label: "Recovery",
          signals: {
            energy: "+",
            mental_availability: "+",
            physical_aptitude: "+",
            wake_quality: "+++",
            recovery_sensation: "+++",
            willingness_to_go_out: "+",
            natural_posture: "++",
          },
        },
      
        mental_availability: {
          label: "Mental Availability",
          signals: {
            mental_availability: "+++",
            confidence: "+",
            connection_close_ones: "+",
            willingness_to_go_out: "++",
            stress: "+++",
            coordination: "++",
            satisfaction_yesterday: "++",
            projection_session: "++",
            hormonal: "++",
          },
        },
      
        physical_aptitude: {
          label: "Physical Aptitude",
          signals: {
            energy: "+",
            physical_aptitude: "+++",
            confidence: "+",
            recovery_sensation: "+",
            natural_posture: "+++",
            coordination: "+++",
            hormonal: "++",
          },
        },
      
        ambition: {
          label: "Ambition",
          signals: {
            connection_close_ones: "+",
            satisfaction_yesterday: "++",
            projection_session: "++",
            ambition: "+++",
          },
        },
      
        confidence: {
          label: "Confidence",
          signals: {
            confidence: "+++",
            connection_close_ones: "+++",
            stress: "+",
            coordination: "+",
            satisfaction_yesterday: "++",
            projection_session: "+++",
            ambition: "+",
            hormonal: "+++",
          },
        },
      };