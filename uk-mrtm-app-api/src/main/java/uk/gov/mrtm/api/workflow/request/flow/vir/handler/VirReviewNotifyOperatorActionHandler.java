package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirReviewService;
import uk.gov.mrtm.api.workflow.request.flow.vir.validation.VirReviewNotifyOperatorValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.NotifyOperatorForDecisionRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class VirReviewNotifyOperatorActionHandler
    implements RequestTaskActionHandler<NotifyOperatorForDecisionRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final VirReviewService virReviewService;
    private final VirReviewNotifyOperatorValidator virReviewNotifyOperatorValidator;
    private final WorkflowService workflowService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final NotifyOperatorForDecisionRequestTaskActionPayload payload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final VirApplicationReviewRequestTaskPayload taskPayload =
            (VirApplicationReviewRequestTaskPayload) requestTask.getPayload();

        // Validate review and action payload
        virReviewNotifyOperatorValidator.validate(requestTask, payload, appUser);

        // Submit review
        final DecisionNotification decisionNotification = payload.getDecisionNotification();
        virReviewService.submitReview(requestTask, decisionNotification, appUser);

        // Complete task
        boolean virNeedsImprovements = taskPayload.getRegulatorReviewResponse().getRegulatorImprovementResponses()
                .values().stream().anyMatch(RegulatorImprovementResponse::isImprovementRequired);

        workflowService.completeTask(
                requestTask.getProcessTaskId(),
                Map.of(BpmnProcessConstants.REQUEST_ID, requestTask.getRequest().getId(),
                       BpmnProcessConstants.REVIEW_OUTCOME, ReviewOutcome.COMPLETED,
                       MrtmBpmnProcessConstants.VIR_NEEDS_IMPROVEMENTS, virNeedsImprovements)
        );

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.VIR_NOTIFY_OPERATOR_FOR_DECISION);
    }
}
