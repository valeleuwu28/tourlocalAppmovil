import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StyleSheet, Text, View } from "react-native";

import PlaceDetailScreen from "../screens/explore/PlaceDetailScreen";
import TabNavigator from "./TabNavigator";

import * as RawLogin from "../screens/auth/LoginScreen";
import * as RawSignUp from "../screens/auth/SignUpScreen";
import * as RawRate from "../screens/experiences/RateExperienceScreen";
import * as RawConfirm from "../screens/reservations/ConfirmReservationScreen";
import * as RawSuccess from "../screens/reservations/SuccessScreen";
import * as RawSchedule from "../screens/schedule/ScheduleScreen";

// Helper para crear placeholders seguros cuando los módulos de las compañeras aún no se hayan implementado
function createPlaceholder(title, subtitle, icon = "construct-outline") {
  return function PlaceholderComponent() {
    return (
      <View style={styles.placeholderContainer}>
        <Ionicons name={icon} size={56} color="#0F766E" />
        <Text style={styles.placeholderTitle}>{title}</Text>
        <Text style={styles.placeholderSubtitle}>{subtitle}</Text>
      </View>
    );
  };
}

const ScheduleComponent =
  RawSchedule?.default ||
  createPlaceholder(
    "Selección de Horario",
    "Módulo de horarios y calendario (En integración por Naomi)",
    "calendar-outline",
  );

const ConfirmComponent =
  RawConfirm?.default ||
  createPlaceholder(
    "Confirmar Reserva",
    "Módulo transaccional de reservas (En integración por Andrea)",
    "card-outline",
  );

const SuccessComponent =
  RawSuccess?.default ||
  createPlaceholder(
    "¡Reserva Exitosa!",
    "Código de confirmación y resumen (En integración por Andrea)",
    "checkmark-circle-outline",
  );

const RateComponent =
  RawRate?.default ||
  createPlaceholder(
    "Calificar Experiencia",
    "Módulo de calificaciones (En integración por Naomi)",
    "star-outline",
  );

const LoginComponent =
  RawLogin?.default ||
  createPlaceholder(
    "Iniciar Sesión",
    "Módulo de autenticación (En integración por Valentina)",
    "log-in-outline",
  );

const SignUpComponent =
  RawSignUp?.default ||
  createPlaceholder(
    "Crear Cuenta",
    "Módulo de registro (En integración por Valentina)",
    "person-add-outline",
  );

const Stack = createNativeStackNavigator();

/**
 * AppNavigator principal de TourLocal Móvil
 * Contiene el stack de navegación completo de la aplicación.
 */
export default function AppNavigator() {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="Home" component={TabNavigator} />
        <Stack.Screen
          name="PlaceDetail"
          component={PlaceDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Schedule"
          component={ScheduleComponent}
          options={{ headerShown: true, title: "Agendar Experiencia" }}
        />
        <Stack.Screen
          name="ConfirmReservation"
          component={ConfirmComponent}
          options={{ headerShown: true, title: "Confirmar Reserva" }}
        />
        <Stack.Screen
          name="Success"
          component={SuccessComponent}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="RateExperience"
          component={RateComponent}
          options={{ headerShown: true, title: "Calificar Experiencia" }}
        />
        <Stack.Screen
          name="Login"
          component={LoginComponent}
          options={{ headerShown: true, title: "Iniciar Sesión" }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpComponent}
          options={{ headerShown: true, title: "Registrarse" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  placeholderTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 16,
  },
  placeholderSubtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
    maxWidth: 300,
  },
});
