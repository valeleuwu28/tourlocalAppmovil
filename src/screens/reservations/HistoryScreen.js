import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import ReservationCard from "../../components/reservations/ReservationCard";
import { API_URL } from "../../config";
import { colors } from "../../theme/colors";
import { getSession } from "../../utils/storage";
import { isTourPast } from "../../utils/dateUtils";

export default function HistoryScreen() {
  const router = useRouter();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelingId, setCancelingId] = useState(null);
  const [error, setError] = useState("");

  const fetchReservas = useCallback(async () => {
    try {
      setError("");
      const { user, token } = await getSession();
      const userId = user?.id || "1";

      const response = await fetch(`${API_URL}/api/reservas`, {
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": String(userId),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(
          (data && (data.error || data.message)) ||
            "No se pudo cargar el historial de reservas."
        );
      }

      setReservas(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Error de conexión con el servidor.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchReservas();
    }, [fetchReservas])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    fetchReservas();
  };

  const handleCancelReservation = (reserva) => {
    if (isTourPast(reserva.fecha, reserva.horario)) {
      Alert.alert(
        "No se puede cancelar",
        "Este tour ya comenzó o su fecha ya pasó, por lo que no es posible cancelarlo."
      );
      return;
    }

    Alert.alert(
      "Cancelar reserva",
      `¿Seguro que deseas cancelar "${reserva.experiencia}"?`,
      [
        { text: "No", style: "cancel" },
        {
          text: "Sí, cancelar",
          style: "destructive",
          onPress: async () => {
            setCancelingId(reserva.id);
            try {
              const { user, token } = await getSession();
              const userId = user?.id || "1";

              const response = await fetch(
                `${API_URL}/api/reservas/${reserva.id}`,
                {
                  method: "DELETE",
                  headers: {
                    "X-User-Id": String(userId),
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                  },
                }
              );

              if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error(
                  errData.error || "No se pudo cancelar la reserva."
                );
              }

              Alert.alert("Reserva cancelada", "Tu historial fue actualizado.");
              await fetchReservas();
            } catch (err) {
              Alert.alert("Error", err.message || "Error al cancelar.");
            } finally {
              setCancelingId(null);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mis Reservas</Text>
        <Text style={styles.headerSubtitle}>
          Historial de experiencias agendadas en TourLocal
        </Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.infoText}>Cargando tus reservas...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Ionicons name="cloud-offline-outline" size={52} color="#EF4444" />
          <Text style={styles.errorTitle}>No se pudo cargar el historial</Text>
          <Text style={styles.infoText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchReservas}>
            <Text style={styles.retryBtnText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={reservas}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[colors.primary]}
            />
          }
          renderItem={({ item }) => (
            <ReservationCard
              reserva={item}
              onCancel={handleCancelReservation}
              canceling={cancelingId === item.id}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="calendar-outline" size={52} color={colors.primary} />
              <Text style={styles.emptyTitle}>Aún no tienes reservas</Text>
              <Text style={styles.emptySubtitle}>
                Explora los destinos disponibles y agenda tu próxima experiencia.
              </Text>
              <TouchableOpacity
                style={styles.retryBtn}
                onPress={() => router.navigate("/(tabs)/explore")}
              >
                <Text style={styles.retryBtnText}>Explorar destinos</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 22, fontWeight: "800", color: colors.text },
  headerSubtitle: { fontSize: 13, color: colors.muted, marginTop: 2 },
  listContent: { padding: 20, paddingBottom: 40 },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginTop: 12,
  },
  infoText: {
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginTop: 8,
  },
  retryBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 16,
  },
});