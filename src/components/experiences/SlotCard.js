
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SlotCard({ horario, selected, onPress }) {
  const sinCupos =
    horario.status === "Sin cupos" || horario.remaining === 0;

  return (
    <Pressable
      onPress={onPress}
      disabled={sinCupos}
      style={[
        styles.card,
        selected && styles.selected,
        sinCupos && styles.disabled,
      ]}
    >
      <Text style={[styles.time, sinCupos && styles.muted]}>
        {horario.time}
      </Text>

      <Text style={[styles.period, sinCupos && styles.muted]}>
        {horario.period}
      </Text>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.dot,
            { backgroundColor: sinCupos ? "#94A3B8" : "#0D9488" },
          ]}
        />

        <Text style={[styles.status, sinCupos && styles.muted]}>
          {horario.status}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
  },
  selected: {
    borderColor: "#0F766E",
    borderWidth: 2,
    backgroundColor: "#F0FDFA",
  },
  disabled: {
    backgroundColor: "#F1F5F9",
    opacity: 0.65,
  },
  time: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  period: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 11,
    fontWeight: "600",
    color: "#0F766E",
  },
  muted: {
    color: "#94A3B8",
  },
});
