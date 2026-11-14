#!/bin/bash

# Build script for AntojApp Configuration Server

echo "Building AntojApp Configuration Server..."

# Clean previous build
mvn clean

# Compile the project
mvn compile

# Run tests
mvn test

# Package the application
mvn package

echo "Build completed successfully!"