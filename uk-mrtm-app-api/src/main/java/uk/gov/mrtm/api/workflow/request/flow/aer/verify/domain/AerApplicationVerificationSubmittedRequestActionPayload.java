package uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationSubmittedRequestActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AerApplicationVerificationSubmittedRequestActionPayload extends
        AerApplicationSubmittedRequestActionPayload {

    private AerTotalReportableEmissions totalEmissions;

    private String notCoveredChangesProvided;
}
