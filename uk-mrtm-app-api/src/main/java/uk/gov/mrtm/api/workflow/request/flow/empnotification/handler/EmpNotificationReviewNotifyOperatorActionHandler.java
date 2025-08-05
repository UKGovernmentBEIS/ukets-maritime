package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDeterminationType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationValidatorService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.NotifyOperatorForDecisionRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmpNotificationReviewNotifyOperatorActionHandler implements RequestTaskActionHandler<NotifyOperatorForDecisionRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final WorkflowService workflowService;
    private final EmpNotificationValidatorService empNotificationValidatorService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      NotifyOperatorForDecisionRequestTaskActionPayload taskActionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);

        final EmpNotificationApplicationReviewRequestTaskPayload reviewTaskPayload =
                (EmpNotificationApplicationReviewRequestTaskPayload) requestTask.getPayload();

        // Validate
        empNotificationValidatorService.validateNotificationReviewDecision(reviewTaskPayload.getReviewDecision());
        empNotificationValidatorService.validateNotifyUsers(requestTask, taskActionPayload.getDecisionNotification(), appUser);

        // Save payload to request
        final Request request = requestTask.getRequest();
        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) request.getPayload();
        requestPayload.setReviewDecision(reviewTaskPayload.getReviewDecision());
        requestPayload.setReviewSectionsCompleted(reviewTaskPayload.getSectionsCompleted());
        requestPayload.setReviewDecisionNotification(taskActionPayload.getDecisionNotification());
        requestPayload.setRegulatorReviewer(appUser.getUserId());

        // Get determination type
        MrtmDeterminationType type =
            reviewTaskPayload.getReviewDecision().getType().equals(EmpNotificationReviewDecisionType.ACCEPTED)
                ? MrtmDeterminationType.GRANTED : MrtmDeterminationType.REJECTED;

        // Complete task
        workflowService.completeTask(requestTask.getProcessTaskId(),
                Map.of(BpmnProcessConstants.REVIEW_DETERMINATION, type,
                        BpmnProcessConstants.REVIEW_OUTCOME, ReviewOutcome.NOTIFY_OPERATOR
                        ));

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_NOTIFICATION_NOTIFY_OPERATOR_FOR_DECISION);
    }
}
