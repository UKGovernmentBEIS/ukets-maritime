package uk.gov.mrtm.api.workflow.request.flow.noncompliance.handler;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionPayloadType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestActionType;
import uk.gov.mrtm.api.workflow.request.core.domain.constants.MrtmRequestTaskActionType;
import uk.gov.mrtm.api.workflow.request.flow.common.constants.MrtmBpmnProcessConstants;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmitRequestTaskPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceApplicationSubmittedRequestActionPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceOutcome;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonCompliancePenalties;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.domain.NonComplianceRequestPayload;
import uk.gov.mrtm.api.workflow.request.flow.noncompliance.validation.NonComplianceApplicationValidator;
import uk.gov.netz.api.authorization.core.domain.AppUser;
import uk.gov.netz.api.workflow.request.WorkflowService;
import uk.gov.netz.api.workflow.request.core.domain.Request;
import uk.gov.netz.api.workflow.request.core.domain.RequestTask;
import uk.gov.netz.api.workflow.request.core.service.RequestService;
import uk.gov.netz.api.workflow.request.core.service.RequestTaskService;
import uk.gov.netz.api.workflow.request.flow.common.domain.RequestTaskActionEmptyPayload;

import java.util.Map;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class NonComplianceSubmitApplicationActionHandlerTest {

    @InjectMocks
    private NonComplianceSubmitApplicationActionHandler handler;

    @Mock
    private RequestTaskService requestTaskService;

    @Mock
    private NonComplianceApplicationValidator validator;

    @Mock
    private WorkflowService workflowService;

    @Mock
    private RequestService requestService;

    @ParameterizedTest
    @MethodSource("processScenarios")
    void process(boolean civilPenalty, boolean noticeOfIntent,
                 boolean initialPenalty, Map<String, Object> variables) {

        final long requestTaskId = 1L;
        final String processTaskId = "processTaskId";
        final NonComplianceApplicationSubmitRequestTaskPayload taskPayload =
            NonComplianceApplicationSubmitRequestTaskPayload.builder()
                .nonCompliancePenalties(NonCompliancePenalties.builder()
                    .civilPenalty(civilPenalty)
                    .noticeOfIntent(noticeOfIntent)
                    .initialPenalty(initialPenalty)
                    .build())
                .build();
        final Request request = Request.builder().id("reqid").payload(NonComplianceRequestPayload.builder().build()).build();
        final NonComplianceApplicationSubmittedRequestActionPayload expectedRequestActionPayload =
            NonComplianceApplicationSubmittedRequestActionPayload.builder()
                .payloadType(MrtmRequestActionPayloadType.NON_COMPLIANCE_APPLICATION_SUBMITTED_PAYLOAD)
                .nonCompliancePenalties(NonCompliancePenalties.builder()
                    .civilPenalty(civilPenalty)
                    .noticeOfIntent(noticeOfIntent)
                    .initialPenalty(initialPenalty)
                    .build())
                .build();
        final RequestTask requestTask = RequestTask.builder()
            .id(requestTaskId)
            .request(request)
            .payload(taskPayload)
            .processTaskId(processTaskId)
            .build();
        final RequestTaskActionEmptyPayload taskActionPayload =
            RequestTaskActionEmptyPayload.builder().build();
        String userId = "userId";
        final AppUser appUser = AppUser.builder().userId(userId).build();

        when(requestTaskService.findTaskById(requestTaskId)).thenReturn(requestTask);

        handler.process(requestTaskId, MrtmRequestTaskActionType.NON_COMPLIANCE_SUBMIT_APPLICATION, appUser,
            taskActionPayload);

        assertThat(request.getSubmissionDate()).isNotNull();
        assertThat(((NonComplianceRequestPayload)request.getPayload()).getIssueNoticeOfIntent()).isEqualTo(noticeOfIntent);

        verify(validator).validateApplication(taskPayload);
        verify(requestService).addActionToRequest(request, expectedRequestActionPayload,
            MrtmRequestActionType.NON_COMPLIANCE_APPLICATION_SUBMITTED, userId);
        verify(workflowService).completeTask(processTaskId, variables);

        verifyNoMoreInteractions(requestTaskService, validator, workflowService, requestService);
     }

    private static Stream<Arguments> processScenarios() {
        Map<String, Object> variables1 = Map.of(
            MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.SUBMITTED,
            MrtmBpmnProcessConstants.CIVIL_PENALTY_LIABLE, true,
            MrtmBpmnProcessConstants.INITIAL_PENALTY_LIABLE, false,
            MrtmBpmnProcessConstants.NOI_PENALTY_LIABLE, false);

        Map<String, Object> variables2 = Map.of(
            MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.SUBMITTED,
            MrtmBpmnProcessConstants.CIVIL_PENALTY_LIABLE, true,
            MrtmBpmnProcessConstants.INITIAL_PENALTY_LIABLE, false,
            MrtmBpmnProcessConstants.NOI_PENALTY_LIABLE, true);

        Map<String, Object> variables3 = Map.of(
            MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.SUBMITTED,
            MrtmBpmnProcessConstants.CIVIL_PENALTY_LIABLE, true,
            MrtmBpmnProcessConstants.INITIAL_PENALTY_LIABLE, true,
            MrtmBpmnProcessConstants.NOI_PENALTY_LIABLE, false);

        Map<String, Object> variables4 = Map.of(
            MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.SUBMITTED,
            MrtmBpmnProcessConstants.CIVIL_PENALTY_LIABLE, false);

        Map<String, Object> variables5 = Map.of(
            MrtmBpmnProcessConstants.NON_COMPLIANCE_OUTCOME, NonComplianceOutcome.SUBMITTED,
            MrtmBpmnProcessConstants.CIVIL_PENALTY_LIABLE, false);

        return Stream.of(
            Arguments.of(true, false, false, variables1),
            Arguments.of(true, true, false, variables2),
            Arguments.of(true, false, true, variables3),
            Arguments.of(false, true, false, variables4),
            Arguments.of(false, false, true, variables5)
        );
    }

    @Test
    void getTypes() {
        assertThat(handler.getTypes()).containsExactly(MrtmRequestTaskActionType.NON_COMPLIANCE_SUBMIT_APPLICATION);
    }
}
