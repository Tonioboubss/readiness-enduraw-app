import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function HormonalCard({ value, onChange }) {
  return (
    <View style={styles.card}>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>BONUS</Text>
      </View>

      <Text style={styles.womenOnly}>WOMEN ONLY</Text>

      <View style={styles.plusCircle}>
        <Feather name="plus" size={26} color="#FF8500" />
      </View>

      <Text style={styles.title}>HORMONAL{"\n"}BALANCE</Text>

      <Feather name="circle" size={44} color="#D7D7D7" style={styles.icon} />

      <Text style={styles.question}>
        How does your hormonal cycle affect your humor?
      </Text>

      <View style={styles.verticalScale}>
        <Text style={styles.scaleNumber}>1</Text>

        <View style={styles.verticalDots}>
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

      <View style={styles.labels}>
        <Text style={styles.label}>Unstable</Text>
        <Text style={styles.label}>Balanced</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 175,
    minHeight: 560,
    backgroundColor: "#07131D",
    borderRadius: 20,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "#FF8500",
    paddingVertical: 24,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  badge: {
    borderWidth: 1,
    borderColor: "#FF8500",
    borderRadius: 7,
    paddingHorizontal: 14,
    paddingVertical: 5,
  },

  badgeText: {
    color: "#FF8500",
    fontSize: 12,
    fontWeight: "900",
  },

  womenOnly: {
    color: "#FF8500",
    fontSize: 13,
    fontWeight: "900",
    marginTop: 18,
  },

  plusCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    borderColor: "#FF8500",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  title: {
    color: "#F5F5F5",
    fontSize: 16,
    fontWeight: "900",
    textAlign: "center",
    marginTop: 22,
    lineHeight: 22,
  },

  icon: {
    marginTop: 24,
    marginBottom: 16,
  },

  question: {
    color: "#D7D7D7",
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
  },

  verticalScale: {
    marginTop: 26,
    alignItems: "center",
  },

  scaleNumber: {
    color: "#F5F5F5",
    fontSize: 15,
    fontWeight: "800",
  },

  verticalDots: {
    height: 165,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },

  dot: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "#333C42",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  dotSelected: {
    backgroundColor: "#FF8500",
    borderColor: "#FFB15A",
  },

  labels: {
    marginTop: -142,
    marginLeft: 100,
    height: 185,
    justifyContent: "space-between",
  },

  label: {
    color: "#D7D7D7",
    fontSize: 12,
  },
});