package uk.gov.mrtm.api.workflow.request.flow.aer.review.domain;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import uk.gov.netz.api.common.validation.SpELExpression;

@Data
@EqualsAndHashCode
@Builder
@SpELExpression(expression = "{(#type eq 'OTHER') == (#reason != null)}", message = "aer.skip.review.reason")

public class AerSkipReviewDecision {

    @NotNull
    private AerSkipReviewActionType type;

    @Size(max = 10000)
    private String reason;
}
