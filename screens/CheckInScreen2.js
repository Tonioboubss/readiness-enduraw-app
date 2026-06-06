import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  SafeAreaView,
} from "react-native";

import SignalCard from "../components/SignalCard";
import { submitDailyCheckin } from "../services/dailyworkflowService";
import ProgressSteps from "../components/ProgressSteps";
import { getTodayAnswers } from "../services/answerService";

export default function CheckInScreen2({ navigation, route }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const checkin1Answers = route?.params?.checkin1Answers || [];
  const readOnly = route?.params?.readOnly === true;
  const checkin1Values = route?.params?.checkin1Values || null;
  const checkin2Values = route?.params?.checkin2Values || null;

  const cardWidth = "23.5%";

  const [answers, setAnswers] = useState(
    checkin2Values || {
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
      title: "Wake-Up\nFeeling",
      question: "What was your wake-up sensation?",
      leftLabel: "Comatose",
      rightLabel: "Up before alarm",
      icon: "sunrise",
    },
    {
      number: 2,
      key: "recoveryCompleteness",
      title: "Recovery\nCompleteness",
      question: "Do you feel enough rested?",
      leftLabel: "Incomplete",
      rightLabel: "Complete",
      icon: "battery-charging",
    },
    {
      number: 3,
      key: "socialConnection",
      title: "Social\nConnection",
      question: "How connected with your loved ones?",
      leftLabel: "Disconnected",
      rightLabel: "Aligned",
      icon: "users",
    },
    {
      number: 4,
      key: "spontaneousMovement",
      title: "Movement\nMood",
      question: "How motivate to go out (not for sport)?",
      leftLabel: "Sedentary",
      rightLabel: "Outside all day",
      icon: "activity",
    },
    {
      number: 5,
      key: "bodyFreedom",
      title: "Body\nAttitude",
      question: "How are you holding right now?",
      leftLabel: "Stiff",
      rightLabel: "Fluid",
      icon: "user",
    },
    {
      number: 6,
      key: "nervousSystemState",
      title: "Nervous\nSystem State",
      question: "How tense are you ?",
      leftLabel: "Tense",
      rightLabel: "Calm",
      icon: "zap",
    },
    {
      number: 7,
      key: "motorFluency",
      title: "Action\nCapacity",
      question: "How easy is it to undertake ?",
      leftLabel: "Friction",
      rightLabel: "Fluid",
      icon: "crosshair",
    },
    {
      number: 8,
      key: "yesterdayFulfilment",
      title: "Yesterday’s\nFulfilment",
      question: "How satisfied are you with yesterday?",
      leftLabel: "Frustrated",
      rightLabel: "Enthusiastic",
      icon: "check-circle",
    },
    {
      number: 9,
      key: "sessionAnticipation",
      title: "Session\nAnticipation",
      question: "How do you feel about today’s session?",
      leftLabel: "Apprehension",
      rightLabel: "Excitement",
      icon: "trending-up",
    },
    {
      number: 10,
      key: "competitiveDrive",
      title: "Competitive\nDrive",
      question: "How much you want to achieve next aim ?",
      leftLabel: "Lassitude",
      rightLabel: "Hungry",
      icon: "zap",
    },
    {
      number: 11,
      key: "futureSignal",
      title: "",
      question: "",
      leftLabel: "",
      rightLabel: "",
      icon: "",
      variant: "empty",
    },
    {
      number: 12,
      key: "hormonalBalance",
      title: "Hormonal\nFeeling",
      question: "How stable do your hormonal sensations feel?",
      leftLabel: "Unstable",
      rightLabel: "Balanced",
      icon: "circle",
      variant: "hormonal",
    },
  ];

  const handleContinue = async () => {
    if (readOnly) {
      navigation.navigate("DailyPrint");
      return;
    }
    try {
      setIsSubmitting(true);
  
      const checkin2Answers = [
        {
          signal_key: "wake_quality",
          signal_label: "Wake Quality",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.wakeUpQuality,
        },
        {
          signal_key: "recovery_sensation",
          signal_label: "Recovery Sensation",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.recoveryCompleteness,
        },
        {
          signal_key: "connection_close_ones",
          signal_label: "Connection Close Ones",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.socialConnection,
        },
        {
          signal_key: "willingness_to_go_out",
          signal_label: "Willingness To Go Out",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.spontaneousMovement,
        },
        {
          signal_key: "natural_posture",
          signal_label: "Natural Posture",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.bodyFreedom,
        },
        {
          signal_key: "stress",
          signal_label: "Stress",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.nervousSystemState,
        },
        {
          signal_key: "coordination",
          signal_label: "Coordination",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.motorFluency,
        },
        {
          signal_key: "satisfaction_yesterday",
          signal_label: "Satisfaction Yesterday",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.yesterdayFulfilment,
        },
        {
          signal_key: "projection_session",
          signal_label: "Projection Session",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.sessionAnticipation,
        },
        {
          signal_key: "ambition",
          signal_label: "Ambition",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.competitiveDrive,
        },
        {
          signal_key: "hormonal",
          signal_label: "Hormonal Feeling",
          screen: "checkin2",
          category: "body_signal",
          value_number: answers.hormonalBalance,
        },
      ];
  
      const allAnswers = [...checkin1Answers, ...checkin2Answers];
  
      const result = await submitDailyCheckin(allAnswers);
      navigation.navigate("DailyPrint", {
        checkinId: result.checkin.id,
        snapshot: result.snapshot.snapshot_json,
      });

    } catch (error) {
      console.log("SUBMIT DAILY CHECKIN ERROR:", error);
      alert(error?.message || "Unable to submit daily check-in.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Gestion mode readonly
  useEffect(() => {
    if (readOnly) {
      loadReadonlyAnswers();
    }
  }, [readOnly]);

  // Restauration valeurs temporaires page 2
  useEffect(() => {
    if (route?.params?.checkin2Values) {
      setAnswers(route.params.checkin2Values);
    }
  }, [route?.params?.checkin2Values]);
  
  const loadReadonlyAnswers = async () => {
    try {
      const savedAnswers = await getTodayAnswers();
  
      const map = {
        wake_quality: "wakeUpQuality",
        recovery_sensation: "recoveryCompleteness",
        connection_close_ones: "socialConnection",
        willingness_to_go_out: "spontaneousMovement",
        natural_posture: "bodyFreedom",
        stress: "nervousSystemState",
        coordination: "motorFluency",
        satisfaction_yesterday: "yesterdayFulfilment",
        projection_session: "sessionAnticipation",
        ambition: "competitiveDrive",
        hormonal: "hormonalBalance",
      };
  
      const nextAnswers = { ...answers };
  
      savedAnswers.forEach((answer) => {
        const stateKey = map[answer.signal_key];
  
        if (stateKey) {
          nextAnswers[stateKey] = Number(answer.value_number);
        }
      });
  
      setAnswers(nextAnswers);
    } catch (error) {
      console.log("LOAD CHECKIN2 READONLY ERROR:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
      <View style={styles.topBar}>
      <Pressable
        style={styles.backContainer}
        onPress={() =>
          navigation.navigate("CheckIn1", {
            readOnly, // reste dans le même flux
            checkin1Values,
            checkin2Values: answers,
          })}
      >
        <Text style={styles.back}>←</Text>
      </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.header}>MORNING CHECK-IN</Text>
          <ProgressSteps currentStep={2} />
        </View>

        <TouchableOpacity
          activeOpacity={0.85}
          style={styles.validateTopButton}
          onPress={handleContinue}
          disabled={isSubmitting}
        >
          <Text style={styles.validateTopButtonText}>
            {readOnly
              ? "VIEW FOOTPRINT"
              : isSubmitting
              ? "GENERATING..."
              : "GENERATE FOOTPRINT"}
          </Text>
        </TouchableOpacity>
      </View>

        <View style={styles.mainLayout}>
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
                variant={signal.variant}
                disabled={readOnly}
                onChange={(value) => updateAnswer(signal.key, value)}
              />
            ))}
          </View>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoIcon}>i</Text>
          <Text style={styles.infoText}>
            Your daily signals help us adapt your training and optimize your performance.
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#05070A",
  },
  
  container: {
    flex: 1,
    backgroundColor: "#05070A",
    paddingVertical: 2,
    paddingHorizontal: 20,
  },

  content: {
    padding: 16,
    paddingBottom: 42,
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
    rowGap:1,
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

  emptyCard: {
    height: 165,
    borderRadius: 18,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(255,255,255,0.14)",
    backgroundColor: "rgba(255,255,255,0.025)",
    alignItems: "center",
    justifyContent: "center",
  },
  
  emptyCardNumber: {
    color: "rgba(255,255,255,0.18)",
    fontSize: 32,
    fontWeight: "900",
  },
  
  hormonalGridCard: {
    height: 165,
    borderRadius: 18,
    backgroundColor: "rgba(255,133,0,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,133,0,0.35)",
    overflow: "hidden",
  },

  topBar: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
    marginTop: 17,
  },
  
  back: {
    color: "#F5F5F5",
    fontSize: 34,
    fontWeight: "300",
    width: 70,
  },

  backContainer: {
    width: 70,
    paddingLeft: 10,
    justifyContent: "center",
  },
  
  headerCenter: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  
  header: {
    color: "#F5F5F5",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  
  validateTopButton: {
    width: 150,
    height: 48,
    marginRight: 10,
    borderRadius: 16,
    backgroundColor: "#FF8500",
    alignItems: "center",
    justifyContent: "center",
  },
  
  validateTopButtonText: {
    color: "#031018",
    fontSize: 13,
    fontWeight: "900",
    textTransform: "uppercase",
  },
});