# Dockerfile for BioAttend Full-Stack Application

# Stage 1: Build Frontend React App
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Build Backend Spring Boot Jar
FROM maven:3.9-eclipse-temurin-17 AS backend-builder
WORKDIR /app/backend
COPY backend/pom.xml ./
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Stage 3: Final Production Runtime
FROM eclipse-temurin:17-jre-alpine
WORKDIR /app

# Copy built Spring Boot jar
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# Copy built React dist to static location if serving unified, or run on 8080
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
