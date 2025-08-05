package uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.emissionsmonitoringplan.domain.EmissionsMonitoringPlan;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class EmpIssuanceApplicationRequestTaskPayload extends RequestTaskPayload {

    private EmissionsMonitoringPlan emissionsMonitoringPlan;

    @Builder.Default
    private Map<String, String> empSectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<UUID, String> empAttachments = new HashMap<>();

    @JsonIgnore
    @Override
    public Map<UUID, String> getAttachments() {
        return this.getEmpAttachments();
    }

    @Override
    public Set<UUID> getReferencedAttachmentIds() {
        return getEmissionsMonitoringPlan() != null ?
                getEmissionsMonitoringPlan().getEmpSectionAttachmentIds() :
                Collections.emptySet();
    }
}
