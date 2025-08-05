package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
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
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecision;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecisionRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecisionSubmittedRequestActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.PeerReviewDecisionType;

import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationReviewPeerDecisionActionHandlerTest {

    @InjectMocks
    private EmpNotificationReviewPeerDecisionActionHandler handler;

    @Mock
    private RequestService requestService;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private WorkflowService workflowService;


    @ParameterizedTest
    @MethodSource("validDates")
    void process(PeerReviewDecisionType decisionType, String actionType) {
        final PeerReviewDecision decision = PeerReviewDecision.builder()
            .type(decisionType)
            .notes("not approved")
            .build();
        final RequestTaskPayload expectedRequestTaskPayload = mock(RequestTaskPayload.class);
        final PeerReviewDecisionRequestTaskActionPayload payload =
            PeerReviewDecisionRequestTaskActionPayload.builder()
                .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION_PAYLOAD)
                .decision(decision)
                .build();
        final String userId = "userId";
        final AppUser appUser = AppUser.builder().userId(userId).build();
        final String processTaskId = "processTaskId";
        final Request request = Request.builder().id("1").build();
        final RequestTask requestTask = RequestTask.builder()
            .id(2L)
            .request(request)
            .payload(expectedRequestTaskPayload)
            .processTaskId(processTaskId)
            .build();

        when(requestTaskService.findTaskById(2L)).thenReturn(requestTask);

        RequestTaskPayload requestTaskPayload = handler.process(requestTask.getId(),
            MrtmRequestTaskActionType.EMP_NOTIFICATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION,
            appUser,
            payload);

        ArgumentCaptor<PeerReviewDecisionSubmittedRequestActionPayload> actionPayloadArgumentCaptor =
            ArgumentCaptor.forClass(PeerReviewDecisionSubmittedRequestActionPayload.class);

        verify(requestService).addActionToRequest(
            eq(request),
            actionPayloadArgumentCaptor.capture(),
            eq(actionType),
            eq(userId));

        final PeerReviewDecisionSubmittedRequestActionPayload captorValue = actionPayloadArgumentCaptor.getValue();
        assertThat(captorValue.getDecision()).isEqualTo(decision);
        assertThat(captorValue.getPayloadType())
            .isEqualTo(MrtmRequestActionPayloadType.EMP_NOTIFICATION_PEER_REVIEW_DECISION_SUBMITTED_PAYLOAD);
        assertThat(requestTaskPayload).isEqualTo(expectedRequestTaskPayload);
        verifyNoMoreInteractions(expectedRequestTaskPayload);
        verify(workflowService).completeTask(processTaskId);
        verifyNoMoreInteractions(requestService, requestTaskService, workflowService);
    }

    static Stream<Arguments> validDates() {
        return Stream.of(
            Arguments.of(PeerReviewDecisionType.AGREE,
                MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_PEER_REVIEWER_ACCEPTED),
            Arguments.of(PeerReviewDecisionType.DISAGREE,
                MrtmRequestActionType.EMP_NOTIFICATION_APPLICATION_PEER_REVIEWER_REJECTED)
        );
    }

    @Test
    void getRequestTaskTypes() {
        assertThat(handler.getTypes())
            .containsExactly(MrtmRequestTaskActionType.EMP_NOTIFICATION_REVIEW_SUBMIT_PEER_REVIEW_DECISION);
    }
}
