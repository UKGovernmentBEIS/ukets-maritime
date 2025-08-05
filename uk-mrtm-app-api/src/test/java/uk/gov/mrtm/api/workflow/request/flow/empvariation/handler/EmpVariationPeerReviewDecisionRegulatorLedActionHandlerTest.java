package uk.gov.mrtm.api.workflow.request.flow.empvariation.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecision;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecisionRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecisionSubmittedRequestActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecisionType;

import static org.mockito.ArgumentMatchers.eq;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpVariationPeerReviewDecisionRegulatorLedActionHandlerTest {

	@InjectMocks
    private EmpVariationPeerReviewDecisionRegulatorLedActionHandler handler;
	
	@Mock
    private RequestService requestService;
	
	@Mock
    private RequestTaskService requestTaskService;
	
	@Mock
    private WorkflowService workflowService;
	
	@Test
	void getRequestTaskTypes() {
		assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.EMP_VARIATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION_REGULATOR_LED);
	}
	
	@Test
    void process() {
        PeerReviewDecision decision = PeerReviewDecision.builder()
            .type(PeerReviewDecisionType.DISAGREE)
            .notes("not agree")
            .build();
        PeerReviewDecisionRequestTaskActionPayload payload =
            PeerReviewDecisionRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_VARIATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION_PAYLOAD)
                .decision(decision)
                .build();
        Long requestTaskId = 1L;
        String userId = "userId";
        AppUser appUser = AppUser.builder().userId(userId).build();
        String processTaskId = "processTaskId";
        Request request = Request.builder().build();
        RequestTask requestTask = RequestTask.builder().id(requestTaskId).request(request).processTaskId(processTaskId).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_VARIATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION_REGULATOR_LED,
            appUser,
            payload);

        ArgumentCaptor<PeerReviewDecisionSubmittedRequestActionPayload> actionPayloadArgumentCaptor =
            ArgumentCaptor.forClass(PeerReviewDecisionSubmittedRequestActionPayload.class);

        verify(requestService, times(1)).addActionToRequest(
            eq(request),
            actionPayloadArgumentCaptor.capture(),
            eq(MrtmRequestActionType.EMP_VARIATION_APPLICATION_PEER_REVIEWER_REJECTED),
            eq(userId));

        PeerReviewDecisionSubmittedRequestActionPayload captorValue = actionPayloadArgumentCaptor.getValue();
        assertThat(captorValue.getDecision()).isEqualTo(decision);
        assertThat(captorValue.getPayloadType()).isEqualTo(MrtmRequestActionPayloadType.EMP_VARIATION_PEER_REVIEW_DECISION_REGULATOR_LED_SUBMITTED_PAYLOAD);

        verify(workflowService, times(1)).completeTask(processTaskId);
    }
}
