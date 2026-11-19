import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import Button from "../../components/common/Button";
import HeaderBar from "../../components/common/HeaderBar";
import InputField from "../../components/common/InputField";
import { getSession, saveSession } from "../../utils/storage";

export default function EditProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [foto, setFoto] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingPhoto, setProcessingPhoto] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getSession().then(({ user: currentUser }) => {
      if (!active) return;
      if (!currentUser) {
        router.replace("/login");
        return;
      }

      setUser(currentUser);
      setNombre(currentUser.nombre || "");
      setEmail(currentUser.email || "");
      setTelefono(currentUser.telefono || "");
      setCiudad(currentUser.ciudad || "");
      setFoto(currentUser.foto || "");
      setLoading(false);
    });

    return () => {
      active = false;
    };
  }, [router]);

  const handlePickPhoto = async () => {
    setError("");
    setProcessingPhoto(true);

    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          "Permiso necesario",
          "Permite el acceso a tus fotos para cambiar tu foto de perfil.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
      });

      if (!result.canceled) {
        setFoto(result.assets[0].uri);
      }
    } catch {
      setError("No se pudo abrir la galería de fotos.");
    } finally {
      setProcessingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!nombre.trim() || !email.trim()) {
      setError("El nombre y el correo son obligatorios.");
      return;
    }
    if (!user) {
      router.replace("/login");
      return;
    }

    setError("");
    setSaving(true);
    try {
      const session = await getSession();
      const currentUser = session.user || user;
      await saveSession(
        {
          ...currentUser,
          nombre: nombre.trim(),
          email: email.trim(),
          telefono: telefono.trim(),
          ciudad: ciudad.trim(),
          foto,
        },
        session.token,
      );
      router.back();
    } catch {
      setError("No se pudieron guardar los cambios del perfil.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0F766E" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HeaderBar
        title="Editar perfil"
        showBackButton
        onBackPress={() => router.back()}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.avatarSection}>
          {foto ? (
            <Image source={{ uri: foto }} style={styles.avatar} />
          ) : (
            <Ionicons name="person-circle" size={88} color="#0F766E" />
          )}
          <Pressable
            onPress={handlePickPhoto}
            disabled={processingPhoto}
            style={styles.photoButton}
          >
            <Text style={styles.photoButtonText}>
              {processingPhoto ? "Abriendo galería..." : "Cambiar foto"}
            </Text>
          </Pressable>
        </View>

        <InputField
          label="Nombre y apellidos"
          value={nombre}
          onChangeText={setNombre}
          placeholder="Tu nombre"
        />
        <InputField
          label="Correo electrónico"
          value={email}
          onChangeText={setEmail}
          placeholder="correo@ejemplo.com"
          keyboardType="email-address"
        />
        <InputField
          label="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          placeholder="Tu teléfono"
          keyboardType="phone-pad"
        />
        <InputField
          label="Ciudad"
          value={ciudad}
          onChangeText={setCiudad}
          placeholder="Tu ciudad"
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Button onPress={handleSave} disabled={saving || processingPhoto}>
          {saving ? "Guardando..." : "Guardar cambios"}
        </Button>
        <Button
          variant="secondary"
          onPress={() => router.back()}
          disabled={saving}
          style={styles.cancelButton}
        >
          Cancelar
        </Button>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FAF8F5" },
  centered: { flex: 1, alignItems: "center", justifyContent: "center" },
  content: { padding: 20, paddingBottom: 36 },
  avatarSection: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 88, height: 88, borderRadius: 44 },
  photoButton: { marginTop: 10, padding: 8 },
  photoButtonText: { color: "#0F766E", fontWeight: "700" },
  error: {
    color: "#800F0F",
    textAlign: "center",
    marginBottom: 14,
  },
  cancelButton: { marginTop: 12 },
});
