package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import lombok.RequiredArgsConstructor;
import org.mapstruct.factory.Mappers;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceOutcome;
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
public class NonComplianceNoticeOfIntentPeerDecisionActionHandler
    implements RequestTaskActionHandler<PeerReviewDecisionRequestTaskActionPayload> {

    private static final PeerReviewMapper PEER_REVIEW_MAPPER = Mappers.getMapper(PeerReviewMapper.class);

    private final RequestService requestService;
    private final RequestTaskService requestTaskService;
    private final WorkflowService workflowService;

    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final PeerReviewDecisionRequestTaskActionPayload taskActionPayload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);
        final Request request = requestTask.getRequest();
        final String peerReviewer = appUser.getUserId();

        final PeerReviewDecisionSubmittedRequestActionPayload actionPayload =
            PEER_REVIEW_MAPPER.toPeerReviewDecisionSubmittedRequestActionPayload(
                taskActionPayload,
                MrtmRequestActionPayloadType.NON_COMPLIANCE_NOTICE_OF_INTENT_PEER_REVIEW_DECISION_SUBMITTED_PAYLOAD
            );

        final String type = actionPayload.getDecision().getType() == PeerReviewDecisionType.AGREE ?
            MrtmRequestActionType.NON_COMPLIANCE_NOTICE_OF_INTENT_PEER_REVIEWER_ACCEPTED :
            MrtmRequestActionType.NON_COMPLIANCE_NOTICE_OF_INTENT_PEER_REVIEWER_REJECTED;

        requestService.addActionToRequest(
            request,
            actionPayload,
            type,
            peerReviewer
        );

        workflowService.completeTask(
            requestTask.getProcessTaskId(),
            Map.of(MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.SUBMITTED)
        );

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.NON_COMPLIANCE_NOTICE_OF_INTENT_SUBMIT_PEER_REVIEW_DECISION);
    }
}
