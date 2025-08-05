package uk.gov.mrtm.api.workflow.request.flow.noncompliance.validation;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceCivilPenaltyRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceNoticeOfIntentRequestTaskPayload;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonCompliancePeerReviewValidatorTest {

    @InjectMocks
    private NonCompliancePeerReviewValidator validator;

    @Mock
    private RequestTaskTypeService requestTaskTypeService;

    @Mock
    private PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;

    @Test
    void validateInitialPenaltyNoticePeerReview() {
        AppUser appUser = mock(AppUser.class);
        RequestTaskType requestTaskType = mock(RequestTaskType.class);
        String selectedPeerReviewer = "selectedPeerReviewer";
        RequestTask requestTask = mock(RequestTask.class);
        NonComplianceInitialPenaltyNoticeRequestTaskPayload requestTaskPayload =
            mock(NonComplianceInitialPenaltyNoticeRequestTaskPayload.class);

        when(requestTaskTypeService.findByCode(MrtmRequestTaskType.NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_APPLICATION_PEER_REVIEW))
            .thenReturn(requestTaskType);

        validator.validateInitialPenaltyNoticePeerReview(requestTaskPayload, requestTask, selectedPeerReviewer, appUser);

        verify(requestTaskTypeService)
            .findByCode(MrtmRequestTaskType.NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_APPLICATION_PEER_REVIEW);
        verify(peerReviewerTaskAssignmentValidator).validate(requestTask, requestTaskType, selectedPeerReviewer, appUser);
        verifyNoMoreInteractions(requestTaskTypeService, peerReviewerTaskAssignmentValidator);
    }

    @Test
    void validateNoticeOfIntentPeerReview() {
        AppUser appUser = mock(AppUser.class);
        RequestTaskType requestTaskType = mock(RequestTaskType.class);
        String selectedPeerReviewer = "selectedPeerReviewer";
        RequestTask requestTask = mock(RequestTask.class);
        NonComplianceNoticeOfIntentRequestTaskPayload requestTaskPayload =
            mock(NonComplianceNoticeOfIntentRequestTaskPayload.class);

        when(requestTaskTypeService.findByCode(MrtmRequestTaskType.NON_COMPLIANCE_NOTICE_OF_INTENT_APPLICATION_PEER_REVIEW))
            .thenReturn(requestTaskType);

        validator.validateNoticeOfIntentPeerReview(requestTaskPayload, requestTask, selectedPeerReviewer, appUser);

        verify(requestTaskTypeService)
            .findByCode(MrtmRequestTaskType.NON_COMPLIANCE_NOTICE_OF_INTENT_APPLICATION_PEER_REVIEW);
        verify(peerReviewerTaskAssignmentValidator).validate(requestTask, requestTaskType, selectedPeerReviewer, appUser);
        verifyNoMoreInteractions(requestTaskTypeService, peerReviewerTaskAssignmentValidator);
    }

    @Test
    void validateCivilPenaltyPeerReview() {
        AppUser appUser = mock(AppUser.class);
        RequestTaskType requestTaskType = mock(RequestTaskType.class);
        String selectedPeerReviewer = "selectedPeerReviewer";
        RequestTask requestTask = mock(RequestTask.class);
        NonComplianceCivilPenaltyRequestTaskPayload requestTaskPayload =
            mock(NonComplianceCivilPenaltyRequestTaskPayload.class);

        when(requestTaskTypeService.findByCode(MrtmRequestTaskType.NON_COMPLIANCE_CIVIL_PENALTY_APPLICATION_PEER_REVIEW))
            .thenReturn(requestTaskType);

        validator.validateCivilPenaltyPeerReview(requestTaskPayload, requestTask, selectedPeerReviewer, appUser);

        verify(requestTaskTypeService)
            .findByCode(MrtmRequestTaskType.NON_COMPLIANCE_CIVIL_PENALTY_APPLICATION_PEER_REVIEW);
        verify(peerReviewerTaskAssignmentValidator).validate(requestTask, requestTaskType, selectedPeerReviewer, appUser);
        verifyNoMoreInteractions(requestTaskTypeService, peerReviewerTaskAssignmentValidator);
    }
}