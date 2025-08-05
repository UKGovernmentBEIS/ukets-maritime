package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskType;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.validation.DecisionNotificationUsersValidator;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

import java.time.LocalDate;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationValidatorServiceTest {

    @InjectMocks
    private EmpNotificationValidatorService validator;

    @Mock
    private DecisionNotificationUsersValidator decisionNotificationUsersValidator;

    @Mock
    private PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;

    @Mock
    private RequestTaskTypeService requestTaskTypeService;

    @Test
    void validateNotificationReviewDecision_accepted_valid() {
        EmpNotificationReviewDecision reviewDecision = EmpNotificationReviewDecision
            .builder()
            .type(EmpNotificationReviewDecisionType.ACCEPTED)
            .details(EmpNotificationAcceptedDecisionDetails.builder()
                .officialNotice("test")
                .followUp(FollowUp
                    .builder()
                    .followUpResponseRequired(true)
                    .followUpRequest("followUpRequest")
                    .followUpResponseExpirationDate(LocalDate.now())
                    .build())
                .build()
            )
            .build();

        // Invoke
        validator.validateNotificationReviewDecision(reviewDecision);

        // Verify
        verifyNoMoreInteractions(decisionNotificationUsersValidator);
        verifyNoInteractions(decisionNotificationUsersValidator, peerReviewerTaskAssignmentValidator);
    }

    @Test
    void validateNotificationReviewDecision_rejected_valid() {
        EmpNotificationReviewDecision reviewDecision = EmpNotificationReviewDecision
            .builder()
            .type(EmpNotificationReviewDecisionType.REJECTED)
            .details(EmpNotificationReviewDecisionDetails.builder()
                .officialNotice("test")
                .build()
            )
            .build();

        // Invoke
        validator.validateNotificationReviewDecision(reviewDecision);

        // Verify
        verifyNoMoreInteractions(decisionNotificationUsersValidator);
        verifyNoInteractions(decisionNotificationUsersValidator, peerReviewerTaskAssignmentValidator);
    }

    @Test
    void validateNotifyUsers() {
        final RequestTask requestTask = RequestTask.builder().build();
        final DecisionNotification decisionNotification = DecisionNotification.builder().build();
        final AppUser appUser = AppUser.builder().build();

        when(decisionNotificationUsersValidator.areUsersValid(requestTask, decisionNotification, appUser)).thenReturn(true);

        // Invoke
        validator.validateNotifyUsers(requestTask, decisionNotification, appUser);

        // Verify
        verify(decisionNotificationUsersValidator).areUsersValid(requestTask, decisionNotification, appUser);
        verifyNoMoreInteractions(decisionNotificationUsersValidator);
        verifyNoInteractions(peerReviewerTaskAssignmentValidator);
    }

    @Test
    void validateNotifyUsers_not_valid() {
        final RequestTask requestTask = RequestTask.builder().build();
        final DecisionNotification decisionNotification = DecisionNotification.builder().build();
        final AppUser appUser = AppUser.builder().build();

        when(decisionNotificationUsersValidator.areUsersValid(requestTask, decisionNotification, appUser)).thenReturn(false);

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
                () -> validator.validateNotifyUsers(requestTask, decisionNotification, appUser));

        // Verify
        assertEquals(ErrorCode.FORM_VALIDATION, businessException.getErrorCode());
        verify(decisionNotificationUsersValidator).areUsersValid(requestTask, decisionNotification, appUser);
        verifyNoMoreInteractions(decisionNotificationUsersValidator);
        verifyNoInteractions(peerReviewerTaskAssignmentValidator);
    }

    @Test
    void validatePeerReviewer() {
        final RequestTask requestTask = RequestTask.builder().build();
        final String peerReviewer = UUID.randomUUID().toString();
        final AppUser appUser = AppUser.builder().build();
        final RequestTaskType requestTaskType = mock(RequestTaskType.class);

        when(requestTaskTypeService.findByCode(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_PEER_REVIEW))
            .thenReturn(requestTaskType);

        // Invoke
        validator.validatePeerReviewer(requestTask, peerReviewer, appUser);

        // Verify
        verify(peerReviewerTaskAssignmentValidator).validate(requestTask, requestTaskType, peerReviewer, appUser);
        verifyNoMoreInteractions(peerReviewerTaskAssignmentValidator, requestTaskTypeService);
        verifyNoInteractions(decisionNotificationUsersValidator);
    }

    @Test
    void validateNotificationFollowUpReviewDecision_valid() {
        EmpNotificationFollowUpReviewDecision reviewDecision = EmpNotificationFollowUpReviewDecision
                .builder()
                .type(EmpNotificationFollowUpReviewDecisionType.ACCEPTED)
                .build();

        // Invoke
        validator.validateNotificationFollowUpReviewDecision(reviewDecision);

        // Verify
        verifyNoInteractions(requestTaskTypeService, decisionNotificationUsersValidator,
            peerReviewerTaskAssignmentValidator);
    }

    @Test
    void validateNotificationFollowUpReviewDecision_invalid() {
        EmpNotificationFollowUpReviewDecision reviewDecision = EmpNotificationFollowUpReviewDecision
            .builder()
            .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
            .build();

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
            () -> validator.validateNotificationFollowUpReviewDecision(reviewDecision));

        // Verify
        assertEquals(ErrorCode.FORM_VALIDATION, businessException.getErrorCode());
        // Verify
        verifyNoInteractions(requestTaskTypeService, decisionNotificationUsersValidator,
            peerReviewerTaskAssignmentValidator);
    }

    @Test
    void validateReturnForAmends_valid() {
        EmpNotificationFollowUpReviewDecision reviewDecision = EmpNotificationFollowUpReviewDecision
            .builder()
            .type(EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED)
            .build();

        // Invoke
        validator.validateReturnForAmends(reviewDecision);

        // Verify
        verifyNoInteractions(requestTaskTypeService, decisionNotificationUsersValidator,
            peerReviewerTaskAssignmentValidator);
    }

    @Test
    void validateReturnForAmends_invalid() {
        EmpNotificationFollowUpReviewDecision reviewDecision = EmpNotificationFollowUpReviewDecision
            .builder()
            .type(EmpNotificationFollowUpReviewDecisionType.ACCEPTED)
            .build();

        // Invoke
        BusinessException businessException = assertThrows(BusinessException.class,
            () -> validator.validateReturnForAmends(reviewDecision));

        // Verify
        assertEquals(ErrorCode.FORM_VALIDATION, businessException.getErrorCode());
        // Verify
        verifyNoInteractions(requestTaskTypeService, decisionNotificationUsersValidator,
            peerReviewerTaskAssignmentValidator);
    }
}
