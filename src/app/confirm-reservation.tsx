
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function ConfirmReservationRoute() {
  const router = useRouter();
  const { destinoId, fecha, horario } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>← Volver</Text>
      </Pressable>

      <Text style={styles.title}>Resumen de tu visita</Text>
      <Text style={styles.subtitle}>
        Estos son los datos que seleccionaste.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>Destino</Text>
        <Text style={styles.value}>
          {String(destinoId || "Sin destino")}
        </Text>

        <Text style={styles.label}>Fecha</Text>
        <Text style={styles.value}>
          {String(fecha || "Sin fecha")}
        </Text>

        <Text style={styles.label}>Horario</Text>
        <Text style={styles.value}>
          {String(horario || "Sin horario")}
        </Text>
      </View>

      <Text style={styles.note}>
        Vista temporal de integración.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
    paddingTop: 65,
  },
  back: {
    color: "#0F766E",
    fontSize: 16,
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#0F172A",
  },
  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#F0FDFA",
    borderRadius: 18,
    padding: 20,
  },
  label: {
    color: "#64748B",
    marginTop: 12,
    fontSize: 13,
  },
  value: {
    color: "#0F766E",
    fontWeight: "700",
    fontSize: 18,
    marginTop: 4,
  },
  note: {
    marginTop: 24,
    color: "#64748B",
    fontSize: 13,
    lineHeight: 20,
  },
});
