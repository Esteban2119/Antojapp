# Setup Instructions for AntojApp Configuration Server

## Prerequisites

- Java 17 or higher
- Maven 3.6 or higher
- Spring Boot 3.2.0
- Spring Cloud 2023.0.0

## Project Structure

```
backend/config-server/
├── pom.xml
├── src/
│   └── main/
│       ├── java/
│       │   └── com/antojapp/configserver/
│       │       └── ConfigServerApplication.java
│       └── resources/
│           ├── application.properties
│           └── services/
│               ├── antojapp-restaurants-service.properties
│               └── antojapp-pedidos-service.properties
├── README.md
└── SETUP_INSTRUCTIONS.md
```

## Configuration Details

### Main Application Properties (`application.properties`)

- Server port: 8888
- Uses native filesystem instead of Git for local development
- Management endpoints enabled
- Logging configuration

### Service Configurations

#### Restaurant Service Configuration (`antojapp-restaurants-service.properties`)

Non-sensitive database settings:
- URL: `jdbc:postgresql://localhost:5432/antoj_restaurantes`
- Driver: `org.postgresql.Driver`

Non-sensitive email settings:
- Host: `smtp.gmail.com`
- Port: `587`
- SMTP auth enabled
- STARTTLS enabled

Template codes for email notifications:
- RESTAURANT_CREATED
- RESTAURANT_UPDATED
- RESTAURANT_DELETED

#### Order Service Configuration (`antojapp-pedidos-service.properties`)

Non-sensitive database settings:
- URL: `jdbc:postgresql://localhost:5432/antoj_pedidos`
- Driver: `org.postgresql.Driver`

Non-sensitive email settings:
- Host: `smtp.gmail.com`
- Port: `587`
- SMTP auth enabled
- STARTTLS enabled

Template codes for email notifications:
- ORDER_CREATED
- ORDER_UPDATED
- ORDER_CANCELLED

## Security Notice

This configuration server only stores non-sensitive configuration data. Sensitive information such as passwords and API keys should be managed through secure secret management systems, not stored in this repository.

## Building the Project

### Using Maven

```bash
cd backend/config-server
mvn clean install
```

## Running the Server

To run the configuration server:

```bash
cd backend/config-server
mvn spring-boot:run
```

The server will start on port 8888.

## Accessing Configuration

Configuration can be accessed using the following endpoints:
- `http://localhost:8888/antojapp-restaurants-service/default` - Restaurant service configuration
- `http://localhost:8888/antojapp-pedidos-service/default` - Order service configuration

## Testing Configuration

Once the server is running, you can test it by accessing the configuration endpoints in a browser or using curl:

```bash
curl http://localhost:8888/antojapp-restaurants-service/default
curl http://localhost:8888/antojapp-pedidos-service/default
```