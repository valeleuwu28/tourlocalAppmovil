# TourLocal Móvil 📱

Aplicación móvil oficial de **TourLocal**, desarrollada en **React Native con Expo** para la evaluación continua **EC3** del Taller de Proyectos Interactivos (IMU-324) de la Universidad Católica Boliviana «San Pablo».

---

## 💡 ¿Por qué React Native?

> *Decidimos utilizar **React Native con Expo** porque nuestro proyecto previo ya estaba desarrollado en JavaScript y React. Esto nos permitió reutilizar la lógica de negocio, hooks personalizados y el modelo de comunicación con nuestra API REST existente. Además, React Native renderiza componentes nativos de Android e iOS con alto rendimiento, mientras que Expo nos brinda la agilidad de probar en tiempo real mediante Expo Go y generar el instalador APK en la nube con EAS Build sin depender de configuraciones nativas pesadas.*

---

## 👥 Equipo y Aportes

| Integrante | Rol y Módulo | Aportes Principales en el Proyecto |
| :--- | :--- | :--- |
| **Esther Daza** | **Exploración, Destinos y Guardados** | • Hook centralizado `useApi.js` con AbortController y refetch.<br>• Componentes `DestinoCard` y `CategoryPill` con estados visuales.<br>• `ExploreScreen`: Buscador en tiempo real, filtros por categoría, Pull-to-Refresh y estados de carga/error.<br>• `PlaceDetailScreen`: Detalle completo del destino, guía oficial y botón para agendar.<br>• `SavedScreen`: Módulo transversal de favoritos/guardados conectado a `GET` y `DELETE /api/guardados`. |
| **Valentina Bravo** | **Autenticación, Perfil e Integración** | • `LoginScreen` y `SignUpScreen` conectados a `/api/users`.<br>• Persistencia de sesión en el dispositivo con `AsyncStorage` (`storage.js`).<br>• `ProfileScreen` y `EditProfileScreen` con selector de fotos (`expo-image-picker`).<br>• Navegación base y soporte de layouts en Expo Router. |
| **Naomi Flores** | **Horarios y Experiencias** | • `ScheduleScreen` para selección de fecha y turnos.<br>• Integración del calendario nativo con `@react-native-community/datetimepicker`.<br>• `SlotCard` con estados (disponible, seleccionado, agotado).<br>• Pantalla y componente de calificación con estrellas (`RateExperience` y `RatingBar`). |
| **Andrea Guachalla** | **Reservas y Flujo Transaccional** | • `ConfirmReservationScreen` con cálculo de participantes y total.<br>• Envío de reservas mediante `POST /api/reservas`.<br>• `SuccessScreen` con generación de código oficial `TL-xxxx`.<br>• `HistoryScreen` y `ReservationCard` con cancelación en tiempo real (`DELETE /api/reservas/:id`). |

---

## 🚀 Cómo Ejecutar el Proyecto

### 1. Iniciar la API Backend (Express + SQLite)
En una terminal:
```bash
cd tourLocal/backend
node src/server.js
```
> El backend escuchará en `http://localhost:3000` y en la IP Wi-Fi local de tu máquina.

### 2. Iniciar la Aplicación Móvil
En una segunda terminal:
```bash
cd tourlocalAppmovil
npm install --legacy-peer-deps
npx expo start
```
- **En Celular Android/iOS:** Escanea el código QR desde la aplicación gratuita **Expo Go**.
- **En Navegador Web (Computadora):** Presiona la tecla `w` en la terminal (o ejecuta `npm run web`).

---

## 📲 Generación de APK para Android (EAS Build)

La app está configurada con `expo-build-properties` (`usesCleartextTraffic: true` para permitir peticiones HTTP a la IP local) y `eas.json`:

1. Iniciar sesión en Expo:
   ```bash
   npx eas-cli login
   ```
2. Lanzar la construcción del APK en la nube:
   ```bash
   npx eas-cli build -p android --profile preview
   ```
3. Al finalizar, escanear el código QR resultante o descargar el archivo `.apk` para instalarlo directamente en cualquier dispositivo Android sin necesidad de Expo Go ni servidor de desarrollo.

---

## 🧭 Flujo Mínimo de Demostración (Rúbrica EC3)

1. **Autenticación:** Iniciar sesión con credenciales válidas o registrar un nuevo usuario.
2. **Exploración:** Ver la lista de destinos cargada desde SQLite vía `GET /api/destinos`, filtrar por categoría o buscar por texto.
3. **Detalle:** Seleccionar un destino para consultar guía asignado, precio, duración y presionar el corazón para guardarlo en favoritos (`POST /api/guardados`).
4. **Agendamiento:** Elegir fecha en el calendario nativo y seleccionar horario disponible.
5. **Transacción:** Confirmar la reserva (`POST /api/reservas`) y recibir el código `TL-xxxx`.
6. **Historial:** Consultar la reserva en la pestaña *Historial* y verificar su cancelación (`DELETE /api/reservas/:id`).
7. **Guardados:** Comprobar que el lugar guardado aparece en la pestaña *Guardados* y retirarlo con el icono de basurero (`DELETE /api/guardados/:id`).
