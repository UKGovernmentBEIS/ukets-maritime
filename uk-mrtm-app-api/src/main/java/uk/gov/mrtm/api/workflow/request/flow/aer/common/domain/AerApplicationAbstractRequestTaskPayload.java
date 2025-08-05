package uk.gov.mrtm.api.workflow.request.flow.aer.common.domain;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.apache.commons.lang3.ObjectUtils;
import uk.gov.mrtm.api.reporting.domain.AerReportingObligationDetails;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;

import java.time.Year;
import java.util.Collections;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class AerApplicationAbstractRequestTaskPayload extends RequestTaskPayload {

    @Schema(type = "string")
    private Year reportingYear;

    private Boolean reportingRequired;

    private AerReportingObligationDetails reportingObligationDetails;

    private AerMonitoringPlanVersion aerMonitoringPlanVersion;

    @Builder.Default
    private Map<String, String> aerSectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<String, String> verificationSectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<UUID, String> aerAttachments = new HashMap<>();

    @Override
    public Set<UUID> getReferencedAttachmentIds() {
        final Set<UUID> attachments = new HashSet<>();
        if (reportingObligationDetails != null && !ObjectUtils.isEmpty(reportingObligationDetails.getSupportingDocuments())) {
            attachments.addAll(reportingObligationDetails.getSupportingDocuments());
        }
        return Collections.unmodifiableSet(attachments);
    }
}
