import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

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

  const testSaveAnswers = async () => {
        try {
          const checkinService = await import(
            "../services/checkinService"
          );
      
          const answerService = await import(
            "../services/answerService"
          );
      
          const checkin =
            await checkinService.createTodayCheckin();
      
          const result =
            await answerService.saveAnswers(
              checkin.id,
              [
                {
                  signal_key: "energy",
                  signal_label: "Energy",
                  screen: "checkin1",
                  category: "readiness",
                  value_number: 82,
                },
                {
                  signal_key: "confidence",
                  signal_label: "Confidence",
                  screen: "checkin1",
                  category: "readiness",
                  value_number: 67,
                },
                {
                  signal_key: "sleep_quality",
                  signal_label: "Sleep Quality",
                  screen: "checkin2",
                  category: "recovery",
                  value_number: 75,
                },
              ]
            );
      
          setMessage(
            JSON.stringify(result, null, 2)
          );
      
        } catch (error) {
          console.log(error);
          setMessage(error.message);
        }
      };

      const testReadinessScore = async () => {
        try {
          setMessage("Calculating readiness score...");
      
          const checkinService = await import("../services/checkinService");
          const answerService = await import("../services/answerService");
          const scoreService = await import("../services/scoreService");
          const readinessCalculator = await import("../utils/readinessCalculator");
      
          const checkin = await checkinService.createTodayCheckin();
      
          const answers = await answerService.saveAnswers(checkin.id, [
            {
              signal_key: "energy",
              signal_label: "Energy",
              screen: "checkin1",
              category: "readiness",
              value_number: 82,
            },
            {
              signal_key: "recovery",
              signal_label: "Recovery",
              screen: "checkin1",
              category: "readiness",
              value_number: 74,
            },
            {
              signal_key: "mental_availability",
              signal_label: "Mental Availability",
              screen: "checkin1",
              category: "readiness",
              value_number: 69,
            },
            {
              signal_key: "physical_aptitude",
              signal_label: "Physical Aptitude",
              screen: "checkin1",
              category: "readiness",
              value_number: 77,
            },
            {
              signal_key: "ambition",
              signal_label: "Ambition",
              screen: "checkin1",
              category: "readiness",
              value_number: 88,
            },
            {
              signal_key: "confidence",
              signal_label: "Confidence",
              screen: "checkin1",
              category: "readiness",
              value_number: 71,
            },
          ]);
      
          const readinessScore =
            readinessCalculator.calculateReadinessScore(answers);
      
          const savedScore = await scoreService.saveScore(checkin.id, {
            score_key: "readiness_score",
            score_label: "Readiness Score",
            value_number: readinessScore,
            score_version: "v1",
          });
      
          setMessage(JSON.stringify(savedScore, null, 2));
        } catch (error) {
          console.log("READINESS SCORE TEST ERROR:", error);
          setMessage(error?.message || "Unknown error");
        }
      };

      const testDailySnapshot = async () => {
        try {
          setMessage("Building daily snapshot...");
      
          const checkinService = await import("../services/checkinService");
          const answerService = await import("../services/answerService");
          const scoreService = await import("../services/scoreService");
          const snapshotService = await import("../services/snapshotService");
          const snapshotBuilder = await import("../utils/snapshotBuilder");
      
          const checkin = await checkinService.createTodayCheckin();
      
          const answers = await answerService.getAnswers(checkin.id);
          const scores = await scoreService.getScores(checkin.id);
      
          const snapshot = snapshotBuilder.buildDailySnapshot({
            answers,
            scores,
          });
      
          const savedSnapshot = await snapshotService.saveDailySnapshot(
            checkin.id,
            snapshot
          );
      
          setMessage(JSON.stringify(savedSnapshot, null, 2));
        } catch (error) {
          console.log("DAILY SNAPSHOT TEST ERROR:", error);
          setMessage(error?.message || "Unknown error");
        }
      };

      const testMockSensors = async () => {
        try {
          const sensorService = await import(
            "../services/sensorService"
          );
      
          const generator = await import(
            "../utils/mockSensorGenerator"
          );
      
          const observations =
            generator.generateMockSensorData();
      
          const result =
            await sensorService.saveSensorObservations(
              observations
            );
      
          setMessage(
            JSON.stringify(result, null, 2)
          );
      
        } catch (error) {
          console.log(error);
          setMessage(error.message);
        }
      };

      const testPerceptionGapScore = async () => {
        try {
          setMessage("Calculating perception gap score...");
      
          const checkinService = await import("../services/checkinService");
          const answerService = await import("../services/answerService");
          const sensorService = await import("../services/sensorService");
          const scoreService = await import("../services/scoreService");
          const perceptionGapCalculator = await import(
            "../utils/perceptionGapCalculator"
          );
      
          const checkin = await checkinService.createTodayCheckin();
      
          const answers = await answerService.getAnswers(checkin.id);
      
          const observations =
            await sensorService.getTodaySensorObservations();
      
          const perceptionGapScore =
            perceptionGapCalculator.calculatePerceptionGapScore(
              answers,
              observations
            );
      
          const savedScore = await scoreService.saveScore(checkin.id, {
            score_key: "perception_gap_score",
            score_label: "Perception Gap Score",
            value_number: perceptionGapScore,
            score_version: "v1",
          });
      
          setMessage(JSON.stringify(savedScore, null, 2));
        } catch (error) {
          console.log("PERCEPTION GAP TEST ERROR:", error);
          setMessage(error?.message || "Unknown error");
        }
      };

      const testBodyHistory = async () => {
        try {
          setMessage("Loading body history...");
      
          const historyService = await import("../services/historyService");
      
          const history = await historyService.getBodyHistory(30);
      
          console.log("BODY HISTORY FULL",JSON.stringify(history, null, 2));
          setMessage(JSON.stringify(history, null, 2));
          console.log("BODY HISTORY",JSON.stringify(history, null, 2));
        } catch (error) {
          console.log("BODY HISTORY TEST ERROR:", error);
          setMessage(error?.message || "Unknown error");
        }
      };

      const testBodyAwarenessScore = async () => {
        try {
          setMessage("Calculating body awareness...");
      
          const historyService = await import(
            "../services/historyService"
          );
      
          const calculator = await import(
            "../utils/bodyAwarenessCalculator"
          );
      
          const history =
            await historyService.getBodyHistory(30);
      
          const score =
            calculator.calculateBodyAwarenessScore(
              history
            );
      
          setMessage(
            `Body Awareness Score : ${score}`
          );
      
        } catch (error) {
          console.log(error);
      
          setMessage(
            error?.message || "Unknown error"
          );
        }
      };

      return (
        <ScrollView
          contentContainerStyle={styles.container}
        >
          <Text style={styles.title}>
            Backend Test
          </Text>
      
          <TouchableOpacity
            style={styles.button}
            onPress={testLogin}
          >
            <Text style={styles.buttonText}>
              Test login
            </Text>
          </TouchableOpacity>
      
          <TouchableOpacity
            style={styles.button}
            onPress={testCreateCheckin}
          >
            <Text style={styles.buttonText}>
              Create today check-in
            </Text>
          </TouchableOpacity>
      
          <TouchableOpacity
            style={styles.button}
            onPress={testCompleteCheckin}
          >
            <Text style={styles.buttonText}>
              Complete today check-in
            </Text>
          </TouchableOpacity>
      
          <TouchableOpacity
            style={styles.button}
            onPress={testSaveAnswers}
          >
            <Text style={styles.buttonText}>
              Save test answers
            </Text>
          </TouchableOpacity>
      
          <TouchableOpacity
            style={styles.button}
            onPress={testReadinessScore}
          >
            <Text style={styles.buttonText}>
              Calculate readiness score
            </Text>
          </TouchableOpacity>
      
          <TouchableOpacity
            style={styles.button}
            onPress={testMockSensors}
          >
            <Text style={styles.buttonText}>
              Generate Mock Sensors
            </Text>
          </TouchableOpacity>
      
          <TouchableOpacity
            style={styles.button}
            onPress={testPerceptionGapScore}
          >
            <Text style={styles.buttonText}>
              Calculate perception gap
            </Text>
          </TouchableOpacity>
      
          <TouchableOpacity
            style={styles.button}
            onPress={testDailySnapshot}
          >
            <Text style={styles.buttonText}>
              Build daily snapshot
            </Text>
          </TouchableOpacity>
      
          <TouchableOpacity
            style={styles.button}
            onPress={testBodyHistory}
          >
            <Text style={styles.buttonText}>
              Load body history
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={testBodyAwarenessScore}
          >
          <Text style={styles.buttonText}>
            Calculate Body Awareness
          </Text>
          </TouchableOpacity>
      
          <Text style={styles.message}>
            {message}
          </Text>
        </ScrollView>
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
  container: {
        padding: 40,
        backgroundColor: "#F7F3EA",
      },
      
      message: {
        marginTop: 24,
        fontSize: 12,
        fontFamily: "monospace",
      },
});