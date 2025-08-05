package uk.gov.mrtm.api.workflow.request.flow.vir.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskPayloadType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorImprovementResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.RegulatorReviewResponse;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.domain.VirRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.vir.service.VirReviewService;
import uk.gov.mrtm.api.workflow.request.flow.vir.validation.VirReviewNotifyOperatorValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.NotifyOperatorForDecisionRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;

import java.util.Map;
import java.util.Set;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VirReviewNotifyOperatorActionHandlerTest {

    @InjectMocks
    private VirReviewNotifyOperatorActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private VirReviewService virReviewService;

    @Mock
    private VirReviewNotifyOperatorValidator virReviewNotifyOperatorValidator;

    @Mock
    private WorkflowService workflowService;

    @Test
    void process() {
        final long requestTaskId = 1L;
        final String processId = "processId";
        final String requestId = "VIR001";

        final AppUser pmrvUser = AppUser.builder().userId("userId").build();
        final DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator"))
                .signatory("signatory")
                .build();
        final NotifyOperatorForDecisionRequestTaskActionPayload actionPayload = NotifyOperatorForDecisionRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.VIR_NOTIFY_OPERATOR_FOR_DECISION_PAYLOAD)
                .decisionNotification(decisionNotification)
                .build();

        final Request request = Request.builder()
                .id(requestId)
                .payload(VirRequestPayload.builder()
                        .payloadType(MrtmRequestPayloadType.VIR_REQUEST_PAYLOAD)
                        .build())
                .build();
        final RequestTask requestTask = RequestTask.builder()
                .processTaskId(processId)
                .request(request)
                .payload(VirApplicationReviewRequestTaskPayload.builder()
                        .payloadType(MrtmRequestTaskPayloadType.VIR_APPLICATION_REVIEW_PAYLOAD)
                        .regulatorReviewResponse(RegulatorReviewResponse.builder()
                                .regulatorImprovementResponses(Map.of(
                                        "A1", RegulatorImprovementResponse.builder().improvementRequired(true).build()
                                ))
                                .build())
                        .build())
                .build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        // Invoke
        handler.process(requestTaskId, MrtmRequestTaskActionType.VIR_NOTIFY_OPERATOR_FOR_DECISION, pmrvUser, actionPayload);

        // Verify
        verify(requestTaskService, times(1))
                .findTaskById(requestTaskId);
        verify(virReviewNotifyOperatorValidator, times(1))
                .validate(requestTask, actionPayload, pmrvUser);
        verify(virReviewService, times(1))
                .submitReview(requestTask, decisionNotification, pmrvUser);
        verify(workflowService, times(1))
                .completeTask(processId, Map.of(BpmnProcessConstants.REQUEST_ID, requestId,
                        BpmnProcessConstants.REVIEW_OUTCOME, ReviewOutcome.COMPLETED,
                        MrtmBpmnProcessConstants.VIR_NEEDS_IMPROVEMENTS, true));
    }
}
