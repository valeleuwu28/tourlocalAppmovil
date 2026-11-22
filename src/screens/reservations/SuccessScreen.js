import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import Button from "../../components/common/Button";
import DetailRow from "../../components/common/DetailRow";
import { colors } from "../../theme/colors";

export default function SuccessScreen({ route }) {
  const router = useRouter();
  const routerParams = useLocalSearchParams();
  const params = route?.params || routerParams || {};

  const codigo = params.codigo || "TL-0001";
  const experiencia = params.experiencia || "Experiencia TourLocal";
  const fecha = params.fecha || "-";
  const horario = params.horario || "-";
  const participantes = params.participantes || "1";
  const total = params.total || "0";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconCircle}>
          <Ionicons name="checkmark-circle" size={76} color={colors.primary} />
        </View>

        <Text style={styles.title}>¡Reserva realizada!</Text>
        <Text style={styles.subtitle}>
          Tu lugar está asegurado. Presenta este código al iniciar tu recorrido.
        </Text>

        <View style={styles.codeBox}>
          <Text style={styles.codeLabel}>CÓDIGO DE RESERVA</Text>
          <Text style={styles.codeValue}>{codigo}</Text>
        </View>

        <View style={styles.card}>
          <DetailRow label="Experiencia" value={experiencia} />
          <DetailRow label="Fecha" value={fecha} />
          <DetailRow label="Horario" value={horario} />
          <DetailRow label="Participantes" value={`${participantes} persona(s)`} />
          <DetailRow label="Total" value={`Bs ${total}`} />
        </View>

        <Button onPress={() => router.replace("/(tabs)/history")}>
          Ver mis reservas
        </Button>

        <Button
          variant="secondary"
          onPress={() => router.replace("/(tabs)/explore")}
          style={{ marginTop: 12 }}
        >
          Volver a explorar
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: 24,
    alignItems: "center",
    justifyContent: "center",
    flexGrow: 1,
  },
  iconCircle: {
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    textAlign: "center",
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 20,
  },
  codeBox: {
    width: "100%",
    backgroundColor: colors.infoBg,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#99F6E4",
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 1,
  },
  codeValue: {
    fontSize: 24,
    fontWeight: "800",
    color: colors.primary,
    marginTop: 4,
  },
  card: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
});