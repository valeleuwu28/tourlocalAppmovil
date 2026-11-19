
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { API_URL } from "../config";
import { getSession } from "../utils/storage";

export default function RateExperiencePage() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const nombre = Array.isArray(params.nombre)
    ? params.nombre[0]
    : params.nombre;

  const [rating, setRating] = useState(0);
  const [comentario, setComentario] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [esError, setEsError] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [guardada, setGuardada] = useState(false);

  const enviarCalificacion = async () => {
    if (rating === 0) {
      setMensaje("Selecciona de 1 a 5 estrellas.");
      setEsError(true);
      return;
    }

    if (!comentario.trim()) {
      setMensaje("Escribe un comentario sobre tu experiencia.");
      setEsError(true);
      return;
    }

    if (!id || !Number.isSafeInteger(Number(id))) {
      setMensaje("No se encontró el destino.");
      setEsError(true);
      return;
    }

    setEnviando(true);
    setMensaje("");
    setEsError(false);

    try {
      const sesion = await getSession();
      const userId = sesion?.user?.id;

      if (!userId) {
        throw new Error(
          "Debes iniciar sesión para enviar una calificación."
        );
      }

      const response = await fetch(
        `${API_URL}/api/calificaciones`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(userId),
          },
          body: JSON.stringify({
            destinoId: Number(id),
            estrellas: rating,
            comentario: comentario.trim(),
          }),
        }
      );

      const resultado = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          resultado?.error ||
          resultado?.message ||
          "No se pudo guardar la calificación."
        );
      }

      setGuardada(true);
      setMensaje("¡Calificación guardada correctamente!");
      setEsError(false);
    } catch (error: any) {
      setEsError(true);
      setMensaje(
        error?.message ||
        "Error de conexión con el servidor."
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <Pressable onPress={() => router.replace("/(tabs)/explore")}>
        <Text style={styles.back}>← Volver</Text>
      </Pressable>

      <Text style={styles.title}>
        Califica tu experiencia
      </Text>

      <Text style={styles.subtitle}>
        Cuéntanos qué te pareció tu visita.
      </Text>

      <View style={styles.card}>
        <Text style={styles.destination}>
          {nombre || `Experiencia ${id || ""}`}
        </Text>

        <Text style={styles.question}>
          ¿Cómo fue tu experiencia?
        </Text>

        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((valor) => (
            <Pressable
              key={valor}
              onPress={() => {
                if (guardada || enviando) return;

                setRating(valor);
                setMensaje("");
              }}
              disabled={guardada || enviando}
              accessibilityRole="button"
              accessibilityLabel={`${valor} estrellas`}
              style={styles.starButton}
            >
              <Text style={styles.star}>
                {valor <= rating ? "★" : "☆"}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.ratingText}>
          {rating === 0
            ? "Selecciona las estrellas"
            : `${rating} de 5 estrellas`}
        </Text>

        <Text style={styles.label}>Tu comentario</Text>

        <TextInput
          style={styles.input}
          placeholder="Cuéntanos qué fue lo que más te gustó..."
          placeholderTextColor="#94A3B8"
          value={comentario}
          onChangeText={(texto) => {
            setComentario(texto);
            setMensaje("");
          }}
          multiline
          maxLength={500}
          editable={!guardada && !enviando}
          textAlignVertical="top"
        />

        <Text style={styles.counter}>
          {comentario.length}/500 caracteres
        </Text>

        {mensaje ? (
          <Text
            style={[
              styles.message,
              esError && styles.errorMessage,
            ]}
          >
            {mensaje}
          </Text>
        ) : null}

        <Pressable
          style={[
            styles.button,
            (enviando || guardada) && styles.disabledButton,
          ]}
          onPress={enviarCalificacion}
          disabled={enviando || guardada}
        >
          {enviando ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {guardada
                ? "Calificación enviada"
                : "Enviar calificación"}
            </Text>
          )}
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 22,
    paddingTop: 60,
    paddingBottom: 50,
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
    marginBottom: 25,
  },
  card: {
    backgroundColor: "#FFFFFF",
    padding: 22,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  destination: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F766E",
    textAlign: "center",
  },
  question: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    textAlign: "center",
    marginTop: 26,
  },
  stars: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    marginBottom: 10,
  },
  starButton: {
    paddingHorizontal: 4,
    paddingVertical: 6,
  },
  star: {
    fontSize: 39,
    color: "#F59E0B",
  },
  ratingText: {
    color: "#64748B",
    textAlign: "center",
    marginBottom: 28,
  },
  label: {
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 10,
  },
  input: {
    height: 135,
    backgroundColor: "#F8FAFC",
    borderColor: "#CBD5E1",
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: "#0F172A",
  },
  counter: {
    textAlign: "right",
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 8,
  },
  message: {
    textAlign: "center",
    color: "#0F766E",
    marginTop: 16,
    fontSize: 13,
  },
  errorMessage: {
    color: "#DC2626",
  },
  button: {
    backgroundColor: "#0F766E",
    padding: 17,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 22,
  },
  disabledButton: {
    backgroundColor: "#94A3B8",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
  },
});
