import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { normalizePseudo } from "../services/sessionService.js";

function toISODate(date) {
  return date.toISOString().split("T")[0];
}

function getDateOffset(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return toISODate(d);
}

export default function SessionModal({ visible, onSubmit }) {
  const [pseudo, setPseudo] = useState("");
  const [date, setDate] = useState(getDateOffset(0));

  const canSubmit = pseudo.trim().length > 0 && date.trim().length > 0;

  const quickDates = [
    { label: "Today", value: getDateOffset(0) },
    { label: "Yesterday", value: getDateOffset(1) },
    { label: "Day-2", value: getDateOffset(2) },
  ];

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Text style={styles.title}>
            Start your Endur<Text style={styles.orange}>aw</Text> session
          </Text>

          <Text style={styles.subtitle}>
            Enter the same pseudo every time to keep your history.
          </Text>

          <Text style={styles.label}>Pseudo</Text>
          <TextInput
            style={styles.input}
            placeholder="Your pseudo"
            placeholderTextColor="#64748b"
            value={pseudo}
            onChangeText={setPseudo}
            autoCapitalize="none"
          />

          <Text style={styles.label}>Check-in date</Text>

          <View style={styles.quickDateRow}>
            {quickDates.map((item) => {
              const active = date === item.value;

              return (
                <TouchableOpacity
                  key={item.label}
                  style={[
                    styles.quickDateButton,
                    active && styles.quickDateButtonActive,
                  ]}
                  onPress={() => setDate(item.value)}
                >
                  <Text
                    style={[
                      styles.quickDateText,
                      active && styles.quickDateTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>
                  <Text
                    style={[
                      styles.quickDateSub,
                      active && styles.quickDateTextActive,
                    ]}
                  >
                    {item.value}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#64748b"
            value={date}
            onChangeText={setDate}
          />

          <TouchableOpacity
            disabled={!canSubmit}
            style={[styles.button, !canSubmit && styles.buttonDisabled]}
            onPress={() =>
              onSubmit({
                pseudo: normalizePseudo(pseudo),
                checkinDate: date.trim(),
              })
            }
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#06121d",
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: "#243447",
  },

  title: {
    color: "#ffffff",
    fontSize: 23,
    fontWeight: "900",
    marginBottom: 6,
  },

  orange: {
    color: "#ff8500",
  },

  subtitle: {
    color: "#cbd5e1",
    fontSize: 13,
    marginBottom: 18,
    lineHeight: 18,
  },

  label: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
    marginBottom: 8,
    textTransform: "uppercase",
  },

  input: {
    backgroundColor: "#02070d",
    borderWidth: 1,
    borderColor: "#243447",
    color: "#ffffff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    fontSize: 15,
  },

  quickDateRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },

  quickDateButton: {
    flex: 1,
    backgroundColor: "#02070d",
    borderWidth: 1,
    borderColor: "#243447",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: "center",
  },

  quickDateButtonActive: {
    backgroundColor: "#ff8500",
    borderColor: "#ff8500",
  },

  quickDateText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },

  quickDateSub: {
    color: "#94a3b8",
    fontSize: 10,
    marginTop: 4,
    fontWeight: "700",
  },

  quickDateTextActive: {
    color: "#031018",
  },

  button: {
    backgroundColor: "#ff8500",
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },

  buttonDisabled: {
    opacity: 0.4,
  },

  buttonText: {
    color: "#031018",
    fontWeight: "900",
    fontSize: 15,
  },
});