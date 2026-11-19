import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import InputField from "../../components/common/InputField";
import { API_URL } from "../../config";
import { saveSession } from "../../utils/storage";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Por favor, completa todos los campos.");
      return;
    }
    if (!API_URL) {
      setError("Configura EXPO_PUBLIC_API_URL con la dirección de tu servidor.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setError("El servidor devolvió una respuesta no válida.");
        return;
      }

      if (response.ok) {
        try {
          await saveSession(data);
        } catch {
          setError("No se pudo guardar la sesión en este dispositivo.");
          return;
        }
        router.replace("/home");
      } else {
        setError(data.error || "Correo o contraseña incorrectos.");
      }
    } catch {
      setError("No se pudo conectar con el servidor. ¿Está encendido?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Bienvenido de nuevo!</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar.</Text>

      <InputField
        label="Correo"
        value={email}
        onChangeText={setEmail}
        placeholder="ejemplo@gmail.com"
        keyboardType="email-address"
      />
      <InputField
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.push("/signup")}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>
          ¿No tienes cuenta? <Text style={styles.linkBold}>Regístrate</Text>
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    padding: 24,
    justifyContent: "center",
  },
  title: { fontSize: 28, fontWeight: "800", color: "#242421", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#706560", marginBottom: 32 },
  button: {
    backgroundColor: "#0F766E",
    padding: 16,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  error: {
    color: "#800F0F",
    fontSize: 14,
    textAlign: "center",
    marginBottom: 10,
  },
  linkContainer: { marginTop: 24, alignItems: "center" },
  linkText: { color: "#706560", fontSize: 14 },
  linkBold: { color: "#0F766E", fontWeight: "700" },
});
