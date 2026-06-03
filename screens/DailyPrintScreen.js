import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { COLORS, SPACING, RADIUS } from "../constants/theme";

function getStateLabel(score) {
  if (score >= 75) return "Optimal State";
  if (score >= 55) return "Average State";
  return "Weak State";
}

function getStateMessage(score) {
  if (score >= 75) {
    return "Your system seems ready to absorb a demanding day.";
  }
  if (score >= 55) {
    return "Your state is stable, but some signals deserve attention.";
  }
  return "Your body seems to ask for caution and softer recovery.";
}

function getInsights({ energy, mental, confidence }) {
  return [
    {
      title: "Shape Readiness",
      value: Math.round((mental + confidence) / 2),
      description: "Body and Mind fluidity and coordination.",
    },
    {
      title: "Hidden Tank",
      value: Math.round((energy + confidence) / 2),
      description: "Physical fuel available today.",
    },
    {
      title: "Mental Noise",
      value: Math.round(100 - mental),
      description: "Cognitive load and Dispersion level felt.",
    },
  ];
}

export default function DailyPrintScreen({ route, navigation }) {
  const score = route.params?.score ?? 68;
  const energy = route.params?.energy ?? 70;
  const mental = route.params?.mental ?? 65;
  const confidence = route.params?.confidence ?? 72;

  const insights = getInsights({ energy, mental, confidence });

  return (
    <View style={styles.container}>
      <Text style={styles.kicker}>DAILY FOOTPRINT</Text>

      <View style={styles.scoreCircle}>
        <Text style={styles.score}>{score}</Text>
        <Text style={styles.scoreLabel}>readiness</Text>
      </View>

      <Text style={styles.state}>{getStateLabel(score)}</Text>
      <Text style={styles.message}>{getStateMessage(score)}</Text>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{Math.round(energy)}</Text>
          <Text style={styles.metricLabel}>Energy</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{Math.round(mental)}</Text>
          <Text style={styles.metricLabel}>Mental</Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricValue}>{Math.round(confidence)}</Text>
          <Text style={styles.metricLabel}>Confidence</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Catched Signals</Text>

      {insights.map((item) => (
        <View key={item.title} style={styles.insightCard}>
          <View>
            <Text style={styles.insightTitle}>{item.title}</Text>
            <Text style={styles.insightDescription}>{item.description}</Text>
          </View>

          <Text style={styles.insightValue}>{item.value}</Text>
        </View>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Check-Out")}
      >
        <Text style={styles.buttonText}>Complete Evening Check-out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Home")}
      >
        <Text style={styles.secondaryButtonText}>Back Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  kicker: {
    color: COLORS.orange,
    fontSize: 12,
    fontWeight: "900",
    letterSpacing: 2,
    marginBottom: SPACING.md,
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: COLORS.orange,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    backgroundColor: "rgba(255,122,0,0.08)",
  },
  score: {
    color: COLORS.text,
    fontSize: 42,
    fontWeight: "900",
  },
  scoreLabel: {
    color: COLORS.muted,
    fontSize: 13,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  state: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: "900",
    textAlign: "center",
    marginBottom: 6,
  },
  message: {
    color: COLORS.muted,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 14,
  },
  metricCard: {
    flex: 1,
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  metricValue: {
    color: COLORS.orange,
    fontSize: 20,
    fontWeight: "900",
  },
  metricLabel: {
    color: COLORS.muted,
    fontSize: 11,
    marginTop: 2,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: "900",
    marginBottom: 8,
  },
  insightCard: {
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
  },
  insightTitle: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: "800",
  },
  insightDescription: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 15,
    marginTop: 2,
    maxWidth: 240,
  },
  insightValue: {
    color: COLORS.orange,
    fontSize: 22,
    fontWeight: "900",
  },
  button: {
    backgroundColor: COLORS.orange,
    padding: 12,
    borderRadius: 14,
    marginTop: 8,
  },
  buttonText: {
    color: "#111",
    textAlign: "center",
    fontWeight: "900",
  },
  secondaryButton: {
    padding: 10,
  },
  secondaryButtonText: {
    color: COLORS.muted,
    textAlign: "center",
    fontWeight: "700",
  },
});