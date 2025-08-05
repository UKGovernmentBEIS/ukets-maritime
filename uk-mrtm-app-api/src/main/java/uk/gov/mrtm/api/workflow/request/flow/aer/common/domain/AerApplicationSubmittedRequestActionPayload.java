package uk.gov.mrtm.api.workflow.request.flow.aer.common.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerReportingObligationDetails;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.netz.api.workflow.request.core.domain.RequestActionPayload;

import java.time.Year;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AerApplicationSubmittedRequestActionPayload extends RequestActionPayload {

    private Boolean reportingRequired;

    private AerReportingObligationDetails reportingObligationDetails;

    private Aer aer;

    private Year reportingYear;

    private AerMonitoringPlanVersion aerMonitoringPlanVersion;

    private boolean verificationPerformed;

    private AerVerificationReport verificationReport;

    @Builder.Default
    private Map<UUID, String> aerAttachments = new HashMap<>();

    @Builder.Default
    private Map<UUID, String> verificationAttachments = new HashMap<>();

    @Override
    public Map<UUID, String> getAttachments() {
        return Stream.of(aerAttachments, verificationAttachments)
                .flatMap(map -> map.entrySet().stream())
                .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue));
    }
}
