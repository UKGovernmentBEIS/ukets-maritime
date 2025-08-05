package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;

@Service
public class EmpVariationReviewDeterminationDeemedWithdrawnValidator implements EmpVariationReviewDeterminationTypeValidator {

    @Override
    public boolean isValid(EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload) {
        return true;
    }

    @Override
    public EmpVariationDeterminationType getType() {
        return EmpVariationDeterminationType.DEEMED_WITHDRAWN;
    }
}
