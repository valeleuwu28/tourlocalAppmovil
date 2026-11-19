import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import { clearSession, getSession } from "../../utils/storage";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await getSession();
      if (data) setUser(data);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await clearSession();
    router.replace("/login");
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
          }}
          style={styles.avatar}
        />
        <Text style={styles.name}>{user.nombre}</Text>
        <Text style={styles.subtitle}>
          Viajero explorador · {user.ciudad || "La Paz"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información de cuenta</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Correo</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.value}>{user.telefono || "-"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Miembro desde</Text>
          <Text style={styles.value}>{user.fechaRegistro}</Text>
        </View>
      </View>

      <Pressable
        style={[styles.button, styles.dangerButton]}
        onPress={handleLogout}
      >
        <Text style={styles.buttonText}>Cerrar Sesión</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF8F5", padding: 20 },
  header: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 80, height: 80, borderRadius: 40, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "800", color: "#242421" },
  subtitle: { fontSize: 14, color: "#706560", marginTop: 4 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAE6E1",
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242421",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE6E1",
  },
  label: { fontSize: 14, color: "#706560" },
  value: { fontSize: 14, fontWeight: "600", color: "#242421" },
  button: {
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: "#0F766E",
  },
  dangerButton: { backgroundColor: "#800F0F" },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
