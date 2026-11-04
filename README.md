# AntojApp — Primera entrega funcional

Aplicación académica distribuida de comida con Angular 19, Java 17, Spring Boot 3.3, API REST y PostgreSQL.

## Qué incluye
- Catálogo con 3 restaurantes y 6 productos precargados.
- Búsqueda, filtros por categoría, carrito y total.
- Confirmación de pedidos con nombre y dirección.
- Pedidos persistidos en PostgreSQL y consulta de estados.
- **Microservicio de notificaciones** con envío por correo, plantillas reutilizables y registro de cada mensaje.
- Tres microservicios **independientes** en los puertos 8081, 8082 y 8083.
- Frontend Angular standalone responsive con carpetas `models`, `services` y `app`.
- Mailpit como SMTP local para probar los correos sin enviarlos a internet.

**Alcance:** primera etapa de un proyecto académico. El frontend llama a los servicios directamente. Aún NO incluye API Gateway, autenticación, pagos reales, RabbitMQ, reparto ni validación cruzada de precios. Los totales se calculan en el cliente y por eso **no son seguros para producción**.

## Requisitos
Java 17, Maven 3.9+, PostgreSQL, Node.js 20/22, npm y VS Code. Comprueba: `java -version`, `mvn -version`, `node -v`, `npm -v`. Docker es opcional: sirve para levantar Mailpit, Kafka y PostgreSQL sueltos, o el proyecto completo como se explica en la sección siguiente.

## Levantar todo con Docker (opcional)

Alternativa a los pasos 1–5: el proyecto completo corre en contenedores con el código fuente montado como volumen (modo desarrollo).

```bash
docker compose up -d
docker compose logs -f pedidos-service
```

- El primer arranque descarga las dependencias de Maven y npm y tarda varios minutos; los siguientes reutilizan las cachés (`maven-cache`, `postgres-data`, `frontend-node-modules`).
- Los puertos del host evitan choques con otros proyectos que corren en Docker: PostgreSQL se publica en el **5434** y Kafka en el **9092** con compose (o **9094** con swarm; el broker se anuncia en el mismo puerto que publica; el 5432, el 5433 y el 9092 suelen estar ocupados). Ajusta los mapeos si tu máquina los tiene libres.
- No mezcles modos: con Docker levantado no ejecutes también `mvn spring-boot:run` o `npm start` en el host (puertos duplicados).
- El frontend recarga solo al guardar cambios. Tras editar Java, reinicia ese servicio: `docker compose restart restaurantes-service`.
- PostgreSQL queda accesible desde pgAdmin en `localhost:5434` (usuario `postgres`, contraseña `1234`). Kafka queda en `localhost:9092` con compose (o `localhost:9094` con swarm; solo importa si corres microservicios fuera de Docker) y la bandeja de correos en `http://localhost:8025`.
- UI de Kafka opcional: `docker compose --profile tools up -d kafka-ui` y abre `http://localhost:8090`.

### Docker Swarm (un solo nodo)

`docker-swarm.yml` es el mismo stack adaptado a Swarm: sin `depends_on` (los servicios reintentan solos hasta que PostgreSQL y Kafka responden) y sin `profiles` (la kafka-ui va incluida). Ejecuta los comandos desde la raíz del proyecto:

```bash
docker swarm init                                  # solo la primera vez
docker stack deploy -c docker-swarm.yml antojapp
docker stack services antojapp
docker service logs -f antojapp_pedidos-service
docker stack rm antojapp
```

Ojo: los montajes de código (`./backend`, `./frontend`) solo existen en el nodo que ejecuta cada tarea, así que esto funciona en un swarm de **un solo nodo**. Para varios nodos habría que construir imágenes con `Dockerfile` y publicarlas en un registry.

## 1. Base de datos
En pgAdmin abre Query Tool de la base `postgres` y ejecuta las tres instrucciones de `database/crear_bases.sql` **una por una**. Ajusta `spring.datasource.username` y `spring.datasource.password` en los tres archivos `application.properties` para tu instalación.

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

## 4. Microservicio de notificaciones

### 4.1 Levantar Mailpit (SMTP local)
Desde la raíz del proyecto:

```bash
docker compose up -d mailpit
```

También puedes usar Docker directamente:

```bash
docker run -d --name antoj-mailpit -p 1025:1025 -p 8025:8025 axllent/mailpit:v1.30.5
```

- SMTP: `localhost:1025`
- Bandeja web: `http://localhost:8025`

El microservicio ya está configurado para usar ese SMTP en `backend/notificaciones-service/src/main/resources/application.properties`.

### 4.2 Arrancar el servicio
En **otra** terminal:

```bash
cd backend/notificaciones-service
mvn spring-boot:run
```

Si no tienes Maven instalado, usa el wrapper incluido: `./mvnw spring-boot:run`.

Prueba `http://localhost:8083/api/plantillas`. En el primer arranque se crean las plantillas de ejemplo.

### 4.3 Tablas
JPA crea y actualiza las tablas automáticamente en la base `antoj_notificaciones`:

| Tabla | Para qué sirve |
|---|---|
| `plantillas_notificacion` | Templates con `codigo`, `nombre`, `canal`, `asunto`, `cuerpo`, `activa` y fechas. |
| `mensajes_notificacion` | Cada envío: destinatario, asunto, cuerpo renderizado, variables en `jsonb`, estado, error, intentos, referencia y fechas. |

### 4.4 Campos reemplazables
Los templates usan **Thymeleaf**, la librería de plantillas integrada con Spring Boot. Permite reemplazar variables, usar condicionales y escapar HTML automáticamente. La sintaxis es:

```text
[[${nombreVariable}]]
```

Ejemplo de asunto:

```text
Pedido #[[${pedidoId}]] recibido en [[${restaurante}]]
```

Ejemplo de cuerpo:

```html
<p>Hola [[${cliente}]], recibimos tu pedido #[[${pedidoId}]].</p>
```

Las variables se envían como pares clave/valor de texto en el campo `variables` y quedan guardadas en `mensajes_notificacion.variables` con tipo `jsonb` de PostgreSQL. El mapeo lo hace Hibernate con `@JdbcTypeCode(SqlTypes.JSON)`.

### 4.5 Enviar una notificación
```bash
curl -X POST http://localhost:8083/api/notificaciones \
  -H 'Content-Type: application/json' \
  -d '{
    "codigoPlantilla": "PEDIDO_RECIBIDO",
    "destinatario": "cliente@example.com",
    "variables": {
      "cliente": "Ana",
      "pedidoId": "15",
      "restaurante": "Sabor Andino",
      "total": "12.50"
    },
    "referencia": "15"
  }'
```

El correo aparece en `http://localhost:8025`. Si el SMTP falla, el mensaje queda guardado con estado `FALLIDO` y puede reenviarse con `POST /api/notificaciones/{id}/reenviar`.

### 4.6 Endpoints principales
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/plantillas` | Lista plantillas. Filtros: `canal`, `activa`. |
| `GET` | `/api/plantillas/{id}` | Busca una plantilla por id. |
| `GET` | `/api/plantillas/codigo/{codigo}` | Busca una plantilla por código. |
| `POST` | `/api/plantillas` | Crea una plantilla. |
| `PUT` | `/api/plantillas/{id}` | Actualiza una plantilla. |
| `DELETE` | `/api/plantillas/{id}` | Elimina una plantilla. |
| `POST` | `/api/notificaciones` | Renderiza y envía una notificación. |
| `POST` | `/api/notificaciones/{id}/reenviar` | Reintenta el envío de un mensaje. |
| `GET` | `/api/notificaciones` | Lista mensajes. Filtros: `estado`, `canal`, `destinatario`. |
| `GET` | `/api/notificaciones/{id}` | Consulta un mensaje. |

### 4.7 Agregar otro canal (SMS, push, WhatsApp)
El envío está detrás de la interfaz `NotificacionSender`. Para agregar un canal:

1. Implementa `NotificacionSender` y devuelve el nuevo valor de `CanalNotificacion`.
2. Anota la clase con `@Component`.
3. Crea o actualiza una plantilla con ese canal.

`NotificacionService` descubre todos los beans `NotificacionSender` al arrancar; no hay que modificar la lógica de envío.

## 5. Frontend Angular
Abre **otra** terminal en `frontend`:

```bash
npm install
npm start
```

Visita `http://localhost:4200`. Necesitas tener los servicios que uses ejecutándose.

## 6. Pruebas en Thunder Client o Postman

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

**POST** `http://localhost:8083/api/notificaciones` — Body JSON:
```json
{
  "codigoPlantilla": "PEDIDO_CONFIRMADO",
  "destinatario": "cliente@example.com",
  "variables": {"cliente":"Esteban","pedidoId":"1","restaurante":"Sabor Andino"}
}
```

## 7. Generación con start.spring.io
Para recrear cada backend desde cero, visita https://start.spring.io/ y selecciona:
- Project: Maven; Language: Java; Spring Boot: **3.3.x**; Group: `com.antojapp`; Java: **17**; Packaging: Jar.
- Artifact: `restaurantes-service`, `pedidos-service` o `notificaciones-service`.
- Dependencies: **Spring Web, Spring Data JPA, PostgreSQL Driver, Validation**. Para notificaciones agrega **Java Mail Sender** y **Thymeleaf**.

La versión Spring Boot 3.3.13 está fijada en los `pom.xml` entregados, por compatibilidad con Java 17. start.spring.io ya no ofrece 3.3.x (solo 4.x); el proyecto de notificaciones se generó desde esa página y luego se ajustó el `pom.xml` a 3.3.13 para mantener la misma versión que los otros dos servicios.

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
│   ├── pedidos-service/
│   │   └── src/main/java/com/antojapp/pedidos/
│   │       ├── model/
│   │       ├── repository/
│   │       └── controller/
│   └── notificaciones-service/
│       └── src/main/java/com/antojapp/notificaciones/
│           ├── config/       # Plantillas iniciales
│           ├── controller/   # Endpoints de envío y plantillas
│           ├── dto/          # Request/response de la API
│           ├── exception/    # Errores uniformes
│           ├── model/        # Mensaje, plantilla y enums
│           ├── repository/
│           └── service/      # Interfaz NotificacionSender + correo + renderizado
├── frontend/
│   └── src/app/
│       ├── models/          # Interfaces TypeScript
│       ├── services/        # Llamadas HTTP
│       ├── app.component.ts # Lógica de interfaz
│       ├── app.component.html # Vistas
│       └── app.component.css # Estilos
├── database/crear_bases.sql
├── docker-compose.yml       # Proyecto completo en contenedores (dev)
└── docker-swarm.yml         # El mismo stack para Docker Swarm
```

## Próximos pasos
1. CRUD completo de restaurantes y productos con formularios Angular.
2. Separar componentes Angular: `navbar`, `catalogo`, `producto-card`, `carrito`, `pedidos`.
3. Conectar `pedidos-service` con `notificaciones-service` para avisar automáticamente en cada cambio de estado.
4. Servicio de pagos simulados.
5. API Gateway y comunicación backend-backend para validar productos, precios y stock.
6. Seguridad, RabbitMQ, pruebas automatizadas y despliegue.

**Nota:** el ejemplo usa imágenes representadas por emojis para funcionar sin descargar recursos externos; los campos `imagen` ya están preparados para añadir fotografías después.
