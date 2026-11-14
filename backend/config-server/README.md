# AntojApp Configuration Server

This is the Spring Cloud Config Server for the AntojApp project, which manages configuration properties for all microservices in the system.

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

## Configuration Files

The configuration is organized in the `services` directory with separate properties files for each service:

1. **antojapp-restaurants-service.properties** - Configuration for the restaurants service including database and email settings (non-sensitive)
2. **antojapp-pedidos-service.properties** - Configuration for the orders service including database and email settings (non-sensitive)

## Features

- Properties-based configuration using `.properties` format
- Centralized configuration management for microservices
- Template codes for email notifications
- Database configurations for both services (non-sensitive parts)
- Email server configurations (non-sensitive parts)
- Management endpoints enabled
- Separated configuration files per service

## Security Notice

This configuration server only stores non-sensitive configuration data. Sensitive information such as passwords and API keys should be managed through secure secret management systems, not stored in this repository.

## Running the Server

To run the configuration server, you need to have Maven installed:

1. Navigate to the config-server directory:
```bash
cd backend/config-server
```

2. Compile and run using Maven:
```bash
mvn spring-boot:run
```

The server will start on port 8888.

## Accessing Configuration

Configuration can be accessed using the following endpoints:
- `http://localhost:8888/antojapp-restaurants-service/default` - Restaurant service configuration
- `http://localhost:8888/antojapp-pedidos-service/default` - Order service configuration

For more information, see the SETUP_INSTRUCTIONS.md file.