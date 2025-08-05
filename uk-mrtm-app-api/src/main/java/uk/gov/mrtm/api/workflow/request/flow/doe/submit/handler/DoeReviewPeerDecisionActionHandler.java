package uk.gov.mrtm.api.workflow.request.flow.doe.submit.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.doe.common.domain.DoeSubmitOutcome;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.actionhandler.RequestTaskActionHandler;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecisionRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecisionSubmittedRequestActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecisionType;
import uk.gov.netz.api.workflow.request.flow.common.mapper.PeerReviewMapper;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DoeReviewPeerDecisionActionHandler
    implements RequestTaskActionHandler<PeerReviewDecisionRequestTaskActionPayload> {

    private static final PeerReviewMapper PEER_REVIEW_MAPPER = Mappers.getMapper(PeerReviewMapper.class);

    private final RequestService requestService;
    private final RequestTaskService requestTaskService;
    private final WorkflowService workflowService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType, AppUser appUser,
                                      PeerReviewDecisionRequestTaskActionPayload taskActionPayload) {
        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final Request request = requestTask.getRequest();
        final String peerReviewer = appUser.getUserId();

        final PeerReviewDecisionSubmittedRequestActionPayload actionPayload = PEER_REVIEW_MAPPER
            .toPeerReviewDecisionSubmittedRequestActionPayload(taskActionPayload,
                MrtmRequestActionPayloadType.DOE_APPLICATION_PEER_REVIEW_DECISION_SUBMITTED_PAYLOAD);

        final String type = actionPayload.getDecision().getType() == PeerReviewDecisionType.AGREE
            ? MrtmRequestActionType.DOE_PEER_REVIEWER_ACCEPTED
            : MrtmRequestActionType.DOE_PEER_REVIEWER_REJECTED;

        requestService.addActionToRequest(request, actionPayload, type, peerReviewer);

        workflowService.completeTask(requestTask.getProcessTaskId(), Map.of(
                MrtmBpmnProcessConstants.DOE_SUBMIT_OUTCOME, DoeSubmitOutcome.SUBMITTED
            )
        );

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.DOE_SUBMIT_PEER_REVIEW_DECISION);
    }

}
