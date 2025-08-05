package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@SuperBuilder
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
public class EmpNotificationApplicationSubmitRequestTaskPayload extends RequestTaskPayload {

    @Valid
    @NotNull
    private EmissionsMonitoringPlanNotification emissionsMonitoringPlanNotification;

    @Builder.Default
    private Map<UUID, String> empNotificationAttachments = new HashMap<>();

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();

    @Override
    public Map<UUID, String> getAttachments() {
        return this.getEmpNotificationAttachments();
    }

    @Override
    public Set<UUID> getReferencedAttachmentIds() {
        return this.getEmissionsMonitoringPlanNotification() != null ?
                this.getEmissionsMonitoringPlanNotification().getAttachmentIds() :
                Collections.emptySet();
    }
}
