package uk.gov.mrtm.api.workflow.request.flow.empvariation.domain;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.SuperBuilder;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskActionPayload;

@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class EmpVariationSaveDetailsReviewGroupDecisionRequestTaskActionPayload extends RequestTaskActionPayload {

    private String empVariationDetailsCompleted;

    private String empVariationDetailsReviewCompleted;

    @NotNull
    @Valid
    private EmpVariationReviewDecision decision;
}
