package uk.gov.mrtm.api.workflow.request.flow.aer.common.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.Aer;
import uk.gov.mrtm.api.reporting.domain.AerReportingObligationDetails;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationData;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerSkipReviewDecision;
import uk.gov.netz.api.workflow.request.core.domain.RequestPayload;

import java.util.EnumMap;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AerRequestPayload extends RequestPayload {

    private Boolean reportingRequired;

    private boolean virTriggered;

    private AerReportingObligationDetails reportingObligationDetails;

    private boolean verificationPerformed;

    private AerMonitoringPlanVersion aerMonitoringPlanVersion;

    @Builder.Default
    private Map<String, String> aerReviewSectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<String, String> verificationSectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<String, String> aerSubmitSectionsCompleted = new HashMap<>();

    @Builder.Default
    private Map<UUID, String> aerAttachments = new HashMap<>();

    @Builder.Default
    private Map<UUID, String> reviewAttachments = new HashMap<>();

    private Aer aer;

    private AerVerificationReport verificationReport;

    //Represents the total emissions for scheme year when the operator sent the application to verifier.
    //Needed in order to initialize review task payload with proper data
    private AerTotalReportableEmissions totalEmissions;

    //Represents the changes provided in the Monitoring Plan Info section (if any) when the operator sent the application to verifier.
    //Needed in order to initialize review task payload with proper data
    private String notCoveredChangesProvided;

    @Builder.Default
    private Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = new EnumMap<>(AerReviewGroup.class);

    private EmpOriginatedData empOriginatedData;

    private AerSkipReviewDecision aerSkipReviewDecision;

    public void clearReinitiationObsoleteData() {
        this.reviewGroupDecisions.clear();
        this.reviewAttachments.clear();
        this.aerReviewSectionsCompleted.clear();
        this.verificationPerformed = false;
    }

    @JsonIgnore
    public AerVerificationData getVerificationData() {
        return verificationReport == null ? null : verificationReport.getVerificationData();
    }
}
