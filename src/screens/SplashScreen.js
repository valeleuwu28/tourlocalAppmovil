import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import Button from "../components/common/Button";
import { colors } from "../theme/colors";

export default function SplashScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?q=80&w=1000&auto=format&fit=crop",
          }}
          style={styles.image}
        />
      </View>

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoIcon}>
            <Text style={{ color: "white", fontWeight: "bold" }}>◎</Text>
          </View>
          <Text style={styles.brand}>TourLocal</Text>
        </View>

        <Text style={styles.title}>¡Vive la experiencia ahora!</Text>
        <Text style={styles.description}>
          Encuentra recorridos únicos, compara precios de forma transparente y
          asegura tu lugar en minutos.
        </Text>

        <View style={styles.actions}>
          <Button onPress={() => router.push("/signup")}>
            REGISTRAR
          </Button>

          <Pressable
            onPress={() => router.push("/login")}
            style={{ marginTop: 24 }}
          >
            <Text style={styles.loginText}>
              ¿Ya tienes una cuenta?{" "}
              <Text style={styles.loginLink}>Iniciar sesión</Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  imageContainer: {
    height: "50%",
    width: "100%",
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    overflow: "hidden",
  },
  image: { width: "100%", height: "100%", resizeMode: "cover" },
  content: { flex: 1, alignItems: "center", padding: 24, textAlign: "center" },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    marginTop: -20,
  },
  logoIcon: {
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { fontSize: 24, fontWeight: "800", color: colors.text },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colors.text,
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    fontSize: 15,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 40,
  },
  actions: { width: "100%", marginTop: "auto" },
  loginText: { fontSize: 14, color: colors.muted, textAlign: "center" },
  loginLink: { color: colors.primary, fontWeight: "700" },
});
