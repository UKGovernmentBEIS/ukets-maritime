package uk.gov.mrtm.api.common.config;

import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.servers.Server;
import org.springdoc.core.models.GroupedOpenApi;
import org.springframework.boot.info.BuildProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class MrtmSwaggerConfig {
    private final BuildProperties buildProperties;
    private static final String EXTERNAL_API_VERSION = "3.0.0";

    public MrtmSwaggerConfig(BuildProperties buildProperties) {
        this.buildProperties = buildProperties;
    }

    @Bean
    public GroupedOpenApi internalApi() {
        return GroupedOpenApi.builder()
            .group("Internal API")
            .pathsToExclude("/external/**")
            .addOpenApiCustomizer(openApi -> openApi.info(new Info()
                    .title("API Documentation")
                    .version(buildProperties.getVersion())
                    .description("Endpoints intended for internal systems and teams")))
            .build();
    }

    /**
     * To successfully generate the external API without the custom converters, the static
     * block of the NETZ SwaggerConfig must be commented out. This is to prevent any custom conversions
     * (e.g., Big decimal conversion to String instead of number) that are useful for the internal API,
     * but not needed in case of external.
     */
    @Bean
    public GroupedOpenApi externalApi() {
        Server prodServer = new Server()
            .url("https://manage-emissions-reporting.service.gov.uk/maritime/api")
            .description("Production environment");
        Server uatServer = new Server()
                .url("https://qa1.manage-emissions-reporting.service.gov.uk/maritime/api")
                .description("UAT environment");

        return GroupedOpenApi.builder()
            .group("External API")
            .pathsToMatch("/external/**")
            .addOpenApiCustomizer(openApi -> openApi.getComponents().getSchemas().entrySet().removeIf(entry ->
                !entry.getKey().startsWith("External")
                    && !entry.getKey().equals("Violation")
                    && !entry.getKey().equals("AerSiteVisitType")
                    && !entry.getKey().equals("AerVerificationDecisionType")
                    && !entry.getKey().equals("AerNotVerifiedDecisionReasonType")
                    && !entry.getKey().equals("AerAccreditationReferenceDocumentType")
                    && !entry.getKey().equals("EmpMonitoringReportingRole")))
            .addOpenApiCustomizer(openApi -> openApi.setServers(List.of(prodServer, uatServer)))
            .addOpenApiCustomizer(openApi -> openApi.info(new Info()
                .title("Maritime External API")
                .version(EXTERNAL_API_VERSION)
                .description("Maritime External API Specification")))
            .build();
    }
}