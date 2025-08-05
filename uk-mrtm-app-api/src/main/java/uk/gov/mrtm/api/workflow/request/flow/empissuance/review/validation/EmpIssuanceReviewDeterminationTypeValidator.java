package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;

import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;

public interface EmpIssuanceReviewDeterminationTypeValidator {

    boolean isValid(EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload);

    EmpIssuanceDeterminationType getType();
}
