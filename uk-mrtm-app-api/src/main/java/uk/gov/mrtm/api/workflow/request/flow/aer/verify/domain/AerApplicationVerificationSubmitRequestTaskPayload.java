package uk.gov.mrtm.api.workflow.request.flow.aer.verify.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationReport;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerApplicationRequestTaskPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class AerApplicationVerificationSubmitRequestTaskPayload extends AerApplicationRequestTaskPayload {

    private AerVerificationReport verificationReport;

    private AerTotalReportableEmissions totalEmissions;

    private String notCoveredChangesProvided;
}
