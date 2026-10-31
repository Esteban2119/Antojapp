# AntojApp

- `backend/restaurantes-service` (Spring Boot, puerto 8081, BD `antoj_restaurantes`): restaurantes y productos (con `descuento` % y `disponible`).
- `backend/pedidos-service` (Spring Boot, puerto 8082, BD `antoj_pedidos`): pedidos (un pedido por restaurante, enlazado al `email` del cliente).
- `frontend` (Angular 19 standalone, rutas en `src/app/app.routes.ts`, mapa con Leaflet + OpenStreetMap/Nominatim).

## Verificación
- Backend: `mvn -q compile` en cada servicio (`mvn spring-boot:run` para levantarlo; requiere PostgreSQL en 5432).
- Frontend: `npx ng build` en `frontend` (`npm start` para desarrollo en 4200).
