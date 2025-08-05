package uk.gov.mrtm.api.workflow.request.flow.aer.common.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.flow.common.domain.review.ReviewDecisionDetails;

@Data
@SuperBuilder
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class AerVerificationReportDataReviewDecision extends AerReviewDecision {

    @NotNull
    private AerVerificationReportDataReviewDecisionType type;

    @Valid
    private ReviewDecisionDetails details;
}
