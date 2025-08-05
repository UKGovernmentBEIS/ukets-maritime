package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationRespondToRegulatorCommentsRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirSubmitRespondToRegulatorCommentsRequestTaskActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirRespondToRegulatorCommentsService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;

import java.util.HashMap;
import java.util.List;

@RequiredArgsConstructor
@Component
public class VirRespondToRegulatorCommentsSubmitActionHandler
    implements RequestTaskActionHandler<VirSubmitRespondToRegulatorCommentsRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final VirRespondToRegulatorCommentsService virRespondToRegulatorCommentsService;
    private final WorkflowService workflowService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final VirSubmitRespondToRegulatorCommentsRequestTaskActionPayload payload) {
        
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);

        // Update task payload
        virRespondToRegulatorCommentsService.applySubmitAction(payload, requestTask, appUser);

        final VirApplicationRespondToRegulatorCommentsRequestTaskPayload taskPayload =
                (VirApplicationRespondToRegulatorCommentsRequestTaskPayload) requestTask.getPayload();

        if(taskPayload.getRegulatorImprovementResponses().isEmpty()) {
            // Complete task
            workflowService.completeTask(requestTask.getProcessTaskId());
        }
        else{
            // Send message event to trigger due date change
            workflowService.sendEvent(requestTask.getRequest().getId(), MrtmBpmnProcessConstants.VIR_RESPONSE_COMMENT_SUBMITTED, new HashMap<>());
        }

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.VIR_SUBMIT_RESPOND_TO_REGULATOR_COMMENTS);
    }
}
