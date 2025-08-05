package uk.gov.mrtm.api.integration.registry.common;

import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import java.util.HashMap;
import java.util.Map;

@Data
@Configuration
@ConfigurationProperties(prefix = "maritime.registry.integration.error.handle")
public class RegistryIntegrationEmailProperties {

    @NotNull
    private Map<String, String> email = new HashMap<>();

    @NotNull
    private String fordway;
}
