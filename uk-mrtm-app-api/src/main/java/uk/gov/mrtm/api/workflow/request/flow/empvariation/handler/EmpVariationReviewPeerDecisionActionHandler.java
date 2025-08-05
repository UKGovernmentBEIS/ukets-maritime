package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
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

@Component
@RequiredArgsConstructor
public class EmpVariationReviewPeerDecisionActionHandler
            implements RequestTaskActionHandler<PeerReviewDecisionRequestTaskActionPayload> {

	private static final PeerReviewMapper PEER_REVIEW_MAPPER = Mappers.getMapper(PeerReviewMapper.class);

    private final RequestService requestService;
    private final RequestTaskService requestTaskService;
    private final WorkflowService workflowService;

    @Override
    public RequestTaskPayload process(Long requestTaskId, String requestTaskActionType,
                                      AppUser appUser, PeerReviewDecisionRequestTaskActionPayload payload) {
        RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);

        PeerReviewDecisionSubmittedRequestActionPayload requestActionPayload =
            PEER_REVIEW_MAPPER.toPeerReviewDecisionSubmittedRequestActionPayload(
                payload,
                MrtmRequestActionPayloadType.EMP_VARIATION_PEER_REVIEW_DECISION_SUBMITTED_PAYLOAD
            );

        String type = payload.getDecision().getType() == PeerReviewDecisionType.AGREE ?
                MrtmRequestActionType.EMP_VARIATION_APPLICATION_PEER_REVIEWER_ACCEPTED :
                MrtmRequestActionType.EMP_VARIATION_APPLICATION_PEER_REVIEWER_REJECTED;

        requestService.addActionToRequest(requestTask.getRequest(), requestActionPayload, type, appUser.getUserId());

        workflowService.completeTask(requestTask.getProcessTaskId());
        
        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.EMP_VARIATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION);
    }
}
