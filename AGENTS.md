# AntojApp

- `backend/restaurantes-service` (Spring Boot, puerto 8081, BD `antoj_restaurantes`): restaurantes (con datos bancarios/RUC), productos (con `descuento` % y `disponible`) y usuarios (`/api/auth/login`, `/api/auth/registro`, contraseñas BCrypt).
- `backend/pedidos-service` (Spring Boot, puerto 8082, BD `antoj_pedidos`): pedidos (un pedido por restaurante, enlazado al `email` del cliente, método de pago EFECTIVO/TRANSFERENCIA y datos de facturación).
- `frontend` (Angular 19 standalone, rutas en `src/app/app.routes.ts`):
  - Cliente (`/cliente/...`, guard `rolGuard('CLIENTE')`): explorar, carrito, pedidos, detalle, factura.
  - Local (`/local/...`, guard `rolGuard('LOCAL')`): pedidos, detalle, factura, productos, configuración.
  - Mapa con Leaflet + OpenStreetMap/Nominatim. Imágenes en `frontend/public/img`.
- Cuentas de locales de demostración: `<nombre del local sin espacios ni tildes>@antojapp.com` / `local123` (se crean al arrancar restaurantes-service).

## Verificación
- Backend: `mvn -q compile` en cada servicio (`mvn spring-boot:run` para levantarlo; requiere PostgreSQL en 5432, contraseña `1234`).
- Frontend: `npx ng build` en `frontend` (`npm start` para desarrollo en 4200).
