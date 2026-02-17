FROM eclipse-temurin:21-jre-jammy
WORKDIR /app
COPY target/uk-mrtm-app-data-provider-emulator-1.0.0.jar uk-mrtm-app-data-provider-emulator-1.0.0.jar
EXPOSE 9109
ENTRYPOINT ["java", "-jar", "uk-mrtm-app-data-provider-emulator-1.0.0.jar"]