package uk.gov.mrtm.api.workflow.request.flow.empnotification.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.util.ObjectUtils;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmissionsMonitoringPlanNotification {

    @Valid
    @NotNull
    private EmpNotificationDetailsOfChange detailsOfChange;

    @JsonIgnore
    public Set<UUID> getAttachmentIds() {
        Set<UUID> documents = new HashSet<>();
        if (detailsOfChange != null && !ObjectUtils.isEmpty(detailsOfChange.getDocuments())) {
            documents.addAll(detailsOfChange.getDocuments());
        }

        return Collections.unmodifiableSet(documents);
    }
}
