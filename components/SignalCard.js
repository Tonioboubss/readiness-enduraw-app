import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function SignalCard({
  number,
  title,
  question,
  icon,
  leftLabel,
  rightLabel,
  value,
  onChange,
  cardWidth = "19%",
}) {
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      <View style={styles.numberCircle}>
        <Text style={styles.numberText}>{number}</Text>
      </View>

      <Text style={styles.title}>{title}</Text>

      <Feather name={icon} size={42} color="#D7D7D7" style={styles.icon} />

      <Text style={styles.question}>{question}</Text>

      <View style={styles.scaleWrapper}>
        <Text style={styles.scaleNumber}>1</Text>

        <View style={styles.dotsWrapper}>
          {[1, 2, 3, 4, 5].map((score) => (
            <TouchableOpacity
              key={score}
              activeOpacity={0.8}
              onPress={() => onChange(score)}
              style={[styles.dot, value === score && styles.dotSelected]}
            />
          ))}
        </View>

        <Text style={styles.scaleNumber}>5</Text>
      </View>

      <View style={styles.labelsRow}>
        <Text style={styles.edgeLabel}>{leftLabel}</Text>
        <Text style={[styles.edgeLabel, styles.rightEdgeLabel]}>
          {rightLabel}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 255,
    backgroundColor: "#07131D",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    padding: 14,
    marginBottom: 16,
  },

  numberCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#FF8500",
    alignItems: "center",
    justifyContent: "center",
  },

  numberText: {
    color: "#FF8500",
    fontSize: 17,
    fontWeight: "900",
  },

  title: {
    color: "#F5F5F5",
    fontSize: 14,
    fontWeight: "900",
    textAlign: "center",
    textTransform: "uppercase",
    marginTop: -30,
    minHeight: 42,
  },

  icon: {
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 14,
  },

  question: {
    color: "#D7D7D7",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
    minHeight: 42,
  },

  scaleWrapper: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  scaleNumber: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "800",
  },

  dotsWrapper: {
    flex: 1,
    marginHorizontal: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dot: {
    width: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: "#333C42",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  dotSelected: {
    backgroundColor: "#FF8500",
    borderColor: "#FFB15A",
  },

  labelsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  edgeLabel: {
    color: "#D7D7D7",
    fontSize: 11,
    maxWidth: "48%",
  },

  rightEdgeLabel: {
    textAlign: "right",
  },
});