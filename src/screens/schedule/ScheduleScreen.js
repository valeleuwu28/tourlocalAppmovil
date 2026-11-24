
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

import useApi from "../../hooks/useApi";
import SlotCard from "../../components/experiences/SlotCard";
import { isSlotPassed } from "../../utils/dateUtils";

// Convertir la fecha a YYYY-MM-DD
function formatearFecha(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

// Obtener las próximas siete fechas
function obtenerProximosDias() {
  return Array.from({ length: 7 }, (_, i) => {
    const fecha = new Date();
    fecha.setHours(12, 0, 0, 0);
    fecha.setDate(fecha.getDate() + i);
    return fecha;
  });
}

export default function ScheduleScreen({ navigation, route }) {
  const router = useRouter();
  const searchParams = useLocalSearchParams();
  const id = searchParams?.id || route?.params?.id || route?.params?.destinoId;

  // Estados de nuestra pantalla
  const [fecha, setFecha] = useState(new Date());
  const [mostrarCalendario, setMostrarCalendario] = useState(false);
  const [horarioSeleccionado, setHorarioSeleccionado] = useState(null);

  // Consultar horarios reales desde el backend
  const {
    data,
    loading,
    error,
    refetch,
  } = useApi("/api/horarios");

  // Adaptar la respuesta de la API
  const horarios = Array.isArray(data)
    ? data
    : Array.isArray(data?.horarios)
      ? data.horarios
      : [];

  const dias = obtenerProximosDias();
  const fechaElegida = formatearFecha(fecha);

  // Cambiar fecha y limpiar horario anterior
  const cambiarFecha = (nuevaFecha) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (nuevaFecha < hoy) return;

    setFecha(nuevaFecha);
    setHorarioSeleccionado(null);
  };

  // Seleccionar fecha con calendario nativo
  const elegirFechaNativa = (event, nuevaFecha) => {
    if (Platform.OS === "android") {
      setMostrarCalendario(false);
    }

    if (event.type === "dismissed" || !nuevaFecha) {
      return;
    }

    cambiarFecha(nuevaFecha);
  };

  // Ir a la confirmación de reserva
  const continuar = () => {
    if (
      !id ||
      !horarioSeleccionado ||
      isSlotPassed(fecha, horarioSeleccionado.time) ||
      loading ||
      error
    ) {
      return;
    }

    if (navigation && typeof navigation.navigate === 'function') {
      navigation.navigate("ConfirmReservation", {
        destinoId: String(id),
        fecha: fechaElegida,
        horario: horarioSeleccionado.time,
      });
    } else {
      router.push({
        pathname: "/confirm-reservation",
        params: {
          destinoId: String(id),
          fecha: fechaElegida,
          horario: horarioSeleccionado.time,
        },
      });
    }
  };

  const horarioValido =
    horarioSeleccionado &&
    !isSlotPassed(fecha, horarioSeleccionado.time);

  const puedeContinuar =
    !!id &&
    !!horarioValido &&
    !loading &&
    !error;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>

        {/* Encabezado */}
        <Pressable
          onPress={() => router.back()}
          style={styles.backRow}
        >
          <Ionicons
            name="arrow-back"
            size={20}
            color="#0F766E"
          />
          <Text style={styles.backText}>Volver</Text>
        </Pressable>

        <Text style={styles.title}>Agendar visita</Text>

        <Text style={styles.subtitle}>
          Elige cuándo quieres realizar tu experiencia.
        </Text>

        {/* Destino */}
        <View style={styles.destinationBox}>
          <Ionicons
            name="location-outline"
            size={20}
            color="#0F766E"
          />

          <Text style={styles.destinationText}>
            Destino seleccionado: {id || "No seleccionado"}
          </Text>
        </View>

        {/* Selección de fecha */}
        <Text style={styles.sectionTitle}>
          Selecciona una fecha
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.daysScroll}
        >
          {dias.map((dia) => {
            const seleccionado =
              formatearFecha(dia) === fechaElegida;

            return (
              <Pressable
                key={formatearFecha(dia)}
                onPress={() => cambiarFecha(dia)}
                style={[
                  styles.dayCard,
                  seleccionado && styles.daySelected,
                ]}
              >
                <Text
                  style={[
                    styles.dayName,
                    seleccionado && styles.daySelectedText,
                  ]}
                >
                  {dia.toLocaleDateString("es-BO", {
                    weekday: "short",
                  })}
                </Text>

                <Text
                  style={[
                    styles.dayNumber,
                    seleccionado && styles.daySelectedText,
                  ]}
                >
                  {dia.getDate()}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Calendario del celular */}
        {Platform.OS !== "web" && (
          <Pressable
            style={styles.calendarButton}
            onPress={() => setMostrarCalendario(true)}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color="#0F766E"
            />

            <Text style={styles.calendarButtonText}>
              Abrir calendario completo
            </Text>
          </Pressable>
        )}

        {mostrarCalendario && Platform.OS !== "web" && (
          <DateTimePicker
            value={fecha}
            mode="date"
            minimumDate={new Date()}
            onChange={elegirFechaNativa}
          />
        )}

        <Text style={styles.selectedDate}>
          Fecha elegida:{" "}
          {fecha.toLocaleDateString("es-BO", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>

        {/* Lista de horarios */}
        <Text style={styles.sectionTitle}>
          Horarios disponibles
        </Text>

        {loading && (
          <View style={styles.messageBox}>
            <ActivityIndicator
              size="large"
              color="#0F766E"
            />
            <Text style={styles.messageText}>
              Cargando horarios...
            </Text>
          </View>
        )}

        {!loading && error && (
          <View style={styles.messageBox}>
            <Ionicons
              name="alert-circle-outline"
              size={30}
              color="#DC2626"
            />

            <Text style={styles.errorText}>
              No se pudieron cargar los horarios.
            </Text>

            <Text style={styles.messageText}>
              {error}
            </Text>

            <Pressable
              onPress={refetch}
              style={styles.retryButton}
            >
              <Text style={styles.retryText}>
                Reintentar
              </Text>
            </Pressable>
          </View>
        )}

        {!loading && !error && (
          <View style={styles.slotsContainer}>
            {horarios.length > 0 ? (
              horarios.map((horario) => {
                const isPassed = isSlotPassed(fecha, horario.time);
                const enrichedHorario = { ...horario, isPassed };
                return (
                  <SlotCard
                    key={horario.id}
                    horario={enrichedHorario}
                    selected={
                      !isPassed && horarioSeleccionado?.id === horario.id
                    }
                    onPress={() => {
                      if (!isPassed) {
                        setHorarioSeleccionado(horario);
                      }
                    }}
                  />
                );
              })
            ) : (
              <Text style={styles.messageText}>
                No se encontraron horarios.
              </Text>
            )}
          </View>
        )}

      </ScrollView>

      {/* Botón inferior */}
      <View style={styles.footer}>
        <Pressable
          onPress={continuar}
          disabled={!puedeContinuar}
          style={[
            styles.continueButton,
            !puedeContinuar && styles.continueDisabled,
          ]}
        >
          <Text style={styles.continueText}>
            Continuar con reserva
          </Text>

          <Ionicons
            name="arrow-forward"
            size={18}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 110,
  },

  backRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 25,
  },

  backText: {
    color: "#0F766E",
    fontSize: 15,
    fontWeight: "600",
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#0F172A",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 22,
  },

  destinationBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 15,
    borderRadius: 14,
    backgroundColor: "#F0FDFA",
    marginBottom: 28,
  },

  destinationText: {
    fontSize: 14,
    color: "#0F766E",
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 15,
  },

  daysScroll: {
    marginBottom: 15,
  },

  dayCard: {
    width: 64,
    height: 76,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  daySelected: {
    backgroundColor: "#0F766E",
    borderColor: "#0F766E",
  },

  dayName: {
    color: "#64748B",
    fontSize: 12,
    textTransform: "capitalize",
  },

  dayNumber: {
    color: "#0F172A",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 5,
  },

  daySelectedText: {
    color: "#FFFFFF",
  },

  calendarButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingVertical: 12,
  },

  calendarButtonText: {
    color: "#0F766E",
    fontSize: 14,
    fontWeight: "600",
  },

  selectedDate: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 28,
  },

  slotsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  messageBox: {
    padding: 24,
    alignItems: "center",
    gap: 10,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
  },

  messageText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
  },

  errorText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#DC2626",
    textAlign: "center",
  },

  retryButton: {
    marginTop: 8,
    padding: 12,
    backgroundColor: "#0F766E",
    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 22,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  continueButton: {
    backgroundColor: "#0F766E",
    borderRadius: 14,
    padding: 17,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  continueDisabled: {
    backgroundColor: "#94A3B8",
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});
