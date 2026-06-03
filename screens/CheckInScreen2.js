import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";

import SignalCard from "../components/SignalCard";
import HormonalCard from "../components/HormonalCard";

export default function CheckInScreen2({ navigation }) {
  const { width } = useWindowDimensions();

  const isWideScreen = width >= 950;
  const cardWidth = isWideScreen ? "19%" : "48%";

  const [answers, setAnswers] = useState({
    wakeUpQuality: null,
    recoveryCompleteness: null,
    socialConnection: null,
    spontaneousMovement: null,
    bodyFreedom: null,
    nervousSystemState: null,
    motorFluency: null,
    yesterdayFulfilment: null,
    sessionAnticipation: null,
    competitiveDrive: null,
    hormonalBalance: null,
  });

  const updateAnswer = (key, value) => {
    setAnswers((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const signals = [
    {
      number: 1,
      key: "wakeUpQuality",
      title: "Wake-Up Feeling",
      question: "What was your wake-up sensation?",
      leftLabel: "Comatose",
      rightLabel: "Up before alarm",
      icon: "sunrise",
    },
    {
      number: 2,
      key: "recoveryCompleteness",
      title: "Recovery Completeness",
      question: "Do you feel enough rested?",
      leftLabel: "Incomplete",
      rightLabel: "Complete",
      icon: "battery-charging",
    },
    {
      number: 3,
      key: "socialConnection",
      title: "Social Connection",
      question: "How connected with your loved ones?",
      leftLabel: "Disconnected",
      rightLabel: "Aligned",
      icon: "users",
    },
    {
      number: 4,
      key: "spontaneousMovement",
      title: "Movement Mood",
      question: "How motivate to go out (not for sport)?",
      leftLabel: "Sedentary",
      rightLabel: "Outside all day",
      icon: "activity",
    },
    {
      number: 5,
      key: "bodyFreedom",
      title: "Body Attitude",
      question: "How are you holding right now?",
      leftLabel: "Stiff",
      rightLabel: "Fluid",
      icon: "user",
    },
    {
      number: 6,
      key: "nervousSystemState",
      title: "Nervous System State",
      question: "How tense are you ?",
      leftLabel: "Tense",
      rightLabel: "Calm",
      icon: "zap",
    },
    {
      number: 7,
      key: "motorFluency",
      title: "Action Capacity",
      question: "How easy is it to undertake ?",
      leftLabel: "Friction",
      rightLabel: "Fluid",
      icon: "crosshair",
    },
    {
      number: 8,
      key: "yesterdayFulfilment",
      title: "Yesterday’s Fulfilment",
      question: "How satisfied are you with yesterday?",
      leftLabel: "Frustrated",
      rightLabel: "Enthusiastic",
      icon: "check-circle",
    },
    {
      number: 9,
      key: "sessionAnticipation",
      title: "Session Anticipation",
      question: "How do you feel about today’s session?",
      leftLabel: "Apprehension",
      rightLabel: "Excitement",
      icon: "trending-up",
    },
    {
      number: 10,
      key: "competitiveDrive",
      title: "Competitive Drive",
      question: "How much you want to achieve next aim ?",
      leftLabel: "Lassitude",
      rightLabel: "Hungry",
      icon: "zap",
    },
  ];

  const handleContinue = () => {
    console.log("Check-in screen 2 answers:", {
      ...answers,
      createdAt: new Date().toISOString(),
    });

    navigation.navigate("CheckInScreen3", {
      checkInSignals: answers,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topHeader}>
          <Text style={styles.kicker}>Morning Check-In</Text>
          <Text style={styles.title}>Daily Signals</Text>
          <Text style={styles.subtitle}>
            Rate each signal from 1 to 5. Your answers help adapt your training.
          </Text>
        </View>

        <View
          style={[
            styles.mainLayout,
            !isWideScreen && styles.mainLayoutMobile,
          ]}
        >
          <View style={styles.signalsGrid}>
            {signals.map((signal) => (
              <SignalCard
                key={signal.key}
                number={signal.number}
                title={signal.title}
                question={signal.question}
                icon={signal.icon}
                leftLabel={signal.leftLabel}
                rightLabel={signal.rightLabel}
                value={answers[signal.key]}
                cardWidth={cardWidth}
                onChange={(value) => updateAnswer(signal.key, value)}
              />
            ))}
          </View>

          <View
            style={[
              styles.hormonalColumn,
              !isWideScreen && styles.hormonalColumnMobile,
            ]}
          >
            <HormonalCard
              value={answers.hormonalBalance}
              onChange={(value) => updateAnswer("hormonalBalance", value)}
            />
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>i</Text>
          <Text style={styles.infoText}>
            Your daily signals help us adapt your training and optimize your performance.
          </Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.continueButton}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#031018",
  },

  container: {
    flex: 1,
    backgroundColor: "#031018",
  },

  content: {
    padding: 16,
    paddingBottom: 42,
  },

  topHeader: {
    marginBottom: 18,
  },

  kicker: {
    color: "#FF8500",
    fontSize: 13,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  title: {
    color: "#F5F5F5",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 4,
  },

  subtitle: {
    color: "#9FAAB4",
    fontSize: 13,
    lineHeight: 19,
    marginTop: 6,
  },

  mainLayout: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },

  mainLayoutMobile: {
    flexDirection: "column",
  },

  signalsGrid: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  hormonalColumn: {
    width: 175,
  },

  hormonalColumnMobile: {
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    marginBottom: 12,
  },

  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.4)",
    color: "#9FAAB4",
    textAlign: "center",
    lineHeight: 26,
    marginRight: 10,
    fontSize: 16,
    fontWeight: "800",
  },

  infoText: {
    color: "#9FAAB4",
    fontSize: 13,
    textAlign: "center",
    maxWidth: 620,
  },

  continueButton: {
    height: 54,
    borderRadius: 18,
    backgroundColor: "#FF8500",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },

  continueButtonText: {
    color: "#031018",
    fontSize: 16,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});