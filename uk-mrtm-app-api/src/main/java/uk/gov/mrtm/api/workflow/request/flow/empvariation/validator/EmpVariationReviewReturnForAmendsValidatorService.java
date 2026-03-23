package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;
import uk.gov.netz.api.common.exception.BusinessException;

@Service
@RequiredArgsConstructor
public class EmpVariationReviewReturnForAmendsValidatorService {

    public void validate(final EmpVariationApplicationReviewRequestTaskPayload taskPayload) {

        // Validate if operator amends needed exist
        boolean amendExists = taskPayload.getReviewGroupDecisions().values().stream()
                .anyMatch(reviewDecision -> reviewDecision.getType() == EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED)
                || (taskPayload.getEmpVariationDetailsReviewDecision() != null
                && taskPayload.getEmpVariationDetailsReviewDecision().getType() == EmpVariationReviewDecisionType.OPERATOR_AMENDS_NEEDED);
        if (!amendExists) {
            throw new BusinessException(MrtmErrorCode.INVALID_EMP_VARIATION_REVIEW);
        }
    }
}
