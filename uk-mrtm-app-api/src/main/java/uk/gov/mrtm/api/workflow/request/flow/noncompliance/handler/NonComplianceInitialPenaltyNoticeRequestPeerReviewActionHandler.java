package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmRequestCustomContext;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceInitialPenaltyNoticeRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceOutcome;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.service.NonComplianceInitialPenaltyNoticeApplyService;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.validation.NonCompliancePeerReviewValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
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
public class NonComplianceInitialPenaltyNoticeRequestPeerReviewActionHandler
        implements RequestTaskActionHandler<PeerReviewRequestTaskActionPayload> {

    private final RequestTaskService requestTaskService;
    private final NonCompliancePeerReviewValidator nonCompliancePeerReviewValidator;
    private final NonComplianceInitialPenaltyNoticeApplyService applyService;
    private final RequestService requestService;
    private final WorkflowService workflowService;


    @Override
    public RequestTaskPayload process(final Long requestTaskId,
                                      final String requestTaskActionType,
                                      final AppUser appUser,
                                      final PeerReviewRequestTaskActionPayload payload) {

        final RequestTask requestTask = requestTaskService.findTaskById(requestTaskId);

        final NonComplianceInitialPenaltyNoticeRequestTaskPayload taskPayload =
                (NonComplianceInitialPenaltyNoticeRequestTaskPayload) requestTask.getPayload();

        String selectedPeerReviewer = payload.getPeerReviewer();
        nonCompliancePeerReviewValidator
            .validateInitialPenaltyNoticePeerReview(taskPayload, requestTask, selectedPeerReviewer, appUser);

        applyService.saveRequestPeerReviewAction(requestTask, payload.getPeerReviewer(), appUser.getUserId());

        requestService.addActionToRequest(
                requestTask.getRequest(),
                null,
                MrtmRequestActionType.NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_PEER_REVIEW_REQUESTED,
                appUser.getUserId()
        );

        workflowService.completeTask(
                requestTask.getProcessTaskId(),
                Map.of(
                        BpmnProcessConstants.REQUEST_ID, requestTask.getRequest().getId(),
                        MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.PEER_REVIEW_REQUIRED,
                        BpmnProcessConstants.REQUEST_TYPE_DYNAMIC_TASK_PREFIX, MrtmRequestCustomContext.NON_COMPLIANCE_INITIAL_PENALTY_NOTICE.getCode()
                )
        );

        return requestTask.getPayload();
    }

    @Override
    public List<String> getTypes() {
        return List.of(MrtmRequestTaskActionType.NON_COMPLIANCE_INITIAL_PENALTY_NOTICE_REQUEST_PEER_REVIEW);
    }
}
