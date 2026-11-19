import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import InputField from "../../components/common/InputField";
import { API_URL } from "../../config";

export default function SignUpScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !password) {
      setError("Completa todos los campos obligatorios.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!API_URL) {
      setError("Configura EXPO_PUBLIC_API_URL con la dirección de tu servidor.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          email,
          password,
          telefono: "",
          ciudad: "La Paz, Bolivia",
          fechaRegistro: new Date().toLocaleDateString(),
        }),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        setError("El servidor devolvió una respuesta no válida.");
        return;
      }

      if (response.ok) {
        router.replace("/login");
      } else {
        setError(data.error || "Error al registrarse.");
      }
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Empecemos!</Text>

      <InputField
        label="Nombre completo"
        value={nombre}
        onChangeText={setNombre}
        placeholder="Sofía Martínez"
      />
      <InputField
        label="Correo"
        value={email}
        onChangeText={setEmail}
        placeholder="sofia@gmail.com"
        keyboardType="email-address"
      />
      <InputField
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        placeholder="********"
        secureTextEntry
      />
      <InputField
        label="Confirmar contraseña"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="********"
        secureTextEntry
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        style={styles.button}
        onPress={handleRegister}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Registrando..." : "Registrarse"}
        </Text>
      </Pressable>

      <Pressable
        onPress={() => router.back()}
        style={styles.linkContainer}
      >
        <Text style={styles.linkText}>
          ¿Ya tienes cuenta? <Text style={styles.linkBold}>Inicia sesión</Text>
        </Text>
      </Pressable>
    </View>
  );
}

// ... (Usa los mismos estilos del LoginScreen, puedes importarlos o copiarlos)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAF8F5",
    padding: 24,
    justifyContent: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#242421",
    marginBottom: 24,
  },
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
