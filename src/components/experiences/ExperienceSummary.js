import { Image, StyleSheet, Text, View } from "react-native";
import { colors } from "../../theme/colors";

export default function ExperienceSummary({
  imagen,
  destino,
  ubicacion,
  categoria,
  calificacion,
  resenas,
}) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: imagen }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{destino}</Text>
        <Text style={styles.location}>{ubicacion}</Text>
        {categoria && <Text style={styles.category}>{categoria}</Text>}
        <Text style={styles.rating}>
          <Text style={{ color: colors.star }}>★</Text>
          <Text style={{ fontWeight: "bold", color: colors.text }}>
            {" "}
            {calificacion}
          </Text>
          <Text> ({resenas})</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  image: {
    width: 56,
    height: 56,
    borderRadius: colors.radius,
    resizeMode: "cover",
  },
  info: { flex: 1, gap: 2 },
  title: { fontSize: 16, fontWeight: "700", color: colors.text },
  location: { fontSize: 13, color: colors.muted },
  category: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.primary,
    letterSpacing: 0.4,
  },
  rating: {
    fontSize: 12,
    color: colors.muted,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});
