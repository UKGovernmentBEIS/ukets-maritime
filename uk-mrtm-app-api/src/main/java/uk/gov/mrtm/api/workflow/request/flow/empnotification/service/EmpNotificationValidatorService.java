package uk.gov.mrtm.api.workflow.request.flow.empnotification.service;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationFollowUpReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.common.exception.BusinessException;
import uk.gov.netz.api.common.exception.ErrorCode;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.validation.DecisionNotificationUsersValidator;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

@Service
@Validated
@RequiredArgsConstructor
public class EmpNotificationValidatorService {

    private final DecisionNotificationUsersValidator decisionNotificationUsersValidator;
    private final PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;
    private final RequestTaskTypeService requestTaskTypeService;

    public void validateNotificationReviewDecision(@NotNull @Valid final EmpNotificationReviewDecision reviewDecision) {
        // Validate
    }

    public void validateNotifyUsers(final RequestTask requestTask,
                                    final DecisionNotification decisionNotification,
                                    final AppUser appUser) {
        if (!decisionNotificationUsersValidator.areUsersValid(requestTask, decisionNotification, appUser)) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }
    }

    public void validateFollowUpResponse(@NotNull @Valid @SuppressWarnings("unused")
                                         final EmpNotificationFollowUpRequestTaskPayload taskPayload) {
        // default validation
    }

    public void validatePeerReviewer(RequestTask requestTask, final String peerReviewer, final AppUser appUser) {
        peerReviewerTaskAssignmentValidator.validate(requestTask,
            requestTaskTypeService.findByCode(MrtmRequestTaskType.EMP_NOTIFICATION_APPLICATION_PEER_REVIEW),
            peerReviewer,
            appUser);
    }

    public void validateNotificationFollowUpReviewDecision(@NotNull @Valid
                                                           final EmpNotificationFollowUpReviewDecision reviewDecision) {
        if (reviewDecision.getType() != EmpNotificationFollowUpReviewDecisionType.ACCEPTED) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }
    }

    public void validateReturnForAmends(@NotNull @Valid final EmpNotificationFollowUpReviewDecision reviewDecision) {
        if (reviewDecision.getType() != EmpNotificationFollowUpReviewDecisionType.AMENDS_NEEDED) {
            throw new BusinessException(ErrorCode.FORM_VALIDATION);
        }
    }
}
