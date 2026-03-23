package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.common.exception.BusinessException;

@Service
@RequiredArgsConstructor
public class EmpIssuanceReviewReturnForAmendsValidatorService {

	public void validate(final EmpIssuanceApplicationReviewRequestTaskPayload taskPayload) {

        // Validate if operator amends needed exist
        boolean amendExists = taskPayload.getReviewGroupDecisions().values().stream()
            .anyMatch(reviewDecision -> reviewDecision.getType() == EmpReviewDecisionType.OPERATOR_AMENDS_NEEDED);
        if (!amendExists) {
            throw new BusinessException(MrtmErrorCode.INVALID_EMP_REVIEW);
        }
    }
}
