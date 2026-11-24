# TourLocal Móvil

Aplicación móvil de TourLocal para explorar destinos turísticos, consultar información de guías locales, guardar lugares favoritos y gestionar reservas. Está desarrollada con React Native y Expo para la evaluación EC3 de Taller de Proyectos Interactivos (IMU-324), Universidad Católica Boliviana «San Pablo».

## ¿Por qué React Native y Expo?

Elegimos React Native porque el proyecto web ya utiliza JavaScript y React, lo que nos permite aplicar los mismos conocimientos de componentes, estado y consumo de API REST. A diferencia de una página web, la aplicación presenta interfaces con componentes nativos como `View`, `Text` y `FlatList`. Expo facilita probarla en un teléfono y generar compilaciones para Android con EAS, sin configurar manualmente todo el entorno nativo.

## Funcionalidades y flujo

El recorrido principal de la aplicación es:

**Iniciar sesión o registrarse → Explorar destinos → Ver detalle y mapa → Guardar un destino → Elegir fecha y horario → Confirmar reserva → Consultar historial o cancelar una reserva.**

También incluye edición de perfil y selección de foto, búsqueda y filtros de destinos, y una pantalla para calificar experiencias con estrellas y comentarios.

## Equipo y aportes

| Integrante | Módulos y aportes |
| --- | --- |
| Valentina Bravo | Splash, inicio de sesión, registro y perfil; persistencia de sesión con AsyncStorage e integración de configuración de API. |
| Esther Daza | Exploración, búsqueda y filtros; detalle del destino, guardados y mapa; hook `useApi` para consultar la API. |
| Naomi Flores | Selección de fechas y horarios, calendario nativo, tarjetas de turnos y calificación de experiencias. |
| Andrea Guachalla | Confirmación y éxito de reserva, historial, tarjetas de reservas y cancelación. |

## Requisitos

- Node.js y npm.
- El backend/API de TourLocal en ejecución en el puerto `3000`.
- Para probar en un teléfono físico, el teléfono y la computadora deben poder comunicarse por la misma red Wi-Fi o hotspot.
- Expo Go para probar desde el QR. Algunas funciones o compilaciones pueden requerir una development build.

## Ejecutar en local

1. Inicia el backend de TourLocal siguiendo las instrucciones de su proyecto. Confirma que la API esté disponible en el puerto `3000`.
2. En la raíz de este repositorio, instala las dependencias e inicia Expo:

   ```bash
   npm install
   npx expo start
   ```

3. Para abrir la aplicación web, presiona `w` en la terminal o ejecuta `npm run web`.
4. Para probar en un teléfono, abre Expo Go y escanea el QR. El teléfono debe estar en una red que pueda alcanzar la computadora que ejecuta la API.

### Configurar la conexión con la API

En web, la aplicación usa `http://localhost:3000`. En Android o iOS usa una dirección local de la computadora. Si el teléfono no alcanza la API:

1. Ejecuta `ipconfig` en Windows y encuentra la dirección IPv4 de la interfaz conectada a la misma red que el teléfono.
2. En la pantalla **Explorar**, usa **Cambiar IP** e introduce esa dirección, sin `http://` ni el puerto. La aplicación guarda la configuración en el dispositivo.
3. Verifica que el backend siga activo en el puerto `3000` y que el firewall permita la conexión.

La IP predeterminada está pensada para el hotspot usado durante el desarrollo y puede no coincidir con la red de otra computadora.

## Generar un APK de Android con EAS

El perfil `preview` de [eas.json](./eas.json) está configurado para generar un APK de distribución interna.

1. Inicia sesión en Expo:

   ```bash
   npx eas-cli login
   npx eas-cli whoami
   ```

2. Desde la raíz de este repositorio, inicia la compilación:

   ```bash
   npx eas-cli build --platform android --profile preview
   ```

3. Sigue las instrucciones de EAS si solicita configurar el proyecto o las credenciales de firma. La compilación se ejecuta en la nube; al finalizar, EAS proporciona un enlace para descargar el APK.
4. Instala el APK en un teléfono Android. Para que la aplicación móvil se comunique con el backend, configura desde **Explorar → Cambiar IP** una dirección de API alcanzable desde ese teléfono.

## Recorrido sugerido para la demostración

1. Inicia sesión o crea una cuenta.
2. En **Explorar**, muestra la lista, la búsqueda y los filtros.
3. Abre un destino; revisa su información, el mapa y la opción de guardarlo.
4. Entra a los destinos guardados y vuelve a la experiencia.
5. Elige una fecha y un horario, confirma la reserva y muestra el código de éxito.
6. Abre **Historial**, verifica la reserva y prueba cancelarla.
7. Muestra la edición de perfil y la pantalla de calificación como funciones adicionales.

## Endpoints principales

- `GET /api/destinos` y `GET /api/destinos/:id`: catálogo y detalle.
- `GET`, `POST` y `DELETE /api/guardados`: destinos favoritos.
- `GET /api/horarios`: horarios disponibles.
- `POST /api/reservas`, `GET /api/reservas` y `DELETE /api/reservas/:id`: gestión de reservas.
- `POST /api/calificaciones`: envío de una calificación.
