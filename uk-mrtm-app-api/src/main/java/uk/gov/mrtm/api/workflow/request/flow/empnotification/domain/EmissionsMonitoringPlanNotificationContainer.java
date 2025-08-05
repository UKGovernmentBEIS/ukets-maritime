package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EmissionsMonitoringPlanNotificationContainer {

    @Valid
    @NotNull
    private EmissionsMonitoringPlanNotification emissionsMonitoringPlanNotification;

    @Builder.Default
    private Map<UUID, String> empNotificationAttachments = new HashMap<>();
}
