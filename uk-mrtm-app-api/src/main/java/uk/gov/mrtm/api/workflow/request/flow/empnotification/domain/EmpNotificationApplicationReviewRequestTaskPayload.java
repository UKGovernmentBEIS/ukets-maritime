package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.apache.commons.collections.CollectionUtils;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.flow.rfi.domain.RequestTaskPayloadRfiAttachable;

import java.util.Collection;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpNotificationApplicationReviewRequestTaskPayload extends RequestTaskPayload implements RequestTaskPayloadRfiAttachable {

    @NotNull
    private EmissionsMonitoringPlanNotification emissionsMonitoringPlanNotification;

    @Builder.Default
    private Map<UUID, String> empNotificationAttachments = new HashMap<>();

    @NotNull
    private EmpNotificationReviewDecision reviewDecision;

    @Builder.Default
    private Map<UUID, String> rfiAttachments = new HashMap<>();

    @Builder.Default
    private Map<String, String> sectionsCompleted = new HashMap<>();

    @Override
    public Map<UUID, String> getAttachments() {
        return Stream.of(this.getEmpNotificationAttachments(), getRfiAttachments())
                .flatMap(map -> map.entrySet().stream())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }

    @Override
    public Set<UUID> getReferencedAttachmentIds() {
        return this.getEmissionsMonitoringPlanNotification() != null ?
                this.getEmissionsMonitoringPlanNotification().getAttachmentIds() :
                Collections.emptySet();
    }

    @Override
    public void removeAttachments(final Collection<UUID> uuids) {
        if (CollectionUtils.isEmpty(uuids)) {
            return;
        }
        super.removeAttachments(uuids);
        getRfiAttachments().keySet().removeIf(uuids::contains);
    }
}
