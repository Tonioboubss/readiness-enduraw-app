// screens/HistoryScreen.js
import { StyleSheet, Text, View } from "react-native";
import { COLORS, SPACING } from "../constants/theme";

export default function HistoryScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>History</Text>
      <Text style={styles.subtitle}>Tes tendances seront affichées ici</Text>
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
  title: { color: COLORS.text, fontSize: 32, fontWeight: "900" },
  subtitle: { color: COLORS.muted, marginTop: 12, fontSize: 16 },
});