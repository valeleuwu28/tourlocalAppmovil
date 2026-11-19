import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export default function ExperienceCard({
  imagen,
  nombre,
  guia,
  ubicacion,
  calificacion,
  resenas,
  fecha,
  estado,
  onVerDetalles,
  onCalificar,
  onQuitarGuardado,
  guardadoLoading = false,
}) {
  return (
    <View style={styles.card}>
      {imagen && <Image source={{ uri: imagen }} style={styles.image} />}

      <View style={styles.info}>
        <Text style={styles.name}>{nombre}</Text>

        {guia && <Text style={styles.subText}>Guía: {guia}</Text>}
        {ubicacion && <Text style={styles.subText}>📍 {ubicacion}</Text>}

        {calificacion != null && (
          <Text style={styles.subText}>
            <Text style={{ color: colors.star }}>★</Text> {calificacion}
            {resenas != null && ` (${resenas} reseñas)`}
          </Text>
        )}

        {fecha && <Text style={styles.subText}>Realizada el {fecha}</Text>}

        {estado && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{estado}</Text>
          </View>
        )}

        <View style={styles.actions}>
          {onVerDetalles && (
            <Pressable style={styles.button} onPress={onVerDetalles}>
              <Text style={styles.buttonText}>Detalles</Text>
            </Pressable>
          )}
          {onCalificar && (
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={onCalificar}
            >
              <Text style={styles.buttonSecondaryText}>Calificar</Text>
            </Pressable>
          )}
          {onQuitarGuardado && (
            <Pressable
              style={[styles.button, styles.buttonSecondary]}
              onPress={onQuitarGuardado}
              disabled={guardadoLoading}
            >
              <Text style={styles.buttonSecondaryText}>
                {guardadoLoading ? "Quitando..." : "Quitar"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    padding: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: colors.radius,
    width: "100%",
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: colors.radius,
    resizeMode: "cover",
  },
  info: { flex: 1, justifyContent: "space-between" },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 4,
  },
  subText: { fontSize: 11, color: colors.muted, marginVertical: 1 },
  badge: {
    backgroundColor: colors.infoBg,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  badgeText: { fontSize: 10, color: colors.primary, fontWeight: "600" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  button: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 18,
  },
  buttonText: { color: colors.surface, fontSize: 11, fontWeight: "600" },
  buttonSecondary: { backgroundColor: "#fff7db" },
  buttonSecondaryText: { color: "#806000", fontSize: 11, fontWeight: "600" },
});
