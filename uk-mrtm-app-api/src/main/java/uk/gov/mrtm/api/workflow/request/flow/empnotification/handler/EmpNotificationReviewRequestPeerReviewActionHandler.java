package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationOutcome;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationValidatorService;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.RequestEmpNotificationReviewService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewRequestTaskActionPayload;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class EmpNotificationReviewRequestPeerReviewActionHandler implements
    RequestTaskActionHandler<PeerReviewRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final RequestService requestService;
    private final WorkflowService workflowService;
    private final RequestEmpNotificationReviewService requestPermitNotificationReviewService;
    private final EmpNotificationValidatorService permitNotificationValidatorService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      PeerReviewRequestTaskActionPayload actionPayload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final Request request = requestTask.getRequest();
        final EmpNotificationApplicationReviewRequestTaskPayload payload =
                (EmpNotificationApplicationReviewRequestTaskPayload) requestTask.getPayload();
        final String peerReviewer = actionPayload.getPeerReviewer();

        // Validate
        permitNotificationValidatorService.validateNotificationReviewDecision(payload.getReviewDecision());
        permitNotificationValidatorService.validatePeerReviewer(requestTask, peerReviewer, appUser);

        // Save as Peer Review
        requestPermitNotificationReviewService.saveRequestPeerReviewAction(requestTask, peerReviewer, appUser);
        requestService.addActionToRequest(request, null,
                MrtmRequestActionType.EMP_NOTIFICATION_PEER_REVIEW_REQUESTED, appUser.getUserId());

        // Complete task
        workflowService.completeTask(requestTask.getProcessTaskId(),
                Map.of(BpmnProcessConstants.REQUEST_ID, requestTask.getRequest().getId(),
                        BpmnProcessConstants.REVIEW_OUTCOME, EmpNotificationOutcome.PEER_REVIEW_REQUIRED)
        );

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_NOTIFICATION_REQUEST_PEER_REVIEW);
    }
}
