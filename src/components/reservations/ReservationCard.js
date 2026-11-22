import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

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
  const status = STATUS_STYLES[estadoKey] || STATUS_STYLES.confirmada;
  const canCancel = estadoKey === "confirmada" || estadoKey === "pendiente";

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

        {canCancel && onCancel && (
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
        )}
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
    fontWeight: "700",
    color: colors.muted,
    letterSpacing: 0.5,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "700",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 5,
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
    fontWeight: "800",
    color: colors.primary,
  },
  cancelBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cancelBtnDisabled: {
    opacity: 0.6,
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B91C1C",
  },
});