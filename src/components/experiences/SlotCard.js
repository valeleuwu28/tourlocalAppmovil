import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function SlotCard({ horario, selected, onPress }) {
  const isPassed = Boolean(horario.isPassed);
  const sinCupos =
    !isPassed && (horario.status === "Sin cupos" || horario.remaining === 0);
  const isDisabled = isPassed || sinCupos;

  const statusLabel = isPassed
    ? "Horario pasado"
    : horario.status;

  const dotColor = isPassed
    ? "#94A3B8"
    : sinCupos
      ? "#F87171"
      : "#0D9488";

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={[
        styles.card,
        selected && styles.selected,
        isDisabled && styles.disabled,
      ]}
    >
      <Text style={[styles.time, isDisabled && styles.muted]}>
        {horario.time}
      </Text>

      <Text style={[styles.period, isDisabled && styles.muted]}>
        {horario.period}
      </Text>

      <View style={styles.statusRow}>
        <View
          style={[
            styles.dot,
            { backgroundColor: dotColor },
          ]}
        />

        <Text style={[styles.status, isDisabled && styles.muted]}>
          {statusLabel}
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
    backgroundColor: "#F8FAFC",
    borderColor: "#E2E8F0",
    opacity: 0.6,
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
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  status: {
    fontSize: 12,
    color: "#0F766E",
    fontWeight: "500",
  },
  muted: {
    color: "#94A3B8",
  },
});
