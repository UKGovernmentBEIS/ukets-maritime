package uk.gov.mrtm.api.workflow.request.flow.doe.submit.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeSubmitOutcome;
import uk.gov.mrtm.api.workflow.request.flow.doe.submit.service.RequestDoeApplyService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskTypeService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.validation.PeerReviewerTaskAssignmentValidator;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DoeRequestPeerReviewActionHandler implements RequestTaskActionHandler<PeerReviewRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final RequestDoeApplyService doeApplyService;
    private final RequestService requestService;
    private final WorkflowService workflowService;
    private final PeerReviewerTaskAssignmentValidator peerReviewerTaskAssignmentValidator;
    private final RequestTaskTypeService requestTaskTypeService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      PeerReviewRequestTaskActionPayload taskActionPayload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final Request request = requestTask.getRequest();
        final String userId = appUser.getUserId();
        final String peerReviewer = taskActionPayload.getPeerReviewer();

        peerReviewerTaskAssignmentValidator.validate(requestTask,
                requestTaskTypeService.findByCode(MrtmRequestTaskType.DOE_APPLICATION_PEER_REVIEW),
                peerReviewer, appUser);

        doeApplyService.requestPeerReview(requestTask, peerReviewer, userId);
        requestService.addActionToRequest(request, null, MrtmRequestActionType.DOE_PEER_REVIEW_REQUESTED, userId);

        workflowService.completeTask(requestTask.getProcessTaskId(), Map.of(
                BpmnProcessConstants.REQUEST_ID, request.getId(),
                MrtmBpmnProcessConstants.DOE_SUBMIT_OUTCOME, DoeSubmitOutcome.PEER_REVIEW_REQUIRED
            )
        );

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.DOE_REQUEST_PEER_REVIEW);
    }
}