# TourLocal Móvil 📱

Aplicación móvil oficial de **TourLocal**, desarrollada con **React Native y Expo** para la evaluación continua **EC3** de la materia *Taller de Proyectos Interactivos (IMU-324)* en la Universidad Católica Boliviana «San Pablo».

---

## 💡 ¿Por qué React Native y Expo?

> *Decidimos utilizar **React Native con Expo** porque nuestro proyecto previo ya estaba desarrollado en JavaScript y React. Esto nos permitió reutilizar lógica de negocio, hooks personalizados y la comunicación con nuestra API REST existente. A diferencia de un sitio web, React Native no renderiza elementos HTML sino componentes nativos de Android e iOS (`View`, `Text`, `FlatList`), logrando un rendimiento fluido. Además, Expo simplifica enormemente las pruebas en tiempo real con **Expo Go** y nos permite compilar un archivo instalable **APK en la nube con EAS Build**, sin necesidad de configurar entornos nativos pesados como Android Studio.*

---

## 👥 Equipo y Distribución de Responsabilidades

| Integrante | Rol / Módulo | Funcionalidades y Aportes en el Código |
| :--- | :--- | :--- |
| **Esther Daza** | **Exploración, Destinos y Guardados** | • Hook centralizado `useApi.js` con soporte para cancelación (`AbortController`) y `refetch`.<br>• Componentes visuales `DestinoCard` y `CategoryPill` con estados de selección.<br>• `ExploreScreen`: Buscador en tiempo real, catálogo de destinos desde SQLite, filtros por categoría y *Pull-to-Refresh* nativo.<br>• `PlaceDetailScreen`: Pantalla de detalle con fotografía hero, tarjeta de guía oficial asignado, guardado en favoritos y botón para agendar.<br>• `SavedScreen`: Módulo de favoritos/guardados conectado a `GET`, `POST` y `DELETE /api/guardados`. |
| **Valentina Bravo** | **Autenticación, Perfil e Integración** | • `SplashScreen`: Pantalla de bienvenida y accesos.<br>• `LoginScreen` y `SignUpScreen`: Autenticación y registro de usuarios mediante `/api/users`.<br>• `storage.js`: Persistencia de sesión local en el dispositivo con `AsyncStorage`.<br>• `ProfileScreen` y `EditProfileScreen`: Consulta y edición de datos del usuario con selector de avatar (`expo-image-picker`).<br>• Configuración general de rutas de navegación con Expo Router. |
| **Naomi Flores** | **Horarios y Experiencias** | • `ScheduleScreen`: Selección de fecha y turno para la visita turística.<br>• Integración de calendario nativo mediante `@react-native-community/datetimepicker`.<br>• Componente `SlotCard`: Tarjetas de horarios disponibles, seleccionados y agotados.<br>• Calificación de visitas con estrellas y comentarios (`rate-experience.tsx` y `RatingBar.js`). |
| **Andrea Guachalla** | **Reservas y Flujo Transaccional** | • `ConfirmReservationScreen`: Resumen del tour, selección de pasajeros y cálculo de total.<br>• Registro de reserva en base de datos mediante `POST /api/reservas`.<br>• `SuccessScreen`: Confirmación con código de reserva oficial `TL-xxxx`.<br>• `HistoryScreen` y `ReservationCard`: Listado de reservas activas y cancelación en tiempo real (`DELETE /api/reservas/:id`). |

---

## 🚀 Guía Rápida: Cómo Ejecutar el Proyecto en Local

Para probar la aplicación en tu computadora o en tu celular físico necesitas **dos terminales abiertas**:

### Terminal 1: Iniciar el Servidor Backend (Express + SQLite)
El backend provee los datos reales de destinos, reservas y horarios:
```bash
cd tourLocal/backend
node src/server.js
```
> **Verificación:** Debe mostrar en consola:  
> `Base de datos TourLocal conectada correctamente`  
> `API de TourLocal en http://localhost:3000`

---

### Terminal 2: Iniciar la App Móvil con Expo
```bash
cd tourlocalAppmovil
npm install --legacy-peer-deps
npx expo start
```

Tienes dos formas de interactuar con la app:
* **En tu navegador web (PC):** Presiona la tecla `w` en la terminal (o ejecuta `npm run web`). Se abrirá en `http://localhost:8081`.
* **En tu celular físico (Expo Go):** Instala la app gratuita **Expo Go** (Android o iPhone), asegúrate de estar conectado a la **misma red Wi-Fi** de tu computadora y escanea el código QR que aparece en la terminal.

---

## 📦 Guía Detallada: Cómo Generar el Instalador APK para Android (EAS Build)

El **APK** es el archivo instalador oficial para teléfonos Android. Permite instalar TourLocal directamente en tu celular con su propio ícono y nombre, **sin necesidad de abrir Expo Go ni ejecutar `npx expo start`**.

### ¿Qué se necesita antes de empezar?
1. Un celular Android para instalar la app.
2. Una cuenta gratuita en **[expo.dev](https://expo.dev)**.
3. La computadora y el celular conectados al **mismo Wi-Fi**.

---

### Paso a Paso para Construir el APK:

#### Paso 1: Obtener la IP Wi-Fi de tu computadora
En una terminal ejecuta:
```bash
ipconfig
```
Busca el adaptador **«Adaptador de LAN inalámbrica Wi-Fi»** y copia la **Dirección IPv4** (ejemplo: `192.168.0.37`).  
Asegúrate de que en `src/config.js` esté esa dirección para que el APK sepa dónde está tu backend.

#### Paso 2: Iniciar sesión en Expo desde tu terminal
En la carpeta `tourlocalAppmovil`:
```bash
npx eas-cli login
```
Introduce tu usuario/correo y contraseña registrados en `expo.dev`.  
Verifica con:
```bash
npx eas-cli whoami
```

#### Paso 3: Lanzar la construcción del APK en la nube
Ejecuta el siguiente comando:
```bash
npx eas-cli build -p android --profile preview
```

#### Paso 4: Responder a las preguntas interactivas de la terminal
Durante la primera ejecución, la herramienta te hará dos preguntas:
1. `Would you like to automatically create an EAS project for @tu-usuario/tourlocal-movil?`  
   👉 Presiona la tecla **Y** y luego **Enter**. *(Esto vinculará el proyecto a tu cuenta).*
2. `Generate a new Android Keystore?`  
   👉 Presiona la tecla **Y** y luego **Enter**. *(Expo generará y guardará de forma segura la firma digital de la app).*

#### Paso 5: Esperar la compilación en los servidores de Expo
EAS subirá el código a la nube y compilará el archivo `.apk` (suele tardar entre 10 y 25 minutos según la fila gratuita).  
No es necesario dejar la terminal abierta: el enlace de descarga también se enviará a tu correo electrónico y aparecerá en tu panel de **[expo.dev](https://expo.dev)** en la sección **Builds**.

#### Paso 6: Descargar e instalar en tu celular
1. Cuando termine, la terminal mostrará `✔ Build finished` junto a un código QR y un enlace de descarga.
2. Abre el enlace en tu celular o escanea el QR con tu cámara.
3. Descarga el archivo `.apk` y ábrelo.
4. Si Android solicita autorización, activa la opción **«Permitir la instalación de aplicaciones desconocidas»**.
5. ¡Listo! Verás el ícono de **TourLocal** instalado en la pantalla de inicio de tu teléfono.

> **Para probar el APK:** Enciende tu servidor backend en la computadora (`node src/server.js`), conecta tu celular al mismo Wi-Fi y abre la app instalada TourLocal. Funcionará de forma autónoma.

---

## 🧭 Flujo de Demostración para la Evaluación (Rúbrica EC3)

Este es el recorrido secuencial que debe presentarse durante la evaluación:

```
[SplashScreen] ──► [Login / Registro]
                          │
                          ▼
                  [Explorar Destinos] ◄──► [Filtros y Búsqueda en vivo]
                          │
                          ▼
                 [Detalle del Destino] ──► [Guardar en Favoritos (❤️)]
                          │
                          ▼
                 [Seleccionar Horario] ──► [Calendario Nativo]
                          │
                          ▼
                [Confirmación de Reserva]
                          │
                          ▼
                 [¡Reserva Exitosa! TL-xxxx]
                          │
                          ▼
                 [Historial de Reservas] ──► [Cancelar Reserva (DELETE)]
```

1. **Autenticación (Valentina):** Iniciar sesión con un usuario existente o registrar uno nuevo.
2. **Exploración de destinos (Esther):** Mostrar la carga en tiempo real desde SQLite (`GET /api/destinos`), usar el buscador y filtrar por categorías.
3. **Detalle y Favoritos (Esther):** Entrar a un destino, consultar la ficha del guía oficial y presionar el botón de corazón para guardarlo (`POST /api/guardados`). Revisar que aparezca en la pestaña **Guardados**.
4. **Agendamiento (Naomi):** Presionar *"Agendar experiencia"*, elegir fecha con el selector nativo y elegir turno disponible.
5. **Transacción (Andrea):** Indicar cantidad de personas y confirmar la reserva (`POST /api/reservas`), recibiendo el código `TL-xxxx`.
6. **Historial (Andrea):** Abrir la pestaña **Historial** para verificar que la reserva está registrada y probar la cancelación (`DELETE /api/reservas/:id`).
