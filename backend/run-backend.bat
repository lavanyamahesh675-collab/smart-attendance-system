@echo off
echo Starting BioAttend Spring Boot Backend...
cd /d "%~dp0"
mvn spring-boot:run || (
    echo.
    echo [ERROR] Maven not found in PATH. Please run using Maven or IDE (Eclipse/IntelliJ/VSCode).
    echo Executing with javac/java fallback if available...
    pause
)
