package uk.gov.mrtm.api.workflow.request.flow.aer.review.validation;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.common.exception.MrtmErrorCode;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerDataReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDataType;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.aer.common.domain.AerReviewGroup;
import uk.gov.mrtm.api.workflow.request.flow.aer.review.domain.AerApplicationReviewRequestTaskPayload;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;

import java.util.HashSet;
import java.util.Map;
import java.util.Set;

@Service
@Validated
public class RequestAerReviewValidatorService {

    public void validateAllReviewGroupsExistAndAccepted(AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload, boolean isVerificationPerformed) {
        Map<AerReviewGroup, AerReviewDecision> reviewGroupDecisions = reviewRequestTaskPayload.getReviewGroupDecisions();
        Boolean reportingRequired = reviewRequestTaskPayload.getReportingRequired();
        boolean hasPorts = reviewRequestTaskPayload.getAer() != null
            && reviewRequestTaskPayload.getAer().getPortEmissions() != null
            && !reviewRequestTaskPayload.getAer().getPortEmissions().getPorts().isEmpty();
        boolean hasVoyages = reviewRequestTaskPayload.getAer() != null
            && reviewRequestTaskPayload.getAer().getVoyageEmissions() != null
            && !reviewRequestTaskPayload.getAer().getVoyageEmissions().getVoyages().isEmpty();

        //validate all groups have decisions which are accepted
        //(no need to check accepted decision for verification report review groups accepted is the only  option for these)
        if (!existDecisionForAllReviewGroups(reviewGroupDecisions, reportingRequired, isVerificationPerformed, hasPorts, hasVoyages) ||
                !areAllAerReviewGroupsAccepted(reviewGroupDecisions)) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }
    }

    public void validateAtLeastOneReviewGroupAmendsNeeded(AerApplicationReviewRequestTaskPayload reviewRequestTaskPayload) {
        boolean amendExists = reviewRequestTaskPayload.getReviewGroupDecisions().values().stream()
            .filter(reviewDecision -> reviewDecision.getReviewDataType().equals(AerReviewDataType.AER_DATA))
            .map(AerDataReviewDecision.class::cast)
            .anyMatch(reviewDecision -> reviewDecision.getType() == AerDataReviewDecisionType.OPERATOR_AMENDS_NEEDED);

        if (!amendExists) {
            throw new BusinessException(MrtmErrorCode.INVALID_AER_REVIEW);
        }
    }

    private boolean existDecisionForAllReviewGroups(@NotEmpty Map<AerReviewGroup, @Valid AerReviewDecision> reviewGroupDecisions,
                                                    boolean isReportingRequired,
                                                    boolean isVerificationPerformed, boolean hasPorts, boolean hasVoyages) {
        Set<AerReviewGroup> aerReviewGroups = new HashSet<>(AerReviewGroup
            .getAerDataReviewGroups(isReportingRequired, hasPorts, hasVoyages));

        if (isVerificationPerformed) {
            aerReviewGroups.addAll(AerReviewGroup.getVerificationReportDataReviewGroups());
        }

        return CollectionUtils.isEqualCollection(reviewGroupDecisions.keySet(), aerReviewGroups);
    }

    private boolean areAllAerReviewGroupsAccepted(@NotEmpty Map<AerReviewGroup, @Valid AerReviewDecision> reviewGroupDecisions) {
        return reviewGroupDecisions.values().stream()
                .filter(aerReviewDecision -> aerReviewDecision.getReviewDataType().equals(AerReviewDataType.AER_DATA))
                .map(AerDataReviewDecision.class::cast)
                .allMatch(aerDataReviewDecision -> aerDataReviewDecision.getType().equals(AerDataReviewDecisionType.ACCEPTED));
    }
}
