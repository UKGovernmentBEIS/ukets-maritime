package uk.gov.mrtm.api.workflow.request.flow.noncompliance.validation;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentRequestTaskPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

@Service
@Validated
@RequiredArgsConstructor
public class NonCompliancePeerReviewValidator {

    private final PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;
    private final RequestTaskTypeService requestTaskTypeService;

    public void validateInitialPenaltyNoticePeerReview(
        @Valid @SuppressWarnings("unused") final NonComplianceInitialPenaltyNoticeRequestTaskPayload requestTaskPayload,
        RequestTask requestTask, String selectedPeerReviewer, AppUser appUser
    ) {
        peerReviewerTaskAssignmentValidator.validate(
            requestTask,
            requestTaskTypeService.findByCode(MrtmRequestTaskType.NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_APPLICATION_PEER_REVIEW),
            selectedPeerReviewer,
            appUser);
    }

    public void validateNoticeOfIntentPeerReview(
        @Valid @SuppressWarnings("unused") final NonComplianceNoticeOfIntentRequestTaskPayload requestTaskPayload,
        RequestTask requestTask, String selectedPeerReviewer, AppUser appUser
    ) {
        peerReviewerTaskAssignmentValidator.validate(
            requestTask,
            requestTaskTypeService.findByCode(MrtmRequestTaskType.NON_COMPLIANCE_NOTICE_OF_INTENT_APPLICATION_PEER_REVIEW),
            selectedPeerReviewer,
            appUser);
    }

    public void validateCivilPenaltyPeerReview(
        @Valid @SuppressWarnings("unused") final NonComplianceCivilPenaltyRequestTaskPayload requestTaskPayload,
        RequestTask requestTask, String selectedPeerReviewer, AppUser appUser
    ) {
        peerReviewerTaskAssignmentValidator.validate(
            requestTask,
            requestTaskTypeService.findByCode(MrtmRequestTaskType.NON_COMPLIANCE_CIVIL_PENALTY_APPLICATION_PEER_REVIEW),
            selectedPeerReviewer,
            appUser);
    }
}
