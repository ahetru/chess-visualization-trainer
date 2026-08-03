# Build stage
FROM maven:3.9-eclipse-temurin-21 AS build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

# Run stage — JRE (not JDK): the jar is already compiled, we don't need
# javac. The JRE image is less than half the size.
FROM eclipse-temurin:21-jre

RUN groupadd --system app && \
    useradd --system --gid app --create-home app && \
    apt-get update && \
    apt-get install -y --no-install-recommends curl && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

# Run as a non-privileged user.  If the application is ever compromised,
# the attacker cannot escalate to root inside the container.
USER app

ENTRYPOINT ["java", "-jar", "app.jar"]