package uk.gov.mrtm.api.web.orchestrator.uiconfiguration;

import lombok.Builder;
import lombok.Data;
import lombok.With;
import uk.gov.netz.api.alert.dto.NotificationAlertDTO;

import org.springframework.validation.annotation.Validated;

import java.util.List;
import java.util.Map;

@Validated
@Data
@Builder
public class UIPropertiesDTO {
    private Map<String, Boolean> features;
    private Map<String, String> analytics;
    private Map<String, String> properties;
    private String keycloakServerUrl;

    @With
    private List<NotificationAlertDTO> notificationAlerts;
}