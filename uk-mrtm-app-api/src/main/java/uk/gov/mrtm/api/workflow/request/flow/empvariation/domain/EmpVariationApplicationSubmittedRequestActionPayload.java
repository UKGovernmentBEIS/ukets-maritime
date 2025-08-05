package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.netz.api.workflow.request.core.domain.RequestActionPayload;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpVariationApplicationSubmittedRequestActionPayload extends RequestActionPayload {

    @Valid
    @NotNull
    private EmissionsMonitoringPlan emissionsMonitoringPlan;

    @Valid
    @NotNull
    private EmpVariationDetails empVariationDetails;

    @Builder.Default
    private Map<String, String> empSectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<UUID, String> empAttachments = new HashMap<>();

    @Override
    public Map<UUID, String> getAttachments() {
        return this.getEmpAttachments();
    }
}
