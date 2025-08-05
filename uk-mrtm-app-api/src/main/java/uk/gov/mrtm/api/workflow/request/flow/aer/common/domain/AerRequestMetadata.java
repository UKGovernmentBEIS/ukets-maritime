package uk.gov.mrtm.api.workflow.request.flow.aer.common.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.mrtm.api.reporting.domain.AerTotalReportableEmissions;
import uk.gov.mrtm.api.reporting.domain.verification.AerVerificationDecisionType;
import uk.gov.netz.api.workflow.request.core.domain.RequestMetadata;
import uk.gov.netz.api.workflow.request.core.domain.RequestMetadataReportable;

import java.time.Year;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class AerRequestMetadata extends RequestMetadata implements RequestMetadataReportable {

    @NotNull
    @PastOrPresent
    private Year year;

    @NotNull
    @Valid
    private AerTotalReportableEmissions emissions;

    private boolean isExempted;

    @NotNull
    private AerInitiatorRequest initiatorRequest;

    private AerVerificationDecisionType overallAssessmentType;
}
