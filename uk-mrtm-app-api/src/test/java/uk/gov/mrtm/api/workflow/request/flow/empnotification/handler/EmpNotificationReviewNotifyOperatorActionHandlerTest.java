package uk.gov.mrtm.api.workflow.request.flow.empnotification.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmDeterminationType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionPayloadTypes;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationAcceptedDecisionDetails;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationApplicationReviewRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecision;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.EmpNotificationReviewDecisionType;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.domain.FollowUp;
import uk.gov.mrtm.api.workflow.request.flow.empnotification.service.EmpNotificationValidatorService;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.domain.RequestTaskPayload;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.constants.BpmnProcessConstants;
import uk.gov.netz.api.workflow.request.flow.common.domain.DecisionNotification;
import uk.gov.netz.api.workflow.request.flow.common.domain.NotifyOperatorForDecisionRequestTaskActionPayload;
import uk.gov.netz.api.workflow.request.flow.common.domain.ReviewOutcome;

import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EmpNotificationReviewNotifyOperatorActionHandlerTest {

    @InjectMocks
    private EmpNotificationReviewNotifyOperatorActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private EmpNotificationValidatorService validator;

    @Mock
    private WorkflowService workflowService;

    @ParameterizedTest
    @MethodSource("processScenarios")
    void process(EmpNotificationReviewDecisionType reviewDecisionType, MrtmDeterminationType determinationType) {
        final DecisionNotification decisionNotification = DecisionNotification.builder()
                .operators(Set.of("operator"))
                .signatory("regulator")
                .build();

        final NotifyOperatorForDecisionRequestTaskActionPayload taskActionPayload =
                NotifyOperatorForDecisionRequestTaskActionPayload.builder()
                        .payloadType(MrtmRequestTaskActionPayloadTypes.EMP_NOTIFICATION_NOTIFY_OPERATOR_FOR_DECISION_PAYLOAD)
                        .decisionNotification(decisionNotification)
                        .build();

        final AppUser appUser = AppUser.builder().userId("userId").build();
        final String processTaskId = "processTaskId";
        final EmpNotificationReviewDecision reviewDecision = EmpNotificationReviewDecision.builder()
                .type(reviewDecisionType)
                .details(
                    EmpNotificationAcceptedDecisionDetails.builder()
                        .notes("notes")
                        .officialNotice("officialNotice")
                        .followUp(FollowUp.builder()
                            .followUpResponseRequired(false)
                            .build())
                        .build()
                )

                .build();
        final EmpNotificationApplicationReviewRequestTaskPayload expectedRequestPayload =
                EmpNotificationApplicationReviewRequestTaskPayload.builder()
                        .reviewDecision(reviewDecision)
                        .build();
        final String requestId = "requestId";
        final RequestTask requestTask = RequestTask.builder()
                .id(1L)
                .processTaskId(processTaskId)
                .payload(expectedRequestPayload)
                .request(Request.builder().id(requestId).payload(EmpNotificationRequestPayload.builder().build()).build())
                .build();

        when(requestTaskService.findTaskById(1L)).thenReturn(requestTask);

        // Invoke
        RequestTaskPayload requestTaskPayload =
            handler.process(requestTask.getId(), MrtmRequestTaskActionType.EMP_NOTIFICATION_NOTIFY_OPERATOR_FOR_DECISION,
            appUser, taskActionPayload);

        // Verify
        assertThat(requestTaskPayload).isEqualTo(expectedRequestPayload);
        verify(requestTaskService, times(1)).findTaskById(requestTask.getId());
        verify(validator, times(1)).validateNotificationReviewDecision(reviewDecision);
        verify(validator, times(1)).validateNotifyUsers(requestTask, decisionNotification, appUser);
        verify(workflowService, times(1)).completeTask(processTaskId,
                Map.of(BpmnProcessConstants.REVIEW_DETERMINATION, determinationType,
                        BpmnProcessConstants.REVIEW_OUTCOME, ReviewOutcome.NOTIFY_OPERATOR));

        final EmpNotificationRequestPayload requestPayload = (EmpNotificationRequestPayload) requestTask.getRequest().getPayload();
        assertThat(requestPayload.getReviewDecision()).isEqualTo(reviewDecision);
        assertThat(requestPayload.getReviewDecisionNotification()).isEqualTo(decisionNotification);
        assertThat(requestPayload.getRegulatorReviewer()).isEqualTo(appUser.getUserId());
    }

    private static Stream<Arguments> processScenarios() {
        return Stream.of(
            Arguments.of(EmpNotificationReviewDecisionType.ACCEPTED, MrtmDeterminationType.GRANTED),
            Arguments.of(EmpNotificationReviewDecisionType.REJECTED, MrtmDeterminationType.REJECTED)
        );
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.EMP_NOTIFICATION_NOTIFY_OPERATOR_FOR_DECISION);
    }
}
