import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import React, { useEffect, useState } from "react";
import { getTodayCheckin } from "../services/checkinService";

export default function HomeScreen({ navigation }) {

  const [todayCheckin, setTodayCheckin] = useState(null);
  const [isLoadingCheckin, setIsLoadingCheckin] = useState(true);

  useEffect(() => {
    loadTodayCheckin();
  }, []);

  const loadTodayCheckin = async () => {
    try {
      setIsLoadingCheckin(true);

      const checkin = await getTodayCheckin();
      console.log("TODAY CHECKIN FROM HOME:", checkin);

      setTodayCheckin(checkin);
    } catch (error) {
      console.log("LOAD TODAY CHECKIN ERROR:", error);
    } finally {
      setIsLoadingCheckin(false);
    }
  };

  const hasCompletedToday =
    todayCheckin?.status === "completed";

  return (
    <View style={styles.container}>
      <Image source={require("../assets/logo.png")}
        style={styles.logoImage}
      />
      <Text style={styles.logo}>
        ENDUR
        <Text style={styles.logoOrange}>
          AW
        </Text>
        {" "}LAB
      </Text>
      <Text style={{ color: "white", marginBottom: 12 }}>
        {isLoadingCheckin
          ? "Loading check-in..."
          : todayCheckin
          ? `Today check-in: ${todayCheckin.status}`
          : "No check-in today"}
        </Text>

      <View style={styles.card}>
        <Text style={styles.label}>PERFORMANCE PHYSIOLOGY</Text>

        <Text style={styles.title}>Capture Your Signals.</Text>
        <Text style={styles.title}>Highlight your Readiness State.</Text>
        

        <Text style={styles.subtitle}>
          60 seconds only to collect your Signals everyday and Get your Readiness index.
        </Text>

        {!isLoadingCheckin && !hasCompletedToday && (
        <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => navigation.replace("CheckIn1", {readOnly: false,})}>
            <Text style={styles.primaryButtonText}>Start Morning check-in</Text>
        </TouchableOpacity>
      )}

      {!isLoadingCheckin && hasCompletedToday && (
        
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            navigation.navigate("DailyPrint", {
              checkinId: todayCheckin.id,
            })
          }
        >
        <Text style={styles.primaryButtonText}>
          View Today's Daily Print
        </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("History")}
      >
        <Text style={styles.secondaryButtonText}>
          Check history
        </Text>
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
  logoOrange: {
    color: COLORS.orange,
  },
  logoImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    alignSelf: "left",
    marginBottom: 6,
  },
});