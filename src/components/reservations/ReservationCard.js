import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";
import { isTourPast } from "../../utils/dateUtils";

const STATUS_STYLES = {
  confirmada: { bg: "#CCFBF1", text: "#0F766E", label: "Confirmada" },
  pendiente: { bg: "#FEF3C7", text: "#B45309", label: "Pendiente" },
  cancelada: { bg: "#FEE2E2", text: "#B91C1C", label: "Cancelada" },
  finalizada: { bg: "#E2E8F0", text: "#475569", label: "Finalizada" },
};

export default function ReservationCard({
  reserva,
  onCancel,
  canceling = false,
}) {
  if (!reserva) return null;

  const estadoKey = (reserva.estado || "confirmada").toLowerCase();
  const tourPasado = isTourPast(reserva.fecha, reserva.horario);

  // Si la fecha ya pasó y no estaba cancelada, visualmente es finalizada
  const status =
    estadoKey === "cancelada"
      ? STATUS_STYLES.cancelada
      : tourPasado
        ? STATUS_STYLES.finalizada
        : STATUS_STYLES[estadoKey] || STATUS_STYLES.confirmada;

  // Solo se puede cancelar si está confirmada/pendiente Y la fecha NO ha pasado
  const canCancel =
    (estadoKey === "confirmada" || estadoKey === "pendiente") && !tourPasado;

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.code}>
          {reserva.codigo || `TL-${reserva.id}`}
        </Text>
        <View style={[styles.badge, { backgroundColor: status.bg }]}>
          <Text style={[styles.badgeText, { color: status.text }]}>
            {status.label}
          </Text>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {reserva.experiencia || reserva.destino || "Experiencia TourLocal"}
      </Text>

      <View style={styles.metaRow}>
        <Ionicons name="calendar-outline" size={15} color={colors.primary} />
        <Text style={styles.metaText}>{reserva.fecha || "Por definir"}</Text>
      </View>

      <View style={styles.metaRow}>
        <Ionicons name="time-outline" size={15} color={colors.primary} />
        <Text style={styles.metaText}>{reserva.horario || "Por definir"}</Text>
      </View>

      {reserva.participantes != null && (
        <View style={styles.metaRow}>
          <Ionicons name="people-outline" size={15} color={colors.primary} />
          <Text style={styles.metaText}>
            {reserva.participantes}{" "}
            {Number(reserva.participantes) === 1 ? "persona" : "personas"}
          </Text>
        </View>
      )}

      <View style={styles.footer}>
        <View>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>
            Bs {reserva.total != null ? reserva.total : 0}
          </Text>
        </View>

        {canCancel && onCancel ? (
          <Pressable
            style={[styles.cancelBtn, canceling && styles.cancelBtnDisabled]}
            onPress={() => onCancel(reserva)}
            disabled={canceling}
          >
            <Ionicons name="close-circle-outline" size={16} color="#B91C1C" />
            <Text style={styles.cancelBtnText}>
              {canceling ? "Cancelando..." : "Cancelar reserva"}
            </Text>
          </Pressable>
        ) : tourPasado && estadoKey !== "cancelada" ? (
          <View style={styles.concludedBadge}>
            <Ionicons name="checkmark-done" size={14} color="#64748B" style={{ marginRight: 4 }} />
            <Text style={styles.concludedText}>Tour concluido</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  code: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.muted,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 6,
  },
  metaText: {
    fontSize: 13,
    color: colors.muted,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    fontSize: 11,
    color: colors.muted,
  },
  totalValue: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.primary,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    gap: 4,
  },
  cancelBtnDisabled: {
    opacity: 0.6,
  },
  cancelBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#B91C1C",
  },
  concludedBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
  },
  concludedText: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },
});
