package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import jakarta.validation.constraints.NotNull;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;

public interface EmpVariationReviewDeterminationTypeValidator {

    boolean isValid(EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload);

    @NotNull
    EmpVariationDeterminationType getType();
}
