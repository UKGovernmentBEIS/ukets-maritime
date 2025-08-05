package uk.gov.mrtm.api.workflow.request.flow.empissuance.review.validation;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpIssuanceReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.review.domain.EmpIssuanceApplicationReviewRequestTaskPayload;

import java.util.Map;
import java.util.Set;

@Service
public class EmpIssuanceReviewDeterminationApprovedValidator
        implements EmpIssuanceReviewDeterminationTypeValidator {
    @Override
    public boolean isValid(EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload) {
        return containsDecisionForAllReviewGroups(requestTaskPayload) && isValidReviewGroupDecisionsTaken(requestTaskPayload);
    }

    private boolean containsDecisionForAllReviewGroups(EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload) {
        Map<EmpReviewGroup, EmpIssuanceReviewDecision> reviewGroupDecisions = requestTaskPayload.getReviewGroupDecisions();

        Set<EmpReviewGroup> reviewGroups = EmpReviewGroup.getStandardReviewGroups();

        return CollectionUtils.isEqualCollection(reviewGroupDecisions.keySet(), reviewGroups);
    }

    private boolean isValidReviewGroupDecisionsTaken(EmpIssuanceApplicationReviewRequestTaskPayload requestTaskPayload) {
        return requestTaskPayload.getReviewGroupDecisions().values().stream()
                .noneMatch(dec -> dec.getType() != EmpReviewDecisionType.ACCEPTED);
    }

    @Override
    public EmpIssuanceDeterminationType getType() {
        return EmpIssuanceDeterminationType.APPROVED;
    }
}
