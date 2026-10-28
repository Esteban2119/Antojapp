# AntojApp — Primera entrega funcional

Aplicación académica distribuida de comida con Angular 19, Java 17, Spring Boot 3.3, API REST y PostgreSQL.

## Qué incluye
- Catálogo con 3 restaurantes y 6 productos precargados.
- Búsqueda, filtros por categoría, carrito y total.
- Confirmación de pedidos con nombre y dirección.
- Pedidos persistidos en PostgreSQL y consulta de estados.
- Dos microservicios **independientes** en puertos 8081 y 8082.
- Frontend Angular standalone responsive con carpetas `models`, `services` y `app`.

**Alcance:** primera etapa de un proyecto académico. El frontend llama a ambos servicios directamente. Aún NO incluye API Gateway, autenticación, pagos reales, RabbitMQ, reparto, validación cruzada de precios o notificaciones. Los totales se calculan en el cliente y por eso **no son seguros para producción**.

## Requisitos
Java 17, Maven 3.9+, PostgreSQL, Node.js 20/22, npm y VS Code. Comprueba: `java -version`, `mvn -version`, `node -v`, `npm -v`.

## 1. Base de datos
En pgAdmin abre Query Tool de la base `postgres` y ejecuta las dos instrucciones de `database/crear_bases.sql` **una por una**. Ajusta `spring.datasource.username` y `spring.datasource.password` en los dos archivos `application.properties` para tu instalación.

## 2. Microservicio de restaurantes
Abre una terminal en `backend/restaurantes-service` y ejecuta:

```bash
mvn spring-boot:run
```

Prueba `http://localhost:8081/api/restaurantes` y `http://localhost:8081/api/productos` en el navegador. En el primer arranque se insertan 3 restaurantes y 6 productos.

## 3. Microservicio de pedidos
Abre **otra** terminal en `backend/pedidos-service`:

```bash
mvn spring-boot:run
```

Prueba `http://localhost:8082/api/pedidos` (al inicio verás `[]`).

## 4. Frontend Angular
Abre **otra** terminal en `frontend`:

```bash
npm install
npm start
```

Visita `http://localhost:4200`. Necesitas tener **las tres terminales ejecutándose**.

## 5. Pruebas en Thunder Client o Postman

**GET** `http://localhost:8081/api/productos` — lista productos.

**POST** `http://localhost:8081/api/restaurantes` — Body JSON:
```json
{"nombre":"Mi restaurante","descripcion":"Comida deliciosa","categoria":"Ecuatoriana","imagen":""}
```

**POST** `http://localhost:8082/api/pedidos` — Body JSON:
```json
{"cliente":"Esteban","direccion":"Quito, Ecuador","total":11.25,"detalle":"[{\"productoId\":1,\"cantidad\":2}]"}
```

**PATCH** `http://localhost:8082/api/pedidos/1/estado` — Body JSON:
```json
{"estado":"PREPARANDO"}
```

Otros estados válidos: `RECIBIDO`, `EN_CAMINO`, `ENTREGADO`.

## 6. Generación con start.spring.io
Para recrear cada backend desde cero, visita https://start.spring.io/ y selecciona:
- Project: Maven; Language: Java; Spring Boot: **3.3.x**; Group: `com.antojapp`; Java: **17**; Packaging: Jar.
- Artifact: `restaurantes-service` o `pedidos-service`.
- Dependencies: **Spring Web, Spring Data JPA, PostgreSQL Driver, Validation**.

La versión Spring Boot 3.3.13 está fijada en los `pom.xml` entregados, por compatibilidad con Java 17. Si start.spring.io ofrece otra versión compatible con Java 17, puedes usarla ajustando el `pom.xml`.

## Estructura
```text
AntojApp/
├── backend/
│   ├── restaurantes-service/
│   │   └── src/main/java/com/antojapp/restaurantes/
│   │       ├── model/        # Tablas
│   │       ├── repository/   # Acceso a PostgreSQL
│   │       ├── controller/   # Endpoints REST
│   │       └── config/       # Datos iniciales
│   └── pedidos-service/
│       └── src/main/java/com/antojapp/pedidos/
│           ├── model/
│           ├── repository/
│           └── controller/
├── frontend/
│   └── src/app/
│       ├── models/          # Interfaces TypeScript
│       ├── services/        # Llamadas HTTP
│       ├── app.component.ts # Lógica de interfaz
│       ├── app.component.html # Vistas
│       └── app.component.css # Estilos
└── database/crear_bases.sql
```

## Próximos pasos
1. CRUD completo de restaurantes y productos con formularios Angular.
2. Separar componentes Angular: `navbar`, `catalogo`, `producto-card`, `carrito`, `pedidos`.
3. Servicio de pagos simulados y notificaciones.
4. API Gateway y comunicación backend-backend para validar productos, precios y stock.
5. Seguridad, RabbitMQ, pruebas automatizadas y despliegue.

**Nota:** el ejemplo usa imágenes representadas por emojis para funcionar sin descargar recursos externos; los campos `imagen` ya están preparados para añadir fotografías después.
