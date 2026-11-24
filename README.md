# TourLocal · App Móvil

Aplicación móvil para explorar destinos turísticos en La Paz, agendar visitas con guías locales y gestionar reservas de forma rápida y segura.

## Cómo ejecutar

1. Encender la API del proyecto web: `cd backend` y `npm run dev`
2. En esta carpeta (móvil): `npm install`
3. En `src/config.js` poner la IPv4 de la computadora (obtenida con `ipconfig`)
4. `npx expo start` y escanear el QR con la app Expo Go

## ¿Por qué React Native?

Utilizamos React Native con Expo porque nuestro proyecto web ya estaba desarrollado en JavaScript y React, lo que nos permitió reutilizar la lógica de negocio, los estados y la estructura de componentes. Además, Expo facilita las pruebas en el celular sin necesidad de configurar entornos nativos complejos como Android Studio o Xcode. No elegimos Flutter porque implicaba aprender un nuevo lenguaje (Dart) desde cero.

## Flujo

Login → Explorar destinos → Detalle del lugar → Agendar visita → Confirmar reserva → Historial → Cancelar reserva → Perfil

## Equipo y aportes

| Integrante       | Cuenta de GitHub | Pantallas / Componentes                                                 | Funciones especiales / API                                         |
| ---------------- | ---------------- | ----------------------------------------------------------------------- | ------------------------------------------------------------------ |
| Valentina Bravo  | ValentinaBravoF  | Login, Registro, Perfil, EditProfile, Navegación                        | Persistencia de sesión con AsyncStorage, Configuración de API      |
| Esther Daza      | CrisDaz          | ExploreScreen, PlaceDetailScreen, CategoryPill                          | Hook useApi, Consumo de GET /api/destinos                          |
| Naomi Flores     | Naomi Flores     | ScheduleScreen, RateExperienceScreen, DateField                         | Calendario nativo, Selección de horarios, POST /api/calificaciones |
| Andrea Guachalla | Andrea Guachalla | ConfirmReservationScreen, SuccessScreen, HistoryScreen, ReservationCard | POST /api/reservas, DELETE /api/reservas/:id, Lógica de reservas   |
