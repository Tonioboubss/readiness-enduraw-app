import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { COLORS } from "../constants/theme";

export default function SliderQuestion({
  label,
  value,
  onChange,
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <Text style={styles.value}>{Math.round(value)}</Text>

      <Slider
        minimumValue={0}
        maximumValue={100}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={COLORS.orange}
        maximumTrackTintColor="#333"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 30,
  },

  label: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },

  value: {
    color: COLORS.orange,
    fontSize: 24,
    marginVertical: 10,
  },
});