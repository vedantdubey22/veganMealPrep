# Use an official OpenJDK runtime as a parent image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the Maven wrapper and pom.xml
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (this step is cached unless pom.xml changes)
RUN ./mvnw dependency:go-offline

# Copy the rest of the backend source code
COPY . .

# Build the application
RUN ./mvnw package -DskipTests

# Expose the port your app runs on (default Spring Boot port)
EXPOSE 5000

# Run the jar file
CMD ["sh", "-c", "java -jar target/*.jar"] 