package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;


import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;

@Service
public class EmpIssuanceReviewDeterminationDeemedWithdrawnValidator
        implements EmpIssuanceReviewDeterminationTypeValidator {

    @Override
    public boolean isValid(EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload) {
        return true;
    }

    @Override
    public EmpIssuanceDeterminationType getType() {
        return EmpIssuanceDeterminationType.DEEMED_WITHDRAWN;
    }
}
