import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ENDURAW LAB</Text>

      <View style={styles.card}>
        <Text style={styles.label}>PERFORMANCE PHYSIOLOGY</Text>

        <Text style={styles.title}>
          Help us Capture Signals. We will Highlight your Effort Readiness.
        </Text>

        <Text style={styles.subtitle}>
          Fill in everyday your mental and physical Shape in less than 60 seconds and discover
          your fitness grade.
        </Text>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate("CheckIn1")}
        >
          <Text style={styles.primaryButtonText}>Start Morning check-in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => navigation.navigate("History")}
        >
          <Text style={styles.secondaryButtonText}>Check history</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: "center",
    backgroundColor: COLORS.background,
  },
  logo: {
    color: COLORS.text,
    fontSize: 30,
    fontWeight: "900",
    marginBottom: SPACING.lg,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: RADIUS.lg,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  label: {
    color: COLORS.orange,
    fontWeight: "800",
    fontSize: 12,
    marginBottom: SPACING.sm,
  },
  title: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "900",
    lineHeight: 40,
    marginBottom: SPACING.md,
    textTransform: "uppercase",
  },
  subtitle: {
    color: COLORS.muted,
    fontSize: 16,
    lineHeight: 24,
    marginBottom: SPACING.lg,
  },
  primaryButton: {
    backgroundColor: COLORS.orange,
    padding: 16,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
  },
  primaryButtonText: {
    color: "#111",
    textAlign: "center",
    fontWeight: "900",
  },
  secondaryButton: {
    backgroundColor: COLORS.cardLight,
    padding: 16,
    borderRadius: RADIUS.md,
  },
  secondaryButtonText: {
    color: COLORS.text,
    textAlign: "center",
    fontWeight: "800",
  },
});