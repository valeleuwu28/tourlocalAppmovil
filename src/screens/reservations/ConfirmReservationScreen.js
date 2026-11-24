import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import Button from "../../components/common/Button";
import DetailRow from "../../components/common/DetailRow";
import HeaderBar from "../../components/common/HeaderBar";
import { API_URL } from "../../config";
import useApi from "../../hooks/useApi";
import { colors } from "../../theme/colors";
import { getSession } from "../../utils/storage";

export default function ConfirmReservationScreen({ navigation, route }) {
  const router = useRouter();
  const params = useLocalSearchParams();
  const routeParams = route?.params || {};

  const destinoId = Array.isArray(params.destinoId)
    ? params.destinoId[0]
    : params.destinoId || routeParams.destinoId;
  const fecha = Array.isArray(params.fecha)
    ? params.fecha[0]
    : params.fecha || routeParams.fecha;
  const horario = Array.isArray(params.horario)
    ? params.horario[0]
    : params.horario || routeParams.horario;

  // Traer nombre y precio real del destino desde la API
  const { data: destino, loading: loadingDestino } = useApi(
    destinoId ? `/api/destinos/${destinoId}` : null
  );

  const experiencia =
    destino?.title || destino?.name || `Destino #${destinoId || ""}`;
  const precioUnitario =
    Number(String(destino?.price || "50").replace(/[^\d.]/g, "")) || 50;

  const [participantes, setParticipantes] = useState(1);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const total = precioUnitario * participantes;

  useEffect(() => {
    getSession().then((session) => {
      setUser(session.user);
      setToken(session.token);
    });
  }, []);

  const handleConfirm = async () => {
    if (submitting) return;

    if (!destinoId || !fecha || !horario) {
      setError("Faltan datos obligatorios (destino, fecha u horario).");
      return;
    }

    setError("");
    setSubmitting(true);

    try {
      const userId = user?.id || "1";
      const response = await fetch(`${API_URL}/api/reservas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": String(userId),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          destinoId: Number(destinoId),
          experiencia,
          fecha,
          horario,
          participantes,
          total,
        }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.error || data.message || "No se pudo completar la reserva."
        );
      }

      const reservaCreada = data.reserva || data.data || data;

      if (navigation && typeof navigation.replace === "function") {
        navigation.replace("Success", {
          codigo: reservaCreada.codigo || `TL-${reservaCreada.id || "0001"}`,
          experiencia: reservaCreada.experiencia || experiencia,
          fecha: reservaCreada.fecha || fecha,
          horario: reservaCreada.horario || horario,
          participantes: String(reservaCreada.participantes || participantes),
          total: String(reservaCreada.total ?? total),
        });
      } else {
        router.replace({
          pathname: "/success",
          params: {
            codigo: reservaCreada.codigo || `TL-${reservaCreada.id || "0001"}`,
            experiencia: reservaCreada.experiencia || experiencia,
            fecha: reservaCreada.fecha || fecha,
            horario: reservaCreada.horario || horario,
            participantes: String(reservaCreada.participantes || participantes),
            total: String(reservaCreada.total ?? total),
          },
        });
      }
    } catch (err) {
      const msg = err.message || "Error de conexión con el servidor.";
      setError(msg);
      Alert.alert("Error al reservar", msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <HeaderBar
        title="Confirmar reserva"
        showBackButton
        onBackPress={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Resumen de la experiencia</Text>
          {loadingDestino ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: 10 }} />
          ) : (
            <DetailRow label="Destino" value={experiencia} />
          )}
          <DetailRow label="Fecha" value={fecha || "No seleccionada"} />
          <DetailRow label="Horario" value={horario || "No seleccionado"} />

          <View style={styles.counterRow}>
            <Text style={styles.counterLabel}>Participantes</Text>
            <View style={styles.counterControls}>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setParticipantes((p) => Math.max(1, p - 1))}
              >
                <Ionicons name="remove" size={18} color={colors.primary} />
              </Pressable>
              <Text style={styles.counterValue}>{participantes}</Text>
              <Pressable
                style={styles.counterBtn}
                onPress={() => setParticipantes((p) => Math.min(10, p + 1))}
              >
                <Ionicons name="add" size={18} color={colors.primary} />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Datos del viajero</Text>
          <DetailRow label="Nombre" value={user?.nombre || "Viajero"} />
          <DetailRow label="Correo" value={user?.email || "-"} />
        </View>

        <View style={styles.totalCard}>
          <Text style={styles.totalLabel}>Total a pagar</Text>
          <Text style={styles.totalValue}>Bs {total}</Text>
        </View>

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <Button onPress={handleConfirm} disabled={submitting || loadingDestino}>
          {submitting ? "Confirmando..." : "Confirmar reserva"}
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 8,
  },
  counterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
  },
  counterLabel: { fontSize: 14, color: colors.muted },
  counterControls: { flexDirection: "row", alignItems: "center", gap: 14 },
  counterBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.infoBg,
    alignItems: "center",
    justifyContent: "center",
  },
  counterValue: { fontSize: 16, fontWeight: "700", color: colors.text },
  totalCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.infoBg,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  totalLabel: { fontSize: 15, fontWeight: "700", color: colors.text },
  totalValue: { fontSize: 20, fontWeight: "800", color: colors.primary },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 14,
  },
});