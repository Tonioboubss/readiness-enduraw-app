import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import { COLORS, RADIUS, SPACING } from "../constants/theme";
import React, { useEffect, useState } from "react";
import { getCheckinByPseudoAndDate } from "../services/checkinService";

export default function HomeScreen({ navigation, session, setSession }) {
  const [selectedCheckin, setSelectedCheckin] = useState(null);
  const [isLoadingCheckin, setIsLoadingCheckin] = useState(true);

  useEffect(() => {
    setSelectedCheckin(null);

    if (session?.pseudo && session?.checkinDate) {
      loadSelectedCheckin();
    } else {
      setIsLoadingCheckin(false);
    }
  }, [session?.pseudo, session?.checkinDate]);

  const loadSelectedCheckin = async () => {
    try {
      setIsLoadingCheckin(true);
      setSelectedCheckin(null);

      console.log("HOME LOAD SESSION:", session);

      const checkin = await getCheckinByPseudoAndDate(
        session.pseudo,
        session.checkinDate
      );

      console.log("HOME SELECTED CHECKIN:", checkin);

      setSelectedCheckin(checkin);
    } catch (error) {
      console.log("LOAD SELECTED CHECKIN ERROR:", error);
      setSelectedCheckin(null);
    } finally {
      setIsLoadingCheckin(false);
    }
  };

  const hasCompletedSelectedDate =
    selectedCheckin?.status === "completed";

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/logo.png")}
        style={styles.logoImage}
      />

      <Text style={styles.logo}>
        ENDUR<Text style={styles.logoOrange}>AW</Text> LAB
      </Text>

      <Text style={styles.sessionText}>
        {session
          ? `Pseudo: ${session.pseudo} • Date: ${session.checkinDate}`
          : "No session selected"}
      </Text>

      <TouchableOpacity
        style={styles.changeSessionButton}
        onPress={() => setSession(null)}
      >
        <Text style={styles.changeSessionText}>
          Change pseudo / date
        </Text>
      </TouchableOpacity>

      <Text style={{ color: "white", marginBottom: 12 }}>
        {isLoadingCheckin
          ? "Loading check-in..."
          : selectedCheckin
          ? `Check-in: ${selectedCheckin.status}`
          : "No check-in for this date"}
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>PERFORMANCE PHYSIOLOGY</Text>

        <Text style={styles.title}>Capture Your Signals.</Text>
        <Text style={styles.title}>Highlight your Readiness State.</Text>

        <Text style={styles.subtitle}>
          60 seconds only to collect your Signals everyday and Get your Readiness index.
        </Text>

        {!isLoadingCheckin && !hasCompletedSelectedDate && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.replace("CheckIn1", {
                readOnly: false,
                pseudo: session?.pseudo,
                checkinDate: session?.checkinDate,
              })
            }
          >
            <Text style={styles.primaryButtonText}>
              Start Morning Check-in
            </Text>
          </TouchableOpacity>
        )}

        {!isLoadingCheckin && hasCompletedSelectedDate && (
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() =>
              navigation.navigate("DailyPrint", {
                checkinId: selectedCheckin.id,
                pseudo: session?.pseudo,
                checkinDate: session?.checkinDate,
              })
            }
          >
            <Text style={styles.primaryButtonText}>
              View Daily Print
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() =>
            navigation.navigate("History", {
              pseudo: session?.pseudo,
            })
          }
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

  logoOrange: {
    color: COLORS.orange,
  },

  logoImage: {
    width: 50,
    height: 50,
    resizeMode: "contain",
    alignSelf: "flex-start",
    marginBottom: 6,
  },

  sessionText: {
    color: COLORS.muted,
    fontSize: 13,
    marginBottom: 6,
  },

  changeSessionButton: {
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  changeSessionText: {
    color: COLORS.orange,
    fontSize: 12,
    fontWeight: "800",
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