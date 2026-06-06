import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/theme";

export default function ProgressSteps({ currentStep = 1 }) {
  return (
    <View style={styles.container}>
      {[1, 2, 3].map((step, index) => (
        <View key={step} style={styles.stepWrapper}>
          <View
            style={[
              styles.circle,
              step <= currentStep && styles.circleActive,
            ]}
          >
            <Text
              style={[
                styles.number,
                step <= currentStep && styles.numberActive,
              ]}
            >
              {step}
            </Text>
          </View>

          {index < 2 && (
            <View
              style={[
                styles.line,
                step < currentStep && styles.lineActive,
              ]}
            />
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  stepWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  circle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.22)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#101820",
  },
  circleActive: {
    borderColor: COLORS.orange,
    backgroundColor: COLORS.orange,
  },
  number: {
    color: COLORS.muted,
    fontWeight: "900",
  },
  numberActive: {
    color: "#05070A",
  },
  line: {
    width: 72,
    height: 2,
    backgroundColor: "rgba(255,255,255,0.18)",
  },
  lineActive: {
    backgroundColor: COLORS.orange,
  },
});