package uk.gov.mrtm.api.emissionsmonitoringplan.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmissionsMonitoringPlanContainer {

    @Valid
    @NotNull
    private EmissionsMonitoringPlan emissionsMonitoringPlan;

    @Builder.Default
    private Map<UUID, String> empAttachments = new HashMap<>();
}
