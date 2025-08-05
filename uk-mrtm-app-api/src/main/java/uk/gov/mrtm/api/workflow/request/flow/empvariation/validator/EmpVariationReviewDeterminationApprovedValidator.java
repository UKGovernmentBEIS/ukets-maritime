package uk.gov.mrtm.api.workflow.request.flow.empvariation.validator;

import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;
import uk.gov.mrtm.api.workflow.request.flow.empissuance.common.domain.EmpReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationDeterminationType;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empvariation.domain.EmpVariationReviewDecisionType;

import java.util.Map;
import java.util.Set;
@Service
public class EmpVariationReviewDeterminationApprovedValidator
        implements EmpVariationReviewDeterminationTypeValidator {


    @Override
    public boolean isValid(EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload) {
        return containsDecisionForAllReviewGroups(requestTaskPayload) && isValidReviewGroupDecisionsTaken(requestTaskPayload);
    }

    @Override
    public EmpVariationDeterminationType getType() {
        return EmpVariationDeterminationType.APPROVED;
    }

    private boolean containsDecisionForAllReviewGroups(EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload) {
        Map<EmpReviewGroup, EmpVariationReviewDecision> reviewGroupDecisions = requestTaskPayload.getReviewGroupDecisions();

        Set<EmpReviewGroup> reviewGroups = EmpReviewGroup.getStandardReviewGroups();

        return CollectionUtils.isEqualCollection(reviewGroupDecisions.keySet(), reviewGroups) &&
                requestTaskPayload.getEmpVariationDetailsReviewDecision() != null;
    }

    private boolean isValidReviewGroupDecisionsTaken(EmpVariationApplicationReviewRequestTaskPayload requestTaskPayload) {
        return (requestTaskPayload.getReviewGroupDecisions().values().stream()
                .noneMatch(dec -> dec.getType() != EmpVariationReviewDecisionType.ACCEPTED) &&
                requestTaskPayload.getEmpVariationDetailsReviewDecision().getType() == EmpVariationReviewDecisionType.ACCEPTED);
    }
}
