FROM eclipse-temurin:21-jre

RUN echo "ttf-mscorefonts-installer msttcorefonts/accepted-mscorefonts-eula select true" | debconf-set-selections \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        fontconfig \
        ttf-mscorefonts-installer \
    && rm -rf /var/lib/apt/lists/*

COPY src/main/resources/symbol.ttf /usr/share/fonts
RUN fc-cache -f -v

COPY target/uk-mrtm-app-api-env_version.jar /opt/applications/uk-mrtm-app-api/

RUN groupadd -g 499 mrtm && useradd -m -r -u 499 -g mrtm mrtm
USER mrtm
WORKDIR /opt/applications/uk-mrtm-app-api/

CMD ["/bin/bash", "-c", "sleep 15 && java -XX:+PrintFlagsFinal -Xmx2432m -Xms2432m -jar uk-mrtm-app-api-env_version.jar"]
