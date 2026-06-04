import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function BackendTestScreen() {
  const [message, setMessage] = useState("Backend test screen loaded");

  const testLogin = async () => {
    try {
      setMessage("Import auth service...");

      const authService = await import("../services/authService");

      setMessage("Trying login...");

      await authService.signInWithEmail({
        email: "test-readiness@example.com",
        password: "Test123456!!",
      });

      const user = await authService.getCurrentUser();

      setMessage(`Connected: ${user.email}`);
    } catch (error) {
      console.log("LOGIN TEST ERROR:", error);
      setMessage(error?.message || "Unknown error");
    }
  };

  const testCreateCheckin = async () => {
    try {
      setMessage("Creating today's check-in...");

      const checkinService = await import("../services/checkinService");

      const checkin = await checkinService.createTodayCheckin();

      setMessage(JSON.stringify(checkin, null, 2));
    } catch (error) {
      console.log("CHECKIN TEST ERROR:", error);
      setMessage(error?.message || "Unknown error");
    }
  };

  const testCompleteCheckin = async () => {
    try {
      setMessage("Completing today's check-in...");

      const checkinService = await import("../services/checkinService");

      const checkin = await checkinService.getTodayCheckin();

      if (!checkin) {
        setMessage("No check-in found today. Create one first.");
        return;
      }

      const completedCheckin = await checkinService.completeCheckin(checkin.id);

      setMessage(JSON.stringify(completedCheckin, null, 2));
    } catch (error) {
      console.log("COMPLETE CHECKIN TEST ERROR:", error);
      setMessage(error?.message || "Unknown error");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend Test</Text>

      <TouchableOpacity style={styles.button} onPress={testLogin}>
        <Text style={styles.buttonText}>Test login</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testCreateCheckin}>
        <Text style={styles.buttonText}>Create today check-in</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={testCompleteCheckin}>
        <Text style={styles.buttonText}>Complete today check-in</Text>
      </TouchableOpacity>

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 40,
    justifyContent: "center",
    backgroundColor: "#F7F3EA",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#111827",
    padding: 16,
    borderRadius: 14,
    marginBottom: 12,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
  },
  message: {
    marginTop: 24,
    fontSize: 13,
  },
});