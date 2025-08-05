package uk.gov.mrtm.api.common.config;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

@Validated
@ConfigurationProperties(prefix = "registry-administrator")
@Data
public class RegistryConfig {

    @NotBlank
    private String email;
}
