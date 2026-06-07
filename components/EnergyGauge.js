import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { COLORS } from "../constants/theme.js";

export default function EnergyGauge({ value = 72 }) {
  const size = 150;
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const progress = Math.max(0, Math.min(value, 100)) / 100;
  const dashOffset = circumference * (1 - progress);

  const level = value >= 75 ? "Very high" : value >= 60 ? "High" : value >= 40 ? "Moderate" : "Low";

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} style={styles.svg}>
        <Circle
          stroke="rgba(255,255,255,0.16)"
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        <Circle
          stroke={COLORS.orange}
          fill="none"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>

      <View style={styles.center}>
        <Text style={styles.value}>{Math.round(value)}%</Text>
        <Text style={styles.level}>{level}</Text>
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 170,
    alignItems: "center",
  },
  svg: {
    transform: [{ rotate: "18deg" }],
  },
  center: {
    position: "absolute",
    top: 48,
    alignItems: "center",
  },
  value: {
    color: COLORS.text,
    fontSize: 34,
    fontWeight: "900",
  },
  level: {
    color: COLORS.orange,
    fontSize: 14,
    fontWeight: "800",
  },
});