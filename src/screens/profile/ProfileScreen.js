import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRouter } from "expo-router";
import { clearSession, getSession } from "../../utils/storage";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      setLoading(true);

      getSession().then(({ user: currentUser }) => {
        if (!active) return;
        if (!currentUser) {
          setUser(null);
          router.replace("/login");
        } else {
          setUser(currentUser);
        }
        setLoading(false);
      });

      return () => {
        active = false;
      };
    }, [router]),
  );

  const handleLogout = async () => {
    await clearSession();
    router.replace("/login");
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  if (!user) return null;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View style={styles.header}>
        {user.foto ? (
          <Image source={{ uri: user.foto }} style={styles.avatar} />
        ) : (
          <Ionicons name="person-circle" size={88} color="#0F766E" />
        )}
        <Text style={styles.name}>{user.nombre || "Usuario"}</Text>
        <Text style={styles.subtitle}>
          Viajero explorador · {user.ciudad || "La Paz, Bolivia"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Información de cuenta</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Correo</Text>
          <Text style={styles.value}>{user.email || "-"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Teléfono</Text>
          <Text style={styles.value}>{user.telefono || "-"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Ciudad</Text>
          <Text style={styles.value}>{user.ciudad || "La Paz, Bolivia"}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Miembro desde</Text>
          <Text style={styles.value}>{user.fechaRegistro || "-"}</Text>
        </View>
      </View>

      <Pressable
        style={styles.editButton}
        onPress={() => router.push("/edit-profile")}
      >
        <Ionicons name="create-outline" size={20} color="#0F766E" />
        <Text style={styles.editButtonText}>Editar perfil</Text>
      </Pressable>

      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Cerrar sesión</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF8F5" },
  content: { padding: 20, paddingBottom: 36 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  header: { alignItems: "center", marginVertical: 20 },
  avatar: { width: 88, height: 88, borderRadius: 44, marginBottom: 12 },
  name: { fontSize: 22, fontWeight: "800", color: "#242421" },
  subtitle: { fontSize: 14, color: "#706560", marginTop: 4 },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EAE6E1",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#242421",
    marginBottom: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EAE6E1",
  },
  label: { fontSize: 14, color: "#706560" },
  value: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#242421",
    textAlign: "right",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 15,
    borderWidth: 1,
    borderColor: "#0F766E",
    borderRadius: 50,
    marginBottom: 12,
  },
  editButtonText: { color: "#0F766E", fontSize: 15, fontWeight: "700" },
  logoutButton: {
    padding: 15,
    borderRadius: 50,
    alignItems: "center",
    backgroundColor: "#800F0F",
  },
  logoutText: { color: "#FFFFFF", fontSize: 15, fontWeight: "700" },
});
